import { axiosApi } from '~/common/until/request.until';
import { ChatMessage, ChatRoom, PaginatedMessages } from './chatbox.interface';

export const getRooms = async (): Promise<ChatRoom[]> => {
    const res = await axiosApi.get<ChatRoom[]>('/chat/rooms');
    return res.data;
};

export const openRoomAsCustomer = async (): Promise<ChatRoom> => {
    const res = await axiosApi.post<ChatRoom>('/chat/rooms/open');
    return res.data;
};

export const joinRoomAsStaff = async (roomId: number, staffId: number): Promise<ChatRoom> => {
  const res = await axiosApi.post<ChatRoom>(`/chat/rooms/${roomId}/join`, {
    staff_id: staffId,
  });
  return res.data;
};

export const getMessages = async (roomId: number, page = 1): Promise<PaginatedMessages> => {
    const res = await axiosApi.get<PaginatedMessages>(`/chat/rooms/${roomId}/messages`, {
        params: { page },
    });
    return res.data;
};

export const sendMessage = async (
    roomId: number,
    payload: { message?: string; files?: File[] },
): Promise<ChatMessage> => {
    const formData = new FormData();
    if (payload.message) {
        formData.append('message', payload.message);
    }
    if (payload.files && payload.files.length > 0) {
        payload.files.forEach((file) => {
        formData.append('images[]', file); 
        });
    }

    const res = await axiosApi.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, formData, {
        headers: {
      // Đừng set 'multipart/form-data' thủ công, để axios tự set boundary
        },
    });

    return res.data;
};

export const markAsRead = async (roomId: number): Promise<void> => {
    await axiosApi.post(`/chat/rooms/${roomId}/read`);
};
