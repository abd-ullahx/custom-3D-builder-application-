import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Sparkles, ChevronRight, Zap, Scissors, Wind, Cpu, X } from 'lucide-react'
import { COLORS, GRADIENTS, SPACING, BTN } from '../../config/theme'

export const VideoShowcase = ({ showcaseVideos }) => {
  const [isPlaying1, setIsPlaying1] = useState(false)
  const [isMuted1, setIsMuted1] = useState(true)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const [isMuted2, setIsMuted2] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalActiveTab, setModalActiveTab] = useState(0)

  const videoRef1 = useRef(null)
  const videoRef2 = useRef(null)
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Default values / fallbacks
  const defaultVideos = [
    {
      phase_name: "Action Phase",
      video_url: "https://www.select-sport.com/cdn/shop/videos/c/vp/05b072ff0f6547d0ac4a35024391ff3f/05b072ff0f6547d0ac4a35024391ff3f.HD-1080p-7.2Mbps-22875215.mp4?v=0"
    },
    {
      phase_name: "Craft Phase",
      video_url: "https://www.select-sport.com/cdn/shop/videos/c/vp/04457a95c3a744be95879b0826d72cc9/04457a95c3a744be95879b0826d72cc9.HD-1080p-7.2Mbps-12161544.mp4?v=0"
    }
  ]

  const video1 = (showcaseVideos && showcaseVideos[0]) ? showcaseVideos[0] : defaultVideos[0]
  const video2 = (showcaseVideos && showcaseVideos[1]) ? showcaseVideos[1] : defaultVideos[1]

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsPlaying1(!mobile)
      setIsPlaying2(!mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '200px' }
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const togglePlay1 = () => {
    if (!videoRef1.current) return
    if (videoRef1.current.paused) {
      videoRef1.current.play()
      setIsPlaying1(true)
    } else {
      videoRef1.current.pause()
      setIsPlaying1(false)
    }
  }

  const toggleMute1 = () => {
    if (!videoRef1.current) return
    videoRef1.current.muted = !videoRef1.current.muted
    setIsMuted1(videoRef1.current.muted)
  }

  const togglePlay2 = () => {
    if (!videoRef2.current) return
    if (videoRef2.current.paused) {
      videoRef2.current.play()
      setIsPlaying2(true)
    } else {
      videoRef2.current.pause()
      setIsPlaying2(false)
    }
  }

  const toggleMute2 = () => {
    if (!videoRef2.current) return
    videoRef2.current.muted = !videoRef2.current.muted
    setIsMuted2(videoRef2.current.muted)
  }

  const VideoControls = ({ isPlaying, isMuted, onTogglePlay, onToggleMute }) => (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause Video" : "Play Video"}
        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all shadow-lg"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      </button>
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute Video" : "Mute Video"}
        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all shadow-lg"
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  )

  return (
    <section ref={sectionRef} className="bg-white mt-2 overflow-hidden border-y border-slate-100 relative">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[600px] lg:min-h-[750px]">

        {/* Left Side: Modern Overlapping Media Cluster */}
        <div className="w-full lg:w-1/2 relative bg-white flex items-center justify-center p-8 lg:p-16 overflow-hidden">
          {/* Abstract Ambient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30" />
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40" style={{ animationDelay: '2s' }} />

          <div className="relative w-full max-w-[500px] aspect-[4/5] z-10">
            {/* Top Right Video: Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 right-0 w-[85%] h-[60%] rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-900/15 z-10 group"
            >
              <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay z-10 pointer-events-none" />
              {inView ? (
                <video
                  key={video1.video_url}
                  ref={videoRef1}
                  autoPlay={!isMobile}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src={video1.video_url} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full bg-slate-900/5 animate-pulse" />
              )}
              <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-widest z-20 shadow-lg">
                {video1.phase_name}
              </div>
              {inView && (
                <VideoControls isPlaying={isPlaying1} isMuted={isMuted1} onTogglePlay={togglePlay1} onToggleMute={toggleMute1} />
              )}
            </motion.div>

            {/* Bottom Left Video: Process/Craft */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute bottom-0 left-0 w-[75%] h-[55%] rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-900/20 z-20 group border-4 border-white"
            >
              <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay z-10 pointer-events-none" />
              {inView ? (
                <video
                  key={video2.video_url}
                  ref={videoRef2}
                  autoPlay={!isMobile}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src={video2.video_url} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full bg-slate-900/5 animate-pulse" />
              )}
              <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-widest z-20 shadow-lg">
                {video2.phase_name}
              </div>
              {inView && (
                <VideoControls isPlaying={isPlaying2} isMuted={isMuted2} onTogglePlay={togglePlay2} onToggleMute={toggleMute2} />
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Side: Editorial Content */}
        <div className="w-full lg:w-1/2 flex items-center bg-[#FAFAFA] p-8 sm:p-16 lg:p-24 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl relative z-10"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-10 bg-indigo-500" />
              <span className="text-[#4F46E5] text-[10px] font-black uppercase tracking-[0.3em]">
                Behind The Scenes
              </span>
            </div>

            <h2 className="text-5xl lg:text-7xl text-slate-900 leading-[1.05] mb-8  tracking-tighter">
              Crafted for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 animate-gradient-x">Champions.</span>
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed mb-14 font-medium max-w-md">
              We merge elite athletic performance with artisanal craftsmanship. Our two-stage process ensures every jersey is both a masterpiece of design and a powerhouse of performance.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-16">
              {[
                { title: 'Action Tested', desc: 'Engineered for peak movement', icon: <Zap className="text-indigo-500" size={20} strokeWidth={2} /> },
                { title: 'Hand-Finished', desc: 'Artisanal attention to detail', icon: <Scissors className="text-indigo-500" size={20} strokeWidth={2} /> },
                { title: 'Breathable Tech', desc: 'Advanced moisture control', icon: <Wind className="text-indigo-500" size={20} strokeWidth={2} /> },
                { title: 'AI Optimized', desc: 'Data-driven fit algorithms', icon: <Cpu className="text-indigo-500" size={20} strokeWidth={2} /> }
              ].map((item, i) => (
                <div key={i} className="group relative flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-300 group-hover:shadow-md transition-all duration-500">
                    <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm tracking-wide mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-[160px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setModalActiveTab(0)
                setIsModalOpen(true)
              }}
              className="group relative inline-flex items-center gap-4 text-indigo-600 font-bold text-[11px] uppercase tracking-[0.2em] overflow-hidden hover:text-indigo-900 transition-colors"
            >
              <span className="relative z-10">Discover Process</span>
              <div className="w-12 h-px bg-indigo-200 group-hover:w-20 group-hover:bg-indigo-900 transition-all duration-500 relative z-10" />
              <ChevronRight size={14} className="relative z-10 -ml-2 group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </motion.div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
          {/* Backdrop Close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[420px] border border-slate-100 z-10">
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-30"
            >
              <X size={16} />
            </button>

            {/* Left Media Block */}
            <div className="w-full md:w-1/2 bg-slate-950 relative overflow-hidden flex items-center min-h-[220px] md:min-h-auto">
              <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay z-10 pointer-events-none" />
              <video
                key={modalActiveTab} // force video reload/restart on tab switch
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              >
                <source src={modalActiveTab === 0 ? video1.video_url : video2.video_url} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 z-20">
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[9px] font-bold uppercase tracking-widest">
                  {modalActiveTab === 0 ? "Stage 01" : "Stage 02"}
                </span>
                <h3 className="text-white text-xl font-bold tracking-tight mt-2.5">
                  {modalActiveTab === 0 ? video1.phase_name : video2.phase_name}
                </h3>
              </div>
            </div>

            {/* Right Information Block */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white relative">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                  <span className="text-indigo-600 text-[9px] font-black uppercase tracking-[0.25em]">
                    Interactive Journey
                  </span>
                </div>

                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => setModalActiveTab(0)}
                    className={`flex-1 pb-3 text-left border-b-2 font-bold text-xs uppercase tracking-wider transition-colors ${
                      modalActiveTab === 0 ? 'border-indigo-600 text-slate-900' : 'border-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    1. Action Phase
                  </button>
                  <button 
                    onClick={() => setModalActiveTab(1)}
                    className={`flex-1 pb-3 text-left border-b-2 font-bold text-xs uppercase tracking-wider transition-colors ${
                      modalActiveTab === 1 ? 'border-indigo-600 text-slate-900' : 'border-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    2. Craft Phase
                  </button>
                </div>

                {modalActiveTab === 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">Performance Engineering</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Every high-performance apparel item starts with physical validation. We test all fabrics for dynamic athletic motions to ensure maximum stretch capability and unmatched range of motion.
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                          <Zap size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Dynamic Stretch Testing</p>
                          <p className="text-[10px] text-slate-400">4-way elasticity certification for raw action</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                          <Wind size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Breathability Matrix</p>
                          <p className="text-[10px] text-slate-400">Moisture-wicking panels strategically mapped</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">Artisanal Customization</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Next, we hand-finish each jersey to ensure elite craftsmanship. Utilizing precise sewing techniques combined with digital templates, we craft a product built to last seasons.
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                          <Scissors size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Hand-Finished Seams</p>
                          <p className="text-[10px] text-slate-400">Double-stitched stress points for rugged wear</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                          <Cpu size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">AI-Optimized Tailoring</p>
                          <p className="text-[10px] text-slate-400">Precision fit algorithms matching actual athlete profiles</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${modalActiveTab === 0 ? 'w-4 bg-indigo-600' : 'bg-slate-200'}`} />
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${modalActiveTab === 1 ? 'w-4 bg-indigo-600' : 'bg-slate-200'}`} />
                </div>
                
                {modalActiveTab === 0 ? (
                  <button 
                    onClick={() => setModalActiveTab(1)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-slate-800 transition-colors"
                  >
                    Next Phase <ChevronRight size={12} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    Explore Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
      `}} />
    </section>
  )
}


