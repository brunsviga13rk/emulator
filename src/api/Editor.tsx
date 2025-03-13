import { VFC, useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { execute } from './lua'
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

export const Editor: VFC = () => {
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null)
    const monacoEl = useRef(null)

    monaco.editor.defineTheme('brunsviga13rk-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#111111',
        },
    })

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

        return () => {
            editor?.dispose()
        }
    }, [editor])

    const { mode } = useColorScheme()
    useManacoThemeFromScheme(mode)

    function runProgram() {
        const text = editor?.getModel()?.getValue()
        if (text) {
            execute(text)
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
