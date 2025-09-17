import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { execute } from './lua'
import './userWorker'
import template from './template.lua?raw'
import { useManacoThemeFromScheme } from '../utils'
import { Button, Group, Stack, useMantineColorScheme } from '@mantine/core'
import classes from '../styles.module.css'
import { Icon } from '@iconify/react/dist/iconify.js'

interface EditorProps {
    visible: boolean
}

export const Editor = (props: EditorProps) => {
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null)
    const monacoEl = useRef(null)

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

    const { colorScheme } = useMantineColorScheme()
    useManacoThemeFromScheme(colorScheme)

    function runProgram() {
        const text = editor?.getModel()?.getValue()
        if (text) {
            execute(text)
        }
    }

    return (
        <Stack
            style={{ display: props.visible ? 'flex' : 'none' }}
            className="w-full h-full flex flex-grow flex-col"
            p="md"
        >
            <Group p="sm" className={classes.contentPane}>
                <Button onClick={runProgram} size="sm" variant="default">
                    <Icon icon="icon-park-outline:play" fontSize={24} />
                </Button>
            </Group>
            <div
                className={'flex-grow resize-y ' + classes.contentPane}
                ref={monacoEl}
            ></div>
        </Stack>
    )
}
