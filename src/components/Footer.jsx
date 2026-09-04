import React from 'react';
import { Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-dark text-brand-ivory/95 border-t border-brand-sage/10">

      {/* Contact & Map Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-12 gap-12">

        {/* Contact Info (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-coral flex items-center justify-center text-brand-ivory font-bold text-base">
                K
              </div>
              <span className="font-serif text-lg font-bold tracking-tight">Keystone Dental Care</span>
            </div>

            <p className="text-brand-sage text-xs font-light leading-relaxed mb-8 max-w-sm">
              Providing premium, personalized dental services in Mumbai. We are committed to clinical excellence, patient-first care, and absolute hygiene.
            </p>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="text-brand-coral shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-semibold block mb-1">Our Location:</span>
                  <a
                    href="https://maps.google.com/?q=Keystone+Dental+Care+Shop+No+5+Laxmi+Narayan+CHS+Prabhadevi+Mumbai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-sage hover:text-brand-ivory transition-colors leading-relaxed"
                  >
                    Shop No. 5, Laxmi Narayan C.H.S Ltd, J.A. Raul Marg, Off Sayani Road, Prabhadevi, Mumbai, Maharashtra 400025 Landmark: Sigma Estate II


                    <ExternalLink size={10} className="inline ml-1" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-brand-coral shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-semibold block mb-0.5">Contact Number:</span>
                  <a href="tel:+917506903401" className="text-brand-sage hover:text-brand-ivory transition-colors font-bold">
                    +91 75069 03401
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-brand-coral shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-semibold block mb-0.5">Clinic Hours:</span>
                  <span className="text-brand-sage leading-relaxed block">
                    Monday - Saturday: 10:00 AM – 2:00 PM, 5:00 PM – 9:00 PM
                  </span>
                  <span className="text-brand-coral/80 font-medium block mt-0.5">
                    Sunday: Closed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-sage/10 pt-6 mt-8 text-[11px] text-brand-sage">
            &copy; {new Date().getFullYear()} Keystone Dental Care. All rights reserved.
          </div>
        </div>

        {/* Map Embed (7 columns) */}
        <div className="lg:col-span-7 h-80 lg:h-auto rounded-3xl overflow-hidden border border-brand-sage/15 relative bg-brand-teal/5">
          {/* Embedding a real Google Map of Prabhadevi, Mumbai area */}
          <iframe
            title="Keystone Dental Care Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.1332845688537!2d72.825227!3d19.013898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cecb6b7b7fbf%3A0xe188b43bd12e84d4!2sElanza%20Tower%2C%20Sayani%20Rd%2C%20Prabhadevi%2C%20Mumbai%2C%20Maharashtra%20400025!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale opacity-90 contrast-125"
          ></iframe>
        </div>

      </div>
    </footer>
  );
}
