import WindowControls from '#components/WindowControls'
import WindowWrapper from '#hoc/WindowWrapper'
import { ChevronLeft, ChevronRight, PanelLeft, ShieldHalf, Search, Share, Plus, Copy } from 'lucide-react'
import React, { useState } from 'react'

const Safari = () => {
    const [url] = useState("https://mohssenmbarokha.vercel.app")

    return (
        <>
            <div id="window-header">
                <WindowControls target="safari" />

                <PanelLeft className='ml-10 icon' />

                <div className='flex items-center gap-1 ml-5'>
                    <ChevronLeft className='icon' />
                    <ChevronRight className='icon' />
                </div>

                <div className='flex-1 flex-center gap-3'>
                    <ShieldHalf className='icon' />
                    <div className='search'>
                        <Search className="icon" />

                        <input
                            type='text'
                            value={url}
                            readOnly
                            className='flex-1 truncate'
                        />
                    </div>
                </div>
                <div className='flex items-center gap-5'>
                    <Share className='icon' />
                    <Plus className='icon' />
                    <Copy className='icon' />
                </div>
            </div>

            <div className='h-full bg-white relative' style={{ height: 'calc(100% - 52px)' }}>
                <iframe
                    src={url}
                    title="Browser"
                    className="w-full h-full border-none"
                    loading="lazy"
                />
            </div>
        </>
    )
}

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow
