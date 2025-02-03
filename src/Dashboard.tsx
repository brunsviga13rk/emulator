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
import { useState } from 'react'
import { Brunsviga13rk, onInitHook } from './model/brunsviga13rk'
import {
    SprocketWheelChangeEvent,
    SprocketWheelEventType,
} from './model/sprockets/sprocketWheel'
import { EventHandler } from './model/events'
import { MAX_INPUT_SPROCKET_VALUE } from './model/sprockets/inputSprocket'

enum Sprocket {
    Counter,
    Input,
    Result,
}

type RegisterStateProps = {
    title: string
    min: number
    max: number
    sprocket: Sprocket
}

function RegisterState({ title, min, max, sprocket }: RegisterStateProps) {
    let hook: onInitHook = () => {}

    switch (sprocket) {
        case Sprocket.Counter:
            hook = (instance) =>
                instance.counter_sprocket.getEmitter().subscribe(
                    SprocketWheelEventType.Change,
                    new EventHandler((event) => {
                        setValue((event as SprocketWheelChangeEvent).value)
                    })
                )
            break
        case Sprocket.Input:
            hook = (instance) =>
                instance.input_sprocket.getEmitter().subscribe(
                    SprocketWheelEventType.Change,
                    new EventHandler((event) => {
                        setValue((event as SprocketWheelChangeEvent).value)
                    })
                )
            break
        case Sprocket.Result:
            hook = (instance) =>
                instance.result_sprocket.getEmitter().subscribe(
                    SprocketWheelEventType.Change,
                    new EventHandler((event) => {
                        setValue((event as SprocketWheelChangeEvent).value)
                    })
                )
            break
    }

    Brunsviga13rk.getInstance().whenReady(hook)

    const onClear = () => {
        const bvg13rk = Brunsviga13rk.getInstance()
        switch (sprocket) {
            case Sprocket.Counter:
                bvg13rk.clearCounterRegister()
                break
            case Sprocket.Input:
                bvg13rk.clearInputRegister()
                break
            case Sprocket.Result:
                bvg13rk.clearOutputRegister()
                break
        }
    }

    const [value, setValue] = useState(0)
    return (
        <Paper variant="outlined">
            <Stack padding={2} spacing={1}>
                <Stack
                    direction="row"
                    sx={{ alignItems: 'center' }}
                    spacing={2}
                >
                    <Typography sx={{ width: '100%' }}>{title}</Typography>
                    <Tooltip title="Clear register">
                        <IconButton onClick={onClear}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                {sprocket == Sprocket.Input ? (
                    <Input
                        type="number"
                        fullWidth
                        inputProps={{ min: min, max: max }}
                        value={value}
                        onChange={(e) => {
                            Brunsviga13rk.getInstance().setInput(
                                Number.parseInt(e.target.value)
                            )
                        }}
                    />
                ) : (
                    <Typography>{value}</Typography>
                )}
            </Stack>
        </Paper>
    )
}

export default function Dashboard() {
    return (
        <Grid2 container direction="row" spacing={2}>
            <Grid2 size={4}>
                <RegisterState
                    title="Counter register"
                    min={0}
                    max={99}
                    sprocket={Sprocket.Counter}
                />
            </Grid2>
            <Grid2 size={4}>
                <RegisterState
                    title="Input register"
                    min={0}
                    max={MAX_INPUT_SPROCKET_VALUE}
                    sprocket={Sprocket.Input}
                />
            </Grid2>
            <Grid2 size={4}>
                <RegisterState
                    title="Result register"
                    min={0}
                    max={99}
                    sprocket={Sprocket.Result}
                />
            </Grid2>
        </Grid2>
    )
}
