import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDateTime } from '../../utils/formatters';
import { MessageSquare, Send, Users, User, Stethoscope, Shield, Search, Filter, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for fallback
const mockRooms = [
  {
    room_id: 1,
    room_type: 'customer_doctor',
    customer: { user: { first_name: 'Sarah', last_name: 'Johnson' } },
    doctor: { user: { first_name: 'James', last_name: 'Anderson' } },
    appointment_id: 101,
    created_at: new Date().toISOString(),
  },
  {
    room_id: 2,
    room_type: 'customer_staff',
    customer: { user: { first_name: 'Michael', last_name: 'Chen' } },
    appointment_id: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    room_id: 3,
    room_type: 'customer_doctor',
    customer: { user: { first_name: 'Emma', last_name: 'Williams' } },
    doctor: { user: { first_name: 'Sarah', last_name: 'Wilson' } },
    appointment_id: 102,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockMessages = {
  1: [
    {
      message_id: 1,
      message_text: 'Hello, I have a question about my pet\'s health.',
      sender_id: 1,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      message_id: 2,
      message_text: 'Of course! I\'d be happy to help. What seems to be the concern?',
      sender_id: 2,
      created_at: new Date(Date.now() - 3300000).toISOString(),
    },
  ],
  2: [
    {
      message_id: 3,
      message_text: 'I need help with my order.',
      sender_id: 3,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  3: [
    {
      message_id: 4,
      message_text: 'When is my next appointment?',
      sender_id: 4,
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
};

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadRooms();
  }, [filter]);

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
      let allRooms = response.data.data || [];
      
      // Filter by room type if needed
      if (filter !== 'all') {
        allRooms = allRooms.filter(room => room.room_type === filter);
      }
      
      setRooms(allRooms);
      if (allRooms.length > 0 && !selectedRoom) {
        setSelectedRoom(allRooms[0]);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      // Use mock data as fallback
      let filtered = [...mockRooms];
      if (filter !== 'all') {
        filtered = filtered.filter(room => room.room_type === filter);
      }
      setRooms(filtered);
      if (filtered.length > 0 && !selectedRoom) {
        setSelectedRoom(filtered[0]);
      }
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
      // Use mock data as fallback
      setMessages(mockMessages[selectedRoom.room_id] || []);
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
      return `${room.customer?.user?.first_name} ${room.customer?.user?.last_name} ↔ Dr. ${room.doctor?.user?.first_name} ${room.doctor?.user?.last_name}`;
    } else if (room.room_type === 'customer_staff') {
      return `${room.customer?.user?.first_name} ${room.customer?.user?.last_name} ↔ Staff Support`;
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

  const getRoomTypeColor = (roomType) => {
    switch (roomType) {
      case 'customer_doctor':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
        };
      case 'customer_staff':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
      default:
        return {
          gradient: 'from-slate-500 to-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
        };
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  const customerDoctorRooms = rooms.filter(r => r.room_type === 'customer_doctor').length;
  const customerStaffRooms = rooms.filter(r => r.room_type === 'customer_staff').length;

  return (
    <Layout>
      <div className="page-shell h-[calc(100vh-200px)]">
        <div className="page-header">
          <div>
            <h1 className="page-title">Chat Management</h1>
            <p className="page-subtitle">Monitor and participate in all customer conversations and support chats</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Chats</p>
                <p className="text-2xl font-black text-slate-900">{rooms.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctor Chats</p>
                <p className="text-2xl font-black text-emerald-600">{customerDoctorRooms}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Support Chats</p>
                <p className="text-2xl font-black text-blue-600">{customerStaffRooms}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filter === 'all'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            All Chats
          </button>
          <button
            onClick={() => setFilter('customer_doctor')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filter === 'customer_doctor'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white text-emerald-600 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Doctor Chats
          </button>
          <button
            onClick={() => setFilter('customer_staff')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filter === 'customer_staff'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            Support Chats
          </button>
        </div>

        <div className="flex h-full rounded-3xl border border-slate-100 bg-white/80 backdrop-blur overflow-hidden shadow-sm">
          {/* Chat Rooms Sidebar */}
          <div className="w-80 border-r border-slate-100 bg-slate-50/50 overflow-y-auto shrink-0">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-xl text-slate-800 mb-1">All Conversations</h3>
              <p className="text-xs text-slate-500">Select a chat to view messages</p>
            </div>
            <div className="space-y-1 p-3">
              {rooms.map((room) => {
                const RoomIcon = getRoomIcon(room);
                const roomColors = getRoomTypeColor(room.room_type);
                return (
                  <button
                    key={room.room_id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full text-left p-4 rounded-xl transition-colors flex items-start gap-3 ${
                      selectedRoom?.room_id === room.room_id
                        ? 'bg-primary-100 text-primary-800 font-semibold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${roomColors.gradient} flex items-center justify-center flex-shrink-0`}>
                      <RoomIcon className="w-5 h-5 text-white" />
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
                      const roomColors = getRoomTypeColor(selectedRoom.room_type);
                      return (
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${roomColors.gradient} flex items-center justify-center shadow-lg`}>
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
                      message="Start the conversation with the participants"
                    />
                  ) : (
                    messages.map((message) => {
                      // Determine if message is from admin (we'll need to check current user)
                      const isAdminMessage = false; // This would be determined by checking current user ID
                      return (
                        <div
                          key={message.message_id}
                          className={`flex ${isAdminMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md p-4 rounded-2xl shadow-sm ${
                              isAdminMessage
                                ? 'bg-primary-600 text-white rounded-br-none'
                                : 'bg-white text-slate-900 rounded-bl-none border border-slate-100'
                            }`}
                          >
                            <p className="text-sm">{message.message_text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isAdminMessage
                                  ? 'text-primary-200'
                                  : 'text-slate-500'
                              }`}
                            >
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

