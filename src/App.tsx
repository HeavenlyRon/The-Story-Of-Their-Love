/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Heart, Calendar, Camera, Music, ChevronRight, ChevronLeft, MapPin, Sparkles, Menu, X } from "lucide-react";
import photos, { heroPhotos, galleryPhotos } from "./utils/images";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['home','story','moments','letters','music'];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(id);
        });
      }, { threshold: 0.6 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'Story' },
    { id: 'moments', label: 'Moments' },
    { id: 'letters', label: 'Letters' },
    { id: 'music', label: 'Music' }
  ];

  const handleNavClick = (e: any, id: string) => {
    e && e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center ${
        isScrolled ? "bg-ivory/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="font-serif text-2xl tracking-tighter text-rose-gold">Our Story.</div>

      <div className="hidden md:flex gap-8 font-sans text-sm tracking-widest uppercase items-center">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className={`relative px-1 py-1 transition-colors duration-200 ${active === item.id ? 'text-rose-gold nav-active' : 'text-gray-700 hover:text-rose-gold'}`}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="md:hidden">
        <button aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)} className="text-rose-gold p-2">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-60 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div initial={{ x: '-5%' }} animate={{ x: 0 }} exit={{ x: '-5%' }} transition={{ duration: 0.2 }} className="absolute top-14 right-4 left-4 bg-ivory rounded-xl p-6 shadow-2xl">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} onClick={(e) => handleNavClick(e, item.id)} className={`text-lg font-semibold ${active === item.id ? 'text-rose-gold' : 'text-gray-800'}`}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = ({ motionEnabled = true }: { motionEnabled?: boolean }) => {
  const images = (heroPhotos && heroPhotos.length) ? heroPhotos.map((p:any) => p.src) : [];

  const [current, setCurrent] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (!motionEnabled || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev: number) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [motionEnabled, images.length]);

  const heroTransition: any = motionEnabled ? { duration: 2 } : { duration: 0 };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={motionEnabled ? { opacity: 0, scale: 1.1 } : undefined}
          animate={{ opacity: 1, scale: 1 }}
          exit={motionEnabled ? { opacity: 0, scale: 1.05 } : undefined}
          transition={heroTransition}
          className="absolute inset-0 z-0"
        >
          <img
            src={images[current]}
            alt={`Hero ${current + 1}`}
            loading="lazy"
            decoding="async"
            onLoad={(e: any) => e.currentTarget.classList.add('loaded')}
            className="w-full h-full object-cover fade-in"
          />
          <div className="absolute inset-0 cinematic-overlay" />
        </motion.div>
      </AnimatePresence>

      <Particles enabled={motionEnabled} />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={motionEnabled ? { opacity: 0, y: 30 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: motionEnabled ? 1 : 0 }}
        >
          <span className="font-sans text-white/80 uppercase tracking-[0.3em] text-sm mb-6 block">Est. 2018</span>
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 leading-tight">
            Alexander <span className="text-rose-gold italic font-light">&</span> Eleanor
          </h1>
          <p className="font-serif italic text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light">
            “Every memory with you became a piece of home.”
          </p>
          <motion.a
            href="#story"
            whileHover={motionEnabled ? { scale: 1.05 } : undefined}
            whileTap={motionEnabled ? { scale: 0.95 } : undefined}
            className="inline-flex items-center gap-2 bg-rose-gold text-white px-8 py-4 rounded-full font-sans tracking-widest text-sm hover:bg-rose-gold/90 transition-all duration-300 shadow-xl shadow-rose-gold/20"
            aria-label="Begin our story"
          >
            BEGIN OUR STORY <ChevronRight size={18} />
          </motion.a>
        </motion.div>
      </motion.div>

      {motionEnabled ? (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      ) : (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      )}
    </section>
  );
};

const Particles = ({ enabled = true }: { enabled?: boolean }) => {
  if (!enabled) return null;
  const count = 12;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0, 0.5, 0],
            y: `-=${80 + Math.random() * 60}px`,
            x: `+=${Math.random() * 40 - 20}px`
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

