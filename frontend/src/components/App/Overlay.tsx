import ReactDOM from 'react-dom';

const Overlay = ({ isOpen, closeDropdown }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-black opacity-60 z-20"
      onClick={closeDropdown}
    />,
    document.getElementById('overlay-portal')
  );
};

export {Overlay}