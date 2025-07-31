// Typing Indicator Component
const TypingIndicator = () => (
    <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-green-500">G</div>
        <div className="max-w-xs p-3 rounded-lg bg-gray-200 dark:bg-gray-700 rounded-bl-none">
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);
export default TypingIndicator;