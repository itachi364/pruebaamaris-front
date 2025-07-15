// Enum para tipos de transacción y notificación
export type TransactionType = 'APERTURA' | 'CANCELACION';
export type NotificationType = 'EMAIL' | 'SMS';

// Fund: Respuesta del backend
export interface Fund {
  id: string;
  name: string;
  minimumAmount: number;
  category: string;
}

// Fund: Petición para crear (si la llegas a necesitar)
export interface CreateFundRequest {
  name: string;
  minimumAmount: number;
  category: string;
}

// UserBalance: Petición
export interface UserBalanceRequest {
  fundId: string;
  userId: string;
  amount: number;
  type: TransactionType;
  notificationType: NotificationType;
}

// UserBalance: Respuesta
export interface UserBalance {
  id: string;
  userId: string;
  fundId: string;
  amount: number;
  balanceAfter: number;
  type: TransactionType;
  notificationType: NotificationType;
  timestamp: number; // Epoch timestamp
}

// Transaction: Petición
export interface TransactionRequest {
  userId: string;
  fundId: string;
  amount: number;
  type: TransactionType;
  notificationType: NotificationType;
}

// Transaction: Respuesta
export interface Transaction {
  id: string;
  userId: string;
  fundId: string;
  amount: number;
  balanceAfter: number;
  type: TransactionType;
  notificationType: NotificationType;
  timestamp: number; // Epoch timestamp
}
