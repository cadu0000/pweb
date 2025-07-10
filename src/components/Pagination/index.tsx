interface IPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    isLoading?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    isLoading = false
}: IPaginationProps) {
    const safeTotalItems = totalItems || 0;
    const safeCurrentPage = currentPage || 1;
    const safeItemsPerPage = itemsPerPage || 10;
    
    const startItem = safeTotalItems > 0 ? (safeCurrentPage - 1) * safeItemsPerPage + 1 : 0;
    const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (safeCurrentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (safeCurrentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = safeCurrentPage - 1; i <= safeCurrentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number' && page !== safeCurrentPage && !isLoading) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4">
            <div className="text-sm text-gray-600">
                {safeTotalItems > 0 
                    ? `${safeTotalItems} transaç${safeTotalItems !== 1 ? 'ões' : 'ão'}`
                    : 'Nenhuma transação encontrada'
                }
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageClick(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1 || isLoading}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(page)}
                            disabled={page === '...' || isLoading}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                page === safeCurrentPage
                                    ? 'bg-blue-600 text-white'
                                    : page === '...'
                                    ? 'text-gray-400 cursor-default'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => handlePageClick(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages || isLoading}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Próximo
                </button>
            </div>

            {onItemsPerPageChange && (
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Itens por página:</label>
                    <select
                        value={safeItemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        disabled={isLoading}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white disabled:opacity-50"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            )}
        </div>
    );
} 