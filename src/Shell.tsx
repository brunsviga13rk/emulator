import {
    AppShell,
    Button,
    Center,
    Flex,
    Group,
    Overlay,
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
import App from './App'
import { Editor } from './solver/Editor'
import Editors from './Editors'
import ActionRecommendations from './render/ActionRecommendations'
import { LoadingIndicator } from './LoadingIndicator'

function Shell() {
    return (
        <AppShell header={{ height: 64 }} padding="md" h="100%">
            <AppShell.Header withBorder={false}>
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
                    <Split.Pane w="100%" h="100%" initialWidth="70%">
                        <Flex w="100%" h="100%" gap="md">
                            <Toolbox />
                            <Renderer />
                        </Flex>
                    </Split.Pane>
                    <Split.Resizer m="lg" />
                    <Split.Pane w="100%" h="100%">
                        <Editors />
                    </Split.Pane>
                </Split>
            </AppShell.Main>
            <LoadingIndicator />
        </AppShell>
    )
}

export default Shell
