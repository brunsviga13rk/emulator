import { AppShell, Flex } from '@mantine/core'
import { Header } from './Header'
import Renderer from './render/Renderer'
import { Split } from '@gfazioli/mantine-split-pane'
import Toolbox from './render/Toolbox'
import Editors from './Editors'
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
                    <Split.Pane
                        minWidth="35%"
                        w="100%"
                        h="100%"
                        initialWidth="35%"
                    >
                        <Editors />
                    </Split.Pane>
                    <Split.Resizer m="lg" />
                    <Split.Pane w="100%" h="100%">
                        <Flex w="100%" h="100%" gap="md">
                            <Toolbox />
                            <Renderer />
                        </Flex>
                    </Split.Pane>
                </Split>
            </AppShell.Main>
            <LoadingIndicator />
        </AppShell>
    )
}

export default Shell
