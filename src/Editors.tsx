import {
    Center,
    Container,
    Group,
    ScrollArea,
    SegmentedControl,
    Stack,
} from '@mantine/core'
import classes from './styles.module.css'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import Dashboard from './Dashboard'

function Editors() {
    const [value, setValue] = useState('settings')

    return (
        <Stack w="100%" h="100%" gap="md">
            <Group
                w="100%"
                h="120pt"
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
                            value: 'settings',
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
                            value: 'calc',
                        },
                        {
                            label: (
                                <Center>
                                    <Icon icon="ps:code" fontSize={24} />
                                </Center>
                            ),
                            value: 'code',
                        },
                    ]}
                />
            </Group>
            <Group w="100%" h="calc(90%)" className={classes.contentPane}>
                <ScrollArea h="100%" offsetScrollbars>
                    <Container>
                        {value == 'settings' && <Dashboard />}
                    </Container>
                </ScrollArea>
            </Group>
        </Stack>
    )
}

export default Editors
