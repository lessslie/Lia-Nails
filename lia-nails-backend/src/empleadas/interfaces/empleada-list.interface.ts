import { EmpleadaResponse } from './empleada-response.interface';

export interface EmpleadaListResponse {
  empleadas: EmpleadaResponse[];
  total: number;
}
