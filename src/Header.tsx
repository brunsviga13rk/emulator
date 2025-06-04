import GitHubIcon from '@mui/icons-material/GitHub'
import { TextLogo } from './TextLogo'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ContrastIcon from '@mui/icons-material/Contrast'
import { BrunsvigaLogo } from './BrunsvigaLogo'
import { environmentUniforms } from './render/environment'
import { isDarkMode } from './utils'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import DescriptionIcon from '@mui/icons-material/Description'
import InfoIcon from '@mui/icons-material/Info'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import { Group, Stack, Text, Button, ActionIcon } from '@mantine/core'
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
    const logo = (
        <Group gap={8} h="100%">
            <BrunsvigaLogo />
            <Stack gap={0} justify="center">
                <TextLogo width="8rem" />
                <Text>BRAINS OF STEEL</Text>
            </Stack>
        </Group>
    )

    const left = (
        <Group gap={4}>
            {links.map((link) => (
                <Button
                    variant="transparent"
                    color="default"
                    component="a"
                    href={link.href}
                >
                    {link.name}
                </Button>
            ))}
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
        <Group px={16} h="100%" justify="space-between">
            {logo}
            {left}
        </Group>
    )
}
