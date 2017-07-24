import React, {Component} from 'react'
import Velocity from 'velocity-animate'
import Page from './Page'
import ThumbnailViewer from './ThumbnailViewer'

 class Viewer extends Component{

     state = {
         scale: 1,
         currentPage: 1,
     };

     zoomIn = () => {
         let {scale} = this.state;
         this.setState({scale: scale + .1})
     };

     zoomOut = () => {
         let {scale} = this.state;
         this.setState({scale: scale - .1})
     };

     onVisibleOnViewport = (pageIndex) => {
         this.setState({currentPage: pageIndex});
     };

     onSelectPage = (pageIndex) => {
         let page = document.getElementById(`pdf-page-${pageIndex}`);
         Velocity(page,'scroll',{
             duration: 300,
             queue: false
         });
     };

     onLoaded = () => {
         this.props.onViewLoadComplete()
     };

    render()
    {
        const { scale, currentPage} = this.state;
        const {pages, rotate, renderType, width} = this.props;
        return (
            <section className="pdf-viewer">
                <header>
                    <div className="zoom-actions">
                        <button onClick={this.zoomIn}>Zoom +</button>
                        <button onClick={this.zoomOut}>Zoom -</button>
                    </div>
                    <strong>page {currentPage} sur {pages.length || 0}</strong>
                </header>
                <ThumbnailViewer pages={pages} currentPage={currentPage} onSelect={this.onSelectPage} onLoaded={this.onLoaded} />

                {
                    pages.map((page, index) => (
                        <Page key={index}
                              page={page}
                              scale={scale}
                              width={width}
                              rotate={rotate}
                              renderType={renderType}
                              onVisibleOnViewport={this.onVisibleOnViewport}/>
                    ))
                }
            </section>
        )
    }
}

export default Viewer
