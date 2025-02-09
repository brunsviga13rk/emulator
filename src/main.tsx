import { createRoot } from 'react-dom/client'
import './index.css'
import '@phosphor-icons/web/regular/style.css'
import '@phosphor-icons/web/bold/style.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { LoadingIndicator } from './LoadingIndicator.tsx'
import Renderer from './render/Renderer.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route
                path="/embed"
                element={
                    <>
                        <Renderer />
                        <LoadingIndicator />
                    </>
                }
            />
        </Routes>
    </BrowserRouter>
)
