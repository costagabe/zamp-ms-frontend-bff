import type { PageResponse } from "~/types/common";

export type BuildingStatus =
  | "AVAILABLE"
  | "RENTED"
  | "MAINTENANCE"
  | "INACTIVE";

export type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "COMMERCIAL"
  | "LAND"
  | "FARM";

export interface BuildingAddress {
  id?: string;
  street: string;
  neighbourhood: string;
  city: string;
  state: string;
  cep: string;
  number: string;
  complement?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface BuildingPhoto {
  id: string;
  buildingId: string;
  contentType: string;
  size: number;
  publicPath: string;
  storagePath: string;
  bucket: string;
  filename: string;
  extension: string;
  orderIndex?: number | null;
  isMain?: boolean | null;
  createdAt?: string;
}

export interface Building {
  id: string;
  companyId: string;
  ownerId: string;
  capitationDate?: string | null;
  address: BuildingAddress;
  status: BuildingStatus;
  propertyType: PropertyType;
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  description?: string | null;
  rentValue?: number | null;
  saleValue?: number | null;
  condominiumFee?: number | null;
  iptuValue?: number | null;
  photos?: BuildingPhoto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBuildingPayload {
  companyId: string;
  ownerId: string;
  capitationDate?: string | null;
  address: BuildingAddress;
  status: BuildingStatus;
  propertyType: PropertyType;
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  description?: string | null;
  rentValue?: number | null;
  saleValue?: number | null;
  condominiumFee?: number | null;
  iptuValue?: number | null;
  photos?: Partial<BuildingPhoto>[];
}

export interface UpdateBuildingPayload extends Partial<CreateBuildingPayload> {
  id?: string;
}

export type BuildingPage = PageResponse<Building>;

export interface PhotoUploadRequest {
  file: File;
  bucket?: string;
}

export interface PhotoMetadataPayload {
  buildingId: string;
  contentType: string;
  size: number;
  publicPath: string;
  storagePath: string;
  bucket: string;
  filename: string;
  extension: string;
  orderIndex?: number | null;
  isMain?: boolean | null;
}
