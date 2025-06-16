
import React from 'react';

const Cursor: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={`inline-block bg-terminal-green w-2 h-5 animate-blink ${className || ''}`} />
  );
};

export default Cursor;
