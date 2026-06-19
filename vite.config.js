import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('three') || id.includes('@react-three') || id.includes('three-stdlib')) {
                            return 'three-bundle';
                        }
                        if (id.includes('framer-motion')) {
                            return 'framer-motion';
                        }
                        if (id.includes('lucide-react')) {
                            return 'lucide';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    }
});
