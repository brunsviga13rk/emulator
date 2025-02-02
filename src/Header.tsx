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
        <AppBar position="fixed" color="inherit">
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
                <Chip label={`v${__APP_VERSION__}`} variant="outlined" />
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button color="inherit">Docs</Button>
                <Button color="inherit">Paper</Button>
                <Button color="inherit">About</Button>
                <IconButton>
                    <GitHubIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
