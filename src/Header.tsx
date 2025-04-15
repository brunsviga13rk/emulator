import {
    AppBar,
    Box,
    Button,
    Chip,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
    useColorScheme,
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import { TextLogo } from './TextLogo'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ContrastIcon from '@mui/icons-material/Contrast'
import { BrunsvigaLogo } from './BrunsvigaLogo'
import { environmentUniforms } from './render/environment'
import { isDarkMode } from './utils'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import DescriptionIcon from '@mui/icons-material/Description'
import InfoIcon from '@mui/icons-material/Info'
import NewspaperIcon from '@mui/icons-material/Newspaper'

export function Header() {
    const { mode, setMode } = useColorScheme()

    const [open, setOpen] = useState(false)

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen)
    }

    const drawerList = (
        <Box
            sx={{ width: '16rem' }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            <Stack direction="row" margin="1rem">
                <BrunsvigaLogo />
                <Stack spacing={0} sx={{ marginRight: 4, marginLeft: 1 }}>
                    <TextLogo width="8rem" />
                    <Typography variant="body2" component="div">
                        BRAINS OF STEEL
                    </Typography>
                </Stack>
            </Stack>
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        href="https://brunsviga13rk.github.io/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Docs" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        href={`https://github.com/brunsviga13rk/thesis/releases/download/v0.3.1/44124_emulation-of-the-brunsviga-13-rk.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ListItemIcon>
                            <NewspaperIcon />
                        </ListItemIcon>
                        <ListItemText primary="Paper" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        color="inherit"
                        href="https://github.com/brunsviga13rk/emulator"
                        target="_blank"
                    >
                        <ListItemIcon>
                            <GitHubIcon />
                        </ListItemIcon>
                        <ListItemText primary="Source" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        href="https://github.com/brunsviga13rk"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )

    return (
        <AppBar
            position="static"
            color="inherit"
            variant="outlined"
            elevation={0}
            sx={{ height: '4rem' }}
        >
            <Toolbar>
                <BrunsvigaLogo />
                <Stack spacing={0} sx={{ marginRight: 4, marginLeft: 1 }}>
                    <TextLogo width="8rem" />
                    <Typography variant="body2" component="div">
                        BRAINS OF STEEL
                    </Typography>
                </Stack>
                <Chip
                    component="a"
                    href={`https://github.com/brunsviga13rk/emulator/releases/tag/v${__APP_VERSION__}`}
                    clickable
                    label={`v${__APP_VERSION__}`}
                    variant="outlined"
                />
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton
                        size="large"
                        onClick={() => {
                            const nextMode =
                                mode == 'dark'
                                    ? 'light'
                                    : mode == 'light'
                                      ? 'system'
                                      : 'dark'
                            setMode(nextMode)

                            environmentUniforms.darkMode.value =
                                isDarkMode(nextMode)
                        }}
                    >
                        {mode == 'system' && <ContrastIcon />}
                        {mode == 'dark' && <DarkModeIcon />}
                        {mode == 'light' && <LightModeIcon />}
                    </IconButton>
                    <Button
                        href="https://brunsviga13rk.github.io/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="inherit"
                    >
                        Docs
                    </Button>
                    <Button
                        href={`https://github.com/brunsviga13rk/thesis/releases/download/v${__APP_VERSION__}/44124_emulation-of-the-brunsviga-13-rk.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="inherit"
                    >
                        Paper
                    </Button>
                    <Button
                        href="https://github.com/brunsviga13rk"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="inherit"
                    >
                        About
                    </Button>
                    <IconButton
                        size="large"
                        color="inherit"
                        href="https://github.com/brunsviga13rk/emulator"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHubIcon />
                    </IconButton>
                </Box>
            </Toolbar>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {drawerList}
            </Drawer>
        </AppBar>
    )
}
