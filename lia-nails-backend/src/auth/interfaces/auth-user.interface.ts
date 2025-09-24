export interface AuthUser {
  id: string;
  email: string;
  rol: "admin" | "empleada";
  empleadaId?: string;
  createdAt: Date;
  updatedAt: Date;
}
