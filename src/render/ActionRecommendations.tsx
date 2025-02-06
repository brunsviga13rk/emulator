import Stack from '@mui/material/Stack'
import { useState } from 'react'
import { UserAction } from '../model/selectable'
import { Brunsviga13rk } from '../model/brunsviga13rk'
import Paper from '@mui/material/Paper'

export default function ActionRecommendations() {
    const [actions, setActions] = useState<UserAction[]>([])

    Brunsviga13rk.getInstance().recommendations = setActions

    return (
        <Stack
            spacing={1}
            direction="row"
            sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                margin: '1rem',
            }}
        >
            {actions ? (
                actions.map(([action, description]) => (
                    <Paper
                        variant="elevation"
                        elevation={4}
                        key={description}
                        sx={{ padding: 1 }}
                    >
                        <i className={`ph ${action as string}`} />
                        {description}
                    </Paper>
                ))
            ) : (
                <></>
            )}
        </Stack>
    )
}
