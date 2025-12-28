"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

export default function Toast({ message, isVisible, onClose, type = "success" }: ToastProps) {
  const onCloseRef = useRef(onClose);
  
  // Update ref when onClose changes
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onCloseRef.current();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]); // Removed onClose from dependencies to prevent infinite loops

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className={`bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 min-w-[300px] ${
        type === "error" ? "border-red-200" : "border-gray-200"
      }`}>
        {type === "error" ? (
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        )}
        <p className={`text-sm flex-1 ${type === "error" ? "text-red-900" : "text-gray-900"}`}>{message}</p>
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


