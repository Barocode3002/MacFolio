import React, { useLayoutEffect, useRef } from 'react'
import useWindowStore from '#store/window';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex, isMaximized, isMinimized } = windows[windowKey];
        const ref = useRef(null);
        const resizeRef = useRef(null);
        const dragInstance = useRef(null);

        // Open Animation
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            el.style.display = "block";
            // Only animate entry if not just restoring (though isOpen logic usually means fresh open)
            // We can keep the simple pop-in for now.
            gsap.fromTo(
                el,
                { scale: 0.8, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
            )
        }, [isOpen]);

        // Draggable Logic
        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            // We use the header as trigger to avoid dragging when interacting with content
            const [instance] = Draggable.create(el, {
                type: "x,y",
                trigger: `#${windowKey} #window-header`,
                onPress: () => focusWindow(windowKey),
                zIndexBoost: false,
            });
            dragInstance.current = instance;

            return () => instance.kill();
        }, []);


        // Maximize Logic
        useGSAP(() => {
            const el = ref.current;
            if (!el || !dragInstance.current) return;

            if (isMaximized) {
                dragInstance.current.disable();
                gsap.to(el, {
                    top: 0, left: 0,
                    x: 0, y: 0, // Reset transform
                    width: "100vw",
                    height: "100vh", // Fullscreen check (minus dock maybe? user asked for standard max)
                    borderRadius: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                if (!isMinimized) dragInstance.current.enable();
                gsap.to(el, {
                    width: "50rem", // Default width
                    height: "30rem", // Default height
                    borderRadius: "10px",
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }, [isMaximized]);

        // Minimize Logic
        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            if (isMinimized) {
                if (dragInstance.current) dragInstance.current.disable();

                // Find the target icon in the dock
                const targetIcon = document.querySelector(`#minimized-icon-${windowKey}`);
                let x = 0, y = 500, scale = 0;

                if (targetIcon) {
                    const iconRect = targetIcon.getBoundingClientRect();
                    const elRect = el.getBoundingClientRect();
                    const elCenterX = elRect.left + elRect.width / 2;
                    const elCenterY = elRect.top + elRect.height / 2;
                    const iconCenterX = iconRect.left + iconRect.width / 2;
                    const iconCenterY = iconRect.top + iconRect.height / 2;

                    x = iconCenterX - elCenterX;
                    y = iconCenterY - elCenterY;
                    scale = 0.1;
                }

                // Genie Effect Simulation (Scale + Translate)
                gsap.to(el, {
                    x: x,
                    y: y,
                    scale: scale,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.inOut"
                });
            } else {
                if (dragInstance.current && !isMaximized) dragInstance.current.enable();

                // Restore animation
                gsap.to(el, {
                    x: isMaximized ? 0 : 0,
                    y: isMaximized ? 0 : 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power3.out"
                });
            }
        }, [isMinimized]);

        // Resize Logic
        const handleMouseDown = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const el = ref.current;
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = el.offsetWidth;
            const startHeight = el.offsetHeight;

            const onMouseMove = (moveEvent) => {
                const newWidth = startWidth + (moveEvent.clientX - startX);
                const newHeight = startHeight + (moveEvent.clientY - startY);
                // Min dimensions
                if (newWidth > 300) el.style.width = `${newWidth}px`;
                if (newHeight > 200) el.style.height = `${newHeight}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        };

        // Layout Effect for visibility
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            // If minimized, keep display block but opacity 0 (handled by gsap)
            // If closed, display none.
            el.style.display = isOpen ? "block" : "none";
        }, [isOpen]);

        return (
            <section id={windowKey} ref={ref} style={{ zIndex }} className='absolute'>
                <Component {...props} />
                {/* Resize Handle */}
                {!isMaximized && (
                    <div
                        ref={resizeRef}
                        onMouseDown={handleMouseDown}
                        className="resize-handle cursor-se-resize absolute bottom-0 right-0 w-6 h-6 bg-transparent z-50 hover:bg-gray-500/10 rounded-tl-lg"
                        title="Resize"
                    />
                )}
            </section>
        )
    }

    Wrapped.displayName = `windowWrapper(${Component.displayName || Component.name || "Component"})`

    return Wrapped;
}

export default WindowWrapper;
