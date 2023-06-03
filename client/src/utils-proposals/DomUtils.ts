import {useEffect} from "react";

export function useKeyboardShortcut(code: string, callback: () => void, deps: unknown[]) {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === code){
                event.preventDefault()
                callback()
            }
        };


        // Attach the event listener when the component mounts
        document.addEventListener('keydown', handleKeyPress);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [code,...deps]);
}
