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
import AdbIcon from '@mui/icons-material/Adb'
import './userWorker'
import template from './template.lua?raw'
import { useManacoThemeFromScheme } from '../utils'
import { Instruction } from '../instruction'
import Worker from './luaWorker.tsx?worker'
import RedoIcon from '@mui/icons-material/Redo'

function highlightLine(
    previousLineNumber: number | undefined,
    lineNumber: number | undefined
) {
    const editor = monaco.editor.getEditors().at(0)
    if (editor) {
        if (previousLineNumber) {
            const ids = editor
                .getLineDecorations(previousLineNumber)
                ?.filter((deco) => deco.options.className == 'highlightedLine')
                .map((deco) => deco.id)

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

/**
 * Set a break point on a specific line. The breakpoint can either be turned
 * on or off.
 *
 * Based on: https://microsoft.github.io/monaco-editor/playground.html?source=v0.52.2#example-interacting-with-the-editor-rendering-glyphs-in-the-margin
 * From: https://github.com/Microsoft/monaco-editor/issues/558
 *
 * @param lineNumber
 * @param enable
 */
function setBreakpoint(lineNumber: number, enable: boolean) {
    const editor = monaco.editor.getEditors().at(0)
    if (editor) {
        if (enable) {
            const range = new monaco.Range(lineNumber, 1, lineNumber, 1)
            const highlightDecoration = {
                glyphMarginClassName: 'breakpoint',
            }
            editor.createDecorationsCollection([
                {
                    range: range,
                    options: highlightDecoration,
                },
            ])
        } else {
            const ids = editor
                .getLineDecorations(lineNumber)
                ?.filter((deco) => deco.options.glyphMarginClassName)
                .map((deco) => deco.id)

            if (ids) {
                editor.removeDecorations(ids)
            }
        }
    }
}

function hoverBreakpoint(lineNumber: number | undefined) {
    const editor = monaco.editor.getEditors().at(0)
    if (editor) {
        const range = editor.getModel()?.getFullModelRange()

        if (!range) throw Error('No range')

        // Disable all hover decorations.
        const ids = editor
            .getDecorationsInRange(range)
            ?.filter(
                (deco) =>
                    deco.options.glyphMarginClassName == 'breakpoint-hover'
            )
            .map((deco) => deco.id)

        if (ids) {
            editor.removeDecorations(ids)
        }

        // Enable hover decoration for this one line.
        if (lineNumber) {
            const range = new monaco.Range(lineNumber, 1, lineNumber, 1)
            const highlightDecoration = {
                glyphMarginClassName: 'breakpoint-hover',
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
    const [runInDebugMode, setRunInDebugMode] = useState<boolean | undefined>(
        undefined
    )
    const [paused, setPaused] = useState<boolean>(false)

    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor) return editor

                const newEditor = monaco.editor.create(monacoEl.current!, {
                    value: template,
                    language: 'lua',
                    tabSize: 2,
                    automaticLayout: true,
                    glyphMargin: true,
                })

                newEditor.onMouseDown((e: monaco.editor.IEditorMouseEvent) => {
                    if (
                        e.target.type ==
                        monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
                    ) {
                        if (e.target.position?.lineNumber) {
                            setBreakpoint(e.target.position?.lineNumber, true)
                        }
                    }
                })

                newEditor.onMouseMove((e: monaco.editor.IEditorMouseEvent) => {
                    if (
                        e.target.type ==
                        monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
                    ) {
                        if (e.target.position?.lineNumber) {
                            hoverBreakpoint(e.target.position?.lineNumber)
                        }
                    } else {
                        hoverBreakpoint(undefined)
                    }
                })

                return newEditor
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

                    if (!e.data.running) {
                        setRunInDebugMode(undefined)
                    }
                    break
            }
        }

        return () => {
            editor?.dispose()
        }
    }, [editor])

    if (previousLineNumber != undefined || runInDebugMode) {
        highlightLine(previousLineNumber, currentLine)
        previousLineNumber = currentLine
    }

    const { mode } = useColorScheme()
    useManacoThemeFromScheme(mode)

    const runProgram = () => {
        const text = editor?.getModel()?.getValue()
        if (text) {
            worker.postMessage({ kind: 'Run Script', script: text })
        }

        setRunInDebugMode(false)
    }

    const runProgramInDebugMode = () => {
        const text = editor?.getModel()?.getValue()
        if (text) {
            worker.postMessage({ kind: 'Run Script', script: text })
        }

        setRunInDebugMode(true)
    }

    return (
        <div
            id="div-editor-root"
            className="w-full h-full flex flex-grow flex-col"
        >
            <Stack direction="row" spacing={2}>
                <ButtonGroup variant="contained" color="inherit" size="small">
                    <Button
                        onClick={runProgram}
                        disabled={runInDebugMode != undefined}
                    >
                        <PlayArrowOutlinedIcon />
                    </Button>
                    <Button
                        onClick={runProgramInDebugMode}
                        disabled={runInDebugMode != undefined}
                        color={
                            runInDebugMode
                                ? paused
                                    ? 'error'
                                    : 'success'
                                : 'inherit'
                        }
                    >
                        <AdbIcon />
                    </Button>
                    <Button disabled={!paused}>
                        <RedoIcon />
                    </Button>
                </ButtonGroup>
            </Stack>
            <Divider sx={{ marginY: 2 }} />
            <div className="flex-grow resize-y" ref={monacoEl}></div>
        </div>
    )
}
