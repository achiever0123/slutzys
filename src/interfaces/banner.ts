export interface IBanner {
  _id: string;
  title: string;
  description: string;
  link: string;
  status: string;
  position: string;
  photo: { url: string; thumbnails: string[] };
}
