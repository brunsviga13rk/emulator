import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Brunsviga13rk, onInitHook } from './model/brunsviga13rk'
import {
    SprocketWheelChangeEvent,
    SprocketWheelEventType,
} from './model/sprockets/sprocketWheel'
import { EventHandler } from './model/events'
import {
    ActionIcon,
    Box,
    CopyButton,
    Grid,
    PinInput,
    RangeSlider,
    Slider,
    Space,
    Stack,
    Text,
    Tooltip,
    Typography,
} from '@mantine/core'
import { SledEventType } from './model/sled'
import { Icon } from '@iconify/react/dist/iconify.js'
import { CommataBar, CommataBarEventType } from './model/commata'
import './Dashboard.css'

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
    const [value, setValue] = useState(0)

    // Allow overriding the pin input's value when the Brunviga state is changed
    // based on event handlers. This requires an init hook to be used to
    // register event handlers on the machine once its loaded.
    useEffect(() => {
        const sprocket_event_handler = new EventHandler((event) => {
            setValue((event as SprocketWheelChangeEvent).value)
        })

        let hook: onInitHook = () => {}

        switch (sprocket) {
            case Sprocket.Counter:
                hook = (instance) =>
                    instance.counter_sprocket
                        .getEmitter()
                        .subscribe(
                            SprocketWheelEventType.Change,
                            sprocket_event_handler
                        )
                break
            case Sprocket.Input:
                hook = (instance) =>
                    instance.input_sprocket
                        .getEmitter()
                        .subscribe(
                            SprocketWheelEventType.Change,
                            sprocket_event_handler
                        )
                break
            case Sprocket.Result:
                hook = (instance) =>
                    instance.result_sprocket
                        .getEmitter()
                        .subscribe(
                            SprocketWheelEventType.Change,
                            sprocket_event_handler
                        )
                break
        }

        Brunsviga13rk.getInstance().whenReady(hook)
    })

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

    function onChangeHandler(e: string) {
        if (sprocket == Sprocket.Input) {
            Brunsviga13rk.getInstance().setInput(Number.parseInt(e))
        }
    }

    const numberInputComponent = () => (
        <Box w={`${digits * 1.75}em`}>
            <PinInput
                disabled={sprocket != Sprocket.Input}
                gap={4}
                key={`input-${title}`}
                aria-label="Register Input"
                length={digits}
                inputMode="numeric"
                size="sm"
                oneTimeCode={false}
                value={String(value).padStart(digits, '0')}
                onChange={onChangeHandler}
            />
        </Box>
    )

    return (
        <Grid align="center" justify="flex-end" gutter="xs">
            <Grid.Col span="auto">
                <Text>{title}</Text>
            </Grid.Col>
            <Grid.Col span="content">{numberInputComponent()}</Grid.Col>
            <Grid.Col span="content">
                <CopyButton value={String(value)}>
                    {({ copy }) => (
                        <ActionIcon onClick={copy} size="md" variant="default">
                            <Icon icon="tabler:copy" />
                        </ActionIcon>
                    )}
                </CopyButton>
            </Grid.Col>
            <Grid.Col span="content">
                <Tooltip label="Clear register">
                    <ActionIcon size="md" variant="default" onClick={onClear}>
                        <Icon icon="iconamoon:trash" fontSize={18} />
                    </ActionIcon>
                </Tooltip>
            </Grid.Col>
        </Grid>
    )
}

function DecimalShift() {
    const DECIMAL_SHIFTS = 6

    const [value, setValue] = useState<number>(0)

    const labels = [...Array(DECIMAL_SHIFTS + 1).keys()].map((i) => {
        return { value: i, label: `${i}` }
    })

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

    const moveDeciamlShift = (value: number) => {
        setValue(value)

        const shifts = value - Brunsviga13rk.getInstance().getDecimalShift()

        if (shifts > 0) {
            Brunsviga13rk.getInstance().repeatedShiftRight(shifts)
        } else {
            Brunsviga13rk.getInstance().repeatedShiftLeft(-shifts)
        }
    }

    return (
        <Stack gap="md">
            <Typography>
                <h2>Decimal Shift</h2>
                <p>
                    Amount of decimal digits used to shift the sled and result
                    register to the right. The selector sprockets value is
                    multiplied by ten raised to the power of this amount before
                    addition.
                </p>
            </Typography>

            <Slider
                value={value}
                min={0}
                max={DECIMAL_SHIFTS}
                marks={labels}
                onChange={moveDeciamlShift}
            />
        </Stack>
    )
}

