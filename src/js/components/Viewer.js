import React from 'react';
import PropTypes from 'prop-types';
import Page from './Page';

function Viewer({
  pages,
  rotate,
  renderType,
  scale,
  onPageChange,
}) {
  return (
    <section className="pdf-viewer">
      {
        pages.map((page, index) => (
          <Page
            key={index}
            page={page}
            scale={scale}
            rotate={rotate}
            renderType={renderType}
            onVisibleOnViewport={onPageChange}
          />
        ))
      }
    </section>
  );
}

Viewer.propTypes = {
  pages: PropTypes.array.isRequired,
  rotate: PropTypes.number.isRequired,
  renderType: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Viewer;
