"use client";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { LogOut, MessageSquare, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
    const logout = useAuthStore((state) => state.logout);
    const createChatroom = useChatStore((state) => state.createChatroom);
    const chatrooms = useChatStore((state) => state.chatrooms);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentChatId, setCurrentChatId] = useState("");

    const filteredChatrooms = useMemo(() => 
        chatrooms.filter(c => c.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
        [chatrooms, debouncedSearchTerm]
    );

    const handleNewChat = () => {
        const newChatId = createChatroom();
        window.location.hash = `#chat/${newChatId}`;
    };
    
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      };
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial check
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#chat/')) {
                setCurrentChatId(hash.split('/')[1]);
            } else {
                setCurrentChatId('');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial check

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <div className="h-screen w-screen flex bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <aside className={`absolute md:relative z-20 h-full bg-gray-100 dark:bg-gray-900 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-72 md:w-72`}>
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold">Gemini Clone</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 space-y-4 flex-1 flex flex-col">
                    <button onClick={handleNewChat} className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2">
                        <Plus size={16} /> New Chat
                    </button>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                        />
                    </div>
                    <nav className="flex-1 overflow-y-auto pr-2 -mr-2">
                        <ul className="space-y-1">
                            {filteredChatrooms.map(chat => (
                                <li key={chat.id}>
                                    <a href={`#chat/${chat.id}`} 
                                       className={`block p-2 rounded-md truncate ${currentChatId === chat.id ? 'bg-indigo-100 dark:bg-indigo-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                       onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                    >
                                        {chat.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <ThemeToggle />
                    <button onClick={logout} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col h-screen">
                <header className="md:hidden p-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2">
                        <MessageSquare size={20} />
                    </button>
                </header>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
