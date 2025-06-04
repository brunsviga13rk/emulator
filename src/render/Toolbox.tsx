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
import { ActionIcon, Stack } from '@mantine/core'

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

    return (
        <Stack p="sm" className={classes.contentPane} h="100%">
            <ActionIcon></ActionIcon>
        </Stack>
    )
}
