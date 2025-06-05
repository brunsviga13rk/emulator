import { Center, Group, SegmentedControl, Stack } from '@mantine/core'
import classes from './styles.module.css'
import { useState } from 'react'
import { Icon } from '@iconify/react'

function Editors() {
    const [value, setValue] = useState('ng')

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
                                    <Icon icon="ps:code" fontSize={24} />
                                </Center>
                            ),
                            value: 'svelte',
                        },
                    ]}
                />
            </Group>
            <Group w="100%" h="100%" className={classes.contentPane}></Group>
        </Stack>
    )
}

export default Editors
