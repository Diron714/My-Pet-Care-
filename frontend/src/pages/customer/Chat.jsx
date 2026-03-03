import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDateTime } from '../../utils/formatters';
import { MessageSquare, Send, Stethoscope, Shield, User, Clock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const doctorId = params.get('doctorId');

    if (doctorId) {
      createDoctorChatRoom(doctorId);
    } else {
      loadRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/rooms');
      const roomList = response.data.data || [];
      setRooms(roomList);
      if (roomList.length > 0 && !selectedRoom) {
        setSelectedRoom(roomList[0]);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDoctorChatRoom = async (doctorId) => {
    try {
      setLoading(true);
      await api.post('/chat/rooms', {
        room_type: 'customer_doctor',
        doctor_id: Number(doctorId),
      });
      await loadRooms();
    } catch (error) {
      console.error('Error creating chat room:', error);
      toast.error(error.response?.data?.message || 'Failed to start chat');
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

    setSending(true);
    try {
      await api.post(`/chat/rooms/${selectedRoom.room_id}/messages`, {
        messageText: newMessage,
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getRoomName = (room) => {
    if (room.room_type === 'customer_doctor') {
      return `Dr. ${room.doctor?.user?.first_name} ${room.doctor?.user?.last_name}`;
    } else if (room.room_type === 'customer_staff') {
      return 'Staff Support';
    }
    return 'Chat Room';
  };

  const getRoomIcon = (room) => {
    if (room.room_type === 'customer_doctor') {
      return Stethoscope;
    } else if (room.room_type === 'customer_staff') {
      return Shield;
    }
    return MessageSquare;
  };

  const getRoomStyles = (room) => {
    if (room.room_type === 'customer_doctor') {
      return {
        gradient: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
      };
    } else if (room.room_type === 'customer_staff') {
      return {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      };
    }
    return {
      gradient: 'from-slate-500 to-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
    };
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell h-[calc(100vh-200px)]">
        <div className="page-header">
          <div>
            <h1 className="page-title">Chat</h1>
            <p className="page-subtitle">Connect with doctors and support staff for pet care assistance</p>
          </div>
        </div>

        <div className="flex h-full rounded-3xl border border-slate-100 bg-white/80 backdrop-blur overflow-hidden shadow-sm">
          {/* Chat Rooms Sidebar */}
          <div className="w-80 border-r border-slate-100 bg-slate-50/50 overflow-y-auto shrink-0">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-xl text-slate-800 mb-1">Conversations</h3>
              <p className="text-xs text-slate-500">Select a chat to start messaging</p>
            </div>
            <div className="space-y-1 p-3">
              {rooms.map((room) => {
                const RoomIcon = getRoomIcon(room);
                const roomStyles = getRoomStyles(room);
                return (
                  <button
                    key={room.room_id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full text-left p-4 rounded-xl transition-colors flex items-start gap-3 ${selectedRoom?.room_id === room.room_id
                        ? 'bg-primary-100 text-primary-800 font-semibold'
                        : 'hover:bg-slate-100 text-slate-700'
                      }`}
                  >
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${roomStyles.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <RoomIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{getRoomName(room)}</p>
                      {room.appointment_id && (
                        <p className="text-xs text-slate-500 mt-1">Appointment #{room.appointment_id}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1 capitalize">{room.room_type.replace('_', ' ')}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                <div className="p-6 border-b border-slate-100 bg-white/70 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const RoomIcon = getRoomIcon(selectedRoom);
                      const roomStyles = getRoomStyles(selectedRoom);
                      return (
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${roomStyles.gradient} flex items-center justify-center shadow-lg`}>
                          <RoomIcon className="w-6 h-6 text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="font-bold text-xl text-slate-900">{getRoomName(selectedRoom)}</h2>
                      {selectedRoom.appointment_id && (
                        <p className="text-sm text-slate-500 mt-1">Appointment #{selectedRoom.appointment_id}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/60">
                  {messages.length === 0 ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No messages yet"
                      message="Start the conversation with your doctor or support staff"
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
                                ? 'bg-primary-600 text-white rounded-br-none'
                                : 'bg-white text-slate-900 rounded-bl-none border border-slate-100'
                              }`}
                          >
                            <p className="text-sm">{message.message_text}</p>
                            <p
                              className={`text-xs mt-1 flex items-center gap-1 ${isSentByCurrentUser
                                  ? 'text-primary-200'
                                  : 'text-slate-500'
                                }`}
                            >
                              <Clock className="w-3 h-3" />
                              {formatDateTime(message.created_at)}
                            </p>
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
