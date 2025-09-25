import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChatSocket } from '@/hooks/useChatSocket';
import { ChatAPI } from '@/services/chatApi';
import { useAuthStore } from '@/stores/authStore';
import { Calendar, Check } from 'lucide-react';

const ChatComponent = ({ isOpen, talent, currentUserId, onClose, onMeetingScheduledProp }) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [userTyping, setUserTyping] = useState('');
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: '',
    startTime: '',
    duration: '60',
    description: ''
  });
  const [connectionError, setConnectionError] = useState(null);

  // Refs
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Custom hooks
  const { 
    isConnected: isSocketConnected, 
    connect, 
    disconnect, 
    joinChat, 
    leaveChat,
    sendMessage: socketSendMessage,
    scheduleMeeting: socketScheduleMeeting,
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
  } = useChatSocket();

  const authStore = useAuthStore();

  // Utility functions
  const getInitials = useCallback((name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'recently';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const formatMeetingDate = useCallback((dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const formatMeetingTime = useCallback((startTime, endTime) => {
    if (!startTime) return '';
    const start = new Date(startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const end = endTime ? new Date(endTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }) : '';
    
    return end ? `${start} - ${end}` : start;
  }, []);

  const getTodayDate = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // Core functions
  const loadChatHistory = useCallback(async () => {
    if (!talent?.id) return;
    
    try {
      setLoading(true);
      const response = await ChatAPI.getChatHistory(talent.id);
      
      if (response.success) {
        setMessages(response.data.messages || []);
        setCurrentChatId(response.data.chatId);
        
        // Join the chat room via socket with both chatId and talentId
        if (response.data.chatId) {
          joinChat(response.data.chatId, talent.id);
        } else {
          // If no chatId, join with just talentId to create new chat
          joinChat(null, talent.id);
        }
        
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  }, [talent?.id, joinChat, scrollToBottom]);

  const sendMessageHandler = useCallback(async () => {
    if (!newMessage.trim() || sending || !talent?.id) return;
    
    try {
      setSending(true);
      
      // Create optimistic message for immediate UI feedback
      const optimisticMessage = {
        messageId: `temp-${Date.now()}`,
        sender: { _id: currentUserId },
        receiver: { _id: talent.id },
        message: newMessage.trim(),
        messageType: 'text',
        timestamp: new Date().toISOString(),
        isRead: false,
        isOptimistic: true // Flag to identify optimistic messages
      };
      
      // Add message to UI immediately
      setMessages(prev => [...prev, optimisticMessage]);
      const messageToSend = newMessage.trim();
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
      
      // Always use API since socket is unreliable
      const apiResponse = await ChatAPI.sendMessage(talent.id, messageToSend);
      
      if (apiResponse.success) {
        // Replace optimistic message with real message from API
        setMessages(prev => prev.map(msg => 
          msg.messageId === optimisticMessage.messageId 
            ? { ...apiResponse.data, isOptimistic: false }
            : msg
        ));
      } else {
        // Remove optimistic message on API failure
        setMessages(prev => prev.filter(msg => msg.messageId !== optimisticMessage.messageId));
        console.error('Failed to send message:', apiResponse.error);
        // Show error to user
        setConnectionError('Failed to send message. Please try again.');
        setTimeout(() => setConnectionError(null), 3000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.messageId === `temp-${Date.now()}`));
      setConnectionError('Failed to send message. Please try again.');
      setTimeout(() => setConnectionError(null), 3000);
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, talent?.id, currentUserId, scrollToBottom]);

  const scheduleMeetingHandler = useCallback(async () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.startTime) {
      return;
    }
    
    try {
      setSchedulingMeeting(true);
      
      // Calculate end time
      const startDateTime = new Date(`${meetingForm.date}T${meetingForm.startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + (parseInt(meetingForm.duration) * 60000));
      
      const meetingDetails = {
        title: meetingForm.title,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        description: meetingForm.description,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      // Send via socket for real-time delivery
      const socketSent = socketScheduleMeeting(
        currentChatId,
        talent.id,
        meetingDetails
      );
      
      if (!socketSent) {
        // Fallback to API
        await ChatAPI.scheduleMeeting(talent.id, meetingDetails);
      }
      
      onMeetingScheduledProp?.({
        talent: talent,
        date: meetingForm.date,
        time: meetingForm.startTime,
        details: meetingDetails
      });
      
      closeMeetingModal();
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      setSchedulingMeeting(false);
    }
  }, [meetingForm, currentChatId, talent, socketScheduleMeeting, onMeetingScheduledProp]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageHandler();
    }
  }, [sendMessageHandler]);

  const handleTyping = useCallback(() => {
    if (currentChatId) {
      startTyping(currentChatId);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Capture the chatId at this moment to avoid null reference in timeout
      const chatId = currentChatId;
      
      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (chatId) {
          stopTyping(chatId);
        }
      }, 3000);
    }
  }, [currentChatId, startTyping, stopTyping]);

  const handleOverlayClick = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const closeMeetingModal = useCallback(() => {
    setShowMeetingModal(false);
    setMeetingForm({
      title: '',
      date: '',
      startTime: '',
      duration: '60',
      description: ''
    });
  }, []);

  const updateMeetingForm = useCallback((field, value) => {
    setMeetingForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Socket event handlers setup
  const setupSocketListeners = useCallback(() => {
    onNewMessage((data) => {
      setMessages(prev => [...prev, {
        messageId: data.messageId,
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        messageType: data.messageType,
        timestamp: data.timestamp,
        isRead: data.isRead
      }]);
      
      setTimeout(scrollToBottom, 100);
    });

    // Use the socket event handler with original name
    onMeetingScheduled((data) => {
      setMessages(prev => [...prev, {
        messageId: data.messageId,
        sender: data.sender,
        message: `Meeting scheduled: ${data.meetingDetails.title}`,
        messageType: 'meeting',
        meetingDetails: data.meetingDetails,
        timestamp: data.timestamp,
        isRead: false
      }]);
      
      setTimeout(scrollToBottom, 100);
      
      // Call the prop callback with renamed prop
      onMeetingScheduledProp?.({
        talent: talent,
        meetingDetails: data.meetingDetails
      });
    });

    onChatJoined((data) => {
      console.log('Chat joined:', data.chatId);
      setCurrentChatId(data.chatId);
    });

    onUserTyping((data) => {
      if (data.userId !== currentUserId) {
        setUserTyping(data.userName);
        
        // Clear typing indicator after 5 seconds
        setTimeout(() => {
          setUserTyping('');
        }, 5000);
      }
    });

    onUserStoppedTyping((data) => {
      if (data.userId !== currentUserId) {
        setUserTyping('');
      }
    });

    onError((error) => {
      console.error('Socket error:', error);
    });
  }, [onNewMessage, onMeetingScheduled, onChatJoined, onUserTyping, onUserStoppedTyping, onError, currentUserId, scrollToBottom, onMeetingScheduledProp]);

  // Effects
  useEffect(() => {
    if (isOpen && talent?.id) {
      connect();
      setupSocketListeners();
      loadChatHistory();
    } else {
      if (currentChatId) {
        leaveChat(currentChatId);
      }
      removeAllListeners();
      disconnect();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isOpen, talent?.id, connect, setupSocketListeners, loadChatHistory, currentChatId, leaveChat, removeAllListeners, disconnect]);

  useEffect(() => {
    if (talent?.id && isOpen) {
      setMessages([]);
      loadChatHistory();
    }
  }, [talent?.id, isOpen, loadChatHistory]);

  useEffect(() => {
    if (isOpen && currentChatId) {
      markMessagesAsRead(currentChatId);
    }
  }, [isOpen, currentChatId, markMessagesAsRead]);

  if (!isOpen) return null;

  return (
    <div className="chat-overlay" onClick={handleOverlayClick}>
      <div className="chat-container" onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="talent-info">
            <div className="talent-avatar">
              {talent?.profileImage ? (
                <img 
                  src={talent.profileImage} 
                  alt={talent.name}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(talent?.name)}
                </div>
              )}
              <div className={`status-indicator ${isUserOnline ? 'online' : ''}`}></div>
            </div>
            <div className="talent-details">
              <h3 className="talent-name">{talent?.name || 'Unknown User'}</h3>
              <p className="talent-status">
                {isUserOnline ? 'Online' : `Last seen ${formatLastSeen(lastSeen)}`}
              </p>
              {userTyping && (
                <p className="typing-indicator">
                  {userTyping} is typing...
                </p>
              )}
            </div>
          </div>
          
          <div className="chat-actions">
            <button 
              onClick={() => setShowMeetingModal(true)} 
              className="action-btn meeting-btn"
              title="Schedule Meeting"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <button onClick={onClose} className="action-btn close-btn" title="Close Chat">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connection Status - Update to show API fallback */}
        {(!isSocketConnected || connectionError) && (
          <div className="connection-warning">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>
              {connectionError || 'Using API mode - real-time features limited'}
            </span>
          </div>
        )}

        {/* Messages Area */}
        <div ref={messagesContainerRef} className="messages-container">
          {loading ? (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <span>Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-chat">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3>Start the conversation</h3>
              <p>Send a message to {talent?.name} to begin chatting</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message, index) => {
                // Safe property access with fallbacks
                const senderId = message?.sender?._id || message?.senderId || '';
                const isOwnMessage = senderId === currentUserId;
                const messageText = message?.message || '';
                const messageType = message?.messageType || 'text';
                const timestamp = message?.timestamp || new Date().toISOString();
                
                return (
                  <div 
                    key={message?.messageId || message?._id || `msg-${index}`}
                    className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}
                  >
                    {messageType === 'meeting' && (
                      <div className="meeting-message">
                        <div className="meeting-icon">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="meeting-content">
                          <p className="meeting-title">{message?.meetingDetails?.title || 'Meeting'}</p>
                          <p className="meeting-time">
                            {message?.meetingDetails?.startTime ? 
                              new Date(message.meetingDetails.startTime).toLocaleString() : 
                              'Time TBD'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {messageType === 'text' && (
                      <div className="message-bubble">
                        <div className="message-content">
                          <p className="message-text">{messageText}</p>
                          <div className="message-meta">
                            <span className="message-time">{formatTime(timestamp)}</span>
                            {isOwnMessage && message?.isRead && (
                              <Check className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <div className="input-wrapper">
            <textarea
              ref={messageInputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (currentChatId) {
                  stopTyping(currentChatId);
                }
              }}
              placeholder="Type your message..."
              className="message-input"
              rows="1"
              disabled={!isSocketConnected}
            />
            
            <button 
              onClick={sendMessageHandler}
              disabled={!newMessage.trim() || !isSocketConnected || sending}
              className="send-button"
            >
              {sending ? (
                <div className="loading-spinner small"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Scheduling Modal */}
      {showMeetingModal && (
        <div className="meeting-modal-overlay" onClick={closeMeetingModal}>
          <div className="meeting-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Schedule Meeting with {talent?.name}</h3>
              <button onClick={closeMeetingModal} className="modal-close-btn">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); scheduleMeetingHandler(); }} className="meeting-form">
              <div className="form-group">
                <label className="form-label">Meeting Title *</label>
                <input 
                  value={meetingForm.title}
                  onChange={(e) => updateMeetingForm('title', e.target.value)}
                  type="text" 
                  className="form-input"
                  placeholder="e.g., Technical Interview, Project Discussion"
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input 
                    value={meetingForm.date}
                    onChange={(e) => updateMeetingForm('date', e.target.value)}
                    type="date" 
                    className="form-input"
                    min={getTodayDate()}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input 
                    value={meetingForm.startTime}
                    onChange={(e) => updateMeetingForm('startTime', e.target.value)}
                    type="time" 
                    className="form-input"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Duration *</label>
                  <select 
                    value={meetingForm.duration}
                    onChange={(e) => updateMeetingForm('duration', e.target.value)}
                    className="form-input" 
                    required
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  value={meetingForm.description}
                  onChange={(e) => updateMeetingForm('description', e.target.value)}
                  className="form-input"
                  rows="3"
                  placeholder="Add meeting agenda, topics to discuss, or any other details..."
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={closeMeetingModal} className="cancel-btn">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="schedule-btn"
                  disabled={schedulingMeeting}
                >
                  {schedulingMeeting ? (
                    <div className="loading-spinner small"></div>
                  ) : (
                    <span>Schedule Meeting</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          backdrop-filter: blur(8px);
          padding: 1rem;
        }

        .chat-container {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 1.5rem;
          width: 100%;
          max-width: 42rem;
          height: 90vh;
          max-height: 48rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
        }

        .talent-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .talent-avatar {
          position: relative;
          width: 3rem;
          height: 3rem;
          flex-shrink: 0;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1rem;
          border: 2px solid rgba(59, 130, 246, 0.2);
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.75rem;
          height: 0.75rem;
          background: #9ca3af;
          border: 2px solid white;
          border-radius: 50%;
        }

        .status-indicator.online {
          background: #10b981;
        }

        .talent-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .talent-status {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .typing-indicator {
          font-size: 0.75rem;
          color: #3b82f6;
          font-style: italic;
          margin: 0;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .meeting-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
        }

        .meeting-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .close-btn {
          background: rgba(148, 163, 184, 0.1);
          color: #64748b;
        }

        .close-btn:hover {
          background: rgba(148, 163, 184, 0.2);
          color: #475569;
        }

        .connection-warning {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #92400e;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          margin: 0 1.5rem;
          border-radius: 0.5rem;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          background: rgba(248, 250, 252, 0.3);
        }

        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 1rem;
          color: #64748b;
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-spinner.small {
          width: 1rem;
          height: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          text-align: center;
          color: #64748b;
        }

        .empty-chat h3 {
          margin: 1rem 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .empty-chat p {
          margin: 0;
          font-size: 0.875rem;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-item {
          display: flex;
          flex-direction: column;
        }

        .message-item.own-message {
          align-items: flex-end;
        }

        .message-item.other-message {
          align-items: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          position: relative;
        }

        .own-message .message-bubble {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
        }

        .other-message .message-bubble {
          background: white;
          border: 1px solid #e2e8f0;
          color: #1e293b;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .message-text {
          margin: 0;
          line-height: 1.4;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .meeting-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 0.75rem;
          max-width: 80%;
        }

        .meeting-icon {
          padding: 0.5rem;
          background: #3b82f6;
          color: white;
          border-radius: 0.5rem;
        }

        .meeting-content {
          flex: 1;
        }

        .meeting-title {
          margin: 0 0 0.25rem 0;
          font-weight: 600;
          color: #1e293b;
        }

        .meeting-time {
          margin: 0;
          font-size: 0.875rem;
          color: #64748b;
        }

        .message-input-container {
          padding: 1.5rem;
          border-top: 1px solid rgba(148, 163, 184, 0.3);
          background: rgba(255, 255, 255, 0.9);
        }

        .input-wrapper {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          resize: none;
          font-family: inherit;
          font-size: 0.875rem;
          line-height: 1.4;
          max-height: 120px;
          background: white;
        }

        .message-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .send-button {
          padding: 0.75rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .meeting-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 60;
          backdrop-filter: blur(8px);
          padding: 1rem;
        }

        .meeting-modal {
          background: white;
          border-radius: 1rem;
          width: 100%;
          max-width: 28rem;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .modal-close-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: colors 0.2s;
        }

        .modal-close-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .cancel-btn {
          padding: 0.75rem 1.5rem;
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .schedule-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .schedule-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .schedule-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 640px) {
          .chat-container {
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ChatComponent
