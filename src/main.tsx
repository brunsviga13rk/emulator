import { createRoot } from 'react-dom/client'
import './index.css'
import '@phosphor-icons/web/regular/style.css'
import '@phosphor-icons/web/bold/style.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { LoadingIndicator } from './LoadingIndicator.tsx'
import Renderer from './render/Renderer.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={__APP_BASE_PATH__}>
        <Routes>
            <Route path="/" element={<App />} />
            <Route
                path="/embed"
                element={
                    <div className="w-full h-full">
                        <Renderer />
                        <LoadingIndicator />
                    </div>
                }
            />
        </Routes>
    </BrowserRouter>
)
