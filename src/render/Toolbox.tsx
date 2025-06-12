import { useState } from 'react'
import classes from '../styles.module.css'
import {
    Brunsviga13rk,
    BrunsvigaAnimationEventType,
} from '../model/brunsviga13rk'
import { EventHandler } from '../model/events'
import { ActionIcon, Stack, Tooltip, Divider } from '@mantine/core'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Engine } from './engine'

export default function Toolbox() {
    const [ready, setReady] = useState(true)

    Brunsviga13rk.getInstance()
        .getEmitter()
        .subscribe(
            BrunsvigaAnimationEventType.AnimationStarted,
            new EventHandler(() => setReady(false))
        )

    Brunsviga13rk.getInstance()
        .getEmitter()
        .subscribe(
            BrunsvigaAnimationEventType.AnimationEnded,
            new EventHandler(() => setReady(true))
        )

    type ToolDescriptor = {
        name: string
        icon: string
        description: string
        action: () => void
        disabled: boolean
    }

    const tools: Array<ToolDescriptor | string> = [
        {
            name: 'Free view',
            icon: 'iconamoon:cursor',
            description:
                'Drag the orbital view around with the mouse. Click on element to interact.',
            action: () => {},
            disabled: true,
        },
        {
            name: 'Kinetic interaction',
            icon: 'proicons:cursor-drag',
            description:
                'Drag elements for interaction. Camera cannot be moved around.',
            action: () => {},
            disabled: true,
        },
        'divider',
        {
            name: 'Decimal shift right',
            icon: 'streamline:move-right',
            description:
                'Shift result and counter register by one decimal place to the right.',
            action: () => {
                Brunsviga13rk.getInstance().shiftRight()
            },
            disabled: false,
        },
        {
            name: 'Decimal shift left',
            icon: 'streamline:move-left',
            description:
                'Shift result and counter register by one decimal place to the left.',
            action: () => {
                Brunsviga13rk.getInstance().shiftLeft()
            },
            disabled: false,
        },
        {
            name: 'Perform addition',
            icon: 'charm:rotate-clockwise',
            description:
                'Add selection register to result and increment counter.',
            action: () => {
                Brunsviga13rk.getInstance().add()
            },
            disabled: false,
        },
        {
            name: 'Perform subtraction',
            icon: 'charm:rotate-anti-clockwise',
            description:
                'Subtract selection register from result and increment counter.',
            action: () => {
                Brunsviga13rk.getInstance().subtract()
            },
            disabled: false,
        },
        'divider',
        {
            name: 'Reset machine',
            icon: 'iconamoon:trash',
            description:
                'Reset all regsiters to zero and remove decimal shifts.',
            action: () => {
                Brunsviga13rk.getInstance().clearRegisters()
            },
            disabled: false,
        },
        {
            name: 'Reset camera view',
            icon: 'material-symbols:view-in-ar-outline',
            description: 'Reset orbital camera.',
            action: () => {
                Engine.getInstance()?.resetCamera()
            },
            disabled: false,
        },
    ]

    const actionComponent = (descriptor: ToolDescriptor) => (
        <Tooltip label={descriptor.description}>
            <ActionIcon
                disabled={!ready || descriptor.disabled}
                onClick={descriptor.action}
                variant="transparent"
                color="default"
                size="md"
                key={`action-${descriptor.icon}`}
            >
                <Icon icon={descriptor.icon} fontSize={24} />
            </ActionIcon>
        </Tooltip>
    )

    return (
        <Stack p="sm" className={classes.contentPane} h="100%">
            {tools.map((tool) => {
                if (tool == 'divider') {
                    return <Divider />
                } else {
                    return <>{actionComponent(tool as ToolDescriptor)}</>
                }
            })}
        </Stack>
    )
}
