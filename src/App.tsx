import Renderer from './Renderer.tsx'
import { StatusPanel } from './StatusPanel.tsx'
import { Header } from './Header.tsx'
import { Editor } from './solver/Editor.tsx'
import { Box, CircularProgress, Tab, Tabs } from '@mui/material'
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
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className="flex flex-grow p-4 h-full"
            {...other}
        >
            {value === index && (
                <div className="flex flex-grow h-full">{children}</div>
            )}
        </div>
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
        <div className="flex flex-col h-full">
            <Header />
            <div id="div-center" className="h-full flex flex-row">
                <Renderer />
                <Box id="div-side-panel" className="flex flex-col w-1/5">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            variant="fullWidth"
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
                                label="Coding"
                                {...a11yProps(1)}
                            />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Editor />
                    </CustomTabPanel>
                </Box>
            </div>
            <StatusPanel />
            <div
                id="div-loading-indicator"
                className="flex h-full w-full absolute bg-opacity-100 z-50"
            >
                <div className="m-auto flex-col justify-center">
                    <CircularProgress color="inherit" size={60} />
                    <p className="mt-8">Loading...</p>
                </div>
            </div>
        </div>
    )
}

export default App
