import { useState, useCallback, useMemo, useEffect } from 'react';

interface UsePaginationProps {
    initialPage?: number;
    initialItemsPerPage?: number;
    totalItems?: number;
}

interface UsePaginationReturn {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    skip: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    setTotalItems: (total: number) => void;
}

export function usePagination({
    initialPage = 1,
    initialItemsPerPage = 10,
    totalItems = 0
}: UsePaginationProps = {}): UsePaginationReturn {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    const [total, setTotal] = useState(totalItems);

    const totalPages = useMemo(() => {
        const calculated = Math.ceil(total / itemsPerPage);
        return Math.max(1, calculated);
    }, [total, itemsPerPage]);

    const skip = useMemo(() => {
        return (currentPage - 1) * itemsPerPage;
    }, [currentPage, itemsPerPage]);

    const onPageChange = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    const onItemsPerPageChange = useCallback((newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    }, []);

    const goToFirstPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const goToLastPage = useCallback(() => {
        setCurrentPage(totalPages);
    }, [totalPages]);

    const canGoNext = useMemo(() => {
        return currentPage < totalPages;
    }, [currentPage, totalPages]);

    const canGoPrevious = useMemo(() => {
        return currentPage > 1;
    }, [currentPage]);

    const setTotalItems = useCallback((newTotal: number) => {
        setTotal(newTotal);
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        skip,
        onPageChange,
        onItemsPerPageChange,
        goToFirstPage,
        goToLastPage,
        canGoNext,
        canGoPrevious,
        setTotalItems,
    };
} 