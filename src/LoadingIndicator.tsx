import { TextLogo } from './TextLogo'
import {
    Box,
    Center,
    Loader,
    Overlay,
    Progress,
    Text,
    useMantineColorScheme,
} from '@mantine/core'
import { useSyncExternalStore } from 'react'
import { isDarkMode } from './utils'

export type LoadingEvent = {
    title: string
    progress: number
}

type LoadingProgress = {
    lastEvent: LoadingEvent
    progress: number
    events: number
}

let progress: LoadingProgress = {
    lastEvent: { title: 'initializing', progress: 0 },
    progress: 0.0,
    events: 0.0,
}
let callback: () => void = () => {}

export function setLoadingEvent(event: LoadingEvent) {
    const newProgress = {
        lastEvent: event,
        progress: progress.progress,
        events: progress.events,
    }

    if (progress.lastEvent.title == event.title) {
        newProgress.progress += event.progress - progress.lastEvent.progress
    } else {
        newProgress.progress += event.progress
        newProgress.events += 1.0
    }

    progress = newProgress
    callback()
}

export function subscribe(onStoreChange: () => void): () => void {
    callback = onStoreChange

    return () => {}
}

function useLoadingEvent() {
    return useSyncExternalStore(
        subscribe,
        () => progress,
        () => progress
    )
}

export function LoadingIndicator() {
    const range = (start: number, end: number, step = 1) =>
        Array.from(
            { length: Math.ceil((end - start + 1) / step) },
            (_, i) => start + i * step
        )

    const figure = (index: number) =>
        'icons/' +
        [
            'brunsviga',
            'brainsofsteel',
            'lua',
            'vite',
            'tailwind',
            'mantine',
            'react',
            'three',
            'webgl',
        ][Math.floor(index % 9)] +
        '.svg'

    const { colorScheme } = useMantineColorScheme()
    const prefersDarkMode = isDarkMode(colorScheme)
    const svgFilter = 'loading-image ' + (prefersDarkMode ? '' : 'svg-invert')

    const { lastEvent, progress } = useLoadingEvent()

    return (
        <Overlay
            id="div-loading-indicator"
            color={prefersDarkMode ? 'black' : 'white'}
            backgroundOpacity={1.0}
            style={{ overflow: 'hidden' }}
            className="flex h-full w-full absolute"
        >
            <Progress
                size="sm"
                style={{ zIndex: 999, width: '100%', position: 'absolute' }}
                value={(progress / 5.0) * 100}
            />
            {range(0, 5).map((j) =>
                range(0, 4).map((i) => (
                    <img
                        id={`${i}${j}`}
                        key={`loading-image-${i}${j}`}
                        className={svgFilter}
                        style={{
                            position: 'absolute',
                            top: `calc(50% + ${Math.cos(i * 1.04716 + 0.6283 * j) * 3.0 * (j + 4)}rem)`,
                            left: `calc(50% + ${Math.sin(i * 1.04716 + 0.6283 * j) * 3.0 * (j + 4)}rem)`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        src={figure(i * 4 + j)}
                        height="140pt"
                    ></img>
                ))
            )}
            <Box
                className="loader-gradient"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '64rem',
                    height: '64rem',
                    transform: 'translate(-50%, -50%)',
                }}
            ></Box>
            <Center className="m-auto flex-col text-center z-10">
                <Loader size="lg" color="gray" type="dots" />
                <Text id="text-logo-loading-indicator">
                    <TextLogo width="12rem" />
                </Text>
                <Text id="loading-status">{lastEvent.title}</Text>
            </Center>
        </Overlay>
    )
}
