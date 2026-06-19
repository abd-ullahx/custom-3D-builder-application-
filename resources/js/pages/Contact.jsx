import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, CheckCircle } from 'lucide-react'
import { COLORS, TEXT, BG, SPACING, GRADIENTS, BTN } from '../config/theme'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const contactInfo = [
  { icon: Mail, title: 'Email Us', value: 'hello@eaysports.com', sub: 'We reply within 24 hours' },
  { icon: Phone, title: 'Call Us', value: '+92 300 123 4567', sub: 'Mon–Sat, 9am – 6pm PKT' },
  { icon: MapPin, title: 'Visit Us', value: 'Lahore, Punjab, Pakistan', sub: 'Head office location' },
  { icon: Clock, title: 'Working Hours', value: 'Mon – Sat', sub: '9:00 AM – 6:00 PM' },
]

export const Contact = () => {
  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowMap(true), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => setData(e.target.name, e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/contact', {
      onSuccess: () => {
        setSubmitted(true)
        reset()
      },
      onError: (err) => {
        console.error("Form submission errors:", err);
      }
    })
  }

  console.log("Current form errors:", errors);

  return (
    <div className="pt-20 bg-white min-h-screen">

      {/* Hero Banner */}
      <section className="relative bg-[#4F46E5] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-purple-400 blur-3xl" />
        </div>
        <div className={`${SPACING.container} max-w-4xl text-center relative z-10`}>
          <motion.div {...fadeUp()} className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full mb-6">
            <MessageSquare size={14} className="text-white" />
            <span className="text-xs text-white uppercase tracking-widest">Get In Touch</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-[40px] md:text-[60px] text-white leading-[1.1] mb-6">
            We'd Love to<br />
            <span className="text-yellow-300">Hear From You</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Have a question, a bulk order, or just want to say hi? Our team is always ready to help you gear up.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={`${SPACING.container} max-w-6xl py-16`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {contactInfo.map(({ icon: Icon, title, value, sub }, i) => (
            <motion.div key={title} {...fadeUp(i * 0.1)} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center hover:border-[#4F46E5]/30 hover:shadow-md transition-all group">
              <div className="w-12 h-12 mx-auto bg-[#4F46E5]/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#4F46E5] transition-colors">
                <Icon size={22} className="text-[#4F46E5] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-slate-600 text-sm mb-1">{title}</h3>
              <p className="text-slate-700 text-[13px]">{value}</p>
              <p className="text-slate-400 text-xs mt-1">{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Contact Form */}
          <motion.div {...fadeUp()}>
            <h2 className="text-[28px] text-slate-700 mb-2">Send a Message</h2>
            <p className="text-slate-500 text-sm mb-8">Fill out the form and we'll get back to you as soon as possible.</p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <CheckCircle size={60} className="text-green-500 mb-4" />
                <h3 className="text-2xl text-slate-700 mb-2">Message Sent!</h3>
                <p className="text-slate-500">Thank you for reaching out. We'll reply within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); reset() }}
                  className="mt-6 text-[#4F46E5] text-sm hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      required
                      maxLength={255}
                      disabled={processing}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-slate-200 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5]'} text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-65`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                    {data.name.length >= 255 && <p className="text-orange-500 text-xs mt-1.5">Maximum length reached</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      required
                      maxLength={255}
                      disabled={processing}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-slate-200 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5]'} text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-65`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={data.subject}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    disabled={processing}
                    placeholder="e.g. Bulk Order Inquiry"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-slate-200 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5]'} text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-65`}
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1.5">{errors.subject}</p>}
                  {data.subject.length >= 255 && <p className="text-orange-500 text-xs mt-1.5">Maximum length reached (255 characters)</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Message</label>
                  <textarea
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                    required
                    maxLength={350}
                    disabled={processing}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-slate-200 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5]'} text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all resize-none disabled:opacity-65`}
                  />
                  <div className="flex justify-between items-start mt-1.5">
                    <div>
                      {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                      {data.message.length >= 350 && <p className="text-orange-500 text-xs">Maximum length reached</p>}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {data.message.length} / 350
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3.5 rounded-xl text-sm shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Sending...' : 'Send Message'} <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>

          {/* Map / Visual */}
          <motion.div {...fadeUp(0.2)} className="rounded-2xl overflow-hidden shadow-xl border border-slate-100 h-[480px]">
            {showMap ? (
              <iframe
                title="EAY Sports Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435718.5937836583!2d74.06516!3d31.5203696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1678886400000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-[#4F46E5] animate-spin" />
                <span className="text-xs font-medium text-slate-400">Loading Map...</span>
              </div>
            )}
          </motion.div>

        </div>
      </section>

    </div>
  )
}
