export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  limit-count: number;
  limit-time-period: number;
  price: number;
  duration: number;
}

export interface UsageRecords {
  id: number;
  "user-id": number;
  "operation-type": string | null;
  "operation-details": string | null;
  "operation-count": number | null;
  "remaining-count": number;
  "time-period": string | null;
  "limit-count": number | null;
  date: string | null;
  status: string | null;
  "source-ip": string | null;
  "payment-status": string | null;
}

export interface Subscriber {
  id: number;
  "first-name": string | null;
  "last-name": string | null;
  email: string;
  "time-created": Date;
}

export interface DeletedAccounts {
  id: number;
  "user-id": number;
  email: string;
  "time-created": string;
  "time-deleted": string;
  reason: string;
  "reason-details": string;
}
