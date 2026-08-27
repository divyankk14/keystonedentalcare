import React, { useState, useEffect } from 'react';
import { Lock, X, Trash2, Pencil, CalendarDays, Loader2, RefreshCw, Search, Move } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SLOT_HOURS = [10, 11, 12, 13, 17, 18, 19, 20];
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'smile123';

function formatHour(h) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${period}`;
}

function getDates(offsetWeeks = 0) {
  const dates = [];
  const today = new Date();
  
  // Calculate starting point shifted by weeks
  const startDay = new Date(today);
  startDay.setDate(today.getDate() + (offsetWeeks * 7));
  
  let added = 0;
  // Get 7 operating days starting from startDay (skipping Sunday = 0)
  for (let i = 0; added < 7 && i < 30; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
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

export default function AdminDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!unlocked) {
    return (
      <AdminGate 
        pw={pw} 
        setPw={setPw} 
        error={loginError} 
        setError={setLoginError} 
        onUnlock={() => setUnlocked(true)} 
      />
    );
  }

  return <DashboardContent />;
}

// Password sign-in gate
function AdminGate({ pw, setPw, error, setError, onUnlock }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onUnlock();
    } else {
      setError('Invalid admin password.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white border border-brand-sage/15 rounded-3xl p-6 sm:p-8 text-center shadow-md">
      <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-4 text-brand-teal">
        <Lock size={22} />
      </div>
      <h2 className="font-serif text-xl font-bold text-brand-tealDeep mb-1">Clinic Portal</h2>
      <p className="text-brand-sage text-xs mb-6">Enter password to manage schedules</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full text-xs rounded-xl px-4 py-3 mb-3 border border-brand-sage/20 outline-none focus:border-brand-coral transition-colors text-center text-brand-dark"
        />
        {error && (
          <p className="text-xs text-brand-coral mb-3 font-semibold">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-brand-teal hover:bg-brand-light-teal text-brand-ivory py-3 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

// Active Dashboard
function DashboardContent() {
  const [weekOffset, setWeekOffset] = useState(0);
  const dates = getDates(weekOffset);
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // { date, hour, existingBooking }
  const [error, setError] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drag over tracking
  const [dragOverCell, setDragOverCell] = useState(null); // 'dateStr-hour'

  // Fetch all bookings for the visible range of dates
  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const startStr = dateKey(dates[0]);
      const endStr = dateKey(dates[dates.length - 1]);
      const isPlaceholder = supabase.supabaseUrl.includes('placeholder.supabase.co');

      if (isPlaceholder) {
        // One-time migration: convert old YYYY-MM-DD-H keys to YYYY-MM-DD_H
        const raw = JSON.parse(localStorage.getItem('keystone_bookings') || '{}');
        let needsMigration = false;
        const migrated = {};
        Object.keys(raw).forEach((k) => {
          // Old keys: YYYY-MM-DD-H or YYYY-MM-DD-H-local_XXX (no underscore)
          if (!k.includes('_')) {
            const parts = k.split('-');
            if (parts.length >= 4) {
              const newKey = `${parts[0]}-${parts[1]}-${parts[2]}_${parts.slice(3).join('_')}`;
              migrated[newKey] = raw[k];
              needsMigration = true;
            }
          } else {
            migrated[k] = raw[k];
          }
        });
        if (needsMigration) localStorage.setItem('keystone_bookings', JSON.stringify(migrated));

        // Read from localStorage fallback — keys: YYYY-MM-DD_H or YYYY-MM-DD_H_local_XXX
        const localData = migrated;
        const active = {};
        Object.keys(localData).forEach((k) => {
          if (localData[k].status !== 'cancelled') {
            const underscoreIdx = k.indexOf('_');
            if (underscoreIdx === -1) return;
            const dateStrPart = k.substring(0, underscoreIdx);
            const rest = k.substring(underscoreIdx + 1);
            const hourPart = rest.split('_')[0]; // handles _H and _H_local_XXX
            const baseKey = `${dateStrPart}_${hourPart}`;

            if (!active[baseKey]) active[baseKey] = [];
            active[baseKey].push({
              id: localData[k].id || k,
              name: localData[k].name,
              phone: localData[k].phone,
              notes: localData[k].notes || '',
              created_at: localData[k].created_at
            });
          }
        });
        setBookings(active);
      } else {
        // Fetch from Supabase
        const { data, error: fetchErr } = await supabase
          .from('bookings')
          .select('id, booking_date, time_slot, patient_name, phone, notes')
          .gte('booking_date', startStr)
          .lte('booking_date', endStr)
          .eq('status', 'booked');

        if (fetchErr) throw fetchErr;

        const mapped = {};
        (data || []).forEach((row) => {
          const key = `${row.booking_date}-${row.time_slot}`;
          if (!mapped[key]) mapped[key] = [];
          mapped[key].push({
            id: row.id,
            name: row.patient_name,
            phone: row.phone,
            notes: row.notes || ''
          });
        });
        setBookings(mapped);
      }
    } catch (err) {
      console.error('Error fetching dashboard bookings:', err);
      setError('Could not load bookings. Operating in offline demo mode.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [weekOffset]);

  const handleOpenSlot = (d, h, bookingToEdit = null) => {
    const key = `${dateKey(d)}_${h}`;
    setModal({
      date: d,
      hour: h,
      key,
      existing: bookingToEdit
    });
  };

  const handleSaveBooking = async (name, phone, notes) => {
    try {
      const isPlaceholder = supabase.supabaseUrl.includes('placeholder.supabase.co');
      const dKey = dateKey(modal.date);

      if (isPlaceholder) {
        const localData = JSON.parse(localStorage.getItem('keystone_bookings') || '{}');
        
        if (modal.existing?.id || modal.existing?.created_at) {
          // Find matching local storage booking key
          Object.keys(localData).forEach((k) => {
            if (localData[k].created_at === modal.existing.created_at || localData[k].id === modal.existing.id) {
              localData[k] = {
                ...localData[k],
                name,
                phone,
                notes
              };
            }
          });
        } else {
          // Create new local walk-in slot — key: YYYY-MM-DD_H_local_XXX
          const newId = `local_${Date.now()}`;
          const uniqueKey = `${modal.key}_${newId}`;
          localData[uniqueKey] = {
            id: newId,
            name,
            phone,
            notes,
            status: 'booked',
            date: dKey,
            hour: modal.hour,
            created_at: new Date().toISOString()
          };
        }
        localStorage.setItem('keystone_bookings', JSON.stringify(localData));
      } else {
        if (modal.existing?.id) {
          // Update existing
          const { error: updateErr } = await supabase
            .from('bookings')
            .update({ patient_name: name, phone, notes })
            .eq('id', modal.existing.id);

          if (updateErr) throw updateErr;
        } else {
          // Create new walk-in
          const { error: insertErr } = await supabase
            .from('bookings')
            .insert([
              {
                booking_date: dKey,
                time_slot: modal.hour,
                patient_name: name,
                phone,
                notes,
                status: 'booked'
              }
            ]);

          if (insertErr) throw insertErr;
        }
      }
      setModal(null);
      loadBookings();
    } catch (err) {
      alert('Operation failed: ' + err.message);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const isPlaceholder = supabase.supabaseUrl.includes('placeholder.supabase.co');

      if (isPlaceholder) {
        const localData = JSON.parse(localStorage.getItem('keystone_bookings') || '{}');
        Object.keys(localData).forEach((k) => {
          if (localData[k].created_at === modal.existing.created_at || localData[k].id === modal.existing.id) {
            localData[k].status = 'cancelled';
          }
        });
        localStorage.setItem('keystone_bookings', JSON.stringify(localData));
      } else {
        // Update status to 'cancelled'
        const { error: cancelErr } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', modal.existing.id);

        if (cancelErr) throw cancelErr;
      }
      setModal(null);
      loadBookings();
    } catch (err) {
      alert('Failed to cancel appointment: ' + err.message);
    }
  };

  // --- HTML5 Drag & Drop handlers ---
  const handleDragStart = (e, sourceKey, booking) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ sourceKey, booking }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCell !== targetKey) {
      setDragOverCell(targetKey);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverCell(null);
  };

  const handleDrop = async (e, targetDate, targetHour) => {
    e.preventDefault();
    setDragOverCell(null);
    const targetKey = `${dateKey(targetDate)}_${targetHour}`;
    
    // Check if slot has reached capacity (2 bookings)
    if (bookings[targetKey] && bookings[targetKey].length >= 2) {
      alert('Target slot already has 2 bookings. Please choose another slot.');
      return;
    }

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const { sourceKey, booking } = JSON.parse(dataStr);
      
      if (sourceKey === targetKey) return; // Dropped in the same slot

      const isPlaceholder = supabase.supabaseUrl.includes('placeholder.supabase.co');
      const targetDateStr = dateKey(targetDate);

      if (isPlaceholder) {
        // Update in localStorage
        const localData = JSON.parse(localStorage.getItem('keystone_bookings') || '{}');
        
        // Find old key location and shift it
        Object.keys(localData).forEach((k) => {
          if (localData[k].created_at === booking.created_at || localData[k].id === booking.id) {
            localData[k] = {
              ...localData[k],
              date: targetDateStr,
              hour: targetHour,
              updated_at: new Date().toISOString()
            };
          }
        });
        localStorage.setItem('keystone_bookings', JSON.stringify(localData));
      } else {
        // Update in Supabase
        const { error: updateErr } = await supabase
          .from('bookings')
          .update({
            booking_date: targetDateStr,
            time_slot: targetHour
          })
          .eq('id', booking.id);

        if (updateErr) throw updateErr;
      }
      loadBookings();
    } catch (err) {
      console.error('Error shifting booking:', err);
      alert('Failed to reschedule: ' + err.message);
    }
  };

  // Filter bookings based on name or phone search query
  const filteredBookings = React.useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const q = searchQuery.toLowerCase();

    const filtered = {};
    Object.keys(bookings).forEach((k) => {
      const arr = bookings[k] || [];
      const matches = arr.filter(b => b.name.toLowerCase().includes(q) || b.phone.includes(q));
      if (matches.length > 0) {
        filtered[k] = matches;
      }
    });
    return filtered;
  }, [bookings, searchQuery]);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAllActiveList, setShowAllActiveList] = useState(false);

  const totalBookings = React.useMemo(() => {
    const now = new Date();
    const nowStr = now.toISOString().split('T')[0];
    const nowHour = now.getHours();
    
    let count = 0;
    Object.keys(bookings).forEach((key) => {
      // Key format: YYYY-MM-DD_H
      const underscoreIdx = key.indexOf('_');
      if (underscoreIdx === -1) return;
      const dateStrPart = key.substring(0, underscoreIdx);
      const hourPart = parseInt(key.substring(underscoreIdx + 1), 10);
      
      if (dateStrPart > nowStr || (dateStrPart === nowStr && hourPart >= nowHour)) {
        count += (bookings[key] || []).length;
      }
    });
    return count;
  }, [bookings]);

  const handleOpenSearchSlot = (key, booking) => {
    // Parse key format: YYYY-MM-DD_H
    const underscoreIdx = key.indexOf('_');
    const hour = parseInt(key.substring(underscoreIdx + 1), 10);
    const dateStr = key.substring(0, underscoreIdx);
    const dateObj = new Date(dateStr + 'T00:00:00'); // force local midnight

    setModal({
      date: dateObj,
      hour: hour,
      key,
      existing: booking
    });
    setShowSearchResults(false);
    setShowAllActiveList(false);
  };

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 sm:px-6 relative bg-white border border-brand-sage/20 rounded-3xl shadow-lg mt-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-brand-sage/10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-tealDeep">Clinic Dashboard</h1>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="px-3.5 py-1.5 border border-brand-teal/20 hover:border-brand-teal text-[11px] rounded-xl font-semibold bg-white text-brand-teal transition-all shadow-sm"
            >
              &larr; Previous Week
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
              className="px-2.5 py-1.5 bg-brand-ivory text-[10px] text-brand-teal font-bold rounded-lg disabled:opacity-40"
            >
              Today
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="px-3.5 py-1.5 border border-brand-teal/20 hover:border-brand-teal text-[11px] rounded-xl font-semibold bg-white text-brand-teal transition-all shadow-sm"
            >
              Next Week &rarr;
            </button>
          </div>
        </div>
        
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative">
          {/* Phone/Name search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-sage" size={15} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full sm:w-60 text-xs rounded-xl border border-brand-sage/15 pl-9 pr-8 py-2.5 outline-none focus:border-brand-coral bg-white text-brand-dark font-medium placeholder-brand-sage/60"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sage hover:text-brand-dark text-xs"
              >
                Clear
              </button>
            )}

            {/* Live Search Results Popup Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-brand-sage/20 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto p-2">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-brand-sage/10 mb-1">
                  <span className="text-[10px] uppercase font-bold text-brand-sage tracking-wider">Search Results</span>
                  <button onClick={() => setShowSearchResults(false)} className="text-[10px] text-brand-coral font-bold">Close</button>
                </div>
                {Object.keys(filteredBookings).length > 0 ? (
                  Object.keys(filteredBookings).map((key) => {
                    const slotHits = filteredBookings[key] || [];
                    const dateDisplay = key.substring(0, 10);
                    return slotHits.map((b, idx) => (
                      <button
                        key={`${key}-${idx}`}
                        onClick={() => handleOpenSearchSlot(key, b)}
                        className="w-full text-left p-2.5 hover:bg-brand-ivory/50 rounded-xl transition-all flex flex-col gap-0.5 border-b border-brand-sage/5 last:border-0"
                      >
                        <span className="font-bold text-brand-tealDeep text-[11px]">{b.name}</span>
                        <span className="text-[10px] text-brand-dark/70 flex items-center gap-1.5">
                          <span>{b.phone}</span>
                          <span className="text-brand-coral font-semibold">({dateDisplay} at {parseInt(key.substring(key.indexOf('_') + 1), 10)}:00)</span>
                        </span>
                      </button>
                    ));
                  })
                ) : (
                  <div className="text-center py-4 text-brand-sage text-[10px]">No matches found</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAllActiveList(!showAllActiveList)}
              className="bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/20 text-brand-teal px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors"
            >
              {totalBookings} Upcoming · View All Records
            </button>
            <button
              onClick={loadBookings}
              disabled={loading}
              className="p-2.5 border border-brand-sage/20 rounded-xl hover:border-brand-sage transition-all bg-white text-brand-dark disabled:opacity-50"
              title="Reload Bookings"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* All Bookings List View Modal — shows past + upcoming as permanent records */}
      {showAllActiveList && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sage/10 max-w-lg w-full rounded-3xl p-6 shadow-2xl relative max-h-[80vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-sage/10 mb-4">
                <h3 className="font-serif text-lg font-bold text-brand-tealDeep">All Bookings This Week</h3>
                <button onClick={() => setShowAllActiveList(false)} className="text-brand-sage hover:text-brand-dark">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[50vh] pr-1 flex flex-col gap-2">
                {(() => {
                  const now = new Date();
                  const nowStr = now.toISOString().split('T')[0];
                  const nowHour = now.getHours();

                  // Collect ALL bookings — past and upcoming — as permanent records
                  const allBookings = [];
                  Object.keys(bookings).forEach((key) => {
                    const underscoreIdx = key.indexOf('_');
                    if (underscoreIdx === -1) return;
                    const dateStrPart = key.substring(0, underscoreIdx);
                    const hourPart = parseInt(key.substring(underscoreIdx + 1), 10);
                    const slotBookings = bookings[key] || [];
                    const isPast = dateStrPart < nowStr || (dateStrPart === nowStr && hourPart < nowHour);
                    slotBookings.forEach((b) => {
                      allBookings.push({ key, booking: b, dateStrPart, hourPart, isPast });
                    });
                  });

                  // Sort: upcoming first (ascending), then past (most recent first)
                  allBookings.sort((a, b) => {
                    if (a.isPast !== b.isPast) return a.isPast ? 1 : -1;
                    const aVal = `${a.dateStrPart}_${String(a.hourPart).padStart(2,'0')}`;
                    const bVal = `${b.dateStrPart}_${String(b.hourPart).padStart(2,'0')}`;
                    return a.isPast ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
                  });

                  if (allBookings.length > 0) {
                    return allBookings.map(({ key, booking, dateStrPart, hourPart, isPast }, idx) => (
                      <div
                        key={`${key}-${idx}`}
                        onClick={() => handleOpenSearchSlot(key, booking)}
                        className={`p-3 border rounded-2xl transition-all cursor-pointer flex justify-between items-center ${
                          isPast
                            ? 'border-brand-sage/10 bg-gray-50/60 opacity-70 hover:opacity-100'
                            : 'border-brand-sage/10 bg-brand-ivory/30 hover:border-brand-coral/30 hover:bg-brand-ivory/20'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-brand-tealDeep text-xs">{booking.name}</div>
                          <div className="text-[10px] text-brand-dark/70 mt-0.5">{booking.phone}</div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isPast
                              ? 'text-brand-sage bg-brand-sage/10'
                              : 'text-brand-coral bg-brand-coral/5'
                          }`}>
                            {dateStrPart} · {hourPart}:00
                          </span>
                          {isPast && (
                            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Completed</span>
                          )}
                        </div>
                      </div>
                    ));
                  }

                  return (
                    <div className="text-center py-8 text-brand-sage italic text-xs">No bookings found for this week.</div>
                  );
                })()}
              </div>
            </div>
            <div className="pt-4 border-t border-brand-sage/10 mt-4">
              <button
                onClick={() => setShowAllActiveList(false)}
                className="w-full bg-brand-teal text-white py-2.5 rounded-full text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-brand-coral/10 border border-brand-coral/20 rounded-2xl p-4 mb-6 text-xs text-brand-coral font-medium">
          {error}
        </div>
      )}

      {/* Week Calendar Table */}
      <div className="overflow-x-auto rounded-3xl border border-brand-sage/15 shadow-sm bg-white mt-4">
        <table className="w-full text-xs border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-brand-teal/[0.08]">
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-brand-tealDeep w-24">Time</th>
              {dates.map((d) => (
                <th key={dateKey(d)} className="p-4 text-center border-l border-brand-sage/10">
                  <div className="text-[10px] uppercase font-bold text-brand-teal/60 tracking-wider">{dayLabel(d)}</div>
                  <div className="text-sm font-bold text-brand-tealDeep">{dateLabel(d)}</div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {SLOT_HOURS.map((h) => (
              <tr key={h} className="border-t border-brand-sage/10 hover:bg-brand-ivory/40 transition-colors">
                <td className="p-3 font-semibold text-brand-tealDeep bg-brand-teal/[0.08] align-middle">
                  {formatHour(h)}
                </td>
                
                {dates.map((d) => {
                  const key = `${dateKey(d)}_${h}`;
                  const cellBookings = filteredBookings[key] || [];
                  const rawBookings = bookings[key] || [];
                  const isDragOver = dragOverCell === key;
                  
                  return (
                    <td 
                      key={key} 
                      className={`p-2 align-top border-l border-brand-sage/10 transition-colors space-y-2 bg-brand-ivory/60 ${
                        isDragOver ? 'bg-brand-coral/10 border-brand-coral' : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, key)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, d, h)}
                    >
                      {cellBookings.map((booking, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={(e) => handleDragStart(e, key, booking)}
                          onClick={() => handleOpenSlot(d, h, booking)}
                          className="w-full text-left rounded-xl p-2.5 transition-all text-xs bg-blue-600 hover:bg-blue-700 border border-blue-800 text-white cursor-grab active:cursor-grabbing group relative shadow-sm select-none"
                          title="Drag to reschedule"
                        >
                          <div className="absolute right-1 top-1 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Move size={10} />
                          </div>

                          <div className="flex flex-col">
                            <span className="font-bold truncate text-[11px] pr-2">{booking.name}</span>
                            <span className="text-[10px] opacity-90 mt-0.5">{booking.phone}</span>
                            {booking.notes && (
                              <span className="text-[9px] text-brand-ivory italic mt-1 truncate">
                                "{booking.notes}"
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {rawBookings.length < 2 && (
                        <button
                          onClick={() => handleOpenSlot(d, h)}
                          className="w-full text-center py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all font-bold text-[10px] shadow-sm cursor-pointer"
                        >
                          + Open ({rawBookings.length}/2)
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Modal */}
      {modal && (
        <SlotModal
          date={modal.date}
          hour={modal.hour}
          existing={modal.existing}
          onSave={handleSaveBooking}
          onCancel={modal.existing ? handleCancelBooking : null}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// Modal component for adding/editing a booking
function SlotModal({ date, hour, existing, onSave, onCancel, onClose }) {
  const [name, setName] = useState(existing?.name || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [validationError, setValidationError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (!name.trim()) return setValidationError('Name is required.');
    if (!/^[0-9]{10}$/.test(phone.trim())) return setValidationError('Valid 10-digit phone number is required.');

    onSave(name.trim(), phone.trim(), notes.trim());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-brand-dark/45 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl p-6 bg-white border border-brand-sage/10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg font-bold text-brand-tealDeep">
            {existing ? 'Edit Appointment' : 'Add Walk-in'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-brand-ivory rounded-full text-brand-sage transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <p className="text-[11px] text-brand-sage font-medium uppercase tracking-wider mb-6">
          {dayLabel(date)}, {dateLabel(date)} at {formatHour(hour)}
        </p>

        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-4 mb-5">
            <div>
              <label htmlFor="modal-name" className="block text-[10px] font-bold uppercase tracking-widest text-brand-sage mb-1">
                Patient Name
              </label>
              <input
                id="modal-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full text-xs rounded-xl border border-brand-sage/15 px-3 py-2.5 outline-none focus:border-brand-coral transition-colors text-brand-dark font-medium"
              />
            </div>

            <div>
              <label htmlFor="modal-phone" className="block text-[10px] font-bold uppercase tracking-widest text-brand-sage mb-1">
                Phone Number
              </label>
              <input
                id="modal-phone"
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="10-digit number"
                className="w-full text-xs rounded-xl border border-brand-sage/15 px-3 py-2.5 outline-none focus:border-brand-coral transition-colors text-brand-dark font-medium"
              />
            </div>

            <div>
              <label htmlFor="modal-notes" className="block text-[10px] font-bold uppercase tracking-widest text-brand-sage mb-1">
                Admin Notes (Optional)
              </label>
              <textarea
                id="modal-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Needs cleaning, first time visit"
                className="w-full text-xs rounded-xl border border-brand-sage/15 px-3 py-2.5 outline-none focus:border-brand-coral transition-colors text-brand-dark font-medium resize-none"
              />
            </div>
          </div>

          {validationError && (
            <p className="text-xs text-brand-coral mb-4 font-semibold">{validationError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-brand-teal hover:bg-brand-light-teal text-brand-ivory py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Pencil size={12} /> Save Changes
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 bg-brand-coral/10 hover:bg-brand-coral/15 text-brand-coral rounded-full text-xs font-bold transition-all flex items-center gap-1"
              >
                <Trash2 size={12} /> Cancel
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
