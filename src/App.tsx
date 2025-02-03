import Renderer from './render/Renderer.tsx'
import { Header } from './Header.tsx'
import { Editor as Solver } from './solver/Editor.tsx'
import { Editor as Coder } from './api/Editor.tsx'
import { Box, CircularProgress, Grid2, Stack, Tab, Tabs } from '@mui/material'
import Dashboard from './Dashboard.tsx'
import { useState } from 'react'
import CalculateIcon from '@mui/icons-material/Calculate'
import CodeIcon from '@mui/icons-material/Code'

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
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ height: '100%' }}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3, height: '100%' }}>{children}</Box>
            )}
        </Box>
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

function App() {
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
                    <Stack spacing={2} sx={{ height: '100%' }}>
                        <Dashboard />
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tabs
                                    value={value}
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
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                <Solver />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <Coder />
                            </CustomTabPanel>
                        </Box>
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
