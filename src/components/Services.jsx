import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import checkupsIcon from '../../icon/check up dental.png';
import xrayIcon from '../../icon/x-ray.png';
import rootCanalIcon from '../../icon/root canal.png';
import fillingIcon from '../../icon/thoot colloured filling.png';
import scalingIcon from '../../icon/dental-scalingand polishing.png';
import whiteningIcon from '../../icon/whitening.png';
import bridgeIcon from '../../icon/dental-bridge.png';
import veneersIcon from '../../icon/dental-veneer.png';
import cosmeticIcon from '../../icon/cosmetic dentistry.png';
import gumIcon from '../../icon/dental gum.png';
import denturesIcon from '../../icon/denture.png';
import dentalImplantIcon from '../../icon/dental-implant.png';
import bracesIcon from '../../icon/braces.png';
import wisdomToothIcon from '../../icon/wisdom-tooth.png';
import pediatricIcon from '../../icon/pediatric dentistry.png';

export default function Services() {
  const [expandedId, setExpandedId] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const servicesList = [
    {
      id: 'checkups',
      name: 'Check-ups',
      short: 'Regular dental Check-ups to keep your teeth and gums healthy.',
      details: 'Routine dental check-ups include oral examinations, oral cancer screening, and overall evaluation of your teeth, gums, and bite to detect and prevent problems early.',
      icon: '🔎',
    },
    {
      id: 'xray',
      name: 'Digital X-ray',
      short: 'Safe and fast digital scans to check what is happening inside your teeth.',
      details: 'Advanced low-radiation digital radiography allows us to view detailed structures of your teeth, roots, and jawbone instantly, helping diagnose issues unseen by the naked eye.',
      icon: '📷',
    },
    {
      id: 'rct',
      name: 'Root Canal Treatment',
      short: 'A predictable approach to save and restore a deeply infected tooth.',
      details: 'Modern, comfortable endodontic treatment that removes infected nerve tissue from inside the tooth, followed by cleaning, disinfecting, and sealing to relieve toothache and prevent extraction.',
      icon: '🛡️',
    },
    {
      id: 'filling',
      name: 'Tooth Coloured Filling',
      short: 'Natural-looking fillings to repair cavities and blend with your teeth.',
      details: 'High-quality composite resins are matched to your natural tooth color to restore teeth damaged by decay or wear, offering both structural strength and seamless aesthetics.',
      icon: '🩹',
    },
    {
      id: 'scaling',
      name: 'Scaling and Polishing',
      short: 'Professional cleaning to remove hard build-up and keep gums healthy.',
      details: 'Deep cleaning to remove plaque, calculus (tartar), and surface stains. Helps prevent gum disease, stops bleeding gums, and ensures fresh breath.',
      icon: '🧼',
    },
    {
      id: 'whitening',
      name: 'Teeth Whitening',
      short: 'Safe treatment to remove stains and brighten your smile.',
      details: 'Professional teeth whitening procedure to lighten tooth colour, remove stains from food and drinks, and brighten your overall smile safely and effectively.',
      icon: '✨',
    },
    {
      id: 'crowns',
      name: 'Crowns and Bridges',
      short: 'Caps and bridges to cover damaged teeth or fill in missing gaps.',
      details: 'Custom zirconia/ceramic caps (crowns) to strengthen broken tooth, and bridges to securely fill empty spaces left by missing teeth, restoring function and appearance.',
      icon: '👑',
    },
    {
      id: 'veneers',
      name: 'Veneers',
      short: 'Custom thin shells bonded to your front teeth to improve their look.',
      details: 'Ultra-thin, custom-made porcelain or composite shells bonded to the front surfaces of the teeth to correct spacing, chips, stains, and minor alignment issues for a perfect smile makeover',
      icon: '💎',
    },
    {
      id: 'cosmetic',
      name: 'Cosmetic Dentistry',
      short: 'Treatments designed to enhance the overall beauty of your smile.',
      details: 'A range of artistic dental treatments—combining bonding, contouring, and alignment checks—tailored entirely to give you your dream smile.',
      icon: '🎨',
    },
    {
      id: 'gum',
      name: 'Gum Disease Treatment',
      short: 'Care to stop gum bleeding, infections, and swelling.',
      details: 'Treatments targeting gingivitis or periodontitis, including subgingival scaling and deep root planing and specialized antimicrobial care to stabilize loose teeth and restore gum health.',
      icon: '❤️',
    },
    {
      id: 'dentures',
      name: 'Dentures',
      short: 'Removable, natural-looking prosthetic teeth for a complete smile.',
      details: 'Custom-designed partial or full dentures to replace missing teeth, restoring chewing capabilities, clear speech, and natural facial contours.',
      icon: '🦷',
    },
    {
      id: 'implants',
      name: 'Dental Implants',
      short: 'Permanent, strong artificial tooth roots to replace missing teeth.',
      details: 'Biocompatible titanium implants surgically placed in the jawbone to function as stable artificial tooth roots for supporting replacement crowns.',
      icon: '⚓',
    },
    {
      id: 'aligners',
      name: 'Braces and Clear Aligners',
      short: 'Straightening treatments to fix crooked teeth and jaw issues.',
      details: 'Discreet clear aligners or traditional ceramic/metal braces designed to correct crowded, spaced, or crooked teeth and align your bite for optimal oral health.',
      icon: '📐',
    },
    {
      id: 'extractions',
      name: 'Extractions / Wisdom Tooth Extraction',
      short: 'Safe and gentle removal of non-restorable or impacted tooth.',
      details: 'Careful removal of non-restorable, hopeless, severely compromised tooth or impacted wisdom tooth under local anesthesia focusing on comfort and fast recovery.',
      icon: '🚪',
    },
    {
      id: 'pediatric',
      name: 'Pediatric Dentistry',
      short: 'Friendly and gentle dental check-ups and care for children.',
      details: 'Gentle dentistry designed for kids. Focuses on comprehensive preventive and restorative dental care, including cavity prevention, fluoride applications, dental sealants, pulpectomy, and space maintainers, with an emphasis on building a positive and healthy attitude towards oral health.',
      icon: '🧸',
    },
  ];

  const serviceIcons = {
    checkups: checkupsIcon,
    xray: xrayIcon,
    rct: rootCanalIcon,
    filling: fillingIcon,
    scaling: scalingIcon,
    whitening: whiteningIcon,
    crowns: bridgeIcon,
    veneers: veneersIcon,
    cosmetic: cosmeticIcon,
    gum: gumIcon,
    dentures: denturesIcon,
    implants: dentalImplantIcon,
    aligners: bracesIcon,
    extractions: wisdomToothIcon,
    pediatric: pediatricIcon,
  };

  return (
    <section id="services" className="py-20 bg-brand-ivory">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-coral font-bold block mb-2">Our expertise</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-tealDeep mb-4">
            Comprehensive Dental Services
          </h2>
          <p className="text-brand-dark/80 text-sm font-medium leading-relaxed">
            We provide advanced dental care customized to your specific needs, focusing on aesthetics, comfort, and clinical precision.
          </p>
        </div>

        {/* Swipe instructions for mobile */}
        <div className="md:hidden text-center text-xs text-brand-sage font-medium tracking-wider mb-4 flex items-center justify-center gap-1.5 opacity-80">
          <span>Swipe left & right to view all services</span>
          <span className="animate-bounce-horizontal">↔️</span>
        </div>

        {/* Card Grid / Horizontal Scroll on Mobile */}
        <div ref={scrollRef} className="flex md:grid overflow-x-auto md:overflow-visible gap-6 pb-6 md:pb-0 snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3 scrollbar-none">
          {servicesList.map((service) => {
            const isExpanded = expandedId === service.id;
            const icon = serviceIcons[service.id];
            return (
              <div
                key={service.id}
                onClick={() => setExpandedId(isExpanded ? null : service.id)}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 cursor-pointer select-none group flex flex-col justify-between min-w-[280px] w-[85vw] md:w-auto md:min-w-0 snap-center shrink-0 ${
                  isExpanded 
                    ? 'border-brand-coral shadow-lg' 
                    : 'border-brand-sage/10 hover:border-brand-sage/35 shadow-sm hover:shadow-md hover:translate-y-[-1px]'
                }`}
              >
                <div>
                  <div className="mb-4 bg-brand-ivory w-12 h-12 rounded-xl flex items-center justify-center text-brand-tealDeep group-hover:text-brand-coral transition-colors">
                    <img src={icon} alt="" className="h-7 w-7 object-contain" aria-hidden="true" />
                  </div>
                  <div className="hidden">
                    {service.icon || '🩺'}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-tealDeep mb-2 group-hover:text-brand-coral transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-brand-dark/70 text-xs font-light leading-relaxed mb-4">
                    {service.short}
                  </p>
                  
                  {/* Expanded description */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-brand-dark/95 text-xs border-t border-brand-sage/10 pt-4 leading-relaxed bg-brand-ivory/30 p-3 rounded-lg">
                      {service.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-sage/5 text-[10px] text-brand-sage font-semibold uppercase tracking-wider">
                  <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-brand-coral' : ''}`} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons for mobile version */}
        <div className="md:hidden flex items-center justify-center gap-5 mt-4">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-white border border-brand-sage/20 shadow-md flex items-center justify-center text-brand-teal hover:bg-brand-light-teal/10 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-white border border-brand-sage/20 shadow-md flex items-center justify-center text-brand-teal hover:bg-brand-light-teal/10 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>
        </div>

      </div>
    </section>
  );
}
