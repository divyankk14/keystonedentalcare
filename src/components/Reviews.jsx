import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function Reviews() {
  const [activeIdx, setActiveIdx] = useState(0);

  const reviewsList = [
    {
      name: 'Gautami Mamidi',
      text: 'I have done my root canal treatment from Keystone. Dr. Dethe is so polite and gentle. I would highly recommend to keystone dental care clinic.',
      rating: 5,
      date: '1 week ago',
    },
    {
      name: 'SHIVANI GAIKWAD',
      text: "I had a great experience with Dr. Sayli dethe. She's very caring and gentle, making me feel comfortable during my appointment. Her friendly demeanor and willingness to listen put me at ease. The staff was also welcoming and helpful. I appreciate her compassionate approach and recommend her to anyone looking for a kind and understanding dentist!.",
      rating: 5,
      date: '3 weeks ago',
    },
    {
      name: 'Mansha Tungekar',
      text: 'Visited the clinic. Very warm and nice ambience. Dr. Sayali Dethe is also very cordial and understands patients need.',
      rating: 5,
      date: '1 month ago',
    },
    {
      name: 'Amit Bikram',
      text: "Amazing Hospitality, I recently had my root canal treatment there. Amazing work by the doctor i must say. She's very professional.",
      rating: 5,
      date: '2 months ago',
    },
    {
      name: 'Vinit Khanvilkar',
      text: 'The facilities were clean and modern, and the dentist was incredibly knowledgeable and skilled. She took the time to thoroughly explain the treatment plan and address any concerns I had. Throughout the procedure, she was gentle and attentive, making sure I was comfortable at all times.',
      rating: 5,
      date: 'Recent',
    },
    {
      name: 'Priyanka Shete',
      text: 'My experience was very Good, Doctor is very cooperative and experience',
      rating: 5,
      date: '3 weeks ago',
    },
    {
      name: 'Meena Kedari',
      text: 'I did my teeth cleaning. I had a good experience. I recommend Dr. Sayali for her professionalism.',
      rating: 5,
      date: 'Recent',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviewsList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-brand-ivory/50 border-t border-b border-brand-sage/10 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-coral font-bold block mb-2">Testimonials</span>
          <h2 className="font-serif text-3xl font-bold text-brand-tealDeep">
            Google Reviews from Patients
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-white rounded-3xl border border-brand-sage/15 p-8 sm:p-10 shadow-sm max-w-2xl mx-auto">
          {/* Decorative quote icon */}
          <div className="absolute top-6 right-6 text-brand-sage/15">
            <MessageSquare size={48} />
          </div>

          <div className="flex flex-col items-center text-center">

            {/* Stars */}
            <div className="flex text-brand-coral mb-4">
              {[...Array(reviewsList[activeIdx].rating)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            {/* Review text */}
            <p className="text-brand-dark/90 text-sm sm:text-base font-light italic leading-relaxed mb-6">
              "{reviewsList[activeIdx].text}"
            </p>

            {/* Reviewer Details */}
            <div className="flex flex-col items-center">
              <span className="font-serif font-bold text-brand-tealDeep text-sm">
                {reviewsList[activeIdx].name}
              </span>
              <span className="text-[10px] text-brand-sage font-medium uppercase tracking-wider mt-1">
                Google Reviewer · {reviewsList[activeIdx].date}
              </span>
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 mt-8">
            {reviewsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${activeIdx === idx ? 'bg-brand-coral w-4' : 'bg-brand-sage/30 hover:bg-brand-sage/50'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
