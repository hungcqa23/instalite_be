export interface Media {
  type: MediaType;
  url: string;
}

export enum MediaType {
  IMAGE,
  VIDEO
}
