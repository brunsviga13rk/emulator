import Renderer from './Renderer.tsx'
import * as Icon from 'react-bootstrap-icons'

function App() {
    return (
        <div className="flex flex-col h-full">
            <header className="bg-gray-100 border-b-2">
                <nav
                    className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
                    aria-label="Global"
                >
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-12 w-auto"
                                src="./brunsviga_icon.svg"
                                alt=""
                            />
                        </a>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <a
                            href="#"
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            Brunsviga RK 13
                        </a>
                        <a
                            href="#"
                            className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center"
                        >
                            <Icon.FileEarmarkTextFill
                                size={24}
                                className="pr-2"
                            />
                            <span>Thesis</span>
                        </a>
                        <a
                            href="https://github.com/brunsviga13rk/emulator"
                            className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center"
                        >
                            <Icon.Github size={24} className="pr-2" />
                            <span>Source</span>
                        </a>
                        <a
                            href="#"
                            className="text-sm font-semibold leading-6 text-gray-900  inline-flex items-center"
                        >
                            <Icon.PeopleFill size={24} className="pr-2" />
                            Credits
                        </a>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end" />
                </nav>
            </header>
            <Renderer />
        </div>
    )
}

export default App
