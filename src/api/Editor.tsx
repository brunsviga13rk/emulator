import { VFC, useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import {
    Button,
    ButtonGroup,
    Divider,
    Stack,
    useColorScheme,
} from '@mui/material'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import './userWorker'
import template from './template.lua?raw'
import { useManacoThemeFromScheme } from '../utils'
import { Instruction } from '../instruction'
import Worker from './luaWorker.tsx?worker'

function highlightLine(
    previousLineNumber: number | undefined,
    lineNumber: number | undefined
) {
    const editor = monaco.editor.getEditors().at(0)
    if (editor) {
        if (previousLineNumber) {
            const ids = editor
                .getLineDecorations(previousLineNumber)
                ?.map((deco) => deco.id)

            if (ids) {
                editor.removeDecorations(ids)
            }
        }

        if (lineNumber) {
            const range = new monaco.Range(lineNumber, 1, lineNumber, 1)
            const highlightDecoration = {
                isWholeLine: true,
                className: 'highlightedLine',
            }
            editor.createDecorationsCollection([
                {
                    range: range,
                    options: highlightDecoration,
                },
            ])
        }
    }
}

const worker = new Worker()
let previousLineNumber: number | undefined = undefined

export const Editor: VFC = () => {
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null)
    const monacoEl = useRef(null)

    const [currentLine, setCurrentLine] = useState<number | undefined>(
        undefined
    )

    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor) return editor

                return monaco.editor.create(monacoEl.current!, {
                    value: template,
                    language: 'lua',
                    tabSize: 2,
                    automaticLayout: true,
                })
            })
        }

        worker.onmessage = async (e: MessageEvent) => {
            switch (e.data.kind) {
                case 'API Call':
                    new Instruction(
                        e.data.instruction.opcode,
                        e.data.instruction.value
                    )
                        .execute()
                        .then(() =>
                            worker.postMessage({ kind: 'API Call Returned' })
                        )
                    break
                case 'Debug Info':
                    // Recieved updated debug info.
                    setCurrentLine(e.data.currentLine)
                    break
            }
        }

        return () => {
            editor?.dispose()
        }
    }, [editor])

    highlightLine(previousLineNumber, currentLine)
    previousLineNumber = currentLine

    const { mode } = useColorScheme()
    useManacoThemeFromScheme(mode)

    function runProgram() {
        const text = editor?.getModel()?.getValue()
        if (text) {
            worker.postMessage({ kind: 'Run Script', script: text })
        }
    }

    return (
        <div
            id="div-editor-root"
            className="w-full h-full flex flex-grow flex-col"
        >
            <Stack direction="row" spacing={2}>
                <ButtonGroup variant="contained" color="inherit" size="small">
                    <Button onClick={runProgram}>
                        <PlayArrowOutlinedIcon />
                    </Button>
                </ButtonGroup>
            </Stack>
            <Divider sx={{ marginY: 2 }} />
            <div className="flex-grow resize-y" ref={monacoEl}></div>
        </div>
    )
}
