import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base мусить збігатися з назвою вашого GitHub-репозиторію,
// напр. якщо репозиторій https://github.com/USERNAME/course-builder
// то base має бути '/course-builder/'
export default defineConfig({
  plugins: [react()],
  base: '/course-builder/',
});
