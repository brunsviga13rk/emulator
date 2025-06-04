import {
    AppShell,
    Button,
    Center,
    Flex,
    Group,
    SegmentedControl,
    Stack,
} from '@mantine/core'
import { Header } from './Header'
import Renderer from './render/Renderer'
import classes from './styles.module.css'
import { Split } from '@gfazioli/mantine-split-pane'
import Toolbox from './render/Toolbox'
import { useState } from 'react'
import { Icon } from '@iconify/react'

function Shell() {
    const [value, setValue] = useState('ng')
    return (
        <AppShell header={{ height: 60 }} padding="md" h="100%">
            <AppShell.Header>
                <Header />
            </AppShell.Header>

            <AppShell.Main h="100%">
                <Split
                    w="100%"
                    h="100%"
                    orientation="vertical"
                    withKnob
                    knobAlwaysOn
                    variant="filled"
                    spacing="md"
                >
                    <Split.Pane w="100%" h="100%">
                        <Flex w="100%" h="100%" gap="md">
                            <Toolbox />
                            <Renderer />
                        </Flex>
                    </Split.Pane>
                    <Split.Resizer />
                    <Split.Pane w="100%" h="100%">
                        <Stack w="100%" h="100%">
                            <Group
                                w="100%"
                                className={classes.contentPane}
                                grow
                                p="sm"
                            >
                                <SegmentedControl
                                    value={value}
                                    onChange={setValue}
                                    data={[
                                        {
                                            label: (
                                                <Center>
                                                    <Icon
                                                        icon="codicon:settings"
                                                        fontSize={24}
                                                    />
                                                </Center>
                                            ),
                                            value: 'ng',
                                        },
                                        {
                                            label: (
                                                <Center>
                                                    <Icon
                                                        icon="mdi:calculator-variant-outline"
                                                        fontSize={24}
                                                    />
                                                </Center>
                                            ),
                                            value: 'vue',
                                        },
                                        {
                                            label: (
                                                <Center>
                                                    <Icon
                                                        icon="ps:code"
                                                        fontSize={24}
                                                    />
                                                </Center>
                                            ),
                                            value: 'svelte',
                                        },
                                    ]}
                                />
                            </Group>
                            <Group
                                w="100%"
                                h="100%"
                                className={classes.contentPane}
                            ></Group>
                        </Stack>
                    </Split.Pane>
                </Split>
            </AppShell.Main>
        </AppShell>
    )
}

export default Shell
