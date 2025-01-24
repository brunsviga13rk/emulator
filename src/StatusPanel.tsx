export function StatusPanel() {
    return (
        <div id="status-panel" className="p-4 border-t-2">
            <span
                id="input-action-recommendations"
                className="absolute left-0 bottom-0 m-1"
            ></span>
            <span className="absolute right-0 bottom-0 m-1 mr-4 text-zinc-600">
                {'v'}
                {__APP_VERSION__}
            </span>
        </div>
    )
}
