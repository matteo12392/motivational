export const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') {
        return false; // Default to desktop for server-side rendering
    }

    // Check for common mobile device indicators
    const userAgent = window.navigator.userAgent.toLowerCase();
    const mobileKeywords = [
        'android',
        'webos',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'windows phone'
    ];

    // Check screen width
    const isMobileWidth = window.innerWidth <= 768;

    // Check if userAgent contains any mobile keywords
    const hasMobileUserAgent = mobileKeywords.some(keyword =>
        userAgent.includes(keyword)
    );

    // Additional check for touch capability
    const hasTouch = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error msMaxTouchPoints is a non-standard property
        navigator.msMaxTouchPoints > 0;

    return isMobileWidth || hasMobileUserAgent || hasTouch;
};

// Hook version for React components
import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(isMobileDevice());
        };

        // Check on mount
        checkDevice();

        // Check on window resize
        window.addEventListener('resize', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    return isMobile;
};