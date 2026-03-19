import { computed } from "vue";

interface OptionItem {
  label: string;
  value: string;
}

interface BuildingFillContext {
  setFieldValue: (field: any, value: any) => void;
  companyOptions?: OptionItem[];
  ownerOptions?: OptionItem[];
}

interface UserFillContext {
  setFieldValue: (field: any, value: any) => void;
  roleOptions?: OptionItem[];
  companyOptions?: OptionItem[];
}

interface ClientFillContext {
  setFieldValue: (field: any, value: any) => void;
  companyOptions?: OptionItem[];
  personTypeOptions?: OptionItem[];
  clientTypeOptions?: OptionItem[];
  stateOptions?: OptionItem[];
  cityOptions?: OptionItem[];
  addressTypeOptions?: OptionItem[];
}

interface CompanyFillContext {
  setFieldValue: (field: any, value: any) => void;
}

function randomFrom<T>(arr: T[], fallback: T): T {
  if (!arr.length) return fallback;
  return arr[Math.floor(Math.random() * arr.length)] ?? fallback;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function randomChoice<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

const streets = [
  "Rua das Flores",
  "Avenida Central",
  "Rua das Palmeiras",
  "Rua do Sol",
];
const neighbourhoods = ["Centro", "Jardins", "Vila Nova", "Alto Alegre"];
const cities = ["São Paulo", "Campinas", "Santos", "Sorocaba"];
const states = ["SP", "RJ", "MG", "PR"];
const firstNames = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Eduarda",
  "Felipe",
  "Gabriela",
  "Henrique",
];
const lastNames = [
  "Silva",
  "Souza",
  "Oliveira",
  "Costa",
  "Pereira",
  "Rodrigues",
  "Almeida",
  "Gomes",
];
const professions = [
  "Engenheira",
  "Analista",
  "Arquiteto",
  "Médica",
  "Designer",
  "Desenvolvedor",
];

