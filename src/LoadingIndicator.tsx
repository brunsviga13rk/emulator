import CircularProgress from '@mui/material/CircularProgress'
import { TextLogo } from './TextLogo'

export function LoadingIndicator() {
    return (
        <div
            id="div-loading-indicator"
            className="flex h-full w-full absolute bg-white bg-opacity-100 z-100"
        >
            <div className="m-auto flex-col text-center">
                <CircularProgress color="inherit" size={60} />
                <p style={{ marginTop: '2.5rem' }}>
                    <TextLogo width="12rem" />
                </p>
                <p style={{ marginTop: '1rem' }}>Loading assets...</p>
            </div>
        </div>
    )
}
