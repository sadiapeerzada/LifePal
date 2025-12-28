import { ChatMessage, ChatSession } from '../types';

const MAX_HISTORY_MESSAGES = 50;
const SESSION_KEY_PREFIX = 'lp_chat_session_';

export const historyService = {
  /**
   * Saves a message to a session in localStorage (Mocking DBMS)
   */
  async saveMessage(sessionId: string, message: ChatMessage): Promise<void> {
    const key = SESSION_KEY_PREFIX + sessionId;
    const sessionStr = localStorage.getItem(key);
    let session: ChatSession = sessionStr 
      ? JSON.parse(sessionStr) 
      : { sessionId, messages: [], updatedAt: Date.now() };

    session.messages.push(message);
    
    // Auto-cleanup: Keep only recent messages to prevent data overloading
    if (session.messages.length > MAX_HISTORY_MESSAGES) {
      session.messages = session.messages.slice(-MAX_HISTORY_MESSAGES);
    }

    session.updatedAt = Date.now();
    localStorage.setItem(key, JSON.stringify(session));
  },

  /**
   * Retrieves messages with pagination
   */
  async getMessages(sessionId: string, page = 1, pageSize = 10): Promise<ChatMessage[]> {
    const key = SESSION_KEY_PREFIX + sessionId;
    const sessionStr = localStorage.getItem(key);
    if (!sessionStr) return [];

    const session: ChatSession = JSON.parse(sessionStr);
    const start = Math.max(0, session.messages.length - (page * pageSize));
    const end = session.messages.length - ((page - 1) * pageSize);
    
    return session.messages.slice(start, end).reverse();
  },

  /**
   * Deletes old sessions (Housekeeping)
   */
  async cleanupOldSessions(expiryDays = 7): Promise<void> {
    const now = Date.now();
    const expiryMs = expiryDays * 24 * 60 * 60 * 1000;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(SESSION_KEY_PREFIX)) {
        const session: ChatSession = JSON.parse(localStorage.getItem(key)!);
        if (now - session.updatedAt > expiryMs) {
          localStorage.removeItem(key);
        }
      }
    }
  }
};