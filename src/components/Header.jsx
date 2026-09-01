import React, { useState } from 'react';
import { Menu, X, Lock, Phone } from 'lucide-react';

export default function Header({ view, setView }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Before & After', href: '#before-after' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setView('book');
    setMenuOpen(false);
    // Smooth scroll
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white text-brand-dark border-b border-brand-sage/20 backdrop-blur-md bg-opacity-95 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
          className="flex items-center group"
        >
          <img 
            src="/images/logo.jpg" 
            alt="Keystone Dental Care Logo" 
            className="h-12 md:h-16 object-contain rounded-md transition-transform group-hover:scale-105"
          />
        </a>


        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-brand-dark/70 hover:text-brand-teal transition-colors duration-200 relative group/nav py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-coral transition-all duration-300 group-hover/nav:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right CTAs / Mode selector */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setView(view === 'admin' ? 'book' : 'admin')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-brand-teal/30 hover:border-brand-teal text-brand-teal hover:bg-brand-teal/5 transition-all"
          >
            {view === 'admin' ? (
              <>Patient Site</>
            ) : (
              <>
                <Lock size={12} /> Admin Login
              </>
            )}
          </button>
          
          <a
            href="#booking-section"
            onClick={(e) => { e.preventDefault(); handleNavClick('#booking-section'); }}
            className="bg-brand-coral hover:bg-brand-coral/90 text-brand-ivory px-5 py-2 rounded-full text-xs font-semibold shadow-md transition-all hover:translate-y-[-1px]"
          >
            Book Appointment
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setView(view === 'admin' ? 'book' : 'admin')}
            className="p-2 rounded-full text-brand-dark/70 hover:text-brand-teal border border-brand-teal/20"
            title="Toggle Admin View"
          >
            <Lock size={16} />
          </button>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md text-brand-dark/70 hover:text-brand-teal focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-[100] flex flex-col justify-between p-6 transition-all duration-300">
          <nav className="flex flex-col gap-6 text-lg font-serif mt-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-brand-dark/80 hover:text-brand-teal border-b border-brand-sage/10 pb-3 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4 mb-16">
            <a
              href="tel:+917506903401"
              className="flex items-center justify-center gap-2 bg-white border border-brand-teal/30 text-brand-teal py-3.5 rounded-full text-sm font-semibold"
            >
              <Phone size={16} /> Call Clinic
            </a>
            
            <a
              href="#booking-section"
              onClick={(e) => { e.preventDefault(); handleNavClick('#booking-section'); }}
              className="bg-brand-coral hover:bg-brand-coral/95 text-brand-ivory text-center py-3.5 rounded-full text-sm font-semibold shadow-lg"
            >
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </>
  );
}
