import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  TextField,
  IconButton,
  CircularProgress,
  Button,
  Pagination,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { chatApi, userApi } from '~/apis';
import { ChatMessage, ChatRoom } from '~/apis/chat-box/chatbox.interface';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { InsertPhotoOutlined, SettingsOutlined } from '@mui/icons-material';
import { User } from '~/apis/user/user.interfaces.api';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { echo } from '~/lib/echo';
import { BroadcastMessagePayload } from '~/components/chat/chatbox.interface';
import ModalImage from '~/components/modal/modal-image/modal-image.element';
import { StateTagTypeChat } from './chat.state';
import { TagElement } from '~/components/elements/tag/tag.element';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { ModalElement } from '~/components/modal/modal-element/modal-element';
import { formatDate, formatDateHeader, formatTime } from '~/common/until/date-format.until';

const ChatScreen: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const MAX_IMAGES = 5;
  const ROOMS_PER_PAGE = 8;
  const [roomPage, setRoomPage] = useState(1);
  // reset page when rooms change (or filter changes)
  useEffect(() => {
    setRoomPage(1);
  }, [rooms.length]);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');

  const [profile, setProfile] = useState<User | null>(null);
  const [dsnv, setDsnv] = useState<User[]>([]);

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomForModal, setRoomForModal] = useState<ChatRoom | null>(null);

  // separate modal for non-admin when clicking a pending room
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [pendingRoom, setPendingRoom] = useState<ChatRoom | null>(null);

  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  useEffect(() => {
    if (roomModalOpen && roomForModal) {
      setSelectedStaffId(roomForModal.staff?.id ?? null);
    }
  }, [roomForModal, roomModalOpen]);

  const { snackbar } = useSnackbar();
  const isAdmin = profile?.role?.name === 'admin';

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load danh sách room
  const loadRooms = async () => {
    try {
      setLoadingRooms(true);
      const data = await chatApi.getRooms();
      setRooms(data);
      if (data.length > 0) {
        const updated = data.find((r) => r.id === selectedRoom?.id);
        if (updated) {
          setSelectedRoom(updated);
        }
        // Không tự động chọn phòng đầu tiên khi vào trang
      } else {
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Failed to load rooms', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    loadRooms();
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
    const fetchProfile = async () => {
      try {
        const res = await userApi.getPersonnel(4);
        setDsnv(res);
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    fetchProfile();
  }, []);

  // Load messages khi chọn room
  useEffect(() => {
    if (!selectedRoom) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await chatApi.getMessages(selectedRoom.id);
        setMessages(res.data);
        scrollToBottom();
        // đánh dấu đã đọc
        chatApi.markAsRead(selectedRoom.id).catch(() => {});
      } catch (error) {
        console.error('Failed to load messages', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedRoom?.id]);

  // Lắng nghe realtime với Echo
  useEffect(() => {
    if (!selectedRoom) return;
    const channelName = `chat-room.${selectedRoom.id}`;
    const channel = echo.private(channelName);

    channel.listen('.message.sent', (event: BroadcastMessagePayload) => {
      // update messages (avoid duplicates)
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
          },
        ];
      });

      // update sidebar rooms -> set last_message for the corresponding room
      setRooms((prev) =>
        prev.map((r) =>
          r.id === event.chat_room_id
            ? {
                ...r,
                last_message: {
                  id: event.id,
                  chat_room_id: event.chat_room_id,
                  sender_id: event.sender_id,
                  message: event.message,
                  images: event.images || [],
                  read_at: event.read_at,
                  created_at: event.created_at,
                  sender: event.sender,
                },
              }
            : r,
        ),
      );

      // nếu đang mở phòng đó, cập nhật selectedRoom.last_message luôn
      setSelectedRoom((cur) => {
        if (!cur || cur.id !== event.chat_room_id) return cur;
        return {
          ...cur,
          last_message: {
            id: event.id,
            chat_room_id: event.chat_room_id,
            sender_id: event.sender_id,
            message: event.message,
            images: event.images || [],
            read_at: event.read_at,
            created_at: event.created_at,
            sender: event.sender,
          },
        };
      });
    });

    return () => {
      channel.stopListening('.message.sent');
      echo.leave(`private-${channelName}`);
    };
  }, [selectedRoom?.id]);

  const handleSend = async () => {
    if (!selectedRoom || sending) return;
    if (!input.trim() && files.length === 0) return;

    try {
      setSending(true);
      await chatApi.sendMessage(selectedRoom.id, {
        message: input.trim() || undefined,
        files,
      });
      setInput('');
      // revoke previews and clear files
      previews.forEach((u) => URL.revokeObjectURL(u));
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setSending(false);
    }
  };

  const getRoomTitle = (room: ChatRoom) => {
    return room.customer?.name && room.staff?.name
      ? `${room.customer.name} - ${room.staff.name}`
      : `${room.customer?.name}`;
  };

  const getRoomLastMessageSummary = (room: ChatRoom) => {
    const lm = room.last_message;
    if (!lm) return 'Chưa có tin nhắn';

    // Nếu tin nhắn cuối cùng là của customer và staff chưa đọc -> hiển thị trạng thái chưa đọc của nhân viên
    if (lm.sender_id === room.customer_id && !lm.read_at) {
      return (
        <Stack component="span">
          <Typography variant="subtitle2" fontWeight={600} sx={{ ...getLimitLineCss(1) }}>
            {lm.message || 'Tin nhắn hình ảnh'}
          </Typography>
        </Stack>
      );
    }

    return `${lm.message || 'Tin nhắn hình ảnh'} `;
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

  const handleJoinRoomAsStaff = async () => {
    if (!roomForModal) {
      setRoomModalOpen(false);
      setRoomForModal(null);
      setSelectedStaffId(null);
      return;
    }

    try {
      if (selectedStaffId === null) return;

      await chatApi.joinRoomAsStaff(roomForModal.id, selectedStaffId);
      if (isAdmin) {
        snackbar('success', 'Cập nhật nhân viên hỗ trợ thành công');
      } else {
        snackbar('success', 'Tham gia phòng chat thành công');
      }

      setRoomModalOpen(false);
      setRoomForModal(null);
      setSelectedStaffId(null);

      await loadRooms();
    } catch (error) {
      console.error('Failed to assign staff', error);
      snackbar('error', 'Cập nhật thất bại');
    }
  };
  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);


  // map ngày -> số tin nhắn trong ngày (dùng Date.toDateString để nhóm)
  const countsByDate = messages.reduce<Record<string, number>>((acc, m) => {
    if (!m.created_at) return acc;
    const k = new Date(m.created_at).toDateString();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 100px)' }}>
      <Paper sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar rooms */}
        <Box sx={{ width: 320, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2">Phòng chat</Typography>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {loadingRooms ? (
              <Stack alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <>
                <List>
                  {(() => {
                    const filtered = rooms.filter((room) => room.last_message_id && room.last_message_id !== 0);
                    const total = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(total / ROOMS_PER_PAGE));
                    const start = (roomPage - 1) * ROOMS_PER_PAGE;
                    const paged = filtered.slice(start, start + ROOMS_PER_PAGE);
                    return paged.map((room) => (
                      <ListItemButton
                        key={room.id}
                        selected={selectedRoom?.id === room.id}
                        onClick={() => {
                          if (!isAdmin && room.status === 'pending') {
                            setPendingRoom(room);
                            setRoomForModal(room);
                            const defaultStaffId = profile?.id ?? room.staff?.id ?? dsnv[0]?.id ?? null;
                            setSelectedStaffId(defaultStaffId);
                            setAddStaffModalOpen(true);
                            return;
                          }
                          setSelectedRoom(room);
                        }}
                      >
                        <ListItemText
                          primary={getRoomTitle(room)}
                          secondary={getRoomLastMessageSummary(room)}
                          secondaryTypographyProps={{ component: 'span' }}
                        />
                        <Stack spacing={1} sx={{ alignItems: 'center',  }}>
                          <TagElement
                            content={room.status}
                            type={StateTagTypeChat[room.status]}
                            sx={{ padding: '5px 10px' }}
                          />
                          {isAdmin && (
                            <SettingsOutlined
                              fontSize="small"
                              sx={{ color: 'text.secondary', cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation(); // tránh kích hoạt onClick của ListItemButton
                                setRoomForModal(room);
                                setRoomModalOpen(true);
                              }}
                            />
                          )}
                        </Stack>
                      </ListItemButton>
                     ));
                 })()}
                </List>

                {/* pagination */}
                {(() => {
                 const filteredCount = rooms.filter((room) => room.last_message_id && room.last_message_id !== 0).length;
                 const pages = Math.ceil(filteredCount / ROOMS_PER_PAGE);
                 if (pages > 1) {
                   return (
                     <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                       <Pagination
                         count={pages}
                         page={roomPage}
                         onChange={(_, v) => setRoomPage(v)}
                         size="small"
                       />
                     </Box>
                   );
                 }
                 if (filteredCount === 0) {
                   return (
                     <Typography sx={{ p: 2 }} color="text.secondary">
                       Chưa có phòng chat nào.
                     </Typography>
                   );
                 }
                 return null;
               })()}
             </>
            )}
          </Box>
        </Box>

        {/* Main area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1">
              {selectedRoom ? getRoomTitle(selectedRoom) : 'Chọn một phòng chat'}
            </Typography>

            {/* Ngày/tóm tắt số tin nhắn cho ngày đầu tiên của conversation (nếu có) */}
            {messages.length > 0 && (
              <Box sx={{ position: 'absolute', top: '3%', left: '50%' }}>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(messages[0].created_at)}{' '}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
            
            {loadingMessages && (
              <Stack alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                <CircularProgress size={24} />
              </Stack>
            )}

            {!loadingMessages &&
              (() => {
                const rows: React.ReactNode[] = [];
                let lastDateKey = '';
                messages.forEach((msg) => {
                  const currentUserId = profile?.id;
                  const isAdminUser = profile?.role?.name === 'admin';

                  let isMine = false;
                  if (isAdminUser && selectedRoom) {
                    const staffId = selectedRoom.staff?.id;
                    isMine = msg.sender_id === staffId;
                  } else {
                    isMine = msg.sender_id === currentUserId;
                  }

                  const dateKey = msg.created_at ? new Date(msg.created_at).toDateString() : 'unknown';
                  if (dateKey !== lastDateKey) {
                    rows.push(
                      <Box key={`date-${dateKey}`} sx={{ textAlign: 'center', my: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateHeader(msg.created_at)} {countsByDate[dateKey] ? ` — ${countsByDate[dateKey]} tin nhắn` : ''}
                        </Typography>
                      </Box>,
                    );
                    lastDateKey = dateKey;
                  }

                  rows.push(
                    <Box
                      key={msg.id}
                      sx={{
                        mb: 1,
                        display: 'flex',
                        justifyContent: isMine ? 'flex-end' : 'flex-start',
                      }}
                    >
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
                        {msg.message && <Typography variant="body2">{msg.message}</Typography>}

                        {msg.images && msg.images.length > 0 && (
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
                            {msg.images.map((img, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  setOpen(true);
                                  setModalSrc(`${process.env.REACT_APP_BASE}storage/${img}`);
                                }}
                              >
                                <img
                                  src={`${process.env.REACT_APP_BASE}storage/${img}`}
                                  alt={`img-${idx}`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 4,
                                  }}
                                />
                              </Box>
                            ))}
                          </Stack>
                        )}

                        {/* chỉ hiển thị giờ (HH:MM) */}
                        {msg.created_at && (
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              opacity: 0.6,
                              bottom: 2,
                              fontSize: 10,
                              right: 12,
                              lineHeight: 1,
                            }}
                          >
                            {formatTime(msg.created_at)}
                          </Typography>
                        )}
                      </Paper>
                    </Box>,
                  );
                });
                return rows;
              })()}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            {previews.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', paddingBottom: 1 }}>
                {previews.map((src, idx) => (
                  <Box key={src} sx={{ width: 60, height: 60, position: 'relative' }}>
                    <img
                      src={src}
                      alt={files[idx]?.name || `file-${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
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

            <Stack direction="row" spacing={1}>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (isAdmin) {
                    // admin not allowed to add files
                    if (e.target) e.target.value = '';
                    return;
                  }
                  handleFiles(e.target.files);
                  if (e.target) e.target.value = '';
                }}
              />

              <IconButton
                onClick={() => !isAdmin && fileInputRef.current?.click()}
                color={files.length > 0 ? 'primary' : 'default'}
                disabled={isAdmin}
              >
                <InsertPhotoOutlined />
              </IconButton>

              <TextField
                fullWidth
                placeholder="Nhập tin nhắn..."
                size="small"
                value={input}
                onChange={(e) => !isAdmin && setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (isAdmin) return;
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isAdmin}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!selectedRoom || sending || (!input.trim() && files.length === 0) || isAdmin}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Paper>
      {/*  */}
      <ModalImage open={open} onClose={() => setOpen(false)} src={modalSrc} alt="Sản phẩm" />
      <ModalElement
        open={roomModalOpen}
        onClose={() => {
          setRoomModalOpen(false);
          setRoomForModal(null);
          setSelectedStaffId(null);
        }}
        onConfirm={handleJoinRoomAsStaff}
        title={
          roomForModal
            ? `Chọn nhân viên hổ trợ khách hàng cho ${getRoomTitle(roomForModal)}`
            : 'Chọn nhân viên hổ trợ khách hàng '
        }
        message={
          <Box>
            {dsnv.map((nv) => (
              <Stack key={nv.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
                <Typography>{nv.name}</Typography>
                <Button
                  size="small"
                  variant={selectedStaffId === nv.id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedStaffId(nv.id ?? null)}
                >
                  {selectedStaffId === nv.id ? 'Đã chọn' : 'Chọn'}
                </Button>
              </Stack>
            ))}
          </Box>
        }
        maxWidth="sm"
        confirmText="Lưu"
        cancelText="Đóng"
      />
      {/* modal cho user khi click vào phòng pending */}
      <ModalElement
        open={addStaffModalOpen}
        onClose={() => {
          setAddStaffModalOpen(false);
          setPendingRoom(null);
          setRoomForModal(null);
          setSelectedStaffId(null);
        }}
        title="Thông báo"
        message={<Typography>Xác nhận hỗ trợ khách hàng này</Typography>}
        maxWidth="sm"
        confirmText="Đồng ý"
        onConfirm={handleJoinRoomAsStaff}
        cancelText="Đóng"
      />
    </Box>
  );
};

export default ChatScreen;
