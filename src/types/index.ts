import { SetStateAction } from "react";

export interface Property {
  title: string;
  propertyType: string;
  price: string;
  images: string[];
  bhk: string
  features: string[];
  yearBuilt: number;
  area: string;
  address: {
    city: string;
    state: string;
  }
  dimensions: string;
  description: string;
  recommend:boolean
  updatedAt: string
}

export interface PropertyCardProps {
  id: string,
  imageSrc: string,
  price: string,
  features: string,
  tag: string,
  configuration: string,
  location: string,
  recommend?:true | false
  }

export interface PropertyFormValues {
  title: string;
  images: File[];
  configuration: string,
  description: string;
  price: number;
  location: string;
  address: {
    city?: string;
    state?: string;
  };
  propertyType: string;
  area: string;
  yearBuilt: number;
  features: string[];
  recommend:boolean
}

export interface Property {
  _id: string;
  propertyType: string;
  price: string;
  images: string[];
  configuration: string,
  features: string[];
  yearBuilt: number;
  area: string;
  location: string;
}

export interface InputProps {
  title: string;
  name: string;
  value: string | number | undefined;
  placeholder?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type AuthInputs = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export interface Admin {
  name: string;
  email: string;
}

export type Option = {
  label: string;
  value: string;
  state: string;
};

export interface PropertyPaneProps {
  contentType: "interior-self-intro" | "home-properties" | "home-interior" | "interior";
}

export interface DynamicCarouselProps {
  type: "interior-self-intro" | "home-properties" | "home-interior" | "interior";
  data: Property[] | string[];
  loading: boolean;
}

export interface ServiceItem {
  imageSrc: string;
  title: string;
  url?: string;
}

export interface ServiceSectionProps {
  title: string;
  bgClassName?: string;
  data: ServiceItem[];
}

export interface ServiceCardProps {
  imageSrc: string;
  title: string;
  url?: string;
}

export interface FilterObject {
  city: string;
  state: string;
  bhk: string;
  budget: {
    min: string;
    max: string;
  };
  propertyType: string[];
}

export interface CityNStateProps {
  cityValue: string | undefined
  stateValue: string | undefined
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  locations: Option[]
}

export interface FilterProps {
  filters: FilterObject;
  setFilters: React.Dispatch<React.SetStateAction<FilterObject>>;
}

export type DialogBoxProps = {
  filters?: FilterObject;
  setFilters?: React.Dispatch<React.SetStateAction<FilterObject>>;
  type?: string;
}

export interface CustomerDataTypes {
  _id?: string;
  name: string;
  contact: string;
  serviceType: "buyProperty" | "interiorDesign" | "sellProperty";
  createdAt?: Date | undefined;
}

export type PropertiesPageContentProps = {
  search: string;
  filters: FilterObject;
  setFilters: React.Dispatch<React.SetStateAction<FilterObject>>;
};

export type AdminMenuProp = {
  currentAdmin:Admin | null
  setCurrentAdmin:React.Dispatch<React.SetStateAction<Admin | null>>
}