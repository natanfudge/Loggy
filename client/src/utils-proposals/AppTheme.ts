export namespace AppTheme {
    export const background = "var(--background)"
    export const surface = "var(--surface)"
    export const contrastSurface = "var(--contrast-surface)"
    export const contrastText = "var(--contrast-text)"
    export const hover = "var(--hover)"
    export const error = "var(--error)"
    export const selected = "var(--selected)"
    export const border = "var(--border)"
    export const text = "var(--text)"
    export const primary = "var(--primary)"
}
//     --border: rgb(86,86,86);
//     --text: rgb(255,255,255);
//     --primary: rgb(0, 217, 255)
//
// export interface ThemeColors {
//     background: string
//     surface: string
//     contrastSurface: string
//     contrastText: string
//     text: string
//     hover: string
//     error: string
//     selected: string
//     border: string
// }

// declare module "@emotion/react" {
//     // Allow using ThemeColors in styled and useTheme()
//     export interface Theme  {
//         colors: ThemeColors
//     }
// }
// // MUI interop: allow specifying the theme colors of this lib.
// // This should only be a dev dependency.
// declare module '@mui/material/styles' {
//     // allow configuration using `createTheme`
//     interface ThemeOptions {
//         colors: ThemeColors
//     }
// }

// export function defaultThemeColors(darkInput?: boolean): ThemeColors {
//     const dark = darkInput ?? systemIsDarkMode()
//     return {
//         background: dark ? "rgb(28,28,28)" : "rgb(255,255,255)",
//         surface: dark ? "rgb(40,40,40)" : "rgb(195,195,195)",
//         contrastSurface: dark ? "rgb(50,50,50)" : "rgb(160,160,160)",
//         contrastText: dark ? "rgb(199,198,181)" : "rgb(52,51,47)",
//         hover: "rgba(0,88,150,0.15)",
//         error: "rgba(255,0,0)",
//         selected: "rgba(0,88,150,0.5)",
//         border:  dark ? "rgb(86,86,86)" : "rgb(199,198,181)",
//         text: dark? "rgb(255,255,255)" : "rgb(0,0,0)"
//     }
// }