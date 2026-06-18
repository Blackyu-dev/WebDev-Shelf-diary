import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/isbn-api": {
                target: "https://isbn.tw",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/isbn-api/, ""),


                configure: (proxy) => {
                    // 1. 偽裝成一般的 Google Chrome 瀏覽器
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                        proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8');
                    });

                    // 2. 如 Proxy 真的出錯，把 error print 到 terminal
                    proxy.on('error', (err) => {
                        console.log('🔥 Proxy 連線發生錯誤:', err);
                    });
                }
            },
        },
    },
});