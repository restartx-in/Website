import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VideoScroller = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const frameCount = 240;
    
    // Object to hold the current frame index for GSAP to animate
    const airpods = useRef({ frame: 0 });

    // Load all frames using Vite's glob import
    const frames = import.meta.glob('../assets/ezgif-frame-*.png', { eager: true, as: 'url' });
    const frameUrls = Object.values(frames).sort((a, b) => {
        // Sort numerically based on the filename
        const extractNum = (url) => parseInt(url.match(/frame-(\d+)/)[1]);
        return extractNum(a) - extractNum(b);
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Preload images
        const loadedImages = [];
        let loadedCount = 0;

        frameUrls.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setImages(loadedImages);
                    renderFrame(0); // Initial render
                }
            };
            loadedImages.push(img);
        });

        const renderFrame = (index) => {
            if (loadedImages[index]) {
                const img = loadedImages[index];
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Draw image with "cover" logic
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        // Create a master timeline for everything in the VideoScroller
        const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400%", // Longer scroll for more breathing room
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
            }
        });

        // 1. Video Scrubbing
        masterTl.to(airpods.current, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1, // Timeline progress unit
            onUpdate: () => renderFrame(airpods.current.frame)
        }, 0);

        // 2. Content Translation (Moving the cards up)
        masterTl.to(".video-scroller-content", {
            y: "-200%",
            ease: "none",
            duration: 1,
        }, 0);

        // 3. Card Animations (Fade in/out at specific progress points)
        const cards = gsap.utils.toArray('.glass-card');
        cards.forEach((card, i) => {
            // Fade in
            masterTl.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.2,
            }, (i * 0.4)); // Start points: 0, 0.4, 0.8
            
            // Fade out (only for first two)
            if (i < cards.length - 1) {
                masterTl.to(card, {
                    opacity: 0,
                    y: -30,
                    duration: 0.2,
                }, (i * 0.4) + 0.3);
            }
        });

        // Animate the VideoScroller canvas in
        gsap.to(canvas, {
            opacity: 1,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "top top",
                scrub: true,
            }
        });

        // Hide the Hero section when this starts
        gsap.to(".experience-wrapper, .hero-section", {
            opacity: 0,
            pointerEvents: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 50%",
                end: "top top",
                scrub: true,
            }
        });

        // Resize handler
        const handleResize = () => renderFrame(airpods.current.frame);
        window.addEventListener('resize', handleResize);

        return () => {
            masterTl.kill();
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="video-scroller-container">
            <canvas ref={canvasRef} className="video-scroller-canvas" />
            <div className="video-scroller-content">
                <section className="scroll-section left">
                    <div className="glass-card">
                        <h2>Precision Engineered</h2>
                        <p>Every curve, every detail, perfected for your ears.</p>
                    </div>
                </section>
                <section className="scroll-section left">
                    <div className="glass-card">
                        <h2>Wireless Freedom</h2>
                        <p>Seamlessly switch between devices without missing a beat.</p>
                    </div>
                </section>
                <section className="scroll-section right">
                    <div className="glass-card">
                        <h2>Active Noise Cancellation</h2>
                        <p>Shut out the world. Immerse in the music.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default VideoScroller;
