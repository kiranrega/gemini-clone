import { useChatStore } from "@/store/chatStore";
import { MessageSquare, Paperclip, Send, Trash2, ArrowLeft, X } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import MessageComponent from "./Message";
import MessageSkeleton from "./ui/Skeleton";
import { Message } from "@/lib/types";
import { toast } from "react-hot-toast";
import TypingIndicator from "./TypingIndicator";

// Chatroom Page Component
const ChatroomPage = ({ chatId }: { chatId: string }) => {
    const chatroom = useChatStore(state => state.getChatById(chatId));
    const addMessage = useChatStore(state => state.addMessage);
    const deleteChatroom = useChatStore(state => state.deleteChatroom);
    const updateChatTitle = useChatStore(state => state.updateChatTitle);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, reset, watch } = useForm<{ text: string }>();
    const messageText = watch("text", "");

    // Simulate initial loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [chatId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatroom?.messages.length]);
    
    const handleSendMessage = (data: { text: string }) => {
        if (!data.text.trim() && !imagePreview) return;

        const userMessage: Message = {
            id: Date.now(),
            text: data.text,
            sender: 'user' as const,
            timestamp: new Date().toISOString(),
            image: imagePreview,
        };
        addMessage(chatId, userMessage);
        reset();
        setImagePreview(null);
        setIsAiTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                text: `This is a simulated AI response to: "${data.text}". I am just a demo, but I can pretend to be helpful!`,
                sender: 'ai' as const,
                timestamp: new Date().toISOString(),
                image: null,
            };
            addMessage(chatId, aiResponse);
            setIsAiTyping(false);
            
            // Update chat title if it's the first message
            if (chatroom && chatroom.messages.length === 1 && chatroom.title === "New Chat") {
                const newTitle = data.text.substring(0, 30) + (data.text.length > 30 ? '...' : '');
                updateChatTitle(chatId, newTitle);
            }

        }, 2500);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current?.scrollTop === 0) {
            // Simulate fetching older messages
            toast('Loading older messages...');
            setTimeout(() => {
                setPage(prev => prev + 1);
            }, 1500);
        }
    };

    const handleDelete = () => {
        deleteChatroom(chatId);
        window.location.hash = '#dashboard';
    };

    const messagesToShow = useMemo(() => {
        return chatroom?.messages.slice(-20 * page).reverse() || [];
    }, [chatroom, page]);

    if (!chatroom) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <MessageSquare size={48} className="text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold">Select a chat to start</h2>
                <p className="text-gray-500 dark:text-gray-400">Or create a new one from the sidebar.</p>
            </div>
        );
    }
    
    return (
        <>
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <a href="#dashboard" className="md:hidden p-1 -ml-2"><ArrowLeft size={20}/></a>
                        <h2 className="font-semibold text-lg">{chatroom.title}</h2>
                    </div>
                    <button onClick={() => setIsConfirmingDelete(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Trash2 size={20} className="text-red-500" />
                    </button>
                </header>

                <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
                    <div className="space-y-4">
                        <div ref={messagesEndRef} />
                        {isAiTyping && <TypingIndicator />}
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <MessageSkeleton key={i} />)
                        ) : (
                            messagesToShow.map(msg => <MessageComponent key={msg.id} message={msg} />)
                        )}
                        {chatroom.messages.length > 20 * page && <div className="text-center text-sm text-gray-500">Scroll up to load more</div>}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {imagePreview && (
                        <div className="relative w-24 h-24 mb-2">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                            <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit(handleSendMessage)} className="flex items-center gap-2">
                        <input {...register("text")} type="text" placeholder="Type a message..." disabled={isAiTyping} className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600" />
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Attach image">
                            <Paperclip size={20} />
                        </button>
                        <button type="submit" disabled={isAiTyping || (!messageText.trim() && !imagePreview)} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400" aria-label="Send message">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
            {isConfirmingDelete && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-lg font-bold">Delete Chatroom?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Are you sure you want to delete "{chatroom.title}"? This action cannot be undone.</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsConfirmingDelete(false)} className="px-4 py-2 rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatroomPage