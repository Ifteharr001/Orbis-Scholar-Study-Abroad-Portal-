export interface IUniversity {
  _id?: string;
  name: string;
  location?: string;
  country?: string;
  image?: string;
  heroImage?: string;
  ranking?: string;
  rating?: number | string;
  programs?: Array<{ name?: string } | string>;
  deadline?: string;
}

export type UniversitiesResponse = IUniversity[];
