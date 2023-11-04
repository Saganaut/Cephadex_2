import { Deck } from "./Deck";
import { Quiz } from "./Quiz";
import { Group } from "./Group";
import { DeckFiles } from "./Deck";
export interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  "time-created": string;
  avatar: string;
  "author-name": string;
  images: Array<{ "thumbnail-url": string; "image-url": string }>;
}
export type DashboardCard = Deck | Quiz | Group | DeckFiles;
export type DashboardCardsState = DashboardCard[];

export interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  "time-created": string;
  "type-feedback": string;
}

export interface JobNotification {
  id: number;
  "user-id": number;
  slug: string;
  state: string;
  complete: boolean;
  notified: boolean;
  "time-created": string;
  cost: number;
  "input-details": string;
  "extract-type": string;
}
