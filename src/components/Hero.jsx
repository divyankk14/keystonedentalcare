import React from 'react';
import { Star, Shield, Award, Calendar } from 'lucide-react';

export default function Hero() {
  const scrollToBooking = (e) => {
    e.preventDefault();
    const element = document.querySelector('#booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-brand-teal via-brand-tealDeep to-brand-dark text-brand-ivory py-16 sm:py-20 lg:py-28">
      {/* Floating Organic graphic shape background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-coral/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none animate-float-delayed"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Rating badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-brand-sage mb-6">
              <span className="flex text-brand-coral">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </span>
              <span className="text-brand-ivory font-medium">4.9★ Google Business (150+ reviews)</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.15] mb-6 text-brand-ivory">
              A healthier, brighter smile starts here.
            </h1>

            {/* Subtitle */}
            <p className="text-brand-sage text-sm sm:text-base lg:text-lg max-w-xl mb-8 font-light leading-relaxed">
              Experience modern, personalized dental care with Dr. Sayali Dethe at Keystone Dental Care. We combine advanced clinical technology with a warm, patient-first approach.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#booking-section"
                onClick={scrollToBooking}
                className="bg-brand-coral hover:bg-brand-coral/95 text-brand-ivory px-8 py-4 rounded-full font-semibold text-sm shadow-lg hover-glow text-center flex items-center justify-center gap-2 animate-pulse-slow"
              >
                <Calendar size={16} /> Book Appointment
              </a>
              
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-brand-sage/40 hover:border-brand-sage text-brand-sage hover:text-brand-ivory px-8 py-4 rounded-full font-semibold text-sm transition-all text-center backdrop-blur-sm"
              >
                Explore Services
              </a>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full pt-8 border-t border-brand-sage/10 text-xs">
              <div className="flex flex-col items-center lg:items-start gap-1">
                <Shield className="text-brand-coral" size={18} />
                <span className="font-bold mt-1 text-brand-ivory">Sterilized environment</span>
                <span className="text-brand-sage text-[10px]">Strict safety protocols</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <Award className="text-brand-coral" size={18} />
                <span className="font-bold mt-1 text-brand-ivory">Advanced implants</span>
                <span className="text-brand-sage text-[10px]">Painless technology</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <Calendar className="text-brand-coral" size={18} />
                <span className="font-bold mt-1 text-brand-ivory">Easy Scheduling</span>
                <span className="text-brand-sage text-[10px]">Instant online slots</span>
              </div>
            </div>

          </div>

          {/* Hero 3D Perspective Card Representation */}
          <div className="lg:col-span-5 flex justify-center relative w-full mt-8 lg:mt-0 perspective-3d">
            <div className="w-[300px] sm:w-[340px] h-[300px] sm:h-[340px] rounded-full bg-gradient-to-br from-brand-sage/20 via-brand-teal/40 to-brand-coral/25 absolute -z-10 blur-xl"></div>
            <div className="w-full max-w-[340px] h-[320px] rounded-3xl glass-panel p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden card-3d cursor-pointer">
              <div className="absolute top-[-50px] right-[-50px] w-36 h-36 bg-brand-coral/10 rounded-full blur-xl"></div>
              
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-coral font-bold block mb-2">Our clinic</span>
                <h3 className="font-serif text-2xl font-bold leading-snug mb-3 text-white">Keystone Dental Care</h3>
                <p className="text-brand-sage text-xs font-light leading-relaxed">
                  Located in Prabhadevi, Mumbai. A state-of-the-art clinic dedicated to patient comfort and excellent dental care.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex items-center justify-between text-xs text-brand-sage">
                  <span>Mon - Sat</span>
                  <span className="font-bold text-brand-ivory">10 AM - 2 PM, 5 PM - 9 PM</span>
                </div>
                <div className="flex items-center justify-between text-xs text-brand-sage mt-2">
                  <span>Sunday</span>
                  <span className="text-brand-coral/80 font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
