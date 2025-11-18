// src/components/ChatBox.tsx (ví dụ)

import React, { useEffect, useState } from 'react';
import echo from '~/echo';

interface Message {
  id: number;
  text: string;
  user: { name: string };
}

interface AuthUser {
    id: number; // ID của người dùng hiện tại
}

const ChatBox = ({ authUser }: { authUser: AuthUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Tên kênh phải khớp với tên trong broadcastOn() và Channel Authorization
    const channelName = `private-chat.${authUser.id}`;
    
    // 1. Đăng ký kênh riêng tư (Private Channel)
    echo.private(channelName)
        // 2. Lắng nghe sự kiện (Tên sự kiện phải khớp với broadcastAs())
        .listen('.message.new', (e: { message: any; user: any }) => {
            const newMessage: Message = {
                id: e.message.id,
                text: e.message.text,
                user: e.user,
            };
            
            // Cập nhật state tin nhắn
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            console.log('Tin nhắn mới nhận:', e);
        })
        .error((error: any) => {
            console.error('Lỗi khi kết nối kênh Private:', error);
        });

    // Hàm dọn dẹp (cleanup function)
    return () => {
      echo.leave(channelName);
    };
  }, [authUser.id]);

  // Render UI Chat (Phần gửi tin nhắn và hiển thị)
  return (
    <div>
      <h3>Chatbox Realtime</h3>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.user.name}:</strong> {msg.text}
        </div>
      ))}
      {/* Thêm form gửi tin nhắn gọi đến /chat/send API ở đây */}
    </div>
  );
};

export default ChatBox;