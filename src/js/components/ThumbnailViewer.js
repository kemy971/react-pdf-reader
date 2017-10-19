import React from 'react';
import PropTypes from 'prop-types';
import Thumbnail from './Thumbnail';

function ThumbnailViewer({ currentPage, onSelect, pages }) {
  return (
    <section className="pdf-thumbnail-viewer">
      {pages.map((page, index) =>
        (<Thumbnail
          key={index}
          page={page}
          pageIndex={page.pageIndex}
          isCurrentPage={currentPage === page.pageIndex}
          onSelect={() => onSelect(page.pageIndex)}
        />))}
    </section>
  );
}

ThumbnailViewer.propTypes = {
  currentPage: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  pages: PropTypes.array.isRequired,
};

export default ThumbnailViewer;
