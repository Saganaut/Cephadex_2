import { AccountService } from "@source/client/services/AccountService";
import { useState } from "react";

import { useDebouncedEffect } from "../useDebouncedEffect";

// Assuming checkUsername is available in this scope
// const checkUsername = async (username) => { /* Your username checking logic here */ };
const checkUsername = async (username: string): Promise<boolean> => {
  try {
    const response = await AccountService.checkUsername(username);
    return !response.usernameTaken;
  } catch (error) {
    return true;
  }
};
export const useCheckUsernameAvailability = (
  value: string,
  delay = 1000
): {
  isAvailable: boolean;
  isLoading: boolean;
} => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState("");

  useDebouncedEffect(
    () => {
      const checkAvailability = async (): Promise<void> => {
        if (value !== lastChecked) {
          setIsLoading(true);
          setLastChecked(value);

          try {
            const availability = await checkUsername(value);
            setIsAvailable(availability);
          } catch (error) {
            // Handle any errors here, for now, we'll assume the username is available if an error occurs
            setIsAvailable(true);
          } finally {
            setIsLoading(false);
          }
        }
      };

      if (value !== null) {
        void checkAvailability();
      }
    },
    [value],
    delay
  );

  return { isAvailable, isLoading };
};
