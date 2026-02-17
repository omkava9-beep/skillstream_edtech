import { useEffect } from "react";

// This hook detects clicks outside of the specified ref and calls the provided handler function.
export default function useOnClickOutside(ref, handler) {
    useEffect(() => {
        // Define the listener function to be called on click/touch events
        const listener = (event) => {
            // If the click/touch event originated inside the ref element, do nothing
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            // Otherwise, call the provided handler function
            handler(event);
        };

        // Add event listeners for mousedown and touchstart events
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        // Cleanup function to remove event listeners when the component unmounts or ref/handler changes
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]); // Only re-run the effect if ref or handler changes
}
