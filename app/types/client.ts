export type PersonType = "PF" | "PJ";
export type ClientType = "LESSEE" | "LESSOR";
export type AddressType = "RESIDENTIAL" | "COMMERCIAL" | "OTHER";

export interface ClientAddress {
  id?: string | null;
  street?: string | null;
  neighbourhood?: string | null;
  city?: string | null;
  state?: string | null;
  cep?: string | null;
  number?: string | null;
  complement?: string | null;
  type?: AddressType | null;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  rg?: string | null;
  personType: PersonType;
  birthDate?: string | null;
  profession?: string | null;
  monthlyIncome?: number | null;
  notes?: string | null;
  clientTypes: ClientType[];
  address?: ClientAddress | null;
}

export interface CreateClientPayload {
  companyId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  rg?: string | null;
  personType: PersonType;
  birthDate?: string | null;
  profession?: string | null;
  monthlyIncome?: number | null;
  notes?: string | null;
  clientTypes: ClientType[];
  address?: ClientAddress | null;
}

export interface UpdateClientPayload extends Partial<CreateClientPayload> {
  id?: string;
}
