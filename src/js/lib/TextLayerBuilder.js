/* eslint-disable */
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals PDFJS */

/**
 * @typedef {Object} TextLayerBuilderOptions
 * @property {HTMLDivElement} textLayerDiv - The text layer container.
 * @property {number} pageIndex - The page index.
 * @property {PageViewport} viewport - The viewport of the text layer.
 * @property {PDFFindController} findController
 */

/**
 * TextLayerBuilder provides text-selection functionality for the PDF.
 * It does this by creating overlay divs over the PDF text. These divs
 * contain text that matches the PDF text they are overlaying. This object
 * also provides a way to highlight text that is being searched for.
 * @class
 */
const TextLayerBuilder = (function TextLayerBuilderClosure() {
  function TextLayerBuilder(options) {
    this.textLayerDiv = options.textLayerDiv;
    this.renderingDone = false;
    this.divContentDone = false;
    this.pageIdx = options.pageIndex;
    this.pageNumber = this.pageIdx + 1;
    this.matches = [];
    this.viewport = options.viewport;
    this.textDivs = [];
    this.findController = options.findController || null;
    this.textLayerRenderTask = null;
    this._bindMouse();
  }

  TextLayerBuilder.prototype = {
    _finishRendering: function TextLayerBuilder_finishRendering() {
      this.renderingDone = true;

      const endOfContent = document.createElement('div');
      endOfContent.className = 'endOfContent';
      this.textLayerDiv.appendChild(endOfContent);

      const event = document.createEvent('CustomEvent');
      event.initCustomEvent('textlayerrendered', true, true, {
        pageNumber: this.pageNumber,
      });
      this.textLayerDiv.dispatchEvent(event);
    },

    /**
     * Renders the text layer.
     * @param {number} timeout (optional) if specified, the rendering waits
     *   for specified amount of ms.
     */
    render: function TextLayerBuilder_render(timeout) {
      if (!this.divContentDone || this.renderingDone) {
        return;
      }

      if (this.textLayerRenderTask) {
        this.textLayerRenderTask.cancel();
        this.textLayerRenderTask = null;
      }

      this.textDivs = [];
      const textLayerFrag = document.createDocumentFragment();
      this.textLayerRenderTask = PDFJS.renderTextLayer({
        textContent: this.textContent,
        container: textLayerFrag,
        viewport: this.viewport,
        textDivs: this.textDivs,
        timeout,
      });
      this.textLayerRenderTask.promise.then(() => {
        this.textLayerDiv.appendChild(textLayerFrag);
        this._finishRendering();
        this.updateMatches();
      }, (reason) => {
        // canceled or failed to render text layer -- skipping errors
      });
    },

    setTextContent: function TextLayerBuilder_setTextContent(textContent) {
      if (this.textLayerRenderTask) {
        this.textLayerRenderTask.cancel();
        this.textLayerRenderTask = null;
      }
      this.textContent = textContent;
      this.divContentDone = true;
    },

    convertMatches: function TextLayerBuilder_convertMatches(matches) {
      let i = 0;
      let iIndex = 0;
      const bidiTexts = this.textContent.items;
      const end = bidiTexts.length - 1;
      const queryLen = (this.findController === null ?
        0 : this.findController.state.query.length);
      const ret = [];

      for (let m = 0, len = matches.length; m < len; m++) {
        // Calculate the start position.
        let matchIdx = matches[m];

        // Loop over the divIdxs.
        while (i !== end && matchIdx >= (iIndex + bidiTexts[i].str.length)) {
          iIndex += bidiTexts[i].str.length;
          i++;
        }

        if (i === bidiTexts.length) {
          console.error('Could not find a matching mapping');
        }

        const match = {
          begin: {
            divIdx: i,
            offset: matchIdx - iIndex,
          },
        };

        // Calculate the end position.
        matchIdx += queryLen;

        // Somewhat the same array as above, but use > instead of >= to get
        // the end position right.
        while (i !== end && matchIdx > (iIndex + bidiTexts[i].str.length)) {
          iIndex += bidiTexts[i].str.length;
          i++;
        }

        match.end = {
          divIdx: i,
          offset: matchIdx - iIndex,
        };
        ret.push(match);
      }

      return ret;
    },

    renderMatches: function TextLayerBuilder_renderMatches(matches) {
      // Early exit if there is nothing to render.
      if (matches.length === 0) {
        return;
      }

      const bidiTexts = this.textContent.items;
      const textDivs = this.textDivs;
      let prevEnd = null;
      const pageIdx = this.pageIdx;
      const isSelectedPage = (this.findController === null ?
        false : (pageIdx === this.findController.selected.pageIdx));
      const selectedMatchIdx = (this.findController === null ?
        -1 : this.findController.selected.matchIdx);
      const highlightAll = (this.findController === null ?
        false : this.findController.state.highlightAll);
      const infinity = {
        divIdx: -1,
        offset: undefined,
      };

      function beginText(begin, className) {
        const divIdx = begin.divIdx;
        textDivs[divIdx].textContent = '';
        appendTextToDiv(divIdx, 0, begin.offset, className);
      }

      function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
        const div = textDivs[divIdx];
        const content = bidiTexts[divIdx].str.substring(fromOffset, toOffset);
        const node = document.createTextNode(content);
        if (className) {
          const span = document.createElement('span');
          span.className = className;
          span.appendChild(node);
          div.appendChild(span);
          return;
        }
        div.appendChild(node);
      }

      let i0 = selectedMatchIdx,
        i1 = i0 + 1;
      if (highlightAll) {
        i0 = 0;
        i1 = matches.length;
      } else if (!isSelectedPage) {
        // Not highlighting all and this isn't the selected page, so do nothing.
        return;
      }

      for (let i = i0; i < i1; i++) {
        const match = matches[i];
        const begin = match.begin;
        const end = match.end;
        const isSelected = (isSelectedPage && i === selectedMatchIdx);
        const highlightSuffix = (isSelected ? ' selected' : '');

        if (this.findController) {
          this.findController.updateMatchPosition(
            pageIdx, i, textDivs,
            begin.divIdx, end.divIdx,
          );
        }

        // Match inside new div.
        if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
          // If there was a previous div, then add the text at the end.
          if (prevEnd !== null) {
            appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
          }
          // Clear the divs and set the content until the starting point.
          beginText(begin);
        } else {
          appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset);
        }

        if (begin.divIdx === end.divIdx) {
          appendTextToDiv(
            begin.divIdx, begin.offset, end.offset,
            `highlight${highlightSuffix}`,
          );
        } else {
          appendTextToDiv(
            begin.divIdx, begin.offset, infinity.offset,
            `highlight begin${highlightSuffix}`,
          );
          for (let n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
            textDivs[n0].className = `highlight middle${highlightSuffix}`;
          }
          beginText(end, `highlight end${highlightSuffix}`);
        }
        prevEnd = end;
      }

      if (prevEnd) {
        appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
      }
    },

    updateMatches: function TextLayerBuilder_updateMatches() {
      // Only show matches when all rendering is done.
      if (!this.renderingDone) {
        return;
      }

      // Clear all matches.
      const matches = this.matches;
      const textDivs = this.textDivs;
      const bidiTexts = this.textContent.items;
      let clearedUntilDivIdx = -1;

      // Clear all current matches.
      for (let i = 0, len = matches.length; i < len; i++) {
        const match = matches[i];
        const begin = Math.max(clearedUntilDivIdx, match.begin.divIdx);
        for (let n = begin, end = match.end.divIdx; n <= end; n++) {
          const div = textDivs[n];
          div.textContent = bidiTexts[n].str;
          div.className = '';
        }
        clearedUntilDivIdx = match.end.divIdx + 1;
      }

      if (this.findController === null || !this.findController.active) {
        return;
      }

      // Convert the matches on the page controller into the match format
      // used for the textLayer.
      this.matches = this.convertMatches(this.findController === null ?
        [] : (this.findController.pageMatches[this.pageIdx] || []));
      this.renderMatches(this.matches);
    },

    /**
     * Fixes text selection: adds additional div where mouse was clicked.
     * This reduces flickering of the content if mouse slowly dragged down/up.
     * @private
     */
    _bindMouse: function TextLayerBuilder_bindMouse() {
      const div = this.textLayerDiv;
      div.addEventListener('mousedown', (e) => {
        const end = div.querySelector('.endOfContent');
        if (!end) {
          return;
        }
        // #if !(MOZCENTRAL || FIREFOX)
        // On non-Firefox browsers, the selection will feel better if the height
        // of the endOfContent div will be adjusted to start at mouse click
        // location -- this will avoid flickering when selections moves up.
        // However it does not work when selection started on empty space.
        let adjustTop = e.target !== div;
        // #if GENERIC
        adjustTop = adjustTop && window.getComputedStyle(end)
          .getPropertyValue('-moz-user-select') !== 'none';
        // #endif
        if (adjustTop) {
          const divBounds = div.getBoundingClientRect();
          const r = Math.max(0, (e.pageY - divBounds.top) / divBounds.height);
          end.style.top = `${(r * 100).toFixed(2)}%`;
        }
        // #endif
        end.classList.add('active');
      });
      div.addEventListener('mouseup', (e) => {
        const end = div.querySelector('.endOfContent');
        if (!end) {
          return;
        }
        // #if !(MOZCENTRAL || FIREFOX)
        end.style.top = '';
        // #endif
        end.classList.remove('active');
      });
    },
  };
  return TextLayerBuilder;
}());

export default TextLayerBuilder;

/**
 * @constructor
 * @implements IPDFTextLayerFactory
 */
function DefaultTextLayerFactory() {}
DefaultTextLayerFactory.prototype = {
  /**
   * @param {HTMLDivElement} textLayerDiv
   * @param {number} pageIndex
   * @param {PageViewport} viewport
   * @returns {TextLayerBuilder}
   */
  createTextLayerBuilder(textLayerDiv, pageIndex, viewport) {
    return new TextLayerBuilder({
      textLayerDiv,
      pageIndex,
      viewport,
    });
  },
};