export function useFillForm() {
  const runtimeConfig = useRuntimeConfig();

  const isDevFillButtonVisible = computed(() => {
    const publicEnv = (runtimeConfig.public.env || "").toString().toLowerCase();

    return publicEnv === "dev" || publicEnv === "development";
  });

  function fillBuildingForm(ctx: BuildingFillContext) {
    if (!ctx?.setFieldValue) return;

    const randomCompany = randomChoice(ctx.companyOptions ?? []);
    const randomOwner = randomChoice(ctx.ownerOptions ?? []);

    ctx.setFieldValue("companyId", randomCompany?.value ?? "");
    ctx.setFieldValue("ownerId", randomOwner?.value ?? "");
    ctx.setFieldValue(
      "status",
      randomChoice(["AVAILABLE", "MAINTENANCE", "INACTIVE"]) ?? "AVAILABLE",
    );
    ctx.setFieldValue(
      "propertyType",
      randomChoice(["HOUSE", "APARTMENT", "COMMERCIAL", "LAND"]) ?? "HOUSE",
    );

    const today = new Date();
    const daysAgo = randomInt(1, 120);
    const capDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    ctx.setFieldValue("capitationDate", capDate.toISOString().slice(0, 10));

    ctx.setFieldValue("area", randomInt(50, 400));
    ctx.setFieldValue("bedrooms", randomInt(1, 5));
    ctx.setFieldValue("bathrooms", randomInt(1, 4));
    ctx.setFieldValue("parkingSpaces", randomInt(0, 3));
    ctx.setFieldValue(
      "description",
      "Imóvel de teste preenchido automaticamente para revisão.",
    );
    ctx.setFieldValue("rentValue", randomFloat(1500, 8000));
    ctx.setFieldValue("saleValue", randomFloat(250000, 1200000));
    ctx.setFieldValue("condominiumFee", randomFloat(200, 1200));
    ctx.setFieldValue("iptuValue", randomFloat(100, 900));

    const street = randomFrom(streets, "Rua Projetada");
    const neighbourhood = randomFrom(neighbourhoods, "Centro");
    const city = randomFrom(cities, "São Paulo");
    const state = randomFrom(states, "SP");
    const cep = `${randomInt(10000, 99999)}-${randomInt(100, 999)}`;
    const number = `${randomInt(10, 999)}`;

    ctx.setFieldValue("address.street", street);
    ctx.setFieldValue("address.neighbourhood", neighbourhood);
    ctx.setFieldValue("address.city", city);
    ctx.setFieldValue("address.state", state);
    ctx.setFieldValue("address.cep", cep);
    ctx.setFieldValue("address.number", number);
    ctx.setFieldValue("address.complement", "Ap 12");
    ctx.setFieldValue("address.latitude", randomFloat(-23.6, -23.3, 6));
    ctx.setFieldValue("address.longitude", randomFloat(-46.8, -46.4, 6));
  }

  function fillUserForm(ctx: UserFillContext) {
    if (!ctx?.setFieldValue) return;

    const fullName = `${randomFrom(firstNames, "João")} ${randomFrom(lastNames, "Silva")}`;
    const domain = randomFrom(["exemplo.com", "teste.com"], "exemplo.com");
    const email = `${fullName.toLowerCase().replace(/\s+/g, ".")}${randomInt(1, 99)}@${domain}`;
    const role = randomChoice(ctx.roleOptions ?? []);
    const companies = (ctx.companyOptions ?? [])
      .slice(0, 2)
      .map((c) => c.value);

    ctx.setFieldValue("name", fullName);
    ctx.setFieldValue("email", email);
    ctx.setFieldValue("role", role?.value ?? "");
    ctx.setFieldValue(
      "companies",
      companies.length ? companies : role ? [role.value] : [],
    );
  }

  function fillClientForm(ctx: ClientFillContext) {
    if (!ctx?.setFieldValue) return null;
    const fullName = `${randomFrom(firstNames, "João")} ${randomFrom(lastNames, "Silva")}`;
    const email = `${fullName.toLowerCase().replace(/\s+/g, ".")}${randomInt(10, 99)}@cliente.com`;
    const phone = `(11) 9${randomInt(4000, 9999)}-${randomInt(1000, 9999)}`;
    const personType = randomChoice(ctx.personTypeOptions ?? [])?.value ?? "PF";
    const clientTypes = (ctx.clientTypeOptions ?? [])
      .slice(0, 2)
      .map((c) => c.value);
    const company = randomChoice(ctx.companyOptions ?? []);

    ctx.setFieldValue("companyId", company?.value ?? "");
    ctx.setFieldValue("name", fullName);
    ctx.setFieldValue("email", email);
    ctx.setFieldValue("phone", phone);
    ctx.setFieldValue("personType", personType);
    ctx.setFieldValue(
      "clientTypes",
      clientTypes.length
        ? clientTypes
        : [ctx.clientTypeOptions?.[0]?.value].filter(Boolean),
    );
    const generatedCpf = `${randomInt(100, 999)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(10, 99)}`;
    const generatedCnpj = `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}/${randomInt(1000, 9999)}-${randomInt(10, 99)}`;
    if (personType === "PF") {
      ctx.setFieldValue("cpf", generatedCpf);
      ctx.setFieldValue("cnpj", "");
    } else {
      ctx.setFieldValue("cnpj", generatedCnpj);
      ctx.setFieldValue("cpf", "");
    }
    ctx.setFieldValue(
      "rg",
      `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(0, 9)}`,
    );
    ctx.setFieldValue("profession", randomFrom(professions, "Engenheiro"));
    ctx.setFieldValue("monthlyIncome", randomFloat(3000, 20000));
    ctx.setFieldValue(
      "birthDate",
      `199${randomInt(0, 9)}-0${randomInt(1, 9)}-${randomInt(10, 28)}`,
    );
    ctx.setFieldValue(
      "notes",
      "Cliente preenchido automaticamente para testes.",
    );

    const state = randomChoice(ctx.stateOptions ?? [])?.value ?? "SP";
    const city = randomChoice(ctx.cityOptions ?? [])?.label ?? "São Paulo";
    const cep = `${randomInt(10000, 99999)}-${randomInt(100, 999)}`;
    const number = `${randomInt(10, 999)}`;

    const addressType =
      randomChoice(ctx.addressTypeOptions ?? [])?.value ?? "RESIDENTIAL";
    const street = randomFrom(streets, "Rua Projetada");
    const neighbourhood = randomFrom(neighbourhoods, "Centro");

    ctx.setFieldValue("address.cep", cep);
    ctx.setFieldValue("address.type", addressType);
    ctx.setFieldValue("address.street", street);
    ctx.setFieldValue("address.number", number);
    ctx.setFieldValue("address.neighbourhood", neighbourhood);
    ctx.setFieldValue("address.state", state);
    ctx.setFieldValue("address.city", city);
    ctx.setFieldValue("address.complement", "Ap 21");
    return {
      companyId: company?.value ?? "",
      name: fullName,
      email,
      phone,
      personType,
      clientTypes,
      cpf: personType === "PF" ? generatedCpf : undefined,
      cnpj: personType === "PJ" ? generatedCnpj : undefined,
      address: {
        cep,
        type: addressType,
        street,
        number,
        neighbourhood,
        state,
        city,
        complement: "Ap 21",
      },
    } as const;
  }

  function fillCompanyForm(ctx: CompanyFillContext) {
    if (!ctx?.setFieldValue) return;
    const base = randomFrom(["Zamp", "Alpha", "Beta", "Nova", "Prime"], "Zamp");
    const suffix = randomFrom(
      ["Imóveis", "Serviços", "Holding", "Digital"],
      "Imóveis",
    );
    const name = `${base} ${suffix} ${randomInt(1, 99)}`;
    const cnpj = `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}/${randomInt(1000, 9999)}-${randomInt(10, 99)}`;

    ctx.setFieldValue("name", name);
    ctx.setFieldValue("cnpj", cnpj);
  }

  return {
    isDevFillButtonVisible,
    fillBuildingForm,
    fillUserForm,
    fillClientForm,
    fillCompanyForm,
  };
}
