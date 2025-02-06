import { useState } from 'react'
import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Container,
    IconButton,
    IconButtonProps,
    InputBase,
    Paper,
    Stack,
    styled,
} from '@mui/material'
import FunctionsIcon from '@mui/icons-material/Functions'
import { Instruction, solve } from './solve'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import RedoIcon from '@mui/icons-material/Redo'
import PauseIcon from '@mui/icons-material/Pause'
import { useTheme } from '@mui/material/styles'

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expand, ...other } = props
    return <IconButton {...other} />
})(({ theme }) => ({
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}))

type InstructionCardProps = {
    index: number
    instruction: Instruction
    ready: boolean
    setReady: React.Dispatch<React.SetStateAction<boolean>>
    active: number | undefined
    setActive: React.Dispatch<React.SetStateAction<number | undefined>>
}

function InstructionCard({
    index,
    instruction,
    ready,
    setReady,
    active,
    setActive,
}: InstructionCardProps) {
    const [expanded, setExpanded] = useState(false)
    const theme = useTheme()
    const primaryColor = theme.palette.primary.main

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const handleExecuteClick = () => {
        setReady(false)
        setActive(index)
        instruction.execute().then(() => setReady(true))
    }

    return (
        <Card
            variant="outlined"
            className="m-2 flex-grow"
            sx={{
                borderColor: `${index == active ? primaryColor : ''}`,
                borderWidth: `${index == active ? 'medium' : 'thin'}`,
            }}
        >
            <CardActions disableSpacing>
                {instruction.getTitle()}
                <IconButton
                    style={{ marginLeft: 'auto' }}
                    aria-label="add to favorites"
                    onClick={handleExecuteClick}
                    disabled={!ready}
                >
                    <PlayArrowIcon />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>{instruction.getDescription()}</CardContent>
            </Collapse>
        </Card>
    )
}

let abort: boolean = false
let pause: boolean = false
let step: boolean = false

async function execute(
    program: Instruction[],
    setActive: React.Dispatch<React.SetStateAction<number | undefined>>
): Promise<void> {
    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    for (let i = 0; i < program.length; i++) {
        while (pause && !step) {
            await delay(500)
        }
        step = false

        if (abort) {
            break
        }

        setActive(i)
        await program[i].execute()
        await delay(500)
    }

    if (abort) {
        abort = false
    }
}

export function Editor() {
    const [input, setInput] = useState('')
    const [tokens, setTokens] = useState<Instruction[]>([])
    const [ready, setReady] = useState(true)
    const [running, setRunning] = useState(false)
    const [paused, setPaused] = useState(false)
    const [active, setActive] = useState<number | undefined>(undefined)

    function onSolve() {
        setTokens(solve(input))
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
            abort = true
            pause = false
        }
    }

    return (
        <Stack sx={{ height: '100%' }}>
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    height: '3rem',
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Enter equation"
                    inputProps={{ 'aria-label': 'enter equation' }}
                    content={input}
                    onChange={(event) => {
                        setInput(event.target.value)
                    }}
                />
                <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    aria-label="solve"
                    onClick={onSolve}
                >
                    <FunctionsIcon />
                </IconButton>
            </Paper>
            {tokens.length ? (
                <Stack
                    direction="row"
                    className="pt-4 mb-4"
                    sx={{
                        paddingBottom: 1,
                        paddingTop: 3,
                        borderBottom: 1,
                        borderColor: 'divider',
                        height: '4rem',
                    }}
                    alignContent="center"
                >
                    <span className="mr-auto">{`Solution (${tokens.length} steps):`}</span>
                    <ButtonGroup
                        style={{ marginLeft: 'auto' }}
                        size="small"
                        variant="contained"
                    >
                        <Button
                            onClick={handleExecuteAll}
                            color={running ? 'error' : 'primary'}
                        >
                            {running ? <StopIcon /> : <PlayArrowIcon />}
                        </Button>
                        <Button
                            color="inherit"
                            disabled={!running}
                            onClick={() => {
                                setPaused(!paused)
                                pause = !paused
                            }}
                        >
                            {paused ? <PlayArrowIcon /> : <PauseIcon />}
                        </Button>
                        <Button
                            color="inherit"
                            disabled={!paused}
                            onClick={() => {
                                step = true
                            }}
                        >
                            <RedoIcon />
                        </Button>
                    </ButtonGroup>
                </Stack>
            ) : (
                <></>
            )}
            <Container
                sx={{
                    height: 'calc(100% - 7rem)',
                    overflow: 'scroll',
                }}
            >
                {tokens.map((token, index) => (
                    <Stack direction="row" key={index}>
                        <span className="my-auto">{index + 1}</span>
                        <InstructionCard
                            index={index}
                            instruction={token}
                            ready={ready}
                            setReady={setReady}
                            active={active}
                            setActive={setActive}
                        />
                    </Stack>
                ))}
            </Container>
        </Stack>
    )
}
