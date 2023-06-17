import {RefObject, useEffect} from "react";

export function useKeyboardShortcut(config: KeyboardShortcutConfig, deps?: unknown[]) {
    useEffect(() => {
        const shortcut = registerKeyboardShortcut(config)
        return () => {
            shortcut.unregister()
        }
    }, [...Object.values(config), ...(deps ?? [])])


}

/**
 * Should be run before ReactDOM.createRoot()
 */
export function initKeyboardShortcuts() {
    const handleKeyPress = (event: KeyboardEvent) => {
        const shortcuts = keyboardShortcuts[event.code]
        if (shortcuts === undefined) return
        shortcuts.sort((shortcut1, shortcut2) => {
            // Without the minus it will be lowest priority comes first. With minus it's highest priority comes first.
            return -((shortcut1.config.priority ?? 0) - (shortcut2.config.priority ?? 0));
        })
        let firstShortcut = true;
        // Runs the high priority shortcuts first
        for (const shortcut of shortcuts) {
            // Ignore a shortcut if it was overridden (a higher priority shortcut was run before)
            if (!firstShortcut && shortcut.config.overrideable === true) continue
            const config = shortcut.config
            const requiresCtrl = config.ctrl === true
            if (
                // Require requested target
                (config.target === undefined || config.target?.current === document.activeElement)
                // Require control if requested (if ctrl is not required and ctrl is pressed, the hotkey is not fired)
                && (requiresCtrl === event.ctrlKey)
            ) {
                if (config.preventDefault === undefined || config.preventDefault) event.preventDefault()
                config.callback()
            }
            firstShortcut = false
        }
        // const sorted = shortcuts.length === 1? shortcuts: shortcuts.sor
        // if (event.code === code && (target === undefined || target?.current === document.activeElement) && (ctrl === undefined || event.ctrlKey === ctrl)) {
        //     if (preventDefault === undefined || preventDefault) event.preventDefault()
        //     callback()
        // }
    };


    // Attach the event listener when the component mounts
    document.addEventListener('keydown', handleKeyPress);
}

interface KeyboardShortcutConfig {
    /**
     * The keyboard key that is bound to the shortcut
     */
    code: string
    /**
     * The code to run when the key is pressed
     */
    callback: () => void
    /**
     * When defined, the shortcut will only fire when the target is selected
     */
    target?: RefObject<HTMLElement>
    /**
     * Whether to require control to be pressed
     */
    ctrl?: boolean
    /**
     * When there are multiple shortcuts bound to the same key, higher priority shortcuts will run first.
     */
    priority?: number
    /**
     * If true, what normally happens when pressing this shortcut will not occur.
     */
    preventDefault?: boolean,
    /**
     * If true and there are other hotkeys with the same key with a higher priority, a click won't trigger.
     */
    overrideable?: boolean
}

class KeyboardShortcut {
    readonly config: KeyboardShortcutConfig

    constructor(config: KeyboardShortcutConfig) {
        this.config = config
    }

    unregister() {
        const key = this.config.code
        keyboardShortcuts[key].remove(this)
        if (keyboardShortcuts[key].isEmpty()) delete keyboardShortcuts[key]
    }
}


const keyboardShortcuts: Record<string, KeyboardShortcut[]> = {}

function registerKeyboardShortcut(config: KeyboardShortcutConfig): KeyboardShortcut {
    const shortcut = new KeyboardShortcut(config)
    const array = keyboardShortcuts[config.code]
    if (array === undefined) {
        keyboardShortcuts[config.code] = [shortcut]
    } else {
        array.push(shortcut)
    }
    return shortcut
}

