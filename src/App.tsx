import Renderer from './render/Renderer.tsx'
import { Header } from './Header.tsx'
import { Editor as Solver } from './solver/Editor.tsx'
import { Editor as Coder } from './api/Editor.tsx'
import { useState } from 'react'
import {
    Center,
    Group,
    MantineProvider,
    SegmentedControl,
    Stack,
} from '@mantine/core'
import { theme } from './theme.ts'
import Shell from './Shell.tsx'
import { Icon } from '@iconify/react/dist/iconify.js'
import classes from './styles.module.css'
import { LoadingIndicator } from './LoadingIndicator.tsx'

/**
 * Detect when running in iFrame component.
 *
 * @returns true when running in iFrame, false otherwise.
 */
function inIframe() {
    try {
        return window.self !== window.top
    } catch {
        // Access to window.top may be blocked due to cross origin.
        return true
    }
}

function App() {
    return (
        <MantineProvider theme={theme}>
            <Shell />
        </MantineProvider>
    )
}

export default App
