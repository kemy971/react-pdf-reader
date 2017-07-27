import React, {Component} from 'react'
import Thumbnail from './Thumbnail'

class ThumbnailViewer extends Component {

    render() {
        const {currentPage, onSelect, pages} = this.props;
        return (
            <section className="pdf-thumbnail-viewer">
                {
                    pages.map((page, index) => (
                    <Thumbnail 
                        key={index} 
                        page={page} 
                        pageIndex={page.pageIndex}
                        isCurrentPage={currentPage === page.pageIndex}
                        onSelect={() => onSelect(page.pageIndex)}
                    />
                ))
                }
            </section>
        )
    }
}

export default ThumbnailViewer
