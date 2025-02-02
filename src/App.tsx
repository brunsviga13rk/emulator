import Renderer from './render/Renderer.tsx'
import { Header } from './Header.tsx'
import { Editor } from './solver/Editor.tsx'
import { CircularProgress, Grid2, Stack } from '@mui/material'
import Dashboard from './Dashboard.tsx'

function App() {
    return (
        <Stack direction="column" sx={{ height: '100%' }}>
            <Header />
            <Grid2
                container
                spacing={1}
                sx={{
                    position: 'fixed',
                    top: '4rem',
                    bottom: 0,
                    right: 0,
                    left: 0,
                }}
            >
                <Grid2 size={{ sm: 12, md: 7 }} sx={{ padding: '1rem' }}>
                    <Stack direction="column" sx={{ height: '100%' }}>
                        <Renderer />
                    </Stack>
                </Grid2>
                <Grid2
                    size={{ sm: 12, md: 5 }}
                    sx={{ padding: '1rem', height: '100%' }}
                >
                    <Stack spacing={2}>
                        <Dashboard />
                        <Editor />
                    </Stack>
                </Grid2>
            </Grid2>
            <div
                id="div-loading-indicator"
                className="flex h-full w-full absolute bg-white bg-opacity-100 z-100"
            >
                <div className="m-auto flex-col justify-center">
                    <CircularProgress color="inherit" size={60} />
                    <p className="mt-8">Loading...</p>
                </div>
            </div>
        </Stack>
    )
}

export default App
