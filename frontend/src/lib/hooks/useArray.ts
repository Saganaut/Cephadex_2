import { useState } from "react";

interface ItemWithId {
  id: number;
}

interface UseArrayReturnType<T extends ItemWithId> {
  items: T[];
  addItem: (item: T) => void;
  removeItem: (id: number) => void;
  reset: () => void;
  updateItem: (id: number, partialItem: PartialItem<T>) => void;
}
export type PartialItem<T> = {
  [P in keyof T]?: T[P];
};
const useArray = <T extends ItemWithId>(
  initialItems: T[] = [],
): UseArrayReturnType<T> => {
  const [items, setItems] = useState<T[]>(initialItems);

  const addItem = (item: T): void => {
    setItems((prevItems) => {
      // Check if the item already exists in the array
      const itemIndex = prevItems.findIndex(
        (existingItem) => existingItem.id === item.id,
      );

      // If the item exists, update it; otherwise, add it to the array
      if (itemIndex !== -1) {
        return prevItems.map((existingItem) =>
          existingItem.id === item.id ? item : existingItem,
        );
      } else {
        return [...prevItems, item];
      }
    });
  };
  const updateItem = (id: number, partialItem: PartialItem<T>): void => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...partialItem } : item,
      ),
    );
  };
  const removeItem = (id: number): void => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const reset = (): void => {
    setItems([]);
  };

  return {
    items,
    addItem,
    removeItem,
    reset,
    updateItem,
  };
};

export default useArray;
