export interface UserRole {
  id: string;
  name: string;
  level: number;
}

export interface UserCompany {
  id: string;
  name: string;
  cnpj: string;
}

export type UserSituation = "ACTIVE" | "INACTIVE";

export interface User {
  id: string;
  supabaseUserId: string;
  name: string;
  email: string;
  situation: UserSituation;
  roles: UserRole[];
  companies: UserCompany[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string; // UUID da role vindo do BFF
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string; // UUID da role vindo do BFF
  situation?: UserSituation;
}
