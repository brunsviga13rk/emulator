import { execute } from './lua'
import './userWorker'
import template from './template.lua?raw'
import { CodeHighlight } from '@mantine/code-highlight'
import {
    ActionIcon,
    Button,
    Group,
    Stack,
    Tooltip,
    useMantineTheme,
} from '@mantine/core'
import classes from '../styles.module.css'
import { Icon } from '@iconify/react/dist/iconify.js'

export function Editor() {
    return (
        <Stack h="100%" w="100%" gap={8} p="md">
            <Group className={classes.contentPane} p="xs">
                <Tooltip label="Run code">
                    <Button variant="default" size="sm">
                        <Icon
                            icon="material-symbols:play-circle-outline"
                            fontSize={24}
                        />
                    </Button>
                </Tooltip>
            </Group>
            <CodeHighlight
                style={{
                    background: 'var(--ch-background)',
                }}
                h="100%"
                contentEditable="plaintext-only"
                language="lua"
                code={template}
                radius="md"
                withBorder={false}
                expanded={true}
            />
        </Stack>
    )
}

export default Editor
