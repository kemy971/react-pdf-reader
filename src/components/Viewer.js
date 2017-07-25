import React, {Component} from 'react'
import Page from './Page'

 class Viewer extends Component{
    render()
    {
        const {pages, rotate, renderType, width, scale, onPageChange} = this.props;
        return (
            <section className="pdf-viewer">
                {
                    pages.map((page, index) => (
                        <Page key={index}
                              page={page}
                              scale={scale}
                              width={width}
                              rotate={rotate}
                              renderType={renderType}
                              onVisibleOnViewport={onPageChange}/>
                    ))
                }
            </section>
        )
    }
}

export default Viewer
