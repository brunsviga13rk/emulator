import Renderer from './Renderer.tsx'
import { StatusPanel } from './StatusPanel.tsx'
import { TailSpin } from 'react-loader-spinner'
import { Header } from './Header.tsx'

function App() {
    return (
        <div className="flex flex-col h-full">
            <Header />
            <Renderer />
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
