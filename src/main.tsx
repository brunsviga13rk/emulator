import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'
import '@gfazioli/mantine-split-pane/styles.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { LoadingIndicator } from './LoadingIndicator.tsx'
import Renderer from './render/Renderer.tsx'
import '@mantine/code-highlight/styles.css'

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
