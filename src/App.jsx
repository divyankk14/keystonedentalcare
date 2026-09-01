import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DoctorIntro from './components/DoctorIntro';
import Services from './components/Services';
import BeforeAfter from './components/BeforeAfter';
import Reviews from './components/Reviews';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { Phone, Calendar, MapPin } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('book'); // 'book' | 'admin'

  const handleMobileNav = (href) => {
    setView('book');
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-dark flex flex-col justify-between selection:bg-brand-coral/25">
      <div>
        <Header view={view} setView={setView} />
        
        {view === 'book' ? (
          <main>
            <Hero />
            <DoctorIntro />
            <Services />
            <BeforeAfter />
            <Reviews />
            <BookingForm />
          </main>
        ) : (
          <main className="bg-brand-ivory min-h-[60vh] py-12">
            <AdminDashboard />
          </main>
        )}
      </div>
      
      <Footer />

      {/* Mobile Sticky Bottom Nav Bar (visible on mobile screens only) */}
      {view === 'book' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-brand-sage/30 text-brand-dark py-2 px-6 flex items-center justify-around shadow-[0_-8px_30px_rgb(0,0,0,0.06)]">
          <a
            href="tel:+917506903401"
            className="flex flex-col items-center gap-1 text-[10px] text-brand-dark/70 hover:text-brand-teal font-semibold uppercase tracking-wider transition-colors"
          >
            <Phone size={16} className="text-brand-teal" />
            Call Us
          </a>
          
          <a
            href="#booking-section"
            onClick={(e) => { e.preventDefault(); handleMobileNav('#booking-section'); }}
            className="flex flex-col items-center gap-1.5 text-[10px] text-brand-ivory font-bold uppercase tracking-wider bg-brand-coral hover:bg-brand-coral/95 px-6 py-2 rounded-full shadow-lg transform active:scale-95 transition-all -translate-y-1"
          >
            <Calendar size={14} />
            Book
          </a>
          
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleMobileNav('#contact'); }}
            className="flex flex-col items-center gap-1 text-[10px] text-brand-dark/70 hover:text-brand-teal font-semibold uppercase tracking-wider transition-colors"
          >
            <MapPin size={16} className="text-brand-teal" />
            Contact
          </a>
        </div>
      )}
    </div>
  );
}
