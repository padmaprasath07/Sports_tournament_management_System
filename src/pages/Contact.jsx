import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown } from 'lucide-react';

export const Contact = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Your message has been sent to the sports desk!', 'success');
    setFormData({ name: '', email: '', subject: 'General', message: '' });
  };

  const faqs = [
    { q: 'How do I register my team for a tournament?', a: 'Browse the tournaments page, select an active tournament with "Registration Open", and click Register to fill out your team details.' },
    { q: 'Can I change my match schedule after bracket publication?', a: 'Match schedules can only be adjusted by the Admin Event Director through the Fixture Management page.' },
    { q: 'What payment methods are supported for entry fees?', a: 'We accept Credit/Debit Cards, UPI, Netbanking, and College Sports Wallet passes.' }
  ];

  return (
    <div className="space-y-12 animate-fade-in py-6 max-w-5xl mx-auto">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-outfit">Contact Sports Support</h1>
        <p className="text-xs text-slate-500">Have questions about tournament registration, rules, or fixtures?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="material-card p-6 space-y-4">
            <h3 className="font-bold text-sm font-outfit text-slate-900 dark:text-slate-100">Help Desk Info</h3>
            
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Sports Complex Headquarters, Block C, City Campus</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>support@sportpulse.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>+91 1800 555 9900</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 text-xs space-y-1">
            <p className="font-bold text-blue-900 dark:text-blue-200">Sports Desk Operating Hours</p>
            <p className="text-slate-600 dark:text-slate-400">Mon - Sat: 8:00 AM - 7:00 PM</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 material-card p-6 space-y-4">
          <h3 className="font-bold text-base font-outfit">Send Us a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-field py-2"
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="input-field py-2"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Query Category</label>
              <select 
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="input-field py-2"
              >
                <option value="General">General Inquiry</option>
                <option value="Registration">Tournament Registration Issue</option>
                <option value="Scores">Scorecard Correction</option>
                <option value="Organize">Event Hosting Request</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea 
                rows="4" 
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="input-field py-2"
                placeholder="Describe your issue or request..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary py-2.5 px-5 text-xs font-semibold">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold font-outfit text-center">Frequently Asked Questions</h3>
        <div className="space-y-2 max-w-2xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="material-card overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 font-bold text-xs flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
