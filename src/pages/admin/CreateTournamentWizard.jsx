import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, CheckCircle, ArrowRight, ArrowLeft, Upload, FileText } from 'lucide-react';

export const CreateTournamentWizard = () => {
  const { createTournament, setCurrentView, addToast } = useApp();
  const [step, setStep] = useState(1);
  const [scheduleError, setScheduleError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    sport: 'Cricket',
    category: 'cricket',
    format: 'Knockout',
    type: 'Team',
    venue: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    entryFee: 1000,
    prizePool: 25000,
    maxParticipants: 16,
    description: '',
    rules: 'Standard playing rules apply.\nTeam rosters limited to maximum capacity.\nReferee decisions are final.',
    bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80'
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 3) {
      const validationMessage = validateSchedule(formData);
      if (validationMessage) {
        setScheduleError(validationMessage);
        addToast(validationMessage, 'error');
        return;
      }
    }
    if (step < 5) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const validateSchedule = ({ registrationDeadline, startDate, endDate }) => {
    if (!registrationDeadline || !startDate || !endDate) {
      return 'Please provide deadline, start date, and end date.';
    }
    if (registrationDeadline > startDate) {
      return 'Registration deadline must be on or before the start date.';
    }
    if (startDate > endDate) {
      return 'Start date must be on or before the end date.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationMessage = validateSchedule(formData);
    if (validationMessage) {
      setStep(3);
      setScheduleError(validationMessage);
      addToast(validationMessage, 'error');
      return;
    }
    createTournament(formData);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Create New Tournament</h1>
          <p className="text-xs text-slate-500">Multi-step wizard to setup and launch sports championships.</p>
        </div>
        <button onClick={() => setCurrentView('manage-tournaments')} className="btn btn-outline text-xs">
          Cancel Setup
        </button>
      </div>

      {/* Step Indicator Bar */}
      <div className="wizard-steps">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Format & Rules' },
          { num: 3, label: 'Schedule' },
          { num: 4, label: 'Pricing' },
          { num: 5, label: 'Publish' }
        ].map(s => (
          <div 
            key={s.num} 
            className={`wizard-step ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}
          >
            <div className="step-number">{s.num}</div>
            <span className="text-[10px] font-bold hidden sm:block text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Form Container */}
      <div className="material-card p-6 space-y-6">
        
        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4 text-xs">
            <h3 className="font-bold text-sm font-outfit text-blue-600">Step 1: Tournament Identification</h3>
            
            <div className="form-group">
              <label className="form-label">Tournament Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input-field py-2.5"
                placeholder="e.g. All India Inter-College Cricket Cup 2026"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Sport Discipline</label>
                <select 
                  value={formData.sport}
                  onChange={e => setFormData({ ...formData, sport: e.target.value, category: e.target.value.toLowerCase() })}
                  className="input-field py-2.5"
                >
                  {['Cricket', 'Football', 'Basketball', 'Volleyball', 'Tennis', 'Badminton', 'Chess', 'Table Tennis', 'Kabaddi', 'Athletics'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Participation Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="input-field py-2.5"
                >
                  <option value="Team">Team Tournament</option>
                  <option value="Individual">Individual Athlete</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Overview / Description</label>
              <textarea 
                rows="3"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="input-field py-2"
                placeholder="Write a brief overview..."
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button type="submit" className="btn btn-primary py-2 px-4 text-xs font-semibold">
                Next: Format & Rules <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: FORMAT & RULES */}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4 text-xs">
            <h3 className="font-bold text-sm font-outfit text-blue-600">Step 2: Tournament Structure & Playing Rules</h3>
            
            <div className="form-group">
              <label className="form-label">Tournament Format</label>
              <select 
                value={formData.format}
                onChange={e => setFormData({ ...formData, format: e.target.value })}
                className="input-field py-2.5"
              >
                <option value="Knockout">Knockout (Single Elimination)</option>
                <option value="Round Robin">Round Robin (League Points Table)</option>
                <option value="Swiss">Swiss System</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Official Playing Rules & Guidelines (One per line)</label>
              <textarea 
                rows="5"
                value={formData.rules}
                onChange={e => setFormData({ ...formData, rules: e.target.value })}
                className="input-field py-2 font-mono text-xs"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button type="button" onClick={handleBack} className="btn btn-outline py-2 text-xs">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" className="btn btn-primary py-2 px-4 text-xs font-semibold">
                Next: Schedule & Venue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SCHEDULE & VENUE */}
        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-4 text-xs">
            <h3 className="font-bold text-sm font-outfit text-blue-600">Step 3: Venue Location & Event Dates</h3>
            
            <div className="form-group">
              <label className="form-label">Venue Location & Stadium Name *</label>
              <input 
                type="text" 
                required
                value={formData.venue}
                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                className="input-field py-2.5"
                placeholder="e.g. City Central Indoor Stadium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input 
                  type="date" 
                  required
                  value={formData.startDate}
                  onChange={e => {
                    setFormData({ ...formData, startDate: e.target.value });
                    if (scheduleError) {
                      setScheduleError('');
                    }
                  }}
                  className="input-field py-2"
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input 
                  type="date" 
                  required
                  value={formData.endDate}
                  onChange={e => {
                    setFormData({ ...formData, endDate: e.target.value });
                    if (scheduleError) {
                      setScheduleError('');
                    }
                  }}
                  className="input-field py-2"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Deadline *</label>
                <input 
                  type="date" 
                  required
                  value={formData.registrationDeadline}
                  onChange={e => {
                    setFormData({ ...formData, registrationDeadline: e.target.value });
                    if (scheduleError) {
                      setScheduleError('');
                    }
                  }}
                  className="input-field py-2"
                />
              </div>
            </div>

            {scheduleError && (
              <div className="rounded-lg bg-rose-100 border border-rose-200 text-rose-700 px-4 py-3 text-xs">
                {scheduleError}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button type="button" onClick={handleBack} className="btn btn-outline py-2 text-xs">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" className="btn btn-primary py-2 px-4 text-xs font-semibold">
                Next: Pricing & Limits <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: PRICING & LIMITS */}
        {step === 4 && (
          <form onSubmit={handleNext} className="space-y-4 text-xs">
            <h3 className="font-bold text-sm font-outfit text-blue-600">Step 4: Entry Fees & Prize Pool Allocation</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="form-group">
                <label className="form-label">Entry Fee (₹)</label>
                <input 
                  type="number" 
                  required
                  value={formData.entryFee}
                  onChange={e => setFormData({ ...formData, entryFee: parseInt(e.target.value) || 0 })}
                  className="input-field py-2"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prize Pool (₹)</label>
                <input 
                  type="number" 
                  required
                  value={formData.prizePool}
                  onChange={e => setFormData({ ...formData, prizePool: parseInt(e.target.value) || 0 })}
                  className="input-field py-2"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Participants / Teams</label>
                <input 
                  type="number" 
                  required
                  value={formData.maxParticipants}
                  onChange={e => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                  className="input-field py-2"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button type="button" onClick={handleBack} className="btn btn-outline py-2 text-xs">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" className="btn btn-primary py-2 px-4 text-xs font-semibold">
                Next: Preview & Publish <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: PREVIEW & PUBLISH */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h3 className="font-bold text-sm font-outfit text-blue-600">Step 5: Media Upload & Final Review</h3>
            
            <div className="form-group">
              <label className="form-label">Banner Image URL</label>
              <input 
                type="text" 
                value={formData.bannerImage}
                onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
                className="input-field py-2"
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-800/40">
              <span className="badge badge-success">{formData.sport} • {formData.format}</span>
              <h4 className="font-bold text-sm font-outfit text-slate-900 dark:text-slate-100">{formData.name || 'Untitled Tournament'}</h4>
              <p className="text-slate-500">Venue: {formData.venue || 'TBD'} • Fee: ${formData.entryFee} • Prize: ${formData.prizePool}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button type="button" onClick={handleBack} className="btn btn-outline py-2 text-xs">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" className="btn btn-accent py-2.5 px-6 text-xs font-bold shadow-md">
                <CheckCircle className="w-4 h-4" /> Publish Tournament
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
