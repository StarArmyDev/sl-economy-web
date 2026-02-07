import HotExport from 'vite-plugin-hot-export';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [HotExport(), react()],
    resolve: {
        alias: {
            '@app': resolve('src/'),
            '@css': resolve('src/assets/css'),
            '@img': resolve('src/assets/img'),
        },
    },
    server: {
        port: 2020,
    },
    build: {
        sourcemap: true,
    },
});
