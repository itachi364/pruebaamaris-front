import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({ baseURL: API_BASE_URL });

/* ----------  Funds  ---------- */
export const getFunds           = ()            => api.get('/funds');
export const getFundById        = (id: string)  => api.get(`/funds/${id}`);
export const createFund         = (data: any)   => api.post('/funds', data);
export const updateFund         = (id: string, data: any) => api.put(`/funds/${id}`, data);
export const deleteFund         = (id: string)  => api.delete(`/funds/${id}`);

/* ----------  User Balance  ---------- */
export const subscribeToFund    = (data: any)   => api.post('/user-balance/suscribir', data);
export const cancelFund         = (data: any)   => api.post('/user-balance/cancelar',  data);
export const getUserBalancesAll           = ()            => api.get('/user-balance');
export const getUserBalances    = (userId: string) => api.get(`/user-balance/historial/${userId}`);


/* ----------  Transacciones  ---------- */
export const registerTransaction   = (data: any)   => api.post('/transactions', data);
export const getTransactionHistory = (userId: string) => api.get(`/transactions/historial/${userId}`);
export const getTransactionAll           = ()            => api.get('/transactions');

export default api;
