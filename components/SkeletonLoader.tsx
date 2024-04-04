// components/SkeletonLoader.tsx

const SkeletonLoader = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-300 h-48 w-full rounded-lg"></div>
            <div className="mt-4 h-6 bg-gray-300 rounded"></div>
            <div className="mt-2 h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
    );
};

export default SkeletonLoader;
