import React, {Component} from 'react'
import classnames from 'classnames'

class ThumbnailViewer extends Component {

    state = {
        isLoading: true
    };

    componentWillMount() {
        this.renderThumbnails()
    }

    renderThumbnails = () => {
        const {pages} = this.props;
        const rotate = 0;
        const pixelRatio = window.devicePixelRatio || 1;
        const scale = 1;
        const width = 100;

        let pageScale = width / pages[0].getViewport(scale, rotate).width;
        pageScale = scale * pageScale;

        let viewport = pages[0].getViewport(
            pageScale * pixelRatio,
            rotate
        );

        let renderPromises = [];
        this.thumbnails = [];

        //Render thumbnail canvas for all pages
        pages.forEach((page) => {
            let canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.height = `${viewport.height / pixelRatio}px`;
            canvas.style.width = `${viewport.width / pixelRatio}px`;
            this.thumbnails.push({
                pageIndex: page.pageIndex,
                canvas
            });
            const canvasContext = canvas.getContext("2d");
            const renderContext = {
                canvasContext,
                viewport
            };
            renderPromises.push(page.render(renderContext));
        });

        //Wait all thumbnail canvas rendered
        Promise.all(renderPromises).then(() => {

            //Get thumbnails images
            this.thumbnails.map((thumbnail) => {
                thumbnail.src = thumbnail.canvas.toDataURL();
                thumbnail.canvas.width = 0;
                thumbnail.canvas.height = 0;

                //Destroy unused canvas
                delete thumbnail.canvas;
            });

            this.setState({isLoading: false});
            this.props.onLoaded();
        })

    };

    render() {
        const {isLoading} = this.state;
        const {currentPage, onSelect} = this.props;
        return (
            <section className="pdf-thumbnail-viewer">
                {
                    !isLoading ?
                        this.thumbnails.map(({pageIndex, src}, index) => <Thumbnail key={index} src={src} pageIndex={pageIndex}
                                                                             isCurrentPage={currentPage === pageIndex}
                                                                             onSelect={() => onSelect(pageIndex)}/>)
                        : null}
            </section>
        )
    }
}

function Thumbnail({isCurrentPage, onSelect, pageIndex, src}) {
    return (
        <div className={classnames("pdf-thumbnail", {"active": isCurrentPage})}>
            <img src={src} onClick={onSelect}/>
            <h5>{pageIndex + 1}</h5>
        </div>)
}


export default ThumbnailViewer
