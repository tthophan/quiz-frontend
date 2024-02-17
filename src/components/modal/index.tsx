import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-md p-6 mx-auto my-8 bg-white border rounded-md shadow-lg">
        <button
          className="absolute top-0 right-0 p-2 text-xl font-semibold text-gray-500 cursor-pointer"
          onClick={onClose}
        >
          X
        </button>
        <div className="flex flex-col items-center">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
