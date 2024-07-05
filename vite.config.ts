import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			'codemirror',
			'@codemirror/lang-javascript',
			'@codemirror/view',
			'@codemirror/autocomplete',
			'@codemirror/state',
			'@codemirror/lang-json',
			'@replit/codemirror-vim'
		]
	}
});
