interface ITableLoadingProps {
    rows?: number;
    columns?: number;
}

export function TableLoading({ rows = 5, columns = 5 }: ITableLoadingProps) {
    return (
        <div className="w-full mt-16">
            <div className="bg-white rounded-lg p-4 mb-2">
                <div className="flex gap-4">
                    {Array.from({ length: columns }).map((_, index) => (
                        <div
                            key={index}
                            className="h-6 bg-gray-200 rounded animate-pulse"
                            style={{ width: `${100 / columns}%` }}
                        />
                    ))}
                </div>
            </div>

            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="bg-white h-16 rounded-lg mb-2 flex items-center px-4"
                >
                    <div className="flex gap-4 w-full">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className="h-4 bg-gray-200 rounded animate-pulse"
                                style={{ 
                                    width: `${100 / columns}%`,
                                    animationDelay: `${rowIndex * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
} 