'use client';

import { useState, KeyboardEvent } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TodoInput({
  onAdd,
  placeholder = 'What do you need to do?',
  disabled = false,
}: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex items-stretch bg-[#F1ECE6] rounded-xl overflow-hidden mb-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-5 py-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base disabled:opacity-50"
      />
      <button
        onClick={handleAdd}
        disabled={disabled}
        className="px-6 bg-[#7fb3b5] hover:bg-[#6a9fa1] text-white font-semibold text-sm tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ADD
      </button>
    </div>
  );
}
