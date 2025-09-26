import { Card, Group, Text, Image } from '@mantine/core'
import { useState } from 'react'
import { Vector2 } from 'three'
import { Brunsviga13rk } from '../model/brunsviga13rk'

export class DetailPanel {
    origin: Vector2
    description: string
    name: string
    icon: string | null

    constructor(name: string, description: string, icon: string | null = null) {
        this.icon = icon
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
                    {detail.icon != null ? (
                        <Card.Section>
                            <Image src={detail.icon} />
                        </Card.Section>
                    ) : (
                        <></>
                    )}
                    <Text fw={500} mt="md" mb="xs">
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
