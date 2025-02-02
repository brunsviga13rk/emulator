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

const options = ['Clear counter', 'Clear input', 'Clear result', 'Clear all']
const tips = [
    'Reset counter register',
    'Reset input register',
    'Reset result register',
    'Reset all registers',
]

export default function Toolbox() {
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLDivElement>(null)
    const [selectedIndex, setSelectedIndex] = useState(1)

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`)
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
                    <Button>
                        <RotateRightOutlinedIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Subtract">
                    <Button>
                        <RotateLeftOutlinedIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Shift sled right">
                    <Button>
                        <SwipeRightIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Shift sled left">
                    <Button>
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
