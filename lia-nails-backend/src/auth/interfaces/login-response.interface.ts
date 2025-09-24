export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    rol: "admin" | "empleada";
    empleadaId?: string;
  };
}
