import {
    Box,
    Button,
    ButtonGroup,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Toolbar,
    Tooltip,
} from '@mui/material'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined'
import SwipeRightIcon from '@mui/icons-material/SwipeRightOutlined'
import SwipeLeftIcon from '@mui/icons-material/SwipeLeftOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { useRef, useState } from 'react'
import {
    Brunsviga13rk,
    BrunsvigaAnimationEventType,
} from '../model/brunsviga13rk'
import { EventHandler } from '../model/events'

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
        <Toolbar
            sx={{
                position: 'absolute',
                left: 0,
                right: 0,
            }}
        >
            <ButtonGroup variant="contained" color="inherit" size="small">
                <Tooltip title="Add">
                    <Button
                        disabled={!ready}
                        onClick={() => Brunsviga13rk.getInstance().add()}
                    >
                        <RotateRightOutlinedIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Subtract">
                    <Button
                        disabled={!ready}
                        onClick={() => Brunsviga13rk.getInstance().subtract()}
                    >
                        <RotateLeftOutlinedIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Shift sled right">
                    <Button
                        disabled={!ready}
                        onClick={() => Brunsviga13rk.getInstance().shiftRight()}
                    >
                        <SwipeRightIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Shift sled left">
                    <Button
                        disabled={!ready}
                        onClick={() => Brunsviga13rk.getInstance().shiftLeft()}
                    >
                        <SwipeLeftIcon />
                    </Button>
                </Tooltip>
            </ButtonGroup>
            <Box marginRight={4} />
            <ButtonGroup
                variant="contained"
                color="inherit"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
            >
                <Tooltip title={tips[selectedIndex]}>
                    <Button
                        disabled={!ready}
                        onClick={handleClick}
                        startIcon={<SettingsBackupRestoreIcon />}
                    >
                        {options[selectedIndex]}
                    </Button>
                </Tooltip>
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                    disabled={!ready}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            selected={index === selectedIndex}
                                            onClick={(event) =>
                                                handleMenuItemClick(
                                                    event,
                                                    index
                                                )
                                            }
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Toolbar>
    )
}
