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
      <div className="page-shell h-[calc(100vh-200px)]">
        <div className="page-header">
          <div>
            <h1 className="page-title">Chat with Customers</h1>
            <p className="page-subtitle">Real-time conversations to support pet parents during consultations</p>
          </div>
        </div>

        <div className="flex h-full rounded-3xl border border-slate-100 bg-white/80 backdrop-blur overflow-hidden shadow-sm">
          {/* Chat Rooms Sidebar */}
          <div className="w-80 border-r border-slate-100 bg-slate-50/50 overflow-y-auto shrink-0">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-xl text-slate-800 mb-1">Conversations</h3>
              <p className="text-xs text-slate-500">Select a pet parent to open the chat</p>
            </div>
            <div className="space-y-1 p-3">
              {rooms.map((room) => (
                <button
                  key={room.room_id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full text-left p-4 rounded-xl transition-colors flex items-start gap-3 ${selectedRoom?.room_id === room.room_id
                      ? 'bg-slate-100 text-slate-800 font-semibold'
                      : 'hover:bg-slate-100 text-slate-700'
                    }`}
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{getRoomName(room)}</p>
                    {room.appointment_id && (
                      <p className="text-xs text-slate-500 mt-1">Appointment #{room.appointment_id}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                <div className="p-6 border-b border-slate-100 bg-white/70 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-slate-900">
                        {getRoomName(selectedRoom)}
                      </h2>
                      {selectedRoom.appointment_id && (
                        <p className="text-sm text-slate-500 mt-1">Appointment #{selectedRoom.appointment_id}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  ref={messageListRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/60"
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
                            className={`max-w-md p-4 rounded-2xl shadow-sm ${isSentByCurrentUser
                              ? 'bg-slate-800 text-white rounded-br-none'
                              : 'bg-white text-slate-900 rounded-bl-none border border-slate-100'
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
                <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 bg-white/70 backdrop-blur-sm">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="input-field flex-1 !rounded-xl !py-3.5"
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()} className="!rounded-xl !px-5 !py-3.5">
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50/60">
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
