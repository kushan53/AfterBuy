import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { PublicFooter } from '../components/layout/PublicFooter';
import { apiRequest } from '../utils/api';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast({
        title: 'Required Fields Missing',
        message: 'Please fill in your name, email address, and message.',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (res.success) {
        setSubmitted(true);
        addToast({
          title: 'Message Delivered!',
          message: 'Your inquiry has been sent to AfterBuy Support. A confirmation has been sent to your email.',
          type: 'success',
        });
      }
    } catch (err) {
      addToast({
        title: 'Failed to Send',
        message: err.message || 'Could not deliver your message right now. Please try again or write directly to support.afterbuy@gmail.com',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#0F1115] text-slate-900 dark:text-[#F5F7FA] selection:bg-blue-100 selection:text-blue-700 flex flex-col justify-between transition-colors duration-200">
      {/* Header (Fixed at top-0, stays visible on scroll, zero top gap) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/80 dark:border-[#22262F] bg-white/95 dark:bg-[#11141A]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center tracking-wider shadow-xs">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                AFTERBUY
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                Everything after you buy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="small">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-22 pb-12 sm:pt-26 sm:pb-16 flex-1 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white dark:bg-[#171A21] p-4 sm:p-8 md:p-10 rounded-2xl border border-slate-200/90 dark:border-[#292E38] shadow-sm">
          {/* Left Column: Contact details */}
          <div className="md:col-span-2 space-y-6 md:border-r md:border-slate-100 dark:md:border-[#22262F] md:pr-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-[11px] font-semibold mb-3">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>We're here to help</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
                Contact Us
              </h1>
              <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1 leading-relaxed">
                Have a feature request, question about return rules, or need help recovering a delayed refund?
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#1C2028] text-slate-600 dark:text-[#A9B0BC] mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">Email Support</h4>
                  <a
                    href="mailto:support.afterbuy@gmail.com"
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-0.5 block font-medium"
                  >
                    support.afterbuy@gmail.com
                  </a>
                  <p className="text-[10px] text-slate-400 dark:text-[#747C89]">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#1C2028] text-slate-600 dark:text-[#A9B0BC] mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">Hours of Operation</h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">Monday – Saturday</p>
                  <p className="text-[10px] text-slate-400 dark:text-[#747C89]">9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#1C2028] text-slate-600 dark:text-[#A9B0BC] mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">Headquarters</h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">AfterBuy Technologies Inc.</p>
                  <p className="text-[10px] text-slate-400 dark:text-[#747C89]">Bangalore, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Message Received!</h3>
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC] max-w-sm">
                  Thank you, <strong>{name}</strong>. Our consumer support team will reply to <strong>{email}</strong> shortly.
                </p>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name *"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Subject"
                  placeholder="e.g. Question about Amazon 7-day policy tracking"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-[#A9B0BC]">Your Message *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe what you need assistance with..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] px-3 py-2 text-xs text-slate-900 dark:text-[#F5F7FA] placeholder:text-slate-400 dark:placeholder:text-[#747C89] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  className="w-full"
                  disabled={loading}
                  icon={Send}
                  iconPosition="right"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};
