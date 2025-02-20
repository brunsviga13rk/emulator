import { useMediaQuery } from '@mui/material'

export function useLogoColorFromScheme(mode: string | undefined) {
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

export function useBackgroundColorFromScheme(mode: string | undefined) {
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
