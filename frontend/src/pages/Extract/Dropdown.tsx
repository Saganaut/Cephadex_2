import { useDropdown } from "@hooks/useDropdown";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface DropdownProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
}
const Dropdown: React.FC<DropdownProps> = ({ trigger, content }) => {
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef.current != null) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  const overlay = (
    <div
      className={`fixed left-0 top-0 h-full w-full ${
        isOpen ? "z-20 bg-black opacity-60" : "pointer-events-none opacity-0"
      }`}
      onClick={closeDropdown}
    ></div>
  );

  const dropdownContent = (
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 30,
      }}
    >
      {content}
    </div>
  );

  return (
    <div className="relative">
      <div onClick={toggleDropdown} ref={triggerRef}>
        {trigger}
      </div>
      {isOpen && ReactDOM.createPortal(overlay, document.body)}
      {isOpen && ReactDOM.createPortal(dropdownContent, document.body)}
    </div>
  );
};

export { Dropdown };
