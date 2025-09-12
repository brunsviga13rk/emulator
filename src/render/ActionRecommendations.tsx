import { useState } from 'react'
import { UserAction } from '../model/selectable'
import { Brunsviga13rk } from '../model/brunsviga13rk'
import { Group, Kbd } from '@mantine/core'
import { InlineIcon } from '@iconify/react/dist/iconify.js'

export default function ActionRecommendations() {
    const [actions, setActions] = useState<UserAction[]>([])

    Brunsviga13rk.getInstance().recommendations = setActions

    return (
        <Group m="sm" style={{ position: 'absolute' }}>
            {actions ? (
                actions.map(([action, description]) => (
                    <Kbd size="md" key={action as string}>
                        <Group gap="xs">
                            <InlineIcon
                                fontSize={18}
                                icon={`${action as string}`}
                            />
                            {description}
                        </Group>
                    </Kbd>
                ))
            ) : (
                <></>
            )}
        </Group>
    )
}
