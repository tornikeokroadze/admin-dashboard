export interface TeamItem {
  id: number;
  name: string;
  surname: string;
  position: string;
  image?: string;
  facebook: string;
  instagram: string;
  twitter: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
