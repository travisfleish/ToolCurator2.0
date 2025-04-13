'use client';

import React from 'react';
import Header from '../components/layout/Header';
import SubmitToolSection from '../components/marketing/submit/SubmitToolSection';
import Footer from '../components/layout/Footer';

export default function SubmitToolPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SubmitToolSection />
      <Footer />
    </main>
  );
}