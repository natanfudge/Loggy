import {RefObject, useEffect} from "react";

export function useKeyboardShortcut(code: string, callback: () => void, deps: unknown[], target?: RefObject<HTMLElement>, ctrl?: boolean, preventDefault?: boolean) {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === code && (target === undefined || target?.current === document.activeElement) && (ctrl === undefined || event.ctrlKey === ctrl)) {
                if (preventDefault === undefined || !preventDefault) event.preventDefault()
                callback()
            }
        };


        // Attach the event listener when the component mounts
        document.addEventListener('keydown', handleKeyPress);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [code, ...deps]);
}
