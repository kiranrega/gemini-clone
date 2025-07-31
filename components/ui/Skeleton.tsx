const MessageSkeleton = () => (
  <div className="flex items-start space-x-3 my-4 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export default MessageSkeleton