import {
    Grid2,
    IconButton,
    Input,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

type RegisterStateProps = {
    title: string
    min: number
    max: number
}

function RegisterState({ title, min, max }: RegisterStateProps) {
    return (
        <Paper>
            <Stack padding={2} spacing={1}>
                <Stack
                    direction="row"
                    sx={{ alignItems: 'center' }}
                    spacing={2}
                >
                    <Typography sx={{ width: '100%' }}>{title}</Typography>
                    <Tooltip title="Clear register">
                        <IconButton>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Input
                    type="number"
                    fullWidth
                    inputProps={{ min: min, max: max }}
                />
            </Stack>
        </Paper>
    )
}

export default function Dashboard() {
    return (
        <Grid2 container direction="row" spacing={2}>
            <Grid2 size={4}>
                <RegisterState title="Counter register" min={0} max={99} />
            </Grid2>
            <Grid2 size={4}>
                <RegisterState title="Input register" min={0} max={99} />
            </Grid2>
            <Grid2 size={4}>
                <RegisterState title="Result register" min={0} max={99} />
            </Grid2>
        </Grid2>
    )
}
