import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import { MessageSquare, Send, Stethoscope, User, Clock, MessageCircle, Check, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (!messages.length) return;
    const container = messageListRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [messages]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/rooms');
      const doctorRooms = (response.data.data || []).filter(
        (room) => room.room_type === 'customer_doctor' || room.doctor_id
      );
      setRooms(doctorRooms);
      if (doctorRooms.length > 0 && !selectedRoom) {
        setSelectedRoom(doctorRooms[0]);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedRoom) return;

    try {
      const response = await api.get(`/chat/rooms/${selectedRoom.room_id}/messages`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);
    try {
      const { data } = await api.post(`/chat/rooms/${selectedRoom.room_id}/messages`, {
        messageText: text,
      });
      const sent = data?.data;
      if (sent?.message_id && sent?.created_at) {
        setMessages((prev) => [...prev, { ...sent, is_read: false, read_at: null }]);
      } else {
        loadMessages();
      }
    } catch (error) {
      setNewMessage(text);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getRoomName = (room) => {
    if (room.customer) {
      return `${room.customer.user?.first_name} ${room.customer.user?.last_name}`;
    }
    return 'Customer';
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell max-w-6xl h-[calc(100vh-200px)]">
        <div className="page-header mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Chat with Customers</h1>
            <p className="page-subtitle mt-1">Real-time conversations to support pet parents during consultations</p>
          </div>
        </div>

        <div className="flex h-full rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          {/* Chat Rooms Sidebar */}
          <div className="w-80 border-r border-slate-200/80 bg-slate-50/60 overflow-y-auto shrink-0">
            <div className="p-6 border-b border-slate-200/80">
              <h3 className="font-semibold text-lg text-slate-900 mb-1">Conversations</h3>
              <p className="text-xs text-slate-500">Select a pet parent to open the chat</p>
            </div>
            <div className="space-y-1 p-3">
              {rooms.map((room) => (
                <button
                  key={room.room_id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3 ${selectedRoom?.room_id === room.room_id
                      ? 'bg-white shadow-sm border border-slate-200/80 text-slate-900 font-medium'
                      : 'hover:bg-white/80 text-slate-700 border border-transparent'
                    }`}
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{getRoomName(room)}</p>
                    {room.appointment_id && (
                      <p className="text-xs text-slate-500 mt-1">Appointment #{room.appointment_id}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedRoom ? (
              <>
                <div className="p-6 border-b border-slate-200/80 bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg text-slate-900">
                        {getRoomName(selectedRoom)}
                      </h2>
                      {selectedRoom.appointment_id && (
                        <p className="text-sm text-slate-500 mt-0.5">Appointment #{selectedRoom.appointment_id}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  ref={messageListRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/40"
                >
                  {messages.length === 0 ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No messages yet"
                      message="Start the conversation with your patient"
                    />
                  ) : (
                    messages.map((message) => {
                      const isSentByCurrentUser = message.sender_id === user?.userId;
                      return (
                      <div
                        key={message.message_id}
                          className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                            className={`max-w-md p-4 rounded-2xl ${isSentByCurrentUser
                              ? 'bg-slate-900 text-white rounded-br-md'
                              : 'bg-white text-slate-900 rounded-bl-md border border-slate-200/80 shadow-sm'
                            }`}
                        >
                          <p className="text-sm">{message.message_text}</p>
                          <div
                              className={`text-xs mt-1 flex items-center justify-between gap-2 flex-wrap ${isSentByCurrentUser
                                ? 'text-slate-300'
                                : 'text-slate-500'
                              }`}
                          >
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              {formatDateTime(message.created_at)}
                            </span>
                            {isSentByCurrentUser && (
                              <span className="flex items-center gap-1">
                                {message.is_read ? (
                                  <>
                                    <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Read</span>
                                    {message.read_at && (
                                      <span className="opacity-80">· {formatRelativeTime(message.read_at)}</span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Sent</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-200/80 bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="input-field flex-1 !rounded-2xl !py-3.5 !border-slate-200 focus:!ring-slate-900/10"
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()} className="!rounded-2xl !px-5 !py-3.5 !font-medium !bg-slate-900 hover:!bg-slate-800">
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50/40">
                <EmptyState
                  icon={MessageSquare}
                  title="Select a chat"
                  message="Choose a conversation from the sidebar to begin"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
