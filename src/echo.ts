// src/echo.ts

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Đảm bảo Reverb Host/Port/Key khớp với cấu hình .env của Laravel
const reverbHost = (import.meta as any).env?.VITE_REVERB_HOST || 'localhost';
const reverbPort = (import.meta as any).env?.VITE_REVERB_PORT || '8080';
const reverbKey = (import.meta as any).env?.VITE_REVERB_APP_KEY; // Lấy từ .env FE

if (!reverbKey) {
    console.warn('VITE_REVERB_APP_KEY is not set. Using fallback key "local-dev-key". Set VITE_REVERB_APP_KEY in your .env for production.');
}

(window as any).Pusher = Pusher;

const echo = new Echo({
    // use the pusher connector (pusher-js)
    broadcaster: 'reverb',
    key: reverbKey || 'local-dev-key',
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort, // Dùng cùng port cho cả ws và wss nếu không có proxy/ssl
    forceTLS: false, // Đặt thành true nếu bạn dùng https/wss
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    // Thêm header authorization cho các kênh Private
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Thay bằng cách lấy token của bạn
        },
    },
});

export default echo;