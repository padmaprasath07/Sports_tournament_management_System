import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, CheckCircle, Ticket, Clock, ArrowRight } from 'lucide-react';

export const Contact = () => {
  const { addToast, setNotifications, setCurrentView } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [activeFaq, setActiveFaq] = useState(null);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticketId = 'SP-' + Math.floor(10000 + Math.random() * 90000);
    const newNotif = {
      id: 'notif-' + Date.now(),
      title: `Help Desk Ticket #${ticketId} Logged`,
      message: `Your inquiry regarding "${formData.subject}" has been received. A sports coordinator will contact you at ${formData.email}.`,
      time: 'Just now',
      read: false,
      type: 'system'
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    setSubmittedTicket({
      ticketId,
      subject: formData.subject,
      email: formData.email,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    
    addToast(`Ticket #${ticketId} created! Logged to your notifications.`, 'success');
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
        <h1 className="text-3xl font-bold font-urbanist">Contact Sports Support</h1>
        <p className="text-xs text-slate-500">Have questions about tournament registration, rules, or fixtures? We're here to assist you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="material-card p-6 space-y-4">
            <h3 className="font-bold text-sm font-urbanist text-slate-900 dark:text-slate-100">Help Desk Info</h3>
            
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
            <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Sports Desk Operating Hours</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Mon - Sat: 8:00 AM - 7:00 PM</p>
            <p className="text-[11px] text-slate-400">Urgent match disputes are monitored 24/7 on tournament game days.</p>
          </div>
        </div>

        {/* Contact Form / Submission Receipt */}
        <div className="md:col-span-2 material-card p-6 space-y-4">
          {submittedTicket ? (
            <div className="space-y-4 text-center py-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-urbanist text-slate-900 dark:text-slate-100">
                  Inquiry Ticket Registered
                </h3>
                <p className="text-xs text-slate-500">
                  Your support case has been assigned to our athletic operations team.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Ticket Reference:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{submittedTicket.ticketId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedTicket.subject}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Respondent Contact:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedTicket.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Estimated SLA:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Within 4-6 Business Hours</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="btn btn-outline text-xs py-2 px-4"
                >
                  Send Another Message
                </button>
                <button
                  onClick={() => setCurrentView('notifications')}
                  className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  Check Notifications <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-base font-urbanist">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input-field py-2"
                      placeholder="e.g. Alex Morgan"
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
                      placeholder="alex@college.edu"
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
                    <option value="Scores">Scorecard & Bracket Correction</option>
                    <option value="Organize">Championship Hosting Request</option>
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
                    placeholder="Describe your issue, tournament name, or request in detail..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary py-2.5 px-5 text-xs font-semibold flex items-center gap-1.5 shadow-md">
                  <Send className="w-4 h-4" /> Submit Inquiry Ticket
                </button>
              </form>
            </>
          )}
        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold font-urbanist text-center">Frequently Asked Questions</h3>
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
