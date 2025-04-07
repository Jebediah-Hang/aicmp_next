export interface PictureItem {
  id: number;
  name: string;
}

export interface Picture extends PictureItem {
  content: string;
}
