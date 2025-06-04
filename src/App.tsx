import Renderer from './render/Renderer.tsx'
import { Header } from './Header.tsx'
import { Editor as Solver } from './solver/Editor.tsx'
import { Editor as Coder } from './api/Editor.tsx'
import {
    Box,
    createTheme,
    CssBaseline,
    Grid2,
    Paper,
    Stack,
    Tab,
    Tabs,
    ThemeProvider,
} from '@mui/material'
import Dashboard from './Dashboard.tsx'
import { useState } from 'react'
import CalculateIcon from '@mui/icons-material/Calculate'
import CodeIcon from '@mui/icons-material/Code'
import { LoadingIndicator } from './LoadingIndicator.tsx'
import { MantineProvider } from '@mantine/core'
import { theme } from './theme.ts'
import Shell from './Shell.tsx'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <Box
            role="tabpanel"
            visibility={value === index ? 'visible' : 'hidden'}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            height={value === index ? '100%' : '0'}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
            {...other}
        >
            {children}
        </Box>
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

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

function Content() {
    /* Tab index */
    const [value, setValue] = useState(0)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Stack direction="column" sx={{ height: '100%' }}>
            <Header />
            <Grid2
                container
                spacing={1}
                sx={{
                    height: 'calc(100% - 4rem)',
                    overflow: 'hidden',
                }}
            >
                {/* Renderer on left hand side */}
                <Grid2
                    size={{ xs: 12, md: 7 }}
                    sx={{ padding: '1rem', height: '100%' }}
                >
                    <Stack direction="column" sx={{ height: '100%' }}>
                        <Renderer />
                    </Stack>
                </Grid2>
                {/* Editors on right hand side */}
                <Grid2
                    size={{ xs: 12, md: 5 }}
                    sx={{ padding: '1rem', height: '100%' }}
                >
                    <Dashboard />
                    <Tabs
                        value={value}
                        sx={{ flexShrink: 0, height: '4rem' }}
                        onChange={handleChange}
                        centered
                    >
                        <Tab
                            icon={<CalculateIcon />}
                            iconPosition="start"
                            label="Solver"
                            {...a11yProps(0)}
                        />
                        <Tab
                            icon={<CodeIcon />}
                            iconPosition="start"
                            label="Code"
                            {...a11yProps(1)}
                        />
                    </Tabs>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'calc(100% - 18rem)',
                        }}
                    >
                        <Paper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                padding: 2,
                            }}
                            variant="outlined"
                        >
                            <CustomTabPanel value={value} index={0}>
                                <Solver />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <Coder />
                            </CustomTabPanel>
                        </Paper>
                    </Box>
                </Grid2>
            </Grid2>
            <LoadingIndicator />
        </Stack>
    )
}

export default App
