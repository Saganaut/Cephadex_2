import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useDropdown } from "@hooks/useDropdown";

const Dropdown = ({ trigger, content }) => {
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown();
  const triggerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  const overlay = (
    <div
      className={`fixed top-0 left-0 w-full h-full ${
        isOpen ? "bg-black opacity-60 z-20" : "opacity-0 pointer-events-none"
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
