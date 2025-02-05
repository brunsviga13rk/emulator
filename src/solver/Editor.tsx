import { useCallback, useState } from 'react'
import {
    Box,
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
    StepIcon,
    styled,
} from '@mui/material'
import FunctionsIcon from '@mui/icons-material/Functions'
import { Instruction, solve } from './solve'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'

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
    instruction: Instruction
    ready: boolean
    setReady: React.Dispatch<React.SetStateAction<boolean>>
}

function InstructionCard({
    instruction,
    ready,
    setReady,
}: InstructionCardProps) {
    const [expanded, setExpanded] = useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const handleExecuteClick = () => {
        setReady(false)
        instruction.execute().then(() => setReady(true))
    }

    return (
        <Card variant="outlined" className="m-2 flex-grow">
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

async function executeInstruction(instructions: Instruction[]) {
    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    for (const instr of instructions) {
        await instr.execute()
        await delay(500)
    }
}

export function Editor() {
    const [input, setInput] = useState('')
    const [tokens, setTokens] = useState<Instruction[]>([])
    const [ready, setReady] = useState(true)
    const [running, setRunning] = useState(false)

    function onSolve() {
        setTokens(solve(input))
    }

    const handleExecuteAll = () => {
        setReady(false)
        setRunning(true)
        executeInstruction(tokens).then(() => {
            setReady(true)
            setRunning(false)
        })
    }

    const [interiorHeight, setInteriorHeight] = useState(0)

    const measuredRef = useCallback((node) => {
        if (node !== null) {
            console.log(node.getBoundingClientRect().height)
            setInteriorHeight(node.getBoundingClientRect().height)
        }
    }, [])

    return (
        <Stack sx={{ flexGrow: 1 }} ref={measuredRef}>
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
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
                    </ButtonGroup>
                </Stack>
            ) : (
                <></>
            )}
            <Container
                sx={{
                    height: `${interiorHeight}px`,
                    overflow: 'scroll',
                }}
            >
                {tokens.map((token, index) => (
                    <Stack direction="row" key={index}>
                        <span className="my-auto">{index + 1}</span>
                        <InstructionCard
                            instruction={token}
                            ready={ready}
                            setReady={setReady}
                        />
                    </Stack>
                ))}
            </Container>
        </Stack>
    )
}
