import { Card, Group, Text } from '@mantine/core'
import { useState } from 'react'
import { Vector2 } from 'three'
import { Brunsviga13rk } from '../model/brunsviga13rk'

export class DetailPanel {
    origin: Vector2
    description: string
    name: string

    constructor(name: string, description: string) {
        this.name = name
        this.description = description
        this.origin = new Vector2(0, 0)
    }
}

export default function Details() {
    const [detail, setDetail] = useState<DetailPanel | undefined>()

    Brunsviga13rk.getInstance().details = setDetail

    return (
        <Group m="sm" style={{ position: 'absolute' }}>
            {detail != undefined ? (
                <Card
                    withBorder
                    w={300}
                    shadow="md"
                    style={{
                        left: `${detail?.origin.x}px`,
                        top: `${detail?.origin.y}px`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Text fw={500} mb="xs">
                        {detail.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {detail.description}
                    </Text>
                </Card>
            ) : (
                <></>
            )}
        </Group>
    )
}
