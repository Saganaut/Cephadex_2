import type { UserUpdateRequest } from "@source/client";

type Nullable<T> = { [P in keyof T]: T[P] | null };

type NullableUserUpdateRequest = Nullable<UserUpdateRequest>;

export type { NullableUserUpdateRequest };

interface PlanItem {
  value: number;
  type: string;
  title: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
  period: string;
}

export type { PlanItem };
