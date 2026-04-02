// Contrato de respuesta del backend — espeja ApiResponse del backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  path?: string;
}
