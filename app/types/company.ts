export interface Company {
  id: string;
  name: string;
  cnpj: string;
}

export interface CreateCompanyPayload {
  name: string;
  cnpj: string;
}

export interface UpdateCompanyPayload {
  name?: string;
  cnpj?: string;
}
