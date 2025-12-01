export interface UserSummary {
  id: number;
  name: string;
  email?: string;
}

export interface ChatRoom {
  id: number;
  customer_id: number;
  staff_id: number;
  last_message_id: number | null;
  status: 'pending' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
  customer?: UserSummary;
  staff?: UserSummary;
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: number;
  chat_room_id: number;
  sender_id: number;
  message: string;
  images?: string[];
  read_at: string | null;
  created_at: string;
  sender?: UserSummary;
}

export interface PaginatedMessages {
  data: ChatMessage[];
  current_page: number;
  last_page: number;
  per_page: number;
}