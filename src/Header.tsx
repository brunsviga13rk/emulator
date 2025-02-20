import {
    AppBar,
    Box,
    Button,
    Chip,
    IconButton,
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

export function Header() {
    const { mode, setMode } = useColorScheme()

    return (
        <AppBar
            position="static"
            color="inherit"
            variant="outlined"
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
                <IconButton
                    onClick={() => {
                        setMode(
                            mode == 'dark'
                                ? 'light'
                                : mode == 'light'
                                  ? 'system'
                                  : 'dark'
                        )
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
                    href="https://github.com/brunsviga13rk/emulator"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <GitHubIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
