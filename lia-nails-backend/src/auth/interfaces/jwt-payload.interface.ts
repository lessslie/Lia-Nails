export interface JwtPayload {
  sub: string;
  email: string;
  rol: "admin" | "empleada";
  empleadaId?: string;
  iat?: number;
  exp?: number;
}
