import React, { useEffect, useState } from 'react'

export default function useBrowserWidth() {
    const [browserWidth, setBrowserWidth] = useState<number>(0);
    useEffect(() => {
        function updateSize() {
            setBrowserWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return browserWidth;
}