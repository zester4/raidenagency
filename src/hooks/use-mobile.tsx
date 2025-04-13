
import { useEffect, useState } from 'react';

export function useIsMobile() {
  // Initialize with a function to avoid SSR mismatches
  const [isMobile, setIsMobile] = useState(() => {
    // Only access window when in browser environment
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    // Function to check if the window width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Only add event listeners in browser environment
    if (typeof window !== 'undefined') {
      // Initial check
      checkMobile();

      // Add event listener
      window.addEventListener('resize', checkMobile);

      // Cleanup
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  return isMobile;
}
