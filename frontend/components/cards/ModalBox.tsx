"use client";

import { useEffect } from "react";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ModalBox = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg  rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-1 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
        >
          X
        </button>

        {/* Title */}
        {title && (
          <h2 className="mb-6 pr-10 font-heading text-2xl font-semibold text-charcoal">
            {title}
          </h2>
        )}
        <div className="flex items-center justify-center">

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalBox;