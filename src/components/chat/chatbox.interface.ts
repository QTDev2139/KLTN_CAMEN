export interface BroadcastMessagePayload {
  id: number;
  chat_room_id: number;
  sender_id: number;
  message: string;
  read_at: string | null;
  images?: string[];
  created_at: string;
  sender?: {
    id: number;
    name: string;
  };
}
