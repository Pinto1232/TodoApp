'use client';

import { useState, KeyboardEvent } from 'react';
import { Button, Input } from '../ui';

interface TodoInputProps {
  onAdd: (text: string) => void;
  placeholder?: string;
}

export function TodoInput({
  onAdd,
  placeholder = 'What do you need to do?',
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
    <div className="flex gap-2 mb-2">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <Button onClick={handleAdd}>ADD</Button>
    </div>
  );
}
