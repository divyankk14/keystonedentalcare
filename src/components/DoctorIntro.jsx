export default function DoctorIntro() {
  return (
    <section aria-labelledby="doctor-heading" className="bg-brand-ivory py-14 sm:py-18 lg:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-brand-sage/15 shadow-lg lg:max-w-lg">
          <img
            src="/images/clinic img/DSC08465.JPG edited.jpeg"
            alt="Dr. Sayali Dethe at Keystone Dental Care"
            className="aspect-[4/3] h-full w-full object-cover object-[78%_center]"
          />
        </div>
        <div className="text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-coral">Meet your dentist</span>
          <h2 id="doctor-heading" className="mt-3 font-serif text-3xl font-bold text-brand-tealDeep sm:text-4xl">Dr. Sayali Dethe</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-brand-dark/75 sm:text-base">
            <p>Dr. Sayali Dethe is a dedicated Periodontist and Oral Implantologist with over 10 years of clinical experience.</p>
            <p>Her areas of expertise include dental implant placement, gum disease treatment, scaling and root planing, periodontal flap surgery, gum grafting procedures, crown lengthening, laser-assisted periodontal therapy, and the management of complex periodontal conditions.</p>
            <p>With a patient-centred approach and commitment to evidence-based care, she strives to make every visit informative, comfortable, and personalised.</p>
            <p>At Keystone Dental Care, she combines attentive consultation with modern dental technology to help patients make informed and confident decisions about their oral health.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
