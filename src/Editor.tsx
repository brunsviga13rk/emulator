import { VFC, useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { CaretRight } from 'react-bootstrap-icons'
import { execute } from './api/lua'

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
        <div id="div-editor-root" className="w-5/12 h-full flex flex-col">
            <div>
                <button onClick={runProgram}>
                    <CaretRight size={24} />
                </button>
            </div>
            <div className="flex-grow" ref={monacoEl}></div>
        </div>
    )
}
