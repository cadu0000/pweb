"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { TableLoading } from "@/components/TableLoading";
import { Pagination } from "@/components/Pagination";
import { useTransaction } from "@/hooks/transactions";
import { usePagination } from "@/hooks/usePagination";
import { ITotal, ITransaction } from "@/types/transaction";
import { useMemo, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<ITransaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    skip,
    onPageChange,
    onItemsPerPageChange,
    setTotalItems,
  } = usePagination({
    initialPage: 1,
    initialItemsPerPage: 10,
  });

  const { 
    data: paginatedData, 
    isLoading,
    refetch 
  } = useTransaction.ListPaginated({ skip, take: itemsPerPage });

  useEffect(() => {
    if (paginatedData?.total !== undefined) {
      setTotalItems(paginatedData.total);
    }
  }, [paginatedData?.total, setTotalItems]);

  const { mutateAsync: addTransaction } = useTransaction.Create();
  const { mutateAsync: updateTransaction, isPending: isUpdating } = useTransaction.Update();
  const { mutateAsync: deleteTransaction, isPending: isDeleting } = useTransaction.Delete();
  
  const openModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddModal = (newTransaction: ITransaction) => {
    addTransaction(newTransaction);
  }

  const handleEditTransaction = (transaction: ITransaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  }

  const handleUpdateTransaction = async (id: string, transaction: Omit<ITransaction, 'id'>) => {
    try {
      setUpdatingId(id);
      await updateTransaction({ id, transaction });
      setIsEditModalOpen(false);
      setTransactionToEdit(null);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    } finally {
      setUpdatingId(null);
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteTransaction(id);
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    } finally {
      setDeletingId(null);
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTransactionToEdit(null);
  }

  const totalTransactions: ITotal = useMemo(() => {
    const transactions = paginatedData?.data || [];
    if (transactions.length === 0) {
      return { totalIncome: 0, totalOutcome: 0, total: 0 };
    }
  
    return transactions.reduce(
      (acc: ITotal, { type, price }: ITransaction) => {
        if (type === 'INCOME') {
          acc.totalIncome += price;
          acc.total += price;
        } else if (type === 'OUTCOME') {
          acc.totalOutcome += price;
          acc.total -= price;
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0, total: 0 }
    );
  }, [paginatedData?.data]);

  const { data: allTransactionsData } = useTransaction.ListAll();
  
  const totalTransactionsAll: ITotal = useMemo(() => {
    const transactions = allTransactionsData?.data || [];
    if (transactions.length === 0) {
      return { totalIncome: 0, totalOutcome: 0, total: 0 };
    }
  
    return transactions.reduce(
      (acc: ITotal, { type, price }: ITransaction) => {
        if (type === 'INCOME') {
          acc.totalIncome += price;
          acc.total += price;
        } else if (type === 'OUTCOME') {
          acc.totalOutcome += price;
          acc.total -= price;
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0, total: 0 }
    );
  }, [allTransactionsData?.data]);
  
  return (
    <div>
      <ToastContainer />
      <Header openModal={openModal} />
      <BodyContainer>
        <CardContainer totals={totalTransactionsAll} />
        
        {isLoading ? (
          <TableLoading rows={itemsPerPage} columns={5} />
        ) : (
          <Table 
            data={paginatedData?.data || []} 
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
            deletingId={deletingId}
            updatingId={updatingId}
          />
        )}

        {paginatedData && !isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            totalItems={paginatedData.total || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            isLoading={isLoading}
          />
        )}

        { isModalOpen && <FormModal closeModal={handleCloseModal} formTitle="Adicionar Transação" addTransaction={handleAddModal} /> }
        { isEditModalOpen && transactionToEdit && (
          <FormModal 
            closeModal={handleCloseEditModal} 
            formTitle="Editar Transação" 
            addTransaction={handleAddModal}
            updateTransaction={handleUpdateTransaction}
            transactionToEdit={transactionToEdit}
            isEditing={true}
          /> 
        )}
      </BodyContainer>
    </div>
  );
}
