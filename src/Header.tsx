import {
    AppBar,
    Box,
    Button,
    Chip,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

export function Header() {
    return (
        <AppBar
            position="static"
            color="inherit"
            variant="outlined"
            sx={{ height: '4rem' }}
        >
            <Toolbar>
                <img
                    className="w-auto p-2"
                    src="./brains_of_steel.svg"
                    alt=""
                />
                <Stack spacing={0} sx={{ marginRight: 4 }}>
                    <Typography variant="h5" component="div">
                        Brunsviga 13 RK
                    </Typography>
                    <Typography variant="body1" component="div">
                        Brains of steel
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
                <Button
                    href="#"
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
