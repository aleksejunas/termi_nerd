
import React from 'react';
import type { Command } from './types';
import { Link } from 'react-router-dom';

export const guestbook: Command = () => {
    return (
        <div>
          <p>You can view and sign the guestbook on the website.</p>
          <p>Navigate to <Link to="/guestbook" className="text-terminal-link underline">/guestbook</Link> to see it.</p>
        </div>
    );
};
