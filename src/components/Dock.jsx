import { dockApps } from '#constants';
import useWindowStore from '#store/window';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react'
import { Tooltip } from 'react-tooltip';

const Dock = () => {
    const { openWindow, closeWindow, windows, restoreWindow } = useWindowStore();
    const dockRef = useRef(null);



    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return () => { };

        const icons = dock.querySelectorAll('.dock-icon');

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);

                const intensity = Math.exp(-(distance ** 2.5) / 2000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: 'power2.out',
                })
            })
        }

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();

            animateIcons(e.clientX - left);
        }
        const resetIcons = () =>
            icons.forEach((icon) =>
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power1.out"
                })
            )
        dock.addEventListener('mousemove', handleMouseMove)
        dock.addEventListener('mouseleave', resetIcons)

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove)
            dock.removeEventListener('mouseleave', resetIcons)
        }
    })

    if (!windows) return null;

    const toggleApp = (app) => {
        if (!app.canOpen) return;

        const window = windows[app.id];

        if (window.isOpen) {
            if (window.isMinimized) {
                restoreWindow(app.id);
            } else {
                closeWindow(app.id);
            }
        } else {
            openWindow(app.id)
        }
    };

    return (
        <section id="dock">
            <div ref={dockRef} className='dock-container'>
                {/* Pinned Apps */}
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className='relative flex justify-center'>
                        <button
                            type='button'
                            className='dock-icon'
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                        >
                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading='lazy'
                                className={canOpen ? "" : "opacity-60"}
                            />
                            {windows[id]?.isOpen && !windows[id]?.isMinimized && (
                                <span className='absolute -bottom-1 w-1 h-1 bg-white/50 rounded-full' />
                            )}
                        </button>
                    </div>
                ))}

                {/* Divider if there are minimized windows */}
                {Object.values(windows).some(w => w.isMinimized) && (
                    <div className='w-px h-8 bg-white/20 mx-2 self-center' />
                )}

                {/* Minimized Windows */}
                {Object.entries(windows)
                    .filter(([, win]) => win.isMinimized)
                    .map(([key]) => {
                        // Find matching dock app info if available, or generic
                        const appInfo = dockApps.find(app => app.id === key) || { name: key, icon: 'pdf.png'  };
                        return (
                            <div key={key} className='relative flex justify-center'>
                                <button
                                    id={`minimized-icon-${key}`} // target for genie effect
                                    type='button'
                                    className='dock-icon'
                                    aria-label={`Restore ${appInfo.name}`}
                                    data-tooltip-id="dock-tooltip"
                                    data-tooltip-content={appInfo.name}
                                    data-tooltip-delay-show={150}
                                    onClick={() => restoreWindow(key)}
                                >
                                    <img
                                        src={`/images/${appInfo.icon}`}
                                        alt={appInfo.name}
                                        loading='lazy'
                                        className="opacity-80 grayscale-[0.3]" // Visual distinction
                                    />
                                    {/* Minimized icon indicator */}
                                    <div className="absolute inset-0 bg-white/10 rounded-xl" />
                                </button>
                            </div>
                        )
                    })
                }

                <Tooltip id="dock-tooltip" place='top' className='tooltip' />
            </div>
        </section>
    )
}

export default Dock
