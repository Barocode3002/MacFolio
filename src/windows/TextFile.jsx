import WindowControls from '#components/WindowControls'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import React from 'react'

const TextFile = () => {
    const { windows } = useWindowStore();
    const data = windows.txtfile.data || {};

    return (
        <>
            <div id='window-header'>
                <WindowControls target="txtfile" />
                <h2>{data.name || 'Untitled'}</h2>
            </div>

            <div className='bg-white overflow-y-auto p-8' style={{ height: 'calc(100% - 45px)' }}>
                {/* Optional Image */}
                {data.image && (
                    <div className='mb-6 flex justify-center'>
                        <img
                            src={data.image}
                            alt={data.name}
                            className='max-w-xs rounded-lg shadow-md'
                        />
                    </div>
                )}

                {/* Optional Subtitle */}
                {data.subtitle && (
                    <h3 className='text-xl font-semibold mb-4 text-gray-800'>
                        {data.subtitle}
                    </h3>
                )}

                {/* Description Paragraphs */}
                {data.description && Array.isArray(data.description) && (
                    <div className='space-y-4'>
                        {data.description.map((paragraph, index) => (
                            <p key={index} className='text-gray-700 leading-relaxed'>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                )}

                {/* Fallback if no data */}
                {!data.description && !data.image && !data.subtitle && (
                    <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                        <p>No content to display</p>
                    </div>
                )}
            </div>
        </>
    )
}

const TextFileWindow = WindowWrapper(TextFile, "txtfile")
export default TextFileWindow
