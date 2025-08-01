import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),   basicSsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server:{
    host:true,
    port:3000,
    allowedHosts:['clonecv.com','localhost','127.0.0.1','0.0.0.0','192.168.1.100','https://clonecv.com','www.clonecv.com']
  }
})
