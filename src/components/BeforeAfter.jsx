import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BeforeAfter() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Mobile Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);

  const cases = [
    {
      title: 'Gingival Depigmentation',
      category: 'Cosmetic',
      description: 'Minimally invasive aesthetic gum treatment to reduce pigmentation and enhance your smile.',
      image: '/images/before after/1000307343.png'
    },
    {
      title: 'Dental Crowns',
      category: 'Prosthodontics',
      description: 'Custom-made dental crowns that restore strength, function, and natural aesthetics.',
      image: '/images/before after/1000293875.jpg'
    },
    {
      title: 'Dental Implants',
      category: 'Implants',
      description: 'A durable, natural-looking solution to restore missing teeth, function, and confidence.',
      image: '/images/before after/InShot_20260831_184615703.jpg'
    },
    {
      title: 'Composite Restoration',
      category: 'Restorative',
      description: 'Restoring decayed teeth with natural-looking aesthetics and function.',
      image: '/images/before after/1000293863.jpg'
    },
    {
      title: 'Gingivoplasty',
      category: 'Gum Care',
      description: 'Reshaping the gum line to create a more balanced, symmetrical, and aesthetically pleasing smile.',
      image: '/images/before after/1000289706.jpg'
    },
    {
      title: 'Teeth Whitening',
      category: 'Cosmetic',
      description: 'Brighten your teeth and achieve a visibly whiter, more confident smile.',
      image: '/images/before after/1000293912.jpg'
    },
    {
      title: 'Dentures',
      category: 'Prosthodontics',
      description: 'Restoring missing teeth to improve chewing, speech, comfort, and confidence.',
      image: '/images/before after/1000293915.jpg'
    },
    {
      title: 'Operculectomy',
      category: 'Oral Surgery',
      description: 'Removal of excess gum tissue over a partially erupted wisdom tooth to relieve discomfort and support oral health.',
      image: '/images/before after/1000293859.jpg'
    },
    {
      title: 'Gingivectomy',
      category: 'Gum Care',
      description: 'Precise removal of excess gum tissue to improve gum health.',
      image: '/images/before after/1000293880.jpg'
    },
    {
      title: 'Extraction',
      category: 'Oral Surgery',
      description: 'Safe and gentle removal of teeth that are non-restorable.',
      image: '/images/before after/InShot_20260715_193255696.jpg'
    },
    {
      title: 'Dental Bridge',
      category: 'Prosthodontics',
      description: 'Replacing missing teeth to restore your smile, function, and natural appearance.',
      image: '/images/before after/1000293906.jpg'
    }
  ];

  const categories = ['All', 'Orthodontics', 'Cosmetic', 'Implants', 'Prosthodontics', 'Restorative', 'Gum Care', 'Oral Surgery'];

  const filteredCases = activeCategory === 'All' 
    ? cases 
    : cases.filter(c => c.category === activeCategory);

  // Reset mobile carousel index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Autoplay Effect (Runs on mobile sizes only, when no modal is open)
  useEffect(() => {
    if (selectedImage) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (filteredCases.length <= 1) return 0;
        return (prevIndex + 1) % filteredCases.length;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [filteredCases, selectedImage]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredCases.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCases.length);
  };

  return (
    <section id="before-after" className="py-20 bg-brand-teal text-brand-ivory relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-coral/5 rounded-full blur-3xl -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-coral font-bold block mb-2">Transformations</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-2 leading-tight">
            Before & After Gallery
          </h2>
          <p className="text-brand-sage text-sm font-light px-4 leading-relaxed">
            View actual patient clinical transformations performed by Dr. Sayali Dethe. Select a category below to filter.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-brand-coral text-brand-ivory border-brand-coral'
                  : 'bg-brand-dark/20 text-brand-sage border-brand-sage/20 hover:border-brand-sage/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile View: Automatic Slideshow Carousel */}
        <div className="block md:hidden max-w-md mx-auto relative px-2">
          {filteredCases.length > 0 ? (
            (() => {
              // Ensure index is within range of filteredCases
              const validIndex = currentIndex >= filteredCases.length ? 0 : currentIndex;
              const activeCase = filteredCases[validIndex] || filteredCases[0];
              if (!activeCase) return null;

              return (
                <div 
                  onClick={() => setSelectedImage(activeCase)}
                  className="group bg-brand-dark/30 border border-white/5 rounded-2xl overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-tealDeep">
                    <img 
                      src={activeCase.image} 
                      alt={activeCase.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-dark/30 flex items-center justify-center">
                      <div className="bg-brand-coral text-white p-3 rounded-full shadow-lg">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-brand-coral font-bold block mb-1">
                      {activeCase.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mb-2">
                      {activeCase.title}
                    </h3>
                    <p className="text-brand-sage text-xs font-light leading-relaxed">
                      {activeCase.description}
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-10 text-brand-sage">No cases available in this category.</div>
          )}

          {/* Carousel Arrows */}
          {filteredCases.length > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              
              {/* Indicator dots */}
              <div className="flex gap-1.5">
                {filteredCases.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? 'bg-brand-coral w-4' : 'bg-white/30'}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop View: Responsive Gallery Grid */}
        <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCases.map((c, index) => (
            <div 
              key={index}
              onClick={() => setSelectedImage(c)}
              className="group bg-brand-dark/30 border border-white/5 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:border-brand-coral/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-tealDeep">
                <img 
                  src={c.image} 
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-dark/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <div className="bg-brand-coral text-white p-3 rounded-full shadow-lg">
                    <Maximize2 size={18} />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <span className="text-[10px] uppercase tracking-wider text-brand-coral font-bold block mb-1">
                  {c.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  {c.title}
                </h3>
                <p className="text-brand-sage text-xs font-light leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox / Zoom View */}
        {selectedImage && (
          <div 
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/15 hover:bg-white/25 p-2.5 rounded-full transition-all cursor-pointer"
            >
              <X size={24} />
            </button>
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="max-w-5xl w-full flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-8 bg-brand-dark/40 border border-white/10 p-4 md:p-6 rounded-3xl shadow-2xl cursor-default backdrop-blur-sm"
            >
              {/* Image Container */}
              <div className="flex-1 bg-black/40 rounded-2xl overflow-hidden flex items-center justify-center max-h-[60vh] md:max-h-[75vh]">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.title}
                  className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain rounded-lg"
                />
              </div>

              {/* Sidebar Info Panel */}
              <div className="w-full md:w-80 flex flex-col justify-between text-center md:text-left pt-2 md:pt-0">
                <div>
                  <span className="text-xs uppercase tracking-wider text-brand-coral font-bold block mb-1">
                    {selectedImage.category}
                  </span>
                  <h4 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1 leading-tight">
                    {selectedImage.title}
                  </h4>
                  <p className="text-brand-sage text-sm font-light mt-4 leading-relaxed">
                    {selectedImage.description}
                  </p>
                </div>
                
                <div className="mt-8 md:mt-0 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white py-3 rounded-full text-xs font-semibold shadow-md transition-all active:scale-95 text-center"
                  >
                    Close Gallery View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Preloader for all gallery images to ensure instant opening */}
        <div className="hidden">
          {cases.map((c, i) => (
            <img key={i} src={c.image} alt="preloaded case" />
          ))}
        </div>

      </div>
    </section>
  );
}
