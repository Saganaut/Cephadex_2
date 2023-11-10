import { useState } from "react";

interface DropdownReturnType {
  isOpen: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;
}
const useDropdown = (): DropdownReturnType => {
  const [isOpen, setIsOpen] = useState(false);

  const openDropdown = (): void => {
    setIsOpen(true);
  };
  const closeDropdown = (): void => {
    setIsOpen(false);
  };
  const toggleDropdown = (): void => {
    setIsOpen((prev) => !prev);
  };

  return { isOpen, openDropdown, closeDropdown, toggleDropdown };
};

export { useDropdown };
