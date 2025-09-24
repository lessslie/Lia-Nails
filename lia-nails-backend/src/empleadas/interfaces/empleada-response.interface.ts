export interface EmpleadaResponse {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  diasLaborales: string[];
  horaInicio: string;
  horaFin: string;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}