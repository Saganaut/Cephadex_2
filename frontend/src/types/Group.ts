export interface Group {
  id: number;
  name: string;
  description: string | null;
  "group-type": number;
  "time-created": string;
  "time-updated": string;
  "creator-id": number;
  avatar: string | null;
  "is-private": boolean;
  fav: boolean | null;
  type: "Group";
  role: string;
  permissions: string;
}

export interface GroupInvite {
  id: number;
  name: string;
  group_id: number;
  user_id: number;
  "invited-by-id": number;
  "invited-by-email": string;
  "time-created": string;
  "time-updated": string;
}
