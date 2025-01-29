import { useState } from 'react'
import {
    Card,
    CardActions,
    CardContent,
    Collapse,
    IconButton,
    IconButtonProps,
    InputBase,
    Paper,
    styled,
} from '@mui/material'
import FunctionsIcon from '@mui/icons-material/Functions'
import { Instruction, solve } from './solve'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

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

function InstructionCard({ instruction }) {
    const [expanded, setExpanded] = useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    return (
        <Card variant="outlined" className="m-2 flex-grow">
            <CardActions disableSpacing>
                {instruction.getTitle()}
                <IconButton
                    style={{ marginLeft: 'auto' }}
                    aria-label="add to favorites"
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

export function Editor() {
    const [input, setInput] = useState('')
    const [tokens, setTokens] = useState<Instruction[]>([])

    function onSolve() {
        setTokens(solve(input))
    }

    return (
        <div className="flex-col w-1/5 p-2">
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
                <div className="m-2 mt-6">Solution steps:</div>
            ) : (
                <></>
            )}
            <div className="flex-col w-full h-full">
                {tokens.map((token, index) => (
                    <div className="flex flex-row ml-4">
                        <span className="my-auto mr-4">{index + 1}</span>
                        <InstructionCard instruction={token} />
                    </div>
                ))}
            </div>
        </div>
    )
}
