export interface Attachment {
  id: string;
  file: File;
  url: string;
  type: "image" | "video";
}