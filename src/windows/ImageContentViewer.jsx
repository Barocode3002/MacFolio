import WindowControls from '#components/WindowControls';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window'
import React from 'react'

const ImageContentViewer = () => {
    const { windows } = useWindowStore();
    const data = windows.imgfile?.data || {};
    const { name = 'Untitled', imageUrl } = data;

    return (
        <>
            <div id='window-header' style={{ pointerEvents: 'auto', cursor: 'grab' }}>
                <WindowControls target="imgfile" />
                <p>{name}</p>
            </div> 

            <div className='preview' style={{ pointerEvents: 'none' }}>
                {imageUrl && (
                    <img 
                        src={imageUrl}
                        alt={name}
                        style={{ pointerEvents: 'auto' }}
                    />
                )}
            </div>
        </>
    )
}

const ImageWindow = WindowWrapper(ImageContentViewer, "imgfile")
export default ImageWindow;