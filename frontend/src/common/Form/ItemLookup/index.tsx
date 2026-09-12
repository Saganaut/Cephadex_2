import { UserService } from "@client/services/UserService";
import { InputField } from "@common/Form/InputField";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { useDebouncedEffect } from "@source/lib/hooks/useDebouncedEffect";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { validateEmail } from "@source/lib/utils/functions";
import { fetchDecks, selectDecksBySearchTerm } from "@store/decks/actions";
import { type RootState } from "@store/store";
import React, { useEffect, useState } from "react";

import { SelectedItems } from "./components/SelectedItems";
import { SuggestedItems } from "./components/SuggestedItems";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}

interface ItemLookupProps<T> {
  handleSelectedItems: (items: T[], emails?: Array<{ email: string }>) => void;
  type: "deck" | "user" | "copyCard" | string;
}

const ItemLookup: React.FC<ItemLookupProps<LookedUpItem>> = ({
  handleSelectedItems,
  type,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<LookedUpItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<LookedUpItem[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [selectedEmails, setSelectedEmails] = useState<
    Array<{ email: string }>
  >([]);
  const MIN_INPUT_LENGTH = type === "user" ? 4 : 1;
  const DEBOUNCE_TIME = type === "user" ? 500 : 0;
  const dispatch = useAppDispatch();
  const decksStatus = useAppSelector((state) => state.decks.status);
  const allDecksLoaded = useAppSelector((state) => state.decks.allDecksLoaded);
  useEffect(() => {
    if (type === "deck" || type === "copyCard") {
      if (allDecksLoaded) return;
      void dispatch(fetchDecks());
    }
  }, [dispatch, decksStatus, type]);

  const placeholder =
    type === "user" ? "Type username or email" : "Type deck name or subject";
  const decks = useAppSelector((state: RootState) =>
    selectDecksBySearchTerm(state, inputValue)
  );

  const handleSearchForUsers = async (): Promise<void> => {
    const response = await UserService.searchUsers(inputValue);
    if (Boolean(response.users) && Array.isArray(response.users)) {
      setSuggestions(
        response.users.filter(
          (item: LookedUpItem) =>
            !selectedItems.some((selectedItem) => selectedItem.id === item.id)
        )
      );
    }
  };
  const handleDeckSuggestions = (): void => {
    setSuggestions(
      decks
        .filter(
          (item: LookedUpItem) =>
            !selectedItems.some((selectedItem) => selectedItem.id === item.id)
        )
        .slice(0, 5)
    );
  };

  const handleFetchingItems = async (): Promise<void> => {
    if (inputValue !== "" && inputValue.length > MIN_INPUT_LENGTH) {
      try {
        switch (type) {
          case "user":
            await handleSearchForUsers();
            break;
          case "deck":
            handleDeckSuggestions();
            break;
          case "copyCard":
            handleDeckSuggestions();
            break;
          default:
            setSuggestions([]);
            break;
        }
      } catch (error) {}
    } else {
      setSuggestions([]);
    }
  };
  useDebouncedEffect(
    async () => {
      await handleFetchingItems();
    },
    [inputValue],
    DEBOUNCE_TIME
  );

  const handleKeyDown = (event: {
    key: string;
    preventDefault: () => void;
  }): void => {
    if (event.key === "Enter" && suggestions.length > 0) {
      const enteredSuggestion = suggestions[activeSuggestion];
      if (enteredSuggestion !== undefined) {
        handleSelectItem(enteredSuggestion);
        event.preventDefault();
      }
    } else if (
      event.key === "Enter" &&
      inputValue.includes("@") &&
      validateEmail(inputValue)
    ) {
      setSelectedEmails((prevSelectedEmails) => [
        ...prevSelectedEmails,
        { email: inputValue },
      ]);
      setInputValue("");
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      setActiveSuggestion((prevActiveSuggestion) =>
        Math.min(prevActiveSuggestion + 1, suggestions.length - 1)
      );
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      setActiveSuggestion((prevActiveSuggestion) =>
        Math.max(prevActiveSuggestion - 1, 0)
      );
      event.preventDefault();
    }
  };

  const removeSelectedItem = (item: LookedUpItem): void => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((prevItem) => prevItem.id !== item.id)
    );
  };

  const removeSelectedEmail = (email: string): void => {
    setSelectedEmails((prevSelectedEmails) =>
      prevSelectedEmails.filter((prevEmail) => prevEmail.email !== email)
    );
  };

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }): void => {
    setInputValue(event.target.value);
  };

  const handleSelectItem = (item: LookedUpItem): void => {
    setSelectedItems((prevSelectedItems) => {
      if (
        prevSelectedItems.some((selectedItem) => selectedItem.id === item.id)
      ) {
        return prevSelectedItems;
      } else {
        return [...prevSelectedItems, item];
      }
    });
    setInputValue("");
    setSuggestions([]);
  };

  const handleSubmit = (
    selectedItems: LookedUpItem[],
    selectedEmails: Array<{ email: string }>
  ): void => {
    setSelectedItems([]);
    setSelectedEmails([]);
    switch (type) {
      case "user":
        handleSelectedItems(selectedItems, selectedEmails);
        break;
      case "deck":
        handleSelectedItems(selectedItems);
        break;
      default:
        handleSelectedItems(selectedItems, selectedEmails);
        break;
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-full flex-wrap items-stretch justify-between md:flex-nowrap md:gap-x-[8px] md:p-2 lg:gap-x-[24px]">
        <div className={"w-full"}>
          <InputField
            className={"w-full"}
            name="userLookup"
            onBlur={() => []}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            handleOnKeyDown={handleKeyDown}
          />
          <SuggestedItems
            suggestions={suggestions}
            handleSelectItem={handleSelectItem}
            activeSuggestion={activeSuggestion}
            type={type}
          />
        </div>
        <div className=" mt-2 sm:ml-0 md:mt-0">
          <StyledButton
            onClick={() => {
              handleSubmit(selectedItems, selectedEmails);
            }}
            label={
              type === "deck"
                ? "Add"
                : type === "user"
                ? "Add"
                : type === "copyCard"
                ? "Copy"
                : ""
            }
          />
        </div>
      </div>

      <SelectedItems
        selectedItems={selectedItems}
        removeSelectedItem={removeSelectedItem}
        type={type}
        removeSelectedEmail={removeSelectedEmail} // only used for user type
        selectedEmails={selectedEmails} // only used for user type
      />
    </div>
  );
};

export { ItemLookup };
