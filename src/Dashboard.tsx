import { Dispatch, SetStateAction, useState } from 'react'
import { Brunsviga13rk, onInitHook } from './model/brunsviga13rk'
import {
    SprocketWheelChangeEvent,
    SprocketWheelEventType,
} from './model/sprockets/sprocketWheel'
import { EventHandler } from './model/events'
import {
    ActionIcon,
    Grid,
    PinInput,
    RangeSlider,
    Slider,
    Space,
    Stack,
    Text,
    Tooltip,
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
    const numberInputComponent = () => {
        if (sprocket == Sprocket.Input) {
            return (
                <PinInput
                    gap={4}
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
            )
        } else {
            return (
                <PinInput
                    gap={4}
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
            )
        }
    }

    return (
        <Grid align="center">
            <Grid.Col span={1.5}>
                <Text>{title}</Text>
            </Grid.Col>
            <Grid.Col span={9.5}>{numberInputComponent()}</Grid.Col>
            <Grid.Col span={1}>
                <Tooltip label="Clear register">
                    <ActionIcon
                        variant="transparent"
                        color="default"
                        onClick={onClear}
                    >
                        <Icon icon="iconamoon:trash" fontSize={24} />
                    </ActionIcon>
                </Tooltip>
            </Grid.Col>
        </Grid>
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
        <Stack gap="md">
            <Text>
                <Text fz="xl" fw="bold">
                    Decimal Shift
                </Text>
                <Text fz="sm" c="dimmed">
                    Amount of decimal digits used to shift the sled and result
                    register to the right. The selector sprockets value is
                    multiplied by ten raised to the power of this amount before
                    addition.
                </Text>
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

    return (
        <>
            <Text>{props.label}</Text>
            <RangeSlider
                value={props.value}
                min={1}
                minRange={1}
                max={props.steps}
                marks={labels}
                label={null}
                onChange={(value) => {
                    if (props.bar == undefined) return

                    props.setValue(value)

                    const shifts = [
                        value[0] - props.bar.getDigitShift(0),
                        value[1] - props.bar.getDigitShift(1),
                    ]

                    props.bar.moveDigit(1, shifts[1])
                    props.bar.moveDigit(0, shifts[0])
                }}
            />
            <Space />
        </>
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

    return (
        <Stack gap="md">
            <Text>
                <Text fz="xl" fw="bold">
                    Commata Location
                </Text>
                <Text fz="sm" c="dimmed">
                    Determine location of commata slider. These may represent
                    the begin of the fraction or separate thousands.
                </Text>
            </Text>
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

export default function Dashboard() {
    return (
        <Stack gap="xl" w="100%" p="md">
            <Stack gap="md">
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
            </Stack>
            <DecimalShift />
            <Commata />
        </Stack>
    )
}
