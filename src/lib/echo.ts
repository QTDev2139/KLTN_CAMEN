import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { baseURL } from '~/common/until/request.until';


(window as any).Pusher = Pusher;

const wsHost = process.env.REACT_APP_REVERB_HOST || 'localhost';
const wsPort = Number(process.env.REACT_APP_REVERB_PORT || 8080);

export const echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.REACT_APP_REVERB_APP_KEY as string, 
  wsHost,
  wsPort,
  wssPort: wsPort,
  forceTLS: false,
  encrypted: false,
  enabledTransports: ['ws'],

  // Auth cho private channel (dùng JWT)
  authEndpoint: `${process.env.REACT_APP_BASE}broadcasting/auth`,
  authorizer: (channel, options) => {
    const token = localStorage.getItem('access_token');
    return {
      authorize: (socketId: string, callback: (error: Error | null, data: any) => void) => {
      // dùng axiosApi để gửi kèm Bearer token
        baseURL
          .post(
            '/broadcasting/auth',
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
            {
              headers: token
                ? { Authorization: `Bearer ${token}` }  // GỬI JWT LÊN ĐÂY
                : undefined,
            },
          )
          .then((response) => {
            callback(null, response.data);
          })
          .catch((error) => {
            console.error('Broadcast auth error', error);
            // pass the Error object as first arg to match ChannelAuthorizationCallback
            callback(error as Error, error?.response?.data ?? null);
          });
      },
    };
  },
});
