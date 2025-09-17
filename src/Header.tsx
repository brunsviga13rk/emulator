import { TextLogo } from './TextLogo'
import { BrunsvigaLogo } from './BrunsvigaLogo'
import { useState } from 'react'
import {
    Group,
    Stack,
    Text,
    Button,
    ActionIcon,
    useMantineColorScheme,
    MantineColorScheme,
    Badge,
    Space,
} from '@mantine/core'
import { Icon } from '@iconify/react'

const links = [
    {
        name: 'Docs',
        href: 'https://brunsviga13rk.github.io/docs',
    },
    {
        name: 'Paper',
        href: `https://github.com/brunsviga13rk/thesis/releases/download/${__PAPER_VERSION__}/44124_emulation-of-the-brunsviga-13-rk.pdf`,
    },
    {
        name: 'About',
        href: 'https://github.com/brunsviga13rk',
    },
]

export function Header() {
    const { setColorScheme } = useMantineColorScheme()

    const [mode, setMode] = useState('auto')

    const logo = (
        <Group gap={16} h="100%">
            <BrunsvigaLogo />
            <Stack gap={0} justify="center">
                <TextLogo width="8rem" />
                <Text>BRAINS OF STEEL</Text>
            </Stack>
            <Space />
            <Badge
                component="a"
                href={`https://github.com/brunsviga13rk/emulator/releases/tag/v${__APP_VERSION__}`}
                variant="outline"
                color="gray"
                size="lg"
            >
                {__APP_VERSION__}
            </Badge>
        </Group>
    )

    const themeIcon = () => {
        if (mode == 'auto') {
            return <Icon fontSize={24} icon="fluent:dark-theme-24-filled" />
        }
        if (mode == 'dark') {
            return <Icon fontSize={24} icon="material-symbols:dark-mode" />
        }
        return <Icon fontSize={24} icon="material-symbols:light-mode-outline" />
    }

    const toggleTheme = () => {
        const order = ['auto', 'light', 'dark']
        const theme = order[(order.indexOf(mode) + 1) % 3]

        setMode(theme)
        setColorScheme(theme as MantineColorScheme)
    }

    const left = (
        <Group gap={4}>
            {links.map((link) => (
                <Button
                    fz="md"
                    variant="transparent"
                    color="default"
                    component="a"
                    key={link.name}
                    href={link.href}
                >
                    {link.name}
                </Button>
            ))}
            <ActionIcon
                onClick={toggleTheme}
                variant="transparent"
                color="default"
                size="xl"
            >
                {themeIcon()}
            </ActionIcon>
            <ActionIcon
                variant="transparent"
                color="default"
                size="xl"
                component="a"
                href="https://github.com/brunsviga13rk/emulator"
            >
                <Icon icon="mdi:github" fontSize={32} />
            </ActionIcon>
        </Group>
    )

    return (
        <Group m="sm" px="sm" h="100%" justify="space-between">
            {logo}
            {left}
        </Group>
    )
}
