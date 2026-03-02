export interface CUsuarioRequest {
  username: string;
  password: string;
  roles: string[];
}

export interface CUsuarioResponse {
  id: number;
  username: string;
  roles: string[];
  estadoRegistro: 'ACTIVO' | 'ELIMINADO';
}