const TimelineItem = ({ year, title, description, image, side }: any) => {
  return (
    <div className={`flex flex-col md:flex-row gap-8 items-center mb-28 ${side === "right" ? "md:flex-row-reverse" : ""}`}>
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full md:w-1/2"
      >
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
          <img src={image} alt={title} loading="lazy" decoding="async" className="w-full h-[420px] md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 px-4"
      >
        <span className="font-serif text-rose-gold text-3xl mb-2 block">{year}</span>
        <h3 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">{title}</h3>
        <p className="text-gray-600 leading-relaxed font-light text-lg mb-6">{description}</p>
        <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-rose-gold/60">
          <MapPin size={16} /> <span>Where it all began</span>
        </div>
      </motion.div>
    </div>
  );
};

const OurStory = () => {
  const eventPhotos = photos.slice(0, 8);

  const sampleEvents = [
    { year: '2018', title: 'The First Glance', description: "Under a warm summer light you smiled and everything felt possible." },
    { year: '2019', title: 'Side Pool Smiles', description: "We learned that getting lost meant more time laughing together than worrying." },
    { year: '2020', title: 'Beach Side Afternoons', description: "Long slow afternoons where we talked about small things and held on to the quiet." },
    { year: '2021', title: 'A Simple Promise', description: "An ordinary day that became extraordinary because you were by my side." },
    { year: '2022', title: 'Swimming Together', description: "Tiny moments of surprise that felt like the whole world had been planned for us." },
    { year: '2023', title: 'Living Life', description: "Living life to the fullest, while creating memories that last a lifetime." },
    { year: '2024', title: 'Late Night Laughs', description: "When the world was quiet we found the loudest reasons to smile." },
    { year: '2025', title: 'Always', description: "Small promises, steady presence, and a thousand gentle memories." }
  ];

  const events = sampleEvents.slice(0, eventPhotos.length).map((ev, i) => ({
    ...ev,
    image: eventPhotos[i]?.src ?? '',
    side: i % 2 === 0 ? 'left' : 'right'
  }));

  return (
    <section id="story" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 bg-cream rounded-full mb-6"
          >
            <Calendar className="text-rose-gold" size={24} />
          </motion.div>
          <h2 className="font-serif text-5xl md:text-6xl mb-4 italic">Our Journey</h2>
          <div className="w-24 h-[1px] bg-rose-gold mx-auto" />
        </div>

        <div className="max-w-5xl mx-auto">
          {events.map((event, i) => (
            <TimelineItem key={i} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Moments = ({ motionEnabled = true }: { motionEnabled?: boolean }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [captionOpen, setCaptionOpen] = useState<string | null>(null);
  const photosToShow = (galleryPhotos && galleryPhotos.length) ? galleryPhotos : photos;

  // Limit number for initial render for performance; lazy load rest on intersection
  const initialCount = Math.min(24, photosToShow.length);

  const handleImageError = (e: any) => {
    e.currentTarget.style.opacity = '0.25';
  };

  const pressTimer = useRef<number | null>(null);
  const pressedId = useRef<string | null>(null);
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 768;

  const startPress = (e: React.PointerEvent | React.TouchEvent, src: string, id: string) => {
    e.preventDefault();
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      pressedId.current = id;
      setSelected(src);
      pressTimer.current = null;
    }, 600);
  };

  const endPress = (e: React.PointerEvent | React.TouchEvent, src: string, id: string) => {
    e.preventDefault();
    if (pressTimer.current) {
      // short tap
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
      if (isSmall) {
        setCaptionOpen((prev) => (prev === id ? null : id));
      } else {
        setSelected(src);
      }
    } else {
      // long-press already fired
      pressedId.current = null;
    }
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // captions map — provide reasonable defaults derived from filename; editable in future
  const captionMap: Record<string, string> = Object.fromEntries(
    photosToShow.map((p) => [p.id, captionForName(p.name)])
  );

  return (
    <section id="moments" className="py-32 bg-cream/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-5xl italic mb-6 text-rose-gold">Captured Moments</h2>
            <p className="text-gray-600 font-light text-lg italic">Little memories that made our story.</p>
          </div>
          <motion.button 
            whileHover={motionEnabled ? { scale: 1.05 } : undefined}
            className="flex items-center gap-2 text-rose-gold border border-rose-gold px-6 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-rose-gold hover:text-white transition-all duration-300"
            onClick={() => setSelected(photosToShow[0]?.src ?? null)}
          >
            <Camera size={18} /> Scroll Down
          </motion.button>
        </div>

        <div className="masonry">
          {photosToShow.slice(0, initialCount).map((p, i) => (
            <figure key={p.id} className="masonry-item group overflow-hidden rounded-xl shadow-lg scrapbook-border relative" data-id={p.id}>
              <button
                aria-label={`Open photo ${i+1}`}
                onPointerDown={(e) => startPress(e, p.src, p.id)}
                onPointerUp={(e) => endPress(e, p.src, p.id)}
                onPointerLeave={() => cancelPress()}
                onTouchStart={(e) => startPress(e, p.src, p.id)}
                onTouchEnd={(e) => endPress(e, p.src, p.id)}
                onTouchCancel={() => cancelPress()}
                className="block w-full h-full text-left"
              >
                <img src={p.src} alt={p.name ?? `Moment ${i+1}`} loading="lazy" decoding="async" onError={handleImageError} onLoad={(e:any) => e.currentTarget.classList.add('loaded')} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>

              <figcaption className={`caption-overlay ${captionOpen === p.id ? 'open' : ''}`}>
                <div className="caption-text">{captionMap[p.id]}</div>
              </figcaption>

            </figure>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
              <motion.img src={selected} alt="Preview" initial={motionEnabled ? { scale: 0.98 } : undefined} animate={{ scale: 1 }} className="max-w-[90%] max-h-[85%] rounded-xl shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

function captionForName(name: string) {
  const n = name.toLowerCase();
  if (/beach|sea|ocean|shore/.test(n)) return 'Sunset by the sea — a quiet promise.';
  if (/party|birthday|happy|newyear/.test(n)) return 'Celebrating together under warm lights.';
  if (/mirror|selfie/.test(n)) return 'A small mirror moment — just us.';
  if (/waterfall|pool|swim/.test(n)) return 'First trip together, wonder in every step.';
  if (/picnic|park/.test(n)) return 'Laughing together during a spontaneous walk.';
  if (/grad|graduation/.test(n)) return 'A proud moment shared in a small crowd.';
  if (/dinner|food|cake/.test(n)) return 'Sweet bites and sweeter company.';
  return 'A quiet moment captured between the two of us.';
}

const LoveLetters = ({ motionEnabled = true }: { motionEnabled?: boolean }) => {
  const [open, setOpen] = useState(false);

  const letterText = `I just want to say thank you for everything.

I know I’m not always the best at showing my feelings, and sometimes I make mistakes, but please know that I truly love you and care about you so much.

You’ve become such an important part of my life, and honestly, you make my days better just by being here. I appreciate the little things you do, the way you understand me, and the patience you give me even when I’m difficult to deal with sometimes.

I’ve learned that love isn’t only about saying “I love you.” It’s about making each other feel valued, understood, and cared for. I’m still learning, but I promise I’ll keep trying to become better for you and for us.

No relationship is perfect, but I want you to know that you’re someone I truly cherish. I hope we continue growing together, fixing things together, and making more memories together.

No matter how imperfect I am at expressing it, choosing you has always been the easiest decision I’ve ever made.

I love you, always. ❤️`;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const containerVariant: any = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
  const modalVariant: any = { hidden: { y: 20, opacity: 0, scale: 0.98 }, visible: { y: 0, opacity: 1, scale: 1 }, exit: { y: 20, opacity: 0, scale: 0.98 } };
  const listVariant: any = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const paraVariant: any = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  return (
    <section id="letters" className="py-32 bg-ivory">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <Sparkles className="mx-auto text-rose-gold/40 mb-8" size={48} />

        <div className="flex justify-center">
          <motion.div className="relative w-[360px] h-[220px]" initial={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>
            <motion.button
              aria-label="Open letter"
              className="envelope w-full h-full rounded-2xl bg-ivory shadow-2xl cursor-pointer focus:outline-none"
              onClick={() => setOpen(true)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-36 bg-paper rounded-md shadow-inner p-4 flex items-center justify-center text-sm text-gray-700"> 
                  <div className="text-left leading-relaxed">Open me</div>
                </div>
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-14 border-r-14 border-b-10 border-transparent border-b-ivory"></div>
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[92] flex items-center justify-center p-4 md:p-6" variants={containerVariant} initial="hidden" animate="visible" exit="exit">
              <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

              <motion.div role="dialog" aria-modal="true" aria-label="Love letter" variants={modalVariant} initial="hidden" animate="visible" exit="exit" transition={{ duration: motionEnabled ? 0.42 : 0 }} className="relative z-10 max-w-3xl w-full bg-gradient-to-b from-white to-[#fff8f2] rounded-2xl shadow-2xl p-6 md:p-10">

                <button aria-label="Close letter" onClick={() => setOpen(false)} className="absolute right-4 top-4 md:right-6 md:top-6 bg-white/40 hover:bg-white/60 rounded-full p-2 shadow-md z-20">
                  <X size={18} />
                </button>

                <motion.div className="paper-bg p-6 md:p-8 rounded-lg shadow-inner text-left text-base md:text-lg leading-relaxed font-sans text-gray-800 max-h-[70vh] overflow-auto" variants={listVariant} initial="hidden" animate="visible">
                  {letterText.split('\n\n').map((para, i) => (
                    <motion.p key={i} className="mb-4" variants={paraVariant}>{para}</motion.p>
                  ))}
                </motion.div>

                <div className="mt-6 flex justify-between items-center">
                  <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-full bg-rose-gold text-white">Close</button>
                  <div className="text-sm text-rose-gold">— Always</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const MusicSection = ({ motionEnabled = true }: { motionEnabled?: boolean }) => {
  return (
     <section id="music" className="py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src={photos[3]?.src ?? ''} loading="lazy" onLoad={(e: any) => e.currentTarget.classList.add('loaded')} className="w-full h-full object-cover fade-in" alt="Vinyl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Music className="mx-auto mb-8 text-rose-gold" size={48} />
          <h2 className="font-serif text-4xl md:text-6xl italic mb-6">The Soundtrack to Us</h2>
          <p className="font-sans text-white/60 tracking-widest text-sm mb-12 uppercase">Our favorite melodies from 2018 to now</p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 text-left border border-white/10">
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl">
              <img src={photos[4]?.src ?? ''} loading="lazy" onLoad={(e: any) => e.currentTarget.classList.add('loaded')} alt="Album" className="w-full h-full object-cover fade-in" />
            </div>
            <div className="flex-1">
              <span className="text-rose-gold font-sans text-xs tracking-widest uppercase mb-2 block">Currently Playing</span>
              <h3 className="font-serif text-3xl mb-1">Coming Home</h3>
              <p className="text-white/60 mb-6 italic">Leon Bridges</p>
              
              <div className="w-full h-1 bg-white/20 rounded-full mb-4">
                <motion.div 
                  initial={motionEnabled ? { width: 0 } : undefined}
                  animate={{ width: "65%" }}
                  transition={motionEnabled ? { duration: 10, repeat: Infinity } : { duration: 0 }}
                  className="h-full bg-rose-gold rounded-full relative"
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                </motion.div>
              </div>
              
              <div className="flex justify-between text-[10px] text-white/40 tracking-widest">
                <span>02:14</span>
                <span>03:26</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 bg-ivory text-center">
      <div className="container mx-auto px-6">
        <Heart className="mx-auto text-rose-gold mb-6 fill-rose-gold" size={32} />
        <h2 className="font-serif text-3xl italic mb-2">Our Story Continues</h2>
        <p className="text-gray-500 font-light text-sm tracking-widest uppercase mb-12">Handcrafted with love by us</p>
        <div className="w-full h-[1px] bg-rose-gold/10 mb-12" />
        <p className="text-gray-400 font-sans text-xs tracking-widest">© 2025 ALL RIGHTS RESERVED. FOR PERSONAL USE ONLY.</p>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    const update = () => {
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const saveData = typeof navigator !== 'undefined' && (navigator as any).connection && (navigator as any).connection.saveData;
      const smallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
      setMotionEnabled(!(prefersReduced || saveData || smallScreen));
    };
    update();
    window.addEventListener('resize', update);
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener?.('change', update);
    }
    return () => {
      window.removeEventListener('resize', update);
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        mq.removeEventListener?.('change', update);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-ivory selection:bg-rose-gold/20 scroll-smooth">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-rose-gold z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <Navbar />
      <main>
        <Hero motionEnabled={motionEnabled} />
        <OurStory />
        <Moments motionEnabled={motionEnabled} />
        <LoveLetters motionEnabled={motionEnabled} />
        <MusicSection motionEnabled={motionEnabled} />
      </main>
      <Footer />
    </div>
  );
}

