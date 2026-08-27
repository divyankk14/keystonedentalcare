import React, { useState, useEffect, useMemo } from 'react';
import { User, Phone, Check, CalendarDays, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Dr. Sayali Dethe's clinic hours:
// Morning block: 10:00 AM - 2:00 PM (slots: 10, 11, 12, 13)
// Evening block: 5:00 PM - 9:00 PM (slots: 17, 18, 19, 20)
const SLOT_HOURS = [10, 11, 12, 13, 17, 18, 19, 20];

function formatHour(h) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${period}`;
}

function getDates() {
  const dates = [];
  const today = new Date();
  let added = 0;
  // Get next 7 operating days (skipping Sunday = 0)
  for (let i = 0; added < 7 && i < 15; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) { // Skip Sunday
      dates.push(d);
      added++;
    }
  }
  return dates;
}

function dateKey(d) {
  return d.toISOString().split('T')[0];
}

function dayLabel(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function dateLabel(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function BookingForm() {
  const dates = useMemo(() => getDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [bookedSlots, setBookedSlots] = useState([]); // List of taken hours for the selected date
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState('');

  const dateStr = dateKey(selectedDate);

  // Fetch booked slots for the selected date
  useEffect(() => {
    let active = true;
    async function fetchAvailability() {
      setLoadingSlots(true);
      setError('');
      try {
        const isPlaceholder = supabase.supabaseUrl.includes('placeholder.supabase.co');
        if (isPlaceholder) {
          // Use localStorage fallback — keys are stored as YYYY-MM-DD_H or YYYY-MM-DD_H_local_XXX
          const localBookings = JSON.parse(localStorage.getItem('keystone_bookings') || '{}');
          const taken = [];
          Object.keys(localBookings).forEach((key) => {
            const underscoreIdx = key.indexOf('_');
            if (underscoreIdx === -1) return; // skip malformed keys
            const bDate = key.substring(0, underscoreIdx);
            const rest = key.substring(underscoreIdx + 1);
            const bHour = parseInt(rest.split('_')[0], 10); // handles YYYY-MM-DD_H and YYYY-MM-DD_H_local_XXX
            if (bDate === dateStr && !isNaN(bHour) && localBookings[key].status !== 'cancelled') {
              taken.push(bHour);
            }
          });
          if (active) setBookedSlots(taken);
        } else {
          // Query real Supabase
          const { data, error } = await supabase
            .from('bookings')
            .select('time_slot')
            .eq('booking_date', dateStr)
            .eq('status', 'booked');

          if (error) throw error;
          if (active) {
            setBookedSlots((data || []).map((row) => row.time_slot));
          }
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
        setError('Failed to fetch slot availability. Operating in offline demo mode.');
        // Fallback list of slots
        if (active) setBookedSlots([]);
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    fetchAvailability();
    return () => { active = false; };
  }, [dateStr]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    
    if (selectedHour === null) return setError('Please pick a time slot.');
    if (!name.trim()) return setError('Please enter your name.');
    if (!/^[0-9]{10}$/.test(phone.trim())) return setError('Please enter a valid 10-digit phone number.');

    setSubmitting(true);

    try {
      const isPlaceholder = supabase.supabaseUrl.includes('placeholder.supabase.co');
      // Key format: YYYY-MM-DD_H (underscore before hour avoids dash ambiguity)
      const uniqueKey = `${dateStr}_${selectedHour}`;

      if (isPlaceholder) {
        // LocalStorage fallback flow
        const localBookings = JSON.parse(localStorage.getItem('keystone_bookings') || '{}');
        
        // Race condition check: slot is taken if any key matching this date+hour is not cancelled
        const alreadyBooked = Object.keys(localBookings).some((k) => {
          const uidx = k.indexOf('_');
          if (uidx === -1) return false;
          const kDate = k.substring(0, uidx);
          const kHour = parseInt(k.substring(uidx + 1).split('_')[0], 10);
          return kDate === dateStr && kHour === selectedHour && localBookings[k].status !== 'cancelled';
        });
        if (alreadyBooked) {
          throw new Error('This slot was just booked by another patient. Please select another slot.');
        }

        // Insert booking
        localBookings[uniqueKey] = {
          name: name.trim(),
          phone: phone.trim(),
          status: 'booked',
          date: dateStr,
          hour: selectedHour,
          created_at: new Date().toISOString()
        };
        localStorage.setItem('keystone_bookings', JSON.stringify(localBookings));

        setConfirmed({
          date: selectedDate,
          hour: selectedHour,
          name: name.trim()
        });
      } else {
        // Real Supabase Flow with race-condition verification
        
        // 1. Check if slot is already occupied
        const { data: existing, error: checkError } = await supabase
          .from('bookings')
          .select('id')
          .eq('booking_date', dateStr)
          .eq('time_slot', selectedHour)
          .eq('status', 'booked')
          .maybeSingle();

        if (checkError) throw checkError;
        if (existing) {
          throw new Error('This slot was just booked by another patient. Please select another slot.');
        }

        // 2. Insert new booking
        const { error: insertError } = await supabase
          .from('bookings')
          .insert([
            {
              booking_date: dateStr,
              time_slot: selectedHour,
              patient_name: name.trim(),
              phone: phone.trim(),
              status: 'booked'
            }
          ]);

        if (insertError) throw insertError;

        setConfirmed({
          date: selectedDate,
          hour: selectedHour,
          name: name.trim()
        });
      }

      // Reset form fields
      setSelectedHour(null);
      setName('');
      setPhone('');
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || 'An error occurred during booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="max-w-md mx-auto text-center bg-white border border-brand-sage/20 rounded-3xl p-8 sm:p-10 shadow-lg mt-8">
        <div className="w-14 h-14 rounded-full bg-brand-teal flex items-center justify-center mx-auto mb-6 text-brand-ivory shadow-md">
          <Check size={28} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-tealDeep mb-3">
          Appointment Confirmed!
        </h2>
        <p className="text-brand-dark/80 text-sm mb-6 leading-relaxed">
          Thank you, <strong className="text-brand-tealDeep font-semibold">{confirmed.name}</strong>. Your appointment has been secured successfully.
        </p>
        
        <div className="bg-brand-ivory rounded-2xl p-5 mb-8 border border-brand-sage/10 text-sm">
          <div className="flex justify-between py-1.5 border-b border-brand-sage/5">
            <span className="text-brand-sage font-medium">Clinic:</span>
            <span className="font-semibold text-brand-tealDeep">Keystone Dental Care</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-brand-sage/5">
            <span className="text-brand-sage font-medium">Doctor:</span>
            <span className="font-semibold text-brand-tealDeep">Dr. Sayali Dethe</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-brand-sage/5">
            <span className="text-brand-sage font-medium">Date:</span>
            <span className="font-semibold text-brand-tealDeep">
              {dayLabel(confirmed.date)}, {dateLabel(confirmed.date)}
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-brand-sage font-medium">Time:</span>
            <span className="font-semibold text-brand-tealDeep">{formatHour(confirmed.hour)}</span>
          </div>
        </div>

        <button
          onClick={() => setConfirmed(null)}
          className="bg-brand-teal hover:bg-brand-teal/90 text-brand-ivory px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <section id="booking-section" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-brand-coral font-bold block mb-2">Scheduling</span>
        <h2 className="font-serif text-3xl font-bold text-brand-tealDeep">Book an Appointment</h2>
        <p className="text-brand-sage text-sm font-light mt-2">
          Select an available day and time slot to book your visit with Dr. Sayali Dethe.
        </p>
      </div>

      <div className="bg-white border border-brand-sage/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Step 1: Select Date */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-tealDeep mb-3">
            1. Select a Date
          </label>
          
          <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-thin">
            {dates.map((d) => {
              const active = dateKey(d) === dateStr;
              return (
                <button
                  type="button"
                  key={dateKey(d)}
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedHour(null);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl p-3 min-w-[76px] transition-all border ${
                    active
                      ? 'bg-brand-teal border-brand-teal text-brand-ivory shadow-sm'
                      : 'bg-brand-ivory/50 border-brand-sage/10 text-brand-dark hover:border-brand-sage/40'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-0.5">
                    {dayLabel(d)}
                  </span>
                  <span className="text-sm font-bold">
                    {dateLabel(d).split(' ')[1]}
                  </span>
                  <span className="text-[9px] font-medium opacity-80 uppercase tracking-widest mt-0.5">
                    {dateLabel(d).split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Time Slots */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-tealDeep">
              2. Choose a Time Slot
            </label>
            {loadingSlots && (
              <span className="text-xs text-brand-sage flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> Checking availability...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SLOT_HOURS.map((h) => {
              // Disable past slots: if today is selected and the hour has already passed
              const now = new Date();
              const isToday = dateStr === dateKey(now);
              const isPast = isToday && now.getHours() >= h;

              const taken = bookedSlots.includes(h);
              const unavailable = taken || isPast;
              const active = selectedHour === h;
              return (
                <button
                  type="button"
                  key={h}
                  disabled={unavailable || loadingSlots}
                  onClick={() => setSelectedHour(h)}
                  className={`rounded-xl py-3 text-xs font-bold tracking-wide transition-all border flex items-center justify-center gap-1.5 ${
                    isPast
                      ? 'bg-gray-50 text-gray-300 border-gray-100 line-through cursor-not-allowed'
                      : taken
                      ? 'bg-brand-sage/10 text-brand-sage border-brand-sage/10 line-through cursor-not-allowed'
                      : active
                      ? 'bg-brand-coral border-brand-coral text-brand-ivory shadow-md shadow-brand-coral/10'
                      : 'bg-white border-brand-sage/15 text-brand-dark hover:border-brand-sage/45'
                  }`}
                >
                  <span>{formatHour(h)}</span>
                  {isPast && <span className="text-gray-300 font-bold text-[10px] no-underline">Past</span>}
                  {!isPast && taken && <span className="text-brand-coral font-bold text-[10px] no-underline">✕</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Patient Form */}
        <form onSubmit={handleConfirm} className="border-t border-brand-sage/10 pt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-tealDeep mb-4">
            3. Fill Contact Information
          </label>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="patient-name" className="block text-[10px] font-bold uppercase tracking-widest text-brand-sage mb-1.5">
                Full Name
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-brand-sage/15 px-3.5 py-3 focus-within:border-brand-coral transition-colors">
                <User size={16} className="text-brand-sage" />
                <input
                  id="patient-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs outline-none bg-transparent text-brand-dark font-medium placeholder-brand-sage/60"
                />
              </div>
            </div>

            <div>
              <label htmlFor="patient-phone" className="block text-[10px] font-bold uppercase tracking-widest text-brand-sage mb-1.5">
                Mobile Number
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-brand-sage/15 px-3.5 py-3 focus-within:border-brand-coral transition-colors">
                <Phone size={16} className="text-brand-sage" />
                <input
                  id="patient-phone"
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="10-digit number"
                  className="w-full text-xs outline-none bg-transparent text-brand-dark font-medium placeholder-brand-sage/60"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-brand-coral/10 border border-brand-coral/20 rounded-xl p-3 mb-6 text-xs text-brand-coral font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-brand-teal hover:bg-brand-light-teal text-brand-ivory px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Securing slot...
              </>
            ) : (
              'Confirm Appointment'
            )}
          </button>
        </form>

      </div>
    </section>
  );
}
