import { createTransaction, deleteTransaction, getTransactions, updateTransaction, IPaginationParams, IPaginatedResponse } from "@/services/transactions"
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { ITransaction } from "@/types/transaction"

const QUERY_KEY = 'transactions'

const ListAll = () => {
  return useQuery({ 
    queryKey: [QUERY_KEY, 'all'], 
    queryFn: () => getTransactions(),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  })
}

const ListPaginated = (params: IPaginationParams) => {
  return useQuery({ 
    queryKey: [QUERY_KEY, 'paginated', params], 
    queryFn: () => getTransactions(params),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  })
}

const ListInfinite = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY, 'infinite'],
    queryFn: ({ pageParam = 0 }) => getTransactions({ skip: pageParam, take: pageSize }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.skip + lastPage.take;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  })
}

const Create = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })

      const previousTransactions = queryClient.getQueryData([QUERY_KEY])

      queryClient.setQueryData([QUERY_KEY], (old: any) => {
        if (!old) return { data: [newTransaction], total: 1, skip: 0, take: 1, hasMore: false }
        if (Array.isArray(old)) {
          return [...old, { ...newTransaction, id: `temp-${Date.now()}` }]
        }
        return {
          ...old,
          data: [...old.data, { ...newTransaction, id: `temp-${Date.now()}` }],
          total: old.total + 1
        }
      })

      return { previousTransactions }
    },
    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData([QUERY_KEY], context.previousTransactions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

const Update = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, transaction }: { id: string; transaction: Omit<ITransaction, 'id'> }) => 
      updateTransaction(id, transaction),
    onMutate: async ({ id, transaction }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })

      const previousTransactions = queryClient.getQueryData([QUERY_KEY])

      queryClient.setQueryData([QUERY_KEY], (old: any) => {
        if (!old) return old
        if (Array.isArray(old)) {
          return old.map(t => t.id === id ? { ...transaction, id } : t)
        }
        return {
          ...old,
          data: old.data.map((t: ITransaction) => t.id === id ? { ...transaction, id } : t)
        }
      })

      return { previousTransactions }
    },
    onError: (err, { id }, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData([QUERY_KEY], context.previousTransactions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

const Delete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransaction,
    onMutate: async (transactionId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })

      const previousTransactions = queryClient.getQueryData([QUERY_KEY])

      queryClient.setQueryData([QUERY_KEY], (old: any) => {
        if (!old) return old
        if (Array.isArray(old)) {
          return old.filter(transaction => transaction.id !== transactionId)
        }
        return {
          ...old,
          data: old.data.filter((transaction: ITransaction) => transaction.id !== transactionId),
          total: old.total - 1
        }
      })

      return { previousTransactions }
    },
    onError: (err, transactionId, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData([QUERY_KEY], context.previousTransactions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

const GetById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getTransactions().then(response => 
      response.data.find((t: ITransaction) => t.id === id)
    ),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

const useTransactionLoading = () => {
  const { isPending: isCreating } = useTransaction.Create();
  const { isPending: isUpdating } = useTransaction.Update();
  const { isPending: isDeleting } = useTransaction.Delete();
  
  return {
    isCreating,
    isUpdating,
    isDeleting,
    isLoading: isCreating || isUpdating || isDeleting,
  };
};

export const useTransaction = {
    Create,
    Update,
    Delete,
    ListAll,
    ListPaginated,
    ListInfinite,
    GetById,
    useTransactionLoading,
}

