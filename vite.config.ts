import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // Based on: https://stackoverflow.com/a/70524430
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __APP_BASE_PATH__: JSON.stringify(
            process.env.REACT_APP_BASE_PATH || ''
        ),
    },
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    base: '/',
    assetsInclude: ['**/*.glb'],
    esbuild: {
        supported: {
            'top-level-await': true, //browsers can handle top-level-await features
        },
    },
})
