import { Chatroom, ChatState, Message } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const generateInitialChatrooms = (): Chatroom[] => {
    const chatrooms: Chatroom[] = [
        { id: 'chat1', title: 'Welcome to Gemini Clone!', messages: [] },
        { id: 'chat2', title: 'Project Ideas Brainstorm', messages: [] },
        { id: 'chat3', title: 'Vacation Planning 🌴', messages: [] },
    ];

    const welcomeMessage: Message = { id: Date.now(), text: "Hello! I'm a Gemini clone. Ask me anything or start a new chat.", sender: 'ai', timestamp: new Date().toISOString(), image: null };
    chatrooms[0].messages.push(welcomeMessage);
    
    for(let i = 0; i < 30; i++) {
      chatrooms[1].messages.push({ id: Date.now() - i*100000, text: `This is an older message #${i+1} for reverse scroll testing.`, sender: i % 2 === 0 ? 'user' : 'ai', timestamp: new Date(Date.now() - i*100000).toISOString(), image: null });
    }

    return chatrooms;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: generateInitialChatrooms(),
      
      createChatroom: () => {
        const newChatroom: Chatroom = {
          id: `chat${Date.now()}`,
          title: 'New Chat',
          messages: [],
        };
        set((state) => ({ chatrooms: [newChatroom, ...state.chatrooms] }));
        toast.success("Chatroom created!");
        return newChatroom.id;
      },

      deleteChatroom: (id: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((c) => c.id !== id),
        }));
        toast.error("Chatroom deleted.");
      },

      addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => {
        const newMessage: Message = {
          ...message,
          id: Date.now(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          chatrooms: state.chatrooms.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, newMessage] } : c
          ),
        }));
      },
      
      getChatById: (id: string) => {
        return get().chatrooms.find(c => c.id === id);
      },

      updateChatTitle: (chatId: string, newTitle: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.map((c) =>
            c.id === chatId ? { ...c, title: newTitle } : c
          ),
        }));
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);