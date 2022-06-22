import { IPerformer } from './performer';

export interface IVideo {
  _id: string;
  title: string;
  slug: string;
  performerId: string;
  isSaleVideo: boolean;
  price: number;
  status: string;
  description: string;
  thumbnail: {
    url: string;
    thumbnails: any[]
  };
  teaserId: string;
  teaser: {
    url: string;
    thumbnails: any[],
    duration: number;
  };
  processing: boolean;
  teaserProcessing: boolean;
  tags: string[];
  participantIds: string[];
  participants: any[];
  fileId: string;
  video: {
    url: string;
    thumbnails: string[];
    duration: number;
    width: number;
    height: number;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    favourites: number;
    wishlists: number;
  };
  performer: IPerformer;
  isSubscribed: boolean;
  isBought: boolean;
  isLiked: boolean;
  isFavourited: boolean;
  isWishlist: boolean;
  isSchedule: boolean;
  scheduledAt: Date;
  updatedAt: Date;
  createdAt: Date;
}
