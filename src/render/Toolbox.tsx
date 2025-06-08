import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined'
import SwipeRightIcon from '@mui/icons-material/SwipeRightOutlined'
import SwipeLeftIcon from '@mui/icons-material/SwipeLeftOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { useRef, useState } from 'react'
import classes from '../styles.module.css'
import {
    Brunsviga13rk,
    BrunsvigaAnimationEventType,
} from '../model/brunsviga13rk'
import { EventHandler } from '../model/events'
import {
    ActionIcon,
    Stack,
    Tooltip,
    Divider,
} from '@mantine/core'
import { Icon } from '@iconify/react/dist/iconify.js'
import Renderer from './Renderer'
import { Engine } from './engine'

export default function Toolbox() {
    const [ready, setReady] = useState(true)
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLDivElement>(null)
    const [selectedIndex, setSelectedIndex] = useState(1)

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
        name: string,
        icon: string,
        description: string,
        action: () => void
    }

    const tools: Array<ToolDescriptor | string> = [
        {
            name: 'Free view',
            icon: 'iconamoon:cursor',
            description:
                'Drag the orbital view around with the mouse. Click on element to interact.',
            action: () => {}
        },
        {
            name: 'Kinetic interaction',
            icon: 'proicons:cursor-drag',
            description:
                'Drag elements for interaction. Camera cannot be moved around.',
            action: () => {}
        },
        'divider',
        {
            name: 'Decimal shift right',
            icon: 'streamline:move-right',
            description:
                'Shift result and counter register by one decimal place to the right.',
                action: () => {
                    Brunsviga13rk.getInstance().shiftRight()
                }
        },
        {
            name: 'Decimal shift left',
            icon: 'streamline:move-left',
            description:
                'Shift result and counter register by one decimal place to the left.',
                action: () => {
                    Brunsviga13rk.getInstance().shiftLeft()
                }
        },
        {
            name: 'Perform addition',
            icon: 'charm:rotate-clockwise',
            description:
                'Add selection register to result and increment counter.',
                action: () => {
                    Brunsviga13rk.getInstance().add()
                }
        },
        {
            name: 'Perform subtraction',
            icon: 'charm:rotate-anti-clockwise',
            description:
                'Subtract selection register from result and increment counter.',
                action: () => {
                    Brunsviga13rk.getInstance().subtract()
                }
        },
        'divider',
        {
            name: 'Reset machine',
            icon: 'iconamoon:trash',
            description:
                'Reset all regsiters to zero and remove decimal shifts.',
                action: () => {
                    Brunsviga13rk.getInstance().clearRegisters()
                }
        },
        {
            name: 'Reset camera view',
            icon: 'material-symbols:view-in-ar-outline',
            description: 'Reset orbital camera.',
            action: () => {
                Engine.getInstance()?.resetCamera()
            }
        },
    ]

    return (
        <Stack p="sm" className={classes.contentPane} h="100%">
            {tools.map((tool) => {
                if (tool == 'divider') {
                    return <Divider />
                } else {
                    const descriptor = tool as ToolDescriptor
                    return (
                        <Tooltip label={descriptor.description}>
                            <ActionIcon
                                disabled={!ready}
                                onClick={descriptor.action}
                                variant="transparent"
                                color="default"
                                size="md"
                                key={`action-${descriptor.icon}`}
                            >
                                <Icon icon={descriptor.icon} fontSize={24} />
                            </ActionIcon></Tooltip>
                    )
                }
            })}
        </Stack>
    )
}
