import React from 'react';
import { StoreProvider } from './services/store';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
}
