import { z } from 'zod';

// --- DATA MODELS ---

/**
 * Represents a single message in a chatroom.
 */
export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    image: string | null; // Base64 or URL string for the image
}

/**
 * Represents a single chatroom with its title and messages.
 */
export interface Chatroom {
    id: string;
    title: string;
    messages: Message[];
}

/**
 * Represents the structure for a country's dialing code.
 */
export interface Country {
    name: string;
    code: string;
}

// --- FORM VALIDATION ---

/**
 * Zod schema for OTP form validation.
 */
export const OTPSchema = z.object({
    countryCode: z.string().min(1, "Country is required"),
    phone: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
});

/**
 * Inferred type from the OTPSchema for form data.
 */
export type OTPFormData = z.infer<typeof OTPSchema>;

// --- STORE STATES ---

/**
 * Defines the shape of the authentication store's state.
 */
export interface AuthState {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

/**
 * Defines the shape of the chat store's state and its actions.
 */
export interface ChatState {
    chatrooms: Chatroom[];
    createChatroom: () => string;
    deleteChatroom: (id: string) => void;
    addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    getChatById: (id: string) => Chatroom | undefined;
    updateChatTitle: (chatId: string, newTitle: string) => void;
}
