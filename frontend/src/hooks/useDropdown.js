import { useState } from 'react';

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDropdown = () => setIsOpen(true);
  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => setIsOpen(prev => !prev);

  return { isOpen, openDropdown, closeDropdown, toggleDropdown };
};

export { useDropdown };



