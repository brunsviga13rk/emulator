import { useMediaQuery } from '@mui/material'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect, useRef } from 'react'

export function useLogoColorFromScheme(mode: string | undefined): string {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    switch (mode) {
        case 'light':
            return 'black'
        case 'dark':
            return 'white'
        default:
            return prefersDarkMode ? 'black' : 'white'
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
            theme = 'vs-dark'
            break
        default:
            theme = prefersDarkMode ? 'vs-dark' : 'vs-light'
    }

    if (theme) monaco.editor.setTheme(theme)
}

export const useRunOnce = (fn: () => void, sessionKey: string) => {
    const triggered = useRef(false)

    useEffect(() => {
        const hasBeenTriggered = sessionKey
            ? sessionStorage.getItem(sessionKey)
            : triggered.current
        if (!hasBeenTriggered) {
            fn()
            triggered.current = true
            if (sessionKey) {
                sessionStorage.setItem(sessionKey, 'true')
            }
        }
    }, [fn, sessionKey])
}
