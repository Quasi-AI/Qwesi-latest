import { API_ROUTES } from '@/lib/apiRoutes';
import { authFetch } from '@/lib/auth';

export class ChatAPI {
  static async getChatHistory(talentId) {
    try {
      const response = await authFetch(`${API_ROUTES.BASE_URL}api/chat/history/${talentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: {
          chatId: data.chatId,
          messages: data.messages || []
        }
      };
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async sendMessage(receiverId, message, messageType = 'text') {
    try {
      const response = await authFetch(`${API_ROUTES.BASE_URL}api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverId,
          message,
          messageType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async scheduleMeeting(receiverId, meetingDetails) {
    try {
      const response = await authFetch(`${API_ROUTES.BASE_URL}api/chat/schedule-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverId,
          meetingDetails
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getChatList() {
    try {
      const response = await authFetch(`${API_ROUTES.BASE_URL}api/chat/list`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.chats || []
      };
    } catch (error) {
      console.error('Failed to get chat list:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}