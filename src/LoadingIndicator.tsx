import CircularProgress from '@mui/material/CircularProgress'

export function LoadingIndicator() {
    return (
        <div
            id="div-loading-indicator"
            className="flex h-full w-full absolute bg-white bg-opacity-100 z-100"
        >
            <div className="m-auto flex-col justify-center">
                <CircularProgress color="inherit" size={60} />
                <p className="mt-8">Loading...</p>
            </div>
        </div>
    )
}
