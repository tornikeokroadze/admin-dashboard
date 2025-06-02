export interface BookItem {
  id: number;
  tourId: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  peopleNum: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
