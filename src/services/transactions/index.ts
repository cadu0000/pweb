import { ITransaction } from "@/types/transaction";
import { api } from "../api"
import { toast } from "react-toastify";

export interface IPaginationParams {
    skip?: number;
    take?: number;
}

export interface IPaginatedResponse {
    data: ITransaction[];
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
}

export async function getTransactions(params?: IPaginationParams): Promise<IPaginatedResponse> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) queryParams.append('take', params.take.toString());
        
        const url = `/transaction${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        
        if (Array.isArray(response.data)) {
            const total = response.data.length;
            const skip = params?.skip || 0;
            const take = params?.take || total;
            
            return {
                data: response.data,
                total: total,
                skip: skip,
                take: take,
                hasMore: false
            };
        }
        
        const result = response.data;
        const total = result.total || result.data?.length || 0;
        
        return {
            data: result.data || [],
            total: total,
            skip: result.skip || 0,
            take: result.take || 10,
            hasMore: result.hasMore || false
        };
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data?.message || "Erro no servidor";
            throw new Error("Erro ao buscar transações: " + errorMessage);
        } else if (error.request) {
            throw new Error("Erro de conexão com o servidor");
        } else {
            throw new Error("Erro desconhecido: " + error.message);
        }
    }
}

export async function createTransaction(transaction: ITransaction) {
    try {
        const response = await api.post('/transaction', transaction);
        toast.success("Transação adicionada com sucesso!")
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data?.message || "Erro no servidor";
            toast.error("Erro ao criar transação: " + errorMessage);
            throw new Error("Erro ao criar transação: " + errorMessage);
        } else if (error.request) {
            toast.error("Erro de conexão. Verifique se o servidor está rodando.");
            throw new Error("Erro de conexão com o servidor");
        } else {
            toast.error("Erro desconhecido: " + error.message);
            throw new Error("Erro desconhecido: " + error.message);
        }
    }
}

export async function updateTransaction(id: string, transaction: Omit<ITransaction, 'id'>) {
    try {
        const response = await api.patch(`/transaction/${id}`, transaction);
        toast.success("Transação atualizada com sucesso!")
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data?.message || "Erro no servidor";
            toast.error("Erro ao atualizar transação: " + errorMessage);
            throw new Error("Erro ao atualizar transação: " + errorMessage);
        } else if (error.request) {
            toast.error("Erro de conexão. Verifique se o servidor está rodando.");
            throw new Error("Erro de conexão com o servidor");
        } else {
            toast.error("Erro desconhecido: " + error.message);
            throw new Error("Erro desconhecido: " + error.message);
        }
    }
}

export async function deleteTransaction(id: string) {
    try {
        const response = await api.delete(`/transaction/${id}`);
        toast.success("Transação excluída com sucesso!")
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data?.message || "Erro no servidor";
            toast.error("Erro ao excluir transação: " + errorMessage);
            throw new Error("Erro ao excluir transação: " + errorMessage);
        } else if (error.request) {
            toast.error("Erro de conexão. Verifique se o servidor está rodando.");
            throw new Error("Erro de conexão com o servidor");
        } else {
            toast.error("Erro desconhecido: " + error.message);
            throw new Error("Erro desconhecido: " + error.message);
        }
    }
}