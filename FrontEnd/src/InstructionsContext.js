import React, { createContext, useState } from 'react';
export const InstructionsContext = createContext();

export const InstructionsProvider = ({ children }) => {
  const [instructionsMode, setInstructionsMode] = useState(false);

  return (
    <InstructionsContext.Provider value={{ instructionsMode, setInstructionsMode }}>
      {children}
    </InstructionsContext.Provider>
  );
};
