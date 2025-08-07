// frontend/src/app/providers.js
'use client';

import { FormspreeProvider } from '@formspree/react';

export function Providers({ children }) {
  return (
    <FormspreeProvider>
      {children}
    </FormspreeProvider>
  );
}