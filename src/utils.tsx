import { useMediaQuery } from '@mui/material'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export function useLogoColorFromScheme(mode: string | undefined): string {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    switch (mode) {
        case 'light':
            return 'black'
        case 'dark':
            return 'white'
        default:
            return prefersDarkMode ? 'white' : 'black'
    }
}

export function useBackgroundColorFromScheme(mode: string | undefined): string {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    switch (mode) {
        case 'light':
            return 'white'
        case 'dark':
            return 'black'
        default:
            return prefersDarkMode ? 'black' : 'white'
    }
}

export function isDarkMode(mode: string | undefined): boolean {
    const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches

    switch (mode) {
        case 'light':
            return false
        case 'dark':
            return true
        default:
            return prefersDarkMode ? true : false
    }
}

export function useManacoThemeFromScheme(mode: string | undefined) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    let theme = undefined

    switch (mode) {
        case 'light':
            theme = 'vs-light'
            break
        case 'dark':
            theme = 'brunsviga13rk-dark'
            break
        default:
            theme = prefersDarkMode ? 'brunsviga13rk-dark' : 'vs-light'
    }

    if (theme) monaco.editor.setTheme(theme)
}
