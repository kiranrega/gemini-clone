// Single Message Component
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from 'react-hot-toast';
import { Message } from "@/lib/types";
import Image from "next/image";

interface MessageComponentProps {
  message: Message;
}

const MessageComponent = ({ message }: MessageComponentProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-end gap-2 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isUser ? 'bg-indigo-500' : 'bg-green-500'}`}>
        {isUser ? 'U' : 'G'}
      </div>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${isUser ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'}`}>
        {message.image && <Image src={message.image} alt="Uploaded content" className="rounded-md mb-2 max-h-60"/>}
        <p className="text-sm break-words">{message.text}</p>
        <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.timestamp).toLocaleTimeString()}</p>
      </div>
      <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500 dark:text-gray-400" />}
      </button>
    </div>
  );
};

export default MessageComponent