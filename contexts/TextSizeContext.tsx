import React, { createContext, useContext, useState } from 'react';

type TextSizeContextType = {
  isLargeText: boolean;
  toggleTextSize: () => void;
  textScaleFactor: number; // Added textScaleFactor
};

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

export const TextSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLargeText, setIsLargeText] = useState(false);

  const toggleTextSize = () => {
    setIsLargeText((prev) => !prev);
  };

  const textScaleFactor = isLargeText ? 1.5 : 1;

  return (
    <TextSizeContext.Provider value={{ isLargeText, toggleTextSize, textScaleFactor }}>
      {children}
    </TextSizeContext.Provider>
  );
};

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};