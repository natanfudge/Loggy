import React from 'react'
import ReactDOM from 'react-dom/client'
import {AppWrapper} from './ui/App'
import {createBrowserRouter} from "react-router-dom";
import "./App.css"
import {initKeyboardShortcuts} from "./utils-proposals/Keyboard";
import "fudge-lib/dist/styles.css"
import "./utils-proposals/styles.css"

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: A
//     }
// ])

initKeyboardShortcuts()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AppWrapper/>
    </React.StrictMode>,
)
