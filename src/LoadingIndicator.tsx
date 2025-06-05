import CircularProgress from '@mui/material/CircularProgress'
import { TextLogo } from './TextLogo'
import { useMediaQuery } from '@mantine/hooks'
import { Box, Center, Loader, Overlay, Text } from '@mantine/core'

export function LoadingIndicator() {
    const range = (start: number, end: number, step = 1) =>
        Array.from(
            { length: Math.ceil((end - start + 1) / step) },
            (_, i) => start + i * step
        )

    const figure = () =>
        'icons/' +
        [
            'brunsviga',
            'brainsofsteel',
            'lua',
            'vite',
            'tailwind',
            'mui',
            'react',
            'three',
            'webgl',
        ][Math.floor(Math.random() * 9)] +
        '.svg'

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const svgFilter = 'loading-image ' + (prefersDarkMode ? '' : 'svg-invert')

    return (
        <Overlay
            id="div-loading-indicator"
            color="#000"
            backgroundOpacity={1.0}
            style={{ overflow: 'hidden' }}
            className="flex h-full w-full absolute"
        >
            {range(0, 5).map((j) =>
                range(0, 4).map((i) => (
                    <img
                        id={`${i}${j}`}
                        className={svgFilter}
                        style={{
                            position: 'absolute',
                            top: `calc(50% + ${Math.cos((i * 6.283) / 6.0 + 0.6283 * j) * 3.0 * (j + 4)}rem)`,
                            left: `calc(50% + ${Math.sin((i * 6.283) / 6.0 + 0.6283 * j) * 3.0 * (j + 4)}rem)`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        src={figure()}
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
                <Text>Loading assets...</Text>
            </Center>
        </Overlay>
    )
}
