import { ChatbotState, ChatbotAction, Message } from '../types/chatbot';

export const initialChatbotState: ChatbotState = {
  messages: [],
  isTyping: false,
  isImageUploading: false,
  error: null,
  suggestions: [],
  usedSuggestions: new Set(),
  conversationHistory: []
};

export function chatbotReducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      const newMessage = action.payload;
      const updatedMessages = [...state.messages, newMessage];
      
      // Update conversation history for context
      let updatedHistory = [...state.conversationHistory];
      
      if (newMessage.sender === 'bot' && state.messages.length > 0) {
        const lastUserMessage = [...state.messages].reverse().find(m => m.sender === 'user');
        if (lastUserMessage) {
          updatedHistory.push({
            userMessage: lastUserMessage.text,
            botResponse: newMessage.text,
            timestamp: new Date(),
            hasImage: lastUserMessage.hasImage
          });
          
          // Keep only last 7 conversation turns for context
          if (updatedHistory.length > 7) {
            updatedHistory = updatedHistory.slice(-7);
          }
        }
      }
      
      return {
        ...state,
        messages: updatedMessages,
        conversationHistory: updatedHistory,
        error: null
      };
      
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
      
    case 'SET_IMAGE_UPLOADING':
      return {
        ...state,
        isImageUploading: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isTyping: false,
        isImageUploading: false
      };
      
    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload
      };
      
    case 'ADD_USED_SUGGESTION':
      const newUsedSuggestions = new Set(state.usedSuggestions);
      newUsedSuggestions.add(action.payload);
      return {
        ...state,
        usedSuggestions: newUsedSuggestions
      };
      
    case 'UPDATE_MESSAGE_STATUS':
      const updatedMessagesWithStatus = state.messages.map(message =>
        message.id === action.payload.id
          ? { ...message, status: action.payload.status }
          : message
      );
      return {
        ...state,
        messages: updatedMessagesWithStatus
      };
      
    case 'CLEAR_CONVERSATION':
      return {
        ...initialChatbotState,
        // Keep initial welcome message
        messages: state.messages.length > 0 ? [state.messages[0]] : []
      };
      
    default:
      return state;
  }
}
