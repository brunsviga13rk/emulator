import { Center, Group, SegmentedControl, Stack } from '@mantine/core'
import classes from './styles.module.css'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import Dashboard from './Dashboard'

function Editors() {
    const [value, setValue] = useState('settings')

    return (
        <Stack w="100%" h="100%">
            <Group w="100%" className={classes.contentPane} grow p="sm">
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
            <Group w="100%" h="100%" className={classes.contentPane}>
                {value == 'settings' && <Dashboard />}
            </Group>
        </Stack>
    )
}

export default Editors