function CommataBarComponent(props: {
    label: string
    steps: number
    value: [number, number]
    setValue: Dispatch<SetStateAction<[number, number]>>
    bar: CommataBar | undefined
}) {
    const labels = [...Array(props.steps).keys()].map((i) => {
        return { value: i + 1, label: `${props.steps - i}` }
    })

    const moveDigit = (value: [number, number]) => {
        if (props.bar != undefined) {
            props.setValue(value)

            for (let i = 0; i < props.steps; i++) {
                const delta = value[i] - props.bar.getDigitShift(i)

                props.bar.moveDigit(i, Math.sign(delta))
            }
        }
    }

    return (
        <Stack>
            <Text>{props.label}</Text>
            <RangeSlider
                value={props.value}
                min={1}
                minRange={1}
                max={props.steps}
                marks={labels}
                label={null}
                onChange={moveDigit}
            />
            <Space />
        </Stack>
    )
}

function Commata() {
    const [countValue, setCountValue] = useState<[number, number]>([1, 2])
    const [countBar, setCountBar] = useState<CommataBar | undefined>(undefined)

    const [inputValue, setInputValue] = useState<[number, number]>([1, 2])
    const [inputBar, setInputBar] = useState<CommataBar | undefined>(undefined)

    const [resultValue, setResultValue] = useState<[number, number]>([1, 2])
    const [resultBar, setResultBar] = useState<CommataBar | undefined>(
        undefined
    )

    useEffect(() => {
        const instance = Brunsviga13rk.getInstance()

        instance.whenReady((instance) => {
            setCountBar(instance.count_commata)
            instance.count_commata.getEmitter().subscribe(
                CommataBarEventType.Shifted,
                new EventHandler((event) => {
                    setCountValue([event.commata[0], event.commata[1]])
                })
            )
        })

        instance.whenReady((instance) => {
            setInputBar(instance.input_commata)
            instance.input_commata.getEmitter().subscribe(
                CommataBarEventType.Shifted,
                new EventHandler((event) => {
                    setInputValue([event.commata[0], event.commata[1]])
                })
            )
        })

        instance.whenReady((instance) => {
            setResultBar(instance.result_commata)
            instance.result_commata.getEmitter().subscribe(
                CommataBarEventType.Shifted,
                new EventHandler((event) => {
                    setResultValue([event.commata[0], event.commata[1]])
                })
            )
        })

        return () => {}
    })

    return (
        <Stack gap="md">
            <Typography>
                <h2>Commata Location</h2>
                <p>
                    Determine location of commata slider. These may represent
                    the begin of the fraction or separate thousands.
                </p>
            </Typography>

            <CommataBarComponent
                label="Counter"
                steps={7}
                value={countValue}
                setValue={setCountValue}
                bar={countBar}
            />
            <CommataBarComponent
                label="Selector"
                steps={10}
                value={inputValue}
                setValue={setInputValue}
                bar={inputBar}
            />
            <CommataBarComponent
                label="Result"
                steps={12}
                value={resultValue}
                setValue={setResultValue}
                bar={resultBar}
            />
        </Stack>
    )
}

interface DashboardProps {
    visible: boolean
}

function Registers() {
    return (
        <Stack gap="sm" w="100%">
            <Typography>
                <h2>Registers</h2>
            </Typography>

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
        </Stack>
    )
}

export default function Dashboard(props: DashboardProps) {
    return (
        <Stack
            w="100%"
            h="100%"
            p="md"
            gap="xl"
            style={{ display: props.visible ? 'flex' : 'none' }}
        >
            <Registers />
            <DecimalShift />
            <Commata />
        </Stack>
    )
}
