import { useMediaQuery } from '@mui/material'

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
