import React, { useEffect, useRef, useState } from 'react';
import { Box, Popper, Fab, IconButton, TextField, Stack, Paper, Typography, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { InsertPhotoOutlined } from '@mui/icons-material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { chatApi, userApi } from '~/apis';
import { ChatMessage, ChatRoom } from '~/apis/chat-box/chatbox.interface';
import ModalImage from '../modal/modal-image/modal-image.element';
import { echo } from '~/lib/echo';
import { BroadcastMessagePayload } from './chatbox.interface';
import { User } from '~/apis/user/user.interfaces.api';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { formatDateHeader, formatTime } from '~/common/until/date-format.until';

const MAX_IMAGES = 5;

const ChatBox: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // files + previews
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // image modal
  const [imageOpen, setImageOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');

  const [profile, setProfile] = useState<User | null>(null);

  const { snackbar } = useSnackbar();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // sau useEffect fetchMessages, thêm useEffect này:
  useEffect(() => {
    if (!room) return;

    const channelName = `chat-room.${room.id}`;
    const channel = echo.private(channelName);

    channel.listen('.message.sent', (event: BroadcastMessagePayload) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === event.id)) return prev;

        return [
          ...prev,
          {
            id: event.id,
            chat_room_id: event.chat_room_id,
            sender_id: event.sender_id,
            message: event.message,
            images: event.images || [],
            read_at: event.read_at,
            created_at: event.created_at,
            sender: event.sender,
          } as ChatMessage,
        ];
      });
    });

    return () => {
      channel.stopListening('.message.sent');
      echo.leave(`private-${channelName}`);
    };
  }, [room?.id]);

  // Lắng nghe sự kiện mở chat từ nơi khác trong app
  useEffect(() => {
   const handler = async (e: Event) => {
     const detail = (e as CustomEvent)?.detail || {};
     // Mở popper, anchor vào FAB
     setAnchorEl(buttonRef.current);
     setIsOpen(true);

     if (detail.sellerId) {
       try {
         const rooms = await chatApi.getRooms();
         const matched = (rooms || []).find((r: any) => r.seller_id === detail.sellerId || r.partner_id === detail.sellerId);
         if (matched) {
           setRoom(matched);
         }
       } catch (err) {
         console.error('open-chat: failed to find room', err);
       }
     }
   };

   window.addEventListener('open-chat', handler as EventListener);
   return () => window.removeEventListener('open-chat', handler as EventListener);
 }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        setProfile(res);
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // cố gắng lấy room đầu tiên (customer) nếu có
    const init = async () => {
      try {
        setLoading(true);
        const rooms = await chatApi.getRooms();
        if (rooms && rooms.length > 0) {
          setRoom(rooms[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!room) return;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await chatApi.getMessages(room.id);
        setMessages(res.data || []);
        scrollToBottom();
        chatApi.markAsRead(room.id).catch(() => {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [room?.id]);

  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setIsOpen((prev) => !prev);
  };

  // handle files add (limit + previews)
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const list = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    const remaining = Math.max(0, MAX_IMAGES - files.length);
    const toAdd = list.slice(0, remaining);
    if (toAdd.length === 0) {
      snackbar('warning', `Chỉ được chọn tối đa ${MAX_IMAGES} ảnh`);
      return;
    }
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed);
      return prev.filter((_, i) => i !== index);
    });
  };

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handleSend = async () => {
    if (!room || sending) return;
    if (!input.trim() && files.length === 0) return;

    try {
      setSending(true);
      await chatApi.sendMessage(room.id, {
        message: input.trim() || undefined,
        files,
      });
      setInput('');
      // revoke previews and clear files
      previews.forEach((u) => URL.revokeObjectURL(u));
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const id = setTimeout(() => {
      scrollToBottom();
    }, 0);

    return () => clearTimeout(id);
  }, [isOpen, messages.length]);

  // map ngày -> số tin nhắn trong ngày (dùng Date.toDateString để nhóm)
  const countsByDate = messages.reduce<Record<string, number>>((acc, m) => {
    if (!m.created_at) return acc;
    const k = new Date(m.created_at).toDateString();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={(e) => handleToggle(e)}
        ref={buttonRef}
        sx={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: (theme) => theme.zIndex.tooltip + 1,
        }}
      >
        <ChatIcon />
      </Fab>

      <Popper
        open={isOpen}
        anchorEl={anchorEl}
        placement="top-end"
        popperOptions={{
          strategy: 'fixed',
          modifiers: [
            { name: 'offset', options: { offset: [0, 8] } },
            { name: 'preventOverflow', enabled: true, options: { padding: 8 } },
            { name: 'computeStyles', options: { adaptive: false } },
          ],
        }}
        sx={{ 
          zIndex: 1000,
         }}
      >
        <Paper
          elevation={6}
          sx={{
            width: 360,
            height: 400,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: (theme) => theme.zIndex.tooltip + 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  {room ? `Chat` : 'Chat'}
                </Typography>
                {/* Thu lại (minimize) - khi bấm sẽ thu lại popover */}
                <IconButton
                  size="small"
                  onClick={() => {
                    setAnchorEl(null);
                    setIsOpen(false);
                  }}
                  aria-label="thu-lai"
                >
                  <MinimizeIcon fontSize="small" sx={{ marginTop: '-6px', paddingBottom: '5px' }} />
                </IconButton>
              </Stack>
            </Box>

            {/* previews */}
            {previews.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', p: 1 }}>
                {previews.map((src, idx) => (
                  <Box key={src} sx={{ width: 60, height: 60, position: 'relative' }}>
                    <img
                      src={src}
                      alt={files[idx]?.name || `file-${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                      onClick={() => {
                        setModalSrc(src);
                        setImageOpen(true);
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(idx)}
                      sx={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}

            <Box sx={{ flex: 1, p: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
              {loading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                  <CircularProgress size={20} />
                </Stack>
              ) : messages.length === 0 ? (
                <Typography sx={{ p: 1 }} color="text.secondary">
                  Chưa có tin nhắn.
                </Typography>
              ) : (
                (() => {
                  const rows: React.ReactNode[] = [];
                  let lastDateKey = '';
                  messages.forEach((m) => {
                    const currentUserId = profile?.id;
                    const isMine = m.sender_id === currentUserId;
                    const imgCount = m.images?.length || 0;
                    const columns = Math.min(imgCount, 2); // tối đa 2 cột
                    const dateKey = m.created_at ? new Date(m.created_at).toDateString() : 'unknown';

                    // nếu là ngày mới, chèn header ngày cùng số tin nhắn trong ngày
                    if (dateKey !== lastDateKey) {
                      rows.push(
                        <Box key={`date-${dateKey}`} sx={{ textAlign: 'center', my: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateHeader(m.created_at)} {countsByDate[dateKey] ? ` — ${countsByDate[dateKey]} tin nhắn` : ''}
                          </Typography>
                        </Box>
                      );
                      lastDateKey = dateKey;
                    }

                    rows.push(
                      <Box key={m.id} sx={{ mb: 1, display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: '8px 12px 12px 12px',
                            minWidth: 24,
                            maxWidth: '70%',
                            bgcolor: isMine ? '#514ad1a6' : 'grey.100',
                            color: isMine ? 'white' : 'black',
                            borderRadius: 2,
                            position: 'relative',
                          }}
                        >
                          {m.message && <Typography variant="body2">{m.message}</Typography>}

                          {m.images && imgCount > 0 && (
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${columns}, 60px)`,
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              {m.images.map((img, idx) => (
                                <Box
                                  key={idx}
                                  sx={{ width: 60, height: 60, cursor: 'pointer' }}
                                  onClick={() => {
                                    setModalSrc(`${process.env.REACT_APP_BASE}storage/${img}`);
                                    setImageOpen(true);
                                  }}
                                >
                                  <img
                                    src={`${process.env.REACT_APP_BASE}storage/${img}`}
                                    alt={m.message ? `${m.message} (image ${idx + 1})` : `Image ${idx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                                  />
                                </Box>
                              ))}
                            </Box>
                          )}

                          {/* chỉ hiển thị giờ (HH:MM) */}
                          {m.created_at && (
                            <Typography variant="caption" sx={{ position: 'absolute',  opacity: 0.6, bottom: 2, fontSize: 10, right: 12, lineHeight: 1 }}>
                              {formatTime(m.created_at)}
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    );
                  });
                  return rows;
                })()
              )}

              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    if (e.target) e.target.value = '';
                  }}
                />

                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  color={files.length > 0 ? 'primary' : 'default'}
                >
                  <InsertPhotoOutlined />
                </IconButton>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tin..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!room || sending || (!input.trim() && files.length === 0)}
                >
                  <SendIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Popper>

      <ModalImage open={imageOpen} onClose={() => setImageOpen(false)} src={modalSrc} alt="Ảnh" />
    </>
  );
};

export default ChatBox;
