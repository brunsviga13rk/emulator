import { useState } from 'react'
import { UserAction } from '../model/selectable'
import { Brunsviga13rk } from '../model/brunsviga13rk'
import { Group, Kbd, Text } from '@mantine/core'

export default function ActionRecommendations() {
    const [actions, setActions] = useState<UserAction[]>([])

    Brunsviga13rk.getInstance().recommendations = setActions

    return (
        <Group m="sm" style={{ position: 'absolute' }}>
            {actions ? (
                actions.map(([action, description]) => (
                    <Kbd key={action as string}>
                        <i className={`ph ${action as string}`} />
                        {description}
                    </Kbd>
                ))
            ) : (
                <></>
            )}
        </Group>
    )
}
