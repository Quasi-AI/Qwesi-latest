import { useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

export const useChatSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);
  const authStore = useAuthStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const token = auth?.token;
    
    if (!token) {
      console.error('No authentication token found');
      setConnectionError('No authentication token found');
      return;
    }

    console.log('🔌 Attempting to connect socket with token:', token ? 'Present' : 'Missing');

    const socketUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com";

    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['polling', 'websocket'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current?.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        setTimeout(() => {
          socketRef.current?.connect();
        }, 1000);
      }
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setConnectionError(null);
    }
  }, []);

  const joinChat = useCallback((chatId, talentId) => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    if (!chatId && !talentId) {
      console.error('Either chatId or talentId is required');
      return false;
    }

    const data = {};
    if (chatId) data.chatId = chatId;
    if (talentId) data.talentId = talentId;

    socketRef.current.emit('join_chat', data);
    return true;
  }, []);

  const leaveChat = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId?.trim()) return false;
    
    socketRef.current.emit('leave_chat', { chatId });
    return true;
  }, []);

  const sendMessage = useCallback((chatId, message, receiverId, messageType = 'text') => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    if (!chatId?.trim() || !message?.trim() || !receiverId?.trim()) {
      console.error('Missing required parameters for sending message');
      return false;
    }

    const data = {
      chatId: chatId.trim(),
      message: message.trim(),
      receiverId: receiverId.trim(),
      messageType
    };

    socketRef.current.emit('send_message', data);
    return true;
  }, []);

  const scheduleMeeting = useCallback((chatId, receiverId, meetingDetails) => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    if (!chatId?.trim() || !receiverId?.trim() || !meetingDetails) {
      console.error('Missing required parameters for scheduling meeting');
      return false;
    }

    const data = {
      chatId: chatId.trim(),
      receiverId: receiverId.trim(),
      meetingDetails
    };

    socketRef.current.emit('schedule_meeting', data);
    return true;
  }, []);

  const markMessagesAsRead = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId?.trim()) return false;
    
    socketRef.current.emit('mark_messages_read', { chatId: chatId.trim() });
    return true;
  }, []);

  const startTyping = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId || typeof chatId !== 'string' || !chatId.trim()) return false;
    
    socketRef.current.emit('typing_start', { chatId: chatId.trim() });
    return true;
  }, []);

  const stopTyping = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId || typeof chatId !== 'string' || !chatId.trim()) return false;
    
    socketRef.current.emit('typing_stop', { chatId: chatId.trim() });
    return true;
  }, []);

  // Event listeners
  const onNewMessage = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('new_message', callback);
  }, []);

  const onMeetingScheduled = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('meeting_scheduled', callback);
  }, []);

  const onChatJoined = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('chat_joined', callback);
  }, []);

  const onUserTyping = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('user_typing', callback);
  }, []);

  const onUserStoppedTyping = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('user_stopped_typing', callback);
  }, []);

  const onError = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('error', callback);
  }, []);

  const removeAllListeners = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.removeAllListeners();
  }, []);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    scheduleMeeting,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    onNewMessage,
    onMeetingScheduled,
    onChatJoined,
    onUserTyping,
    onUserStoppedTyping,
    onError,
    removeAllListeners
  };
};

