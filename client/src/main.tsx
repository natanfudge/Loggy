import React from 'react'
import ReactDOM from 'react-dom/client'
import {AppWrapper} from './ui/App'
import {createBrowserRouter} from "react-router-dom";
import "./App.css"

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: A
//     }
// ])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AppWrapper/>
    </React.StrictMode>,
)
