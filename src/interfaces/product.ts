export interface IProduct {
  _id: string;
  imageIds: string[];
  images: any[];
  categoryIds: string[];
  categories: any[];
  type: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  price: number;
  stock: number;
  performerId: string;
  performer: any;
  createdAt: Date;
  updatedAt: Date;
  quantity: number;
  digitalFile: string;
  digitalFileId: string;
  stats: {
    views: number;
    likes: number;
  };
  isBought: boolean;
}
