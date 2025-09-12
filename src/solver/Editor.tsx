import { useState } from 'react'
import { Instruction, Opcode, solve } from './solve'
import { Brunsviga13rk } from '../model/brunsviga13rk'
import {
    ActionIcon,
    Alert,
    Button,
    Group,
    Stack,
    TextInput,
    Timeline,
    Text,
    Tooltip,
    ScrollArea,
} from '@mantine/core'
import { Icon } from '@iconify/react/dist/iconify.js'
import classes from '../styles.module.css'
import { Typography } from '@mui/material'

let abort: boolean = false
let step: boolean = false

async function execute(
    program: Instruction[],
    setActive: React.Dispatch<React.SetStateAction<number | undefined>>
): Promise<void> {
    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    for (let i = 0; i < program.length; i++) {
        setActive(i)

        await program[i].execute().then(() => {
            // Pause before invoking next step.
            if (step) {
                Brunsviga13rk.getInstance().setPausing(true)
                step = false
            }
        })

        if (abort) {
            break
        }

        // Wait until dispatching next animation.
        await delay(500)
    }

    abort = false
}

interface EditorProps {
    visible: boolean
}

export function Editor(props: EditorProps) {
    const [input, setInput] = useState('')
    const [tokens, setTokens] = useState<Instruction[]>([])
    const [ready, setReady] = useState(true)
    const [running, setRunning] = useState(false)
    const [paused, setPaused] = useState(false)
    const [active, setActive] = useState<number | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    )

    function onSolve() {
        try {
            setErrorMessage(undefined)
            setTokens(solve(input))
        } catch (e: unknown) {
            setTokens([])
            setErrorMessage((e as Error).message)
        }
    }

    const handleExecuteAll = () => {
        if (ready) {
            setReady(false)
            setRunning(true)
            setPaused(false)

            execute(tokens, setActive).then(() => {
                setReady(true)
                setRunning(false)
                setPaused(false)
                setActive(undefined)
            })
        } else {
            Brunsviga13rk.getInstance().abort()
            abort = true
        }
    }

    return (
        <Stack
            style={{
                display: props.visible ? 'flex' : 'none',
            }}
            className="w-full h-full flex flex-col"
            gap="md"
            p="md"
        >
            {tokens.length ? (
                <Group className={classes.contentPane} p="sm">
                    <Tooltip label="Run all steps">
                        <Button
                            size="sm"
                            variant="default"
                            onClick={handleExecuteAll}
                            color={running ? 'error' : 'primary'}
                        >
                            {running ? (
                                <Icon icon="mdi:stop" fontSize={24} />
                            ) : (
                                <Icon icon="mdi:play" fontSize={24} />
                            )}
                        </Button>
                    </Tooltip>
                    <Tooltip label="Pause run">
                        <Button
                            size="sm"
                            variant="default"
                            color="default"
                            disabled={!running}
                            onClick={() => {
                                setPaused(!paused)
                                Brunsviga13rk.getInstance().setPausing(!paused)
                            }}
                        >
                            {paused ? (
                                <Icon icon="mdi:play" fontSize={24} />
                            ) : (
                                <Icon icon="mdi:pause" fontSize={24} />
                            )}
                        </Button>
                    </Tooltip>
                    <Tooltip label="Run next steps">
                        <Button
                            size="sm"
                            variant="default"
                            color="default"
                            disabled={!paused}
                            onClick={() => {
                                step = true
                                Brunsviga13rk.getInstance().setPausing(false)
                            }}
                        >
                            <Icon icon="mdi:redo" fontSize={24} />
                        </Button>
                    </Tooltip>
                </Group>
            ) : (
                <></>
            )}
            <ScrollArea className={'flex-1 ' + classes.contentPane} p="md">
                <Stack gap="md">
                    <Typography>
                        <Text size="md" fw={700}>{`Solution`}</Text>
                        Involves {tokens.length} steps.
                    </Typography>
                    <Timeline active={active} bulletSize={28} lineWidth={2}>
                        {tokens.map((token: Instruction, index) => (
                            <Timeline.Item
                                lineVariant={
                                    [Opcode.Reset, Opcode.Zero].includes(
                                        token.opcode
                                    )
                                        ? 'dashed'
                                        : [Opcode.Reset, Opcode.Zero].includes(
                                                tokens.at(index + 1)?.opcode ||
                                                    Opcode.Add
                                            )
                                          ? 'dashed'
                                          : 'solid'
                                }
                                bullet={
                                    <Icon
                                        icon={token.getIcon()}
                                        fontSize={18}
                                    />
                                }
                                title={token.getTitle()}
                            >
                                <Text c="dimmed" size="sm">
                                    {token.getDescription()}
                                </Text>
                                <Text size="xs" mt={4}>
                                    2 hours ago
                                </Text>
                            </Timeline.Item>
                        ))}
                        {errorMessage ? (
                            <Group style={{ marginTop: 2, width: '100%' }}>
                                <Alert
                                    variant="error"
                                    style={{ width: '100%' }}
                                    title="Invalid calculation syntax"
                                >
                                    {errorMessage}
                                </Alert>
                            </Group>
                        ) : (
                            <></>
                        )}
                    </Timeline>
                </Stack>
            </ScrollArea>

            <TextInput
                size="md"
                placeholder="Enter calculation"
                rightSection={
                    <ActionIcon
                        variant="subtle"
                        color="default"
                        size="md"
                        onClick={onSolve}
                    >
                        <Icon icon="bx:math" fontSize={20} />
                    </ActionIcon>
                }
                value={input}
                error={errorMessage}
                onChange={(event) => setInput(event.currentTarget.value)}
            ></TextInput>
        </Stack>
    )
}
