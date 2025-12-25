"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/contexts/SearchContext";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { setSearchQuery } = useSearch();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      setSearchQuery(trimmedValue);
      router.push(`/?search=${encodeURIComponent(trimmedValue)}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    router.push("/");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-apple-gray-900 transition-colors"
        aria-label="Tìm kiếm sản phẩm"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex items-center">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent w-64 text-sm"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Xóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}

