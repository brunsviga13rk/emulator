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
    Text,
    Stack,
    Tooltip,
    Divider,
    HoverCard,
    Group,
    Image,
    SimpleGrid,
    Grid,
} from '@mantine/core'
import { Icon } from '@iconify/react/dist/iconify.js'

const options = ['Clear counter', 'Clear input', 'Clear result', 'Clear all']
const tips = [
    'Reset counter register',
    'Reset input register',
    'Reset result register',
    'Reset all registers',
]

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

    const handleClick = () => {
        const api = Brunsviga13rk.getInstance()
        switch (selectedIndex) {
            case 0:
                api.clearCounterRegister()
                break
            case 1:
                api.clearInputRegister()
                break
            case 2:
                api.clearOutputRegister()
                break
            case 3:
                api.clearRegisters()
                break
        }
    }

    const handleMenuItemClick = (
        _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number
    ) => {
        setSelectedIndex(index)
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return
        }

        setOpen(false)
    }

    type ToolDescriptor = {
        name: string,
        icon: string,
        description: string
    }

    const tools: Array<ToolDescriptor | string> = [
        {
            name: 'Free view',
            icon: 'iconamoon:cursor',
            description:
                'Drag the orbital view around with the mouse. Click on element to interact.',
        },
        {
            name: 'Kinetic interaction',
            icon: 'proicons:cursor-drag',
            description:
                'Drag elements for interaction. Camera cannot be moved around.',
        },
        'divider',
        {
            name: 'Decimal shift right',
            icon: 'streamline:move-right',
            description:
                'Shift result and counter register by one decimal place to the right.',
        },
        {
            name: 'Decimal shift left',
            icon: 'streamline:move-left',
            description:
                'Shift result and counter register by one decimal place to the left.',
        },
        {
            name: 'Perform addition',
            icon: 'charm:rotate-clockwise',
            description:
                'Add selection register to result and increment counter.',
        },
        {
            name: 'Perform subtraction',
            icon: 'charm:rotate-anti-clockwise',
            description:
                'Subtract selection register from result and increment counter.',
        },
        'divider',
        {
            name: 'Reset machine',
            icon: 'iconamoon:trash',
            description:
                'Reset all regsiters to zero and remove decimal shifts.',
        },
        {
            name: 'Reset camera view',
            icon: 'material-symbols:view-in-ar-outline',
            description: 'Reset orbital camera.',
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
