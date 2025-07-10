import { ITransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";
import { useState } from "react";
import { ConfirmModal } from "../ConfirmModal";
import { LoadingSpinner } from "../LoadingSpinner";

export interface ITableProps {
    data?: ITransaction[]
    onDeleteTransaction?: (id: string) => void;
    onEditTransaction?: (transaction: ITransaction) => void;
    isDeleting?: boolean;
    isUpdating?: boolean;
    deletingId?: string | null;
    updatingId?: string | null;
}

export function Table({data = [], onDeleteTransaction, onEditTransaction, isDeleting = false, isUpdating = false, deletingId, updatingId}: ITableProps) {   
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        transactionId: string | null;
        transactionTitle: string;
    }>({
        isOpen: false,
        transactionId: null,
        transactionTitle: '',
    });

    const handleDeleteClick = (transaction: ITransaction) => {
        setDeleteModal({
            isOpen: true,
            transactionId: transaction.id || '',
            transactionTitle: transaction.title,
        });
    };

    const handleEditClick = (transaction: ITransaction) => {
        if (onEditTransaction) {
            onEditTransaction(transaction);
        }
    };

    const handleConfirmDelete = () => {
        if (deleteModal.transactionId && onDeleteTransaction) {
            onDeleteTransaction(deleteModal.transactionId);
        }
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            transactionId: null,
            transactionTitle: '',
        });
    };

    return (  
        <>     
        <table className="w-full mt-16 border-0 border-separate border-spacing-y-2 ">
        <thead>
            <tr>
                <th className="px-4 text-left text-table-header text-base font-medium">Título</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Preço</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Categoria</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Data</th>
                <th className="px-4 text-center text-table-header text-base font-medium">Ações</th>                                   
            </tr>
        </thead>
        <tbody>
            {data?.map((transaction, index) => {
                const isDeletingThis = deletingId === transaction.id;
                const isUpdatingThis = updatingId === transaction.id;
                const isLoadingThis = isDeletingThis || isUpdatingThis;
                
                return (
                    <tr key={transaction.id || index} className={`bg-white h-16 rounded-lg ${isLoadingThis ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-4 whitespace-nowrap text-title">{transaction.title}</td>
                        <td className={`px-4 py-4 whitespace-nowrap text-right ${transaction.type === 'INCOME'? "text-income" : "text-outcome"}`}>{formatCurrency(transaction.price)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.category}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.data ? formatDate(new Date(transaction.data)) : ''}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-2">
                                {isLoadingThis ? (
                                    <LoadingSpinner size="sm" className={isDeletingThis ? "text-red-600" : "text-blue-600"} />
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(transaction)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                                            title="Editar transação"
                                            disabled={isDeleting || isUpdating}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(transaction)}
                                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                            title="Excluir transação"
                                            disabled={isDeleting || isUpdating}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>                             
                    </tr>
                );
            })}
        </tbody>
    </table>

    <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a transação "${deleteModal.transactionTitle}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
    />
    </> 
    )
}