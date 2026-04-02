import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Aliases para imports limpos sem relative paths longos
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    // ⚡ PERFORMANCE: Code splitting manual para melhor cache
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa vendor chunks para melhor cache HTTP
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-state': ['zustand'],
          'vendor-axios': ['axios'],
        },
      },
    },
    // ⚡ PERFORMANCE: Minificação e tree-shaking
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Desabilitar em produção para segurança e performance
    chunkSizeWarningLimit: 500,
  },
  server: {
    allowedHosts: ['testtecnicoprojeto.onrender.com'],
  },
  // ⚡ PERFORMANCE: Pre-bundling de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      'axios',
      'zod',
    ],
  },
})
