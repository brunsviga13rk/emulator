import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useState } from 'react'
import { Brunsviga13rk, onInitHook } from './model/brunsviga13rk'
import {
    SprocketWheelChangeEvent,
    SprocketWheelEventType,
} from './model/sprockets/sprocketWheel'
import { EventHandler } from './model/events'
import {
    ActionIcon,
    Divider,
    Group,
    PinInput,
    Slider,
    Stack,
    Text,
    Tooltip,
} from '@mantine/core'
import { EventEmitter } from 'stream'
import { SledEventType } from './model/sled'

enum Sprocket {
    Counter,
    Input,
    Result,
}

type RegisterStateProps = {
    title: string
    digits: number
    sprocket: Sprocket
}

function RegisterState({ title, digits, sprocket }: RegisterStateProps) {
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
        <Stack w="100%" key={`register-${title}`}>
            <Text>{title}</Text>
            <Group w="100%" justify="space-between">
                <PinInput
                    gap={4}
                    disabled={sprocket != Sprocket.Input}
                    key={`input-${title}`}
                    aria-label="Register Input"
                    length={digits}
                    inputMode="numeric"
                    size="sm"
                    oneTimeCode={false}
                    value={String(value).padStart(digits, '0')}
                    onChange={(e) => {
                        Brunsviga13rk.getInstance().setInput(Number.parseInt(e))
                    }}
                />
                <Tooltip label="Clear register">
                    <ActionIcon
                        variant="transparent"
                        color="default"
                        onClick={onClear}
                    >
                        <DeleteOutlineIcon />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Stack>
    )
}

function DecimalShift() {
    const [value, setValue] = useState<number>(0)
    const labels = [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
    ]

    Brunsviga13rk.getInstance().whenReady((instance) => {
        instance.sled.getEmitter().subscribe(
            SledEventType.ShiftLeft,
            new EventHandler(() => {
                setValue(instance.getDecimalShift())
            })
        )
        instance.sled.getEmitter().subscribe(
            SledEventType.ShiftRight,
            new EventHandler(() => {
                setValue(instance.getDecimalShift())
            })
        )
    })

    return (
        <Stack>
            <Text fz="xl" fw="bold">
                Decimal shift
            </Text>
            <Slider
                value={value}
                min={0}
                max={6}
                marks={labels}
                onChange={(value) => {
                    setValue(value)

                    const shifts =
                        value - Brunsviga13rk.getInstance().getDecimalShift()

                    if (shifts > 0) {
                        Brunsviga13rk.getInstance().repeatedShiftRight(shifts)
                    } else {
                        Brunsviga13rk.getInstance().repeatedShiftLeft(-shifts)
                    }
                }}
            ></Slider>
        </Stack>
    )
}

export default function Dashboard() {
    return (
        <Stack gap={8} w="100%" p="md">
            <Text fz="xl" fw="bold">
                Registers
            </Text>
            <RegisterState
                title="Counter"
                digits={8}
                sprocket={Sprocket.Counter}
            />
            <RegisterState
                title="Selector"
                digits={10}
                sprocket={Sprocket.Input}
            />
            <RegisterState
                title="Result"
                digits={13}
                sprocket={Sprocket.Result}
            />
            <DecimalShift />
        </Stack>
    )
}
