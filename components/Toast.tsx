"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-[300px]">
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        <p className="text-sm text-gray-900 flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}


