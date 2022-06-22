export interface IGallery {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  price: number;
  isSale: boolean;
  stats: {
    views: number;
    likes: number;
    favourites: number;
    comments: number;
  }
  performerId: string;
  performer: any;
  coverPhoto: { thumbnails: string[]; url: string };
  numOfItems: number;
  createdAt: Date;
  updatedAt: Date;
  isBought: boolean;
  isSubscribed: boolean;
  isLiked: boolean;
}
