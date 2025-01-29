import Renderer from './Renderer.tsx'
import { StatusPanel } from './StatusPanel.tsx'
import { TailSpin } from 'react-loader-spinner'
import { Header } from './Header.tsx'
import { Editor } from './solver/Editor.tsx'

function App() {
    return (
        <div className="flex flex-col h-full">
            <Header />
            <div id="div-center" className="h-full flex flex-row">
                <Renderer />
                <Editor />
            </div>
            <StatusPanel />
            <div
                id="div-loading-indicator"
                className="flex h-full w-full absolute bg-opacity-100"
            >
                <div className="m-auto flex-col justify-center">
                    <TailSpin
                        visible={true}
                        height="80"
                        width="80"
                        color="#7f7f7f"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{
                            justifyContent: 'center',
                        }}
                    />
                    <p className="mt-8">Loading...</p>
                </div>
            </div>
        </div>
    )
}

export default App
