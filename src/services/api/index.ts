import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3333',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

api.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
    },
    (error) => {
        console.error('❌ Erro na requisição:', error);
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    (error) => {
        if (error.response){
            const { status, data, config } = error.response;
            console.error(`❌ ${config?.method?.toUpperCase()} ${config?.url} - Status: ${status}`, data);
            
            if (status === 401) {
                console.error('Acesso não autorizado - verifique suas credenciais.');
            } else if (status === 404) {
                console.error('Recurso não encontrado - verifique a URL solicitada.');
            } else if (status === 405) {
                console.error('Método não permitido - verifique se o endpoint suporta este método HTTP.');
            } else if (status === 500) {
                console.error('Erro Interno do Servidor - tente novamente mais tarde.');
            } else if (status === 400) {
                console.error(`Status: ${status} - ${data?.message || 'Requisição inválida'}`);
            }
            else {
                console.error(`Error: ${data?.message || 'Um erro de rede ou servidor indisponível'}`);
            }
        } else {
            console.error('Erro de rede: Servidor não está respondendo');
        }
        return Promise.reject(error);
    }
)