'use client';

import React from 'react';
import Header from '../components/layout/Header';
import AdvertiseSection from '../components/marketing/advertise/AdvertiseSection';
import Footer from '../components/layout/Footer';

export default function AdvertisePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <AdvertiseSection />
      <Footer />
    </main>
  );
}