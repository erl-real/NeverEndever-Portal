import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js')
    }
  },
  server: {
    port: 3000
  }
})
