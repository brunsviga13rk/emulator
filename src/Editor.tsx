import { VFC, useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { CaretRight } from 'react-bootstrap-icons'
import { execute } from './api/lua'
import { Box } from '@mui/material'

export const Editor: VFC = () => {
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null)
    const monacoEl = useRef(null)

    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor) return editor

                return monaco.editor.create(monacoEl.current!, {
                    value: '',
                    language: 'lua',
                })
            })
        }

        return () => {
            editor?.dispose()
        }
    }, [editor])

    function runProgram() {
        const text = editor?.getModel()?.getValue()
        if (text) {
            execute(text)
        }
    }

    return (
        <Box id="div-editor-root" className="w-5/12 h-full flex flex-col">
            <Box>
                <button onClick={runProgram}>
                    <CaretRight size={24} />
                </button>
            </Box>
            <Box className="flex-grow" ref={monacoEl}></Box>
        </Box>
    )
}
