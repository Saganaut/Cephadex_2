export interface UserSettings {
  id: number;
  user: number;
  language: string | null;
  theme: string | null;
  "new-user": boolean | null;
  "new-user-study": boolean | null;
  "new-user-decks": boolean | null;
  "new-user-tests": boolean | null;
  "new-user-cards": boolean | null;
  "srs-setting-1": boolean | null;
  "srs-setting-2": boolean | null;
  "srs-setting-3": boolean | null;
  "srs-setting-4": boolean | null;
}
