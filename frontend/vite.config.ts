import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	root: '../frontend',
	plugins: [svelte()],
	build: {
		outDir: path.resolve('../frontend/dist')
	},
	resolve: {
		alias: {
			$services: path.resolve('../frontend/bindings/appleblox/services'),
			$lib: path.resolve('../frontend/src/lib'),
			'@': path.resolve('../frontend/src'),
			'@root': path.resolve('../'),
		},
	},
	server: {
		host: 'localhost',
	},
	assetsInclude: ['**/*.icns'],
});
