import CircularProgress from '@mui/material/CircularProgress'
import { TextLogo } from './TextLogo'
import { Box, Typography, useColorScheme } from '@mui/material'
import { useBackgroundColorFromScheme } from './utils'

export function LoadingIndicator() {
    const { mode } = useColorScheme()

    return (
        <Box
            id="div-loading-indicator"
            sx={{ backgroundColor: useBackgroundColorFromScheme(mode) }}
            className="flex h-full w-full absolute bg-opacity-100 z-100"
        >
            <Box className="m-auto flex-col text-center">
                <CircularProgress color="inherit" size={60} />
                <Typography style={{ marginTop: '2.5rem' }}>
                    <div id="text-logo-loading-indicator">
                        <TextLogo width="12rem" />
                    </div>
                </Typography>
                <Typography style={{ marginTop: '1rem' }}>
                    Loading assets...
                </Typography>
            </Box>
        </Box>
    )
}
