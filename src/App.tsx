import Renderer from './Renderer.tsx'
import * as Icon from 'react-bootstrap-icons'
import { StatusPanel } from './StatusPanel.tsx'

function App() {
    return (
        <div className="flex flex-col h-full">
            <header className="flex flex-row w-full justify-around">
                <div
                    className="flex flex-row justify-start"
                    id="header-inline-start"
                >
                    <a href="https://github.com/brunsviga13rk">
                        <img
                            className="h-16 w-auto p-2 pl-4"
                            src="./brains_of_steel.svg"
                            alt=""
                        />
                    </a>
                    <div className="flex flex-col" id="div-title">
                        <span className="pl-2 pr-6" id="label-title">
                            Brunsviga 13 RK
                        </span>
                        <span className="pl-2 pr-6" id="label-subtitle">
                            Brains of steel
                        </span>
                    </div>
                </div>
                <div className="flex-grow"></div>
                <div
                    className="flex flex-row-reverse justify-end"
                    id="header-inline-end"
                >
                    <a
                        id="a-github"
                        href="https://github.com/brunsviga13rk/emulator"
                    >
                        <Icon.Github size={32} />
                    </a>
                    <a href="#">About</a>
                    <a href="#">Docs</a>
                    <a href="https://github.com/brunsviga13rk/thesis">Paper</a>
                    <a
                        href={`https://github.com/brunsviga13rk/emulator/releases/tag/v${__APP_VERSION__}`}
                        id="a-version"
                    >
                        {'v'}
                        {__APP_VERSION__}
                    </a>
                </div>
            </header>
            <Renderer />
            <StatusPanel />
        </div>
    )
}

export default App
