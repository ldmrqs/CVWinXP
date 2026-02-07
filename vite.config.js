import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        desktop: resolve(__dirname, 'windowsxp.html'),
        resume: resolve(__dirname, 'resume/index.html'),
        'resume-about': resolve(__dirname, 'resume/about.html'),
        'resume-skills': resolve(__dirname, 'resume/skills.html'),
        'resume-experience': resolve(__dirname, 'resume/experience.html'),
        'resume-projects': resolve(__dirname, 'resume/projects.html'),
        'resume-contact': resolve(__dirname, 'resume/contact.html'),
      },
    },
    outDir: 'dist',
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
