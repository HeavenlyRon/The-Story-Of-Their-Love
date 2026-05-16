/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Heart, Calendar, Camera, Music, ChevronRight, ChevronLeft, MapPin, Sparkles, Menu, X } from "lucide-react";
import photos, { heroPhotos, galleryPhotos } from "./utils/images";

const sailorSongAudio = new URL("../Music/Gigi Perez - Sailor Song (Audio).mp3", import.meta.url).href;
const pagibigAudio = new URL("../Music/fitterkarma - Pag-Ibig ay Kanibalismo II (OFFICIAL MUKBANG VIDEO).mp3", import.meta.url).href;
const evergreenAudio = new URL("../Music/Evergreen (feat. Caamp).mp3", import.meta.url).href;
const mitskiAudio = new URL("../Music/Mitski - My Love Mine All Mine (Official Lyric Video).mp3", import.meta.url).href;

const heroImageSources = heroPhotos.map((photo: any) => photo.src);

const loveLetterText = `I just want to say thank you for everything.

I know I’m not always the best at showing my feelings, and sometimes I make mistakes, but please know that I truly love you and care about you so much.

You’ve become such an important part of my life, and honestly, you make my days better just by being here. I appreciate the little things you do, the way you understand me, and the patience you give me even when I’m difficult to deal with sometimes.

I’ve learned that love isn’t only about saying “I love you.” It’s about making each other feel valued, understood, and cared for. I’m still learning, but I promise I’ll keep trying to become better for you and for us.

No relationship is perfect, but I want you to know that you’re someone I truly cherish. I hope we continue growing together, fixing things together, and making more memories together.

No matter how imperfect I am at expressing it, choosing you has always been the easiest decision I’ve ever made.

I love you, always. ❤️`;

const musicTracks = [
  {
    title: 'Sailor Song',
    artist: 'Gigi Perez',
    src: sailorSongAudio,
    cover: photos[9]?.src ?? ''
  },
  {
    title: 'Pag-ibig ay Kanibalismo',
    artist: 'Filipino Love Song',
    src: pagibigAudio,
    cover: photos[5]?.src ?? ''
  },
  {
    title: 'Evergreen',
    artist: 'Richy Mitch & The Coal Miners',
    src: evergreenAudio,
    cover: photos[6]?.src ?? ''
  },
  {
    title: 'My Love Mine All Mine',
    artist: 'Mitski',
    src: mitskiAudio,
    cover: photos[7]?.src ?? ''
  }
];

// --- Components ---

const RootPortal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>('home');
  const navOffset = 88;

  const navItems = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'Story' },
    { id: 'moments', label: 'Moments' },
    { id: 'letters', label: 'Letters' },
    { id: 'music', label: 'Music' }
  ], []);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsScrolled(window.scrollY > 50));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
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
      }, { threshold: 0.35, rootMargin: `-${navOffset}px 0px -55% 0px` });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [navOffset]);

  const handleNavClick = (e: any, id: string) => {
    e && e.preventDefault();
    setMobileOpen(false);
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      const targetTop = window.scrollY + el.getBoundingClientRect().top - navOffset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center border-b border-transparent pointer-events-none ${
        isScrolled ? "glass-nav shadow-[0_12px_30px_rgba(104,72,58,0.08)]" : "bg-transparent"
      }`}
    >
      <div className="font-serif text-2xl tracking-tighter text-rose-gold pointer-events-auto">Our Story.</div>

      <div className="hidden md:flex gap-8 font-sans text-sm tracking-widest uppercase items-center pointer-events-auto">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className={`relative px-1 py-1 transition-colors duration-200 pointer-events-auto ${active === item.id ? 'text-rose-gold nav-active' : 'text-stone-700 hover:text-rose-gold'}`}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="md:hidden pointer-events-auto">
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
            className="fixed inset-0 z-60 bg-stone-900/35 backdrop-blur-[2px] md:hidden pointer-events-auto"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div initial={{ x: '-5%' }} animate={{ x: 0 }} exit={{ x: '-5%' }} transition={{ duration: 0.2 }} className="absolute top-14 right-4 left-4 theme-card rounded-[1.4rem] p-6 shadow-2xl pointer-events-auto">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} onClick={(e) => handleNavClick(e, item.id)} className={`text-lg font-semibold pointer-events-auto ${active === item.id ? 'text-rose-gold' : 'text-stone-800'}`}>
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
  const images = useMemo(() => heroImageSources.length ? heroImageSources : [], []);

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
    <section id="home" className="section-surface section-hero relative h-screen w-full overflow-hidden flex items-center justify-center">
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
            loading={current === 0 ? "eager" : "lazy"}
            fetchPriority={current === 0 ? "high" : "auto"}
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
          <span className="font-sans text-white/80 uppercase tracking-[0.3em] text-sm mb-6 block">The Love That Never Fades</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight max-w-4xl mx-auto">
            Discover Our Story Together
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
  const particles = useMemo(() => {
    if (!enabled) return [];
    const count = 8;
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 4,
      drift: Math.random() * 40 - 20,
      rise: 72 + Math.random() * 44,
    }));
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.key}
          initial={{
            opacity: 0,
            x: particle.x,
            y: particle.y
          }}
          animate={{
            opacity: [0, 0.5, 0],
            y: `-=${particle.rise}px`,
            x: `+=${particle.drift}px`
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay
          }}
          className="absolute w-1 h-1 bg-rose-gold/50 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

const TimelineItem = ({ marker, title, description, image, side }: any) => {
  return (
    <div className={`flex flex-col md:flex-row gap-8 items-center mb-28 ${side === "right" ? "md:flex-row-reverse" : ""}`}>
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full md:w-1/2"
      >
        <div className="relative group overflow-hidden rounded-[1.5rem] cinematic-frame shadow-[0_20px_60px_rgba(102,72,58,0.16)]">
          <img src={image} alt={title} loading="lazy" decoding="async" className="w-full h-[420px] md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 cinematic-image-overlay transition-colors" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 px-4"
      >
        <span className="font-sans text-rose-gold/70 text-xs uppercase tracking-[0.35em] mb-3 block">{marker}</span>
        <h3 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">{title}</h3>
        <p className="text-stone-600 leading-relaxed font-light text-lg mb-6">{description}</p>
        <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-rose-gold/60">
          <MapPin size={16} /> <span>Where it all began</span>
        </div>
      </motion.div>
    </div>
  );
};

const RELATIONSHIP_START = Date.UTC(2025, 10, 9, 0, 0, 0, 0);

function getRelationshipDuration(now = Date.now()) {
  const elapsed = Math.max(0, now - RELATIONSHIP_START);
  const totalMinutes = Math.floor(elapsed / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

const RelationshipTimer = () => {
  const [elapsed, setElapsed] = useState(() => getRelationshipDuration());

  useEffect(() => {
    const update = () => setElapsed(getRelationshipDuration());
    update();
    const timerId = window.setInterval(update, 60000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-rose-gold/12 bg-white/55 px-5 py-3 text-sm text-stone-600 shadow-[0_12px_30px_rgba(88,57,45,0.06)] backdrop-blur-sm">
      <span className="font-sans uppercase tracking-[0.28em] text-rose-gold/70">Together since Nov 9, 2025</span>
      <span className="text-stone-400">•</span>
      <span aria-live="polite" className="font-medium text-stone-700">
        {elapsed.days} days, {elapsed.hours} hours, {elapsed.minutes} minutes
      </span>
    </div>
  );
};

const OurStory = () => {
  const eventPhotos = photos.slice(0, 8);

  const sampleEvents = [
    { marker: 'First glance', title: 'The First Glance', description: "Under a warm summer light you smiled and everything felt possible." },
    { marker: 'Poolside laughter', title: 'Side Pool Smiles', description: "We learned that getting lost meant more time laughing together than worrying." },
    { marker: 'Slow afternoons', title: 'Beach Side Afternoons', description: "Long slow afternoons where we talked about small things and held on to the quiet." },
    { marker: 'A simple promise', title: 'A Simple Promise', description: "An ordinary day that became extraordinary because you were by my side." },
    { marker: 'Shared wonder', title: 'Swimming Together', description: "Tiny moments of surprise that felt like the whole world had been planned for us." },
    { marker: 'Living fully', title: 'Living Life', description: "Living life to the fullest, while creating memories that last." },
    { marker: 'Quiet joy', title: 'Late Night Laughs', description: "When the world was quiet we found the loudest reasons to smile." },
    { marker: 'Always', title: 'Always', description: "Small promises, steady presence, and a thousand gentle memories." }
  ];

  const events = sampleEvents.slice(0, eventPhotos.length).map((ev, i) => ({
    ...ev,
    image: eventPhotos[i]?.src ?? '',
    side: i % 2 === 0 ? 'left' : 'right'
  }));

  return (
    <section id="story" className="section-surface section-story py-32 relative overflow-hidden">
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
          <RelationshipTimer />
        </div>

        <div className="max-w-5xl mx-auto">
          {events.map((event) => (
            <TimelineItem key={event.image || event.title} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Moments = ({ motionEnabled = true }: { motionEnabled?: boolean }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const photosToShow = (galleryPhotos && galleryPhotos.length) ? galleryPhotos : photos;

  // Limit number for initial render for performance; lazy load rest on intersection
  const initialCount = Math.min(24, photosToShow.length);

  const handleImageError = (e: any) => {
    e.currentTarget.style.opacity = '0.25';
  };

  const pressTimer = useRef<number | null>(null);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setIsSmall(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const startPress = (e: React.PointerEvent, src: string) => {
    e.preventDefault();
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      setSelected(src);
      pressTimer.current = null;
    }, 600);
  };

  const endPress = (e: React.PointerEvent, src: string) => {
    e.preventDefault();
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
      if (!isSmall) {
        setSelected(src);
      }
    }
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <section id="moments" className="section-surface section-moments py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-5xl italic mb-6 text-rose-gold">Captured Moments</h2>
            <p className="text-stone-600 font-light text-lg italic">Little memories that made our story.</p>
          </div>
          <motion.button 
            whileHover={motionEnabled ? { scale: 1.05 } : undefined}
            className="theme-pill flex items-center gap-2 text-rose-gold border border-rose-gold px-6 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-rose-gold hover:text-white transition-all duration-300"
            onClick={() => setSelected(photosToShow[0]?.src ?? null)}
          >
            <Camera size={18} /> Scroll Down
          </motion.button>
        </div>

        <div className="masonry">
          {photosToShow.slice(0, initialCount).map((p, i) => (
            <figure key={p.id} className="masonry-item group overflow-hidden rounded-xl shadow-lg scrapbook-border relative bg-cream/30" data-id={p.id}>
              <button
                aria-label={`Open photo ${i+1}`}
                onPointerDown={(e) => startPress(e, p.src)}
                onPointerUp={(e) => endPress(e, p.src)}
                onPointerLeave={() => cancelPress()}
                onPointerCancel={() => cancelPress()}
                className="block w-full h-full text-left overflow-hidden"
              >
                <img src={p.src} alt={p.name ?? `Moment ${i+1}`} loading="lazy" decoding="async" fetchPriority="low" onError={handleImageError} onLoad={(e:any) => e.currentTarget.classList.add('loaded')} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>

              <figcaption className="caption-overlay" aria-hidden="true">
                <div className="caption-glow" />
              </figcaption>

            </figure>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
              <motion.img src={selected} alt="Preview" initial={motionEnabled ? { scale: 0.98 } : undefined} animate={{ scale: 1 }} className="max-w-[90%] max-h-[85%] rounded-2xl shadow-2xl object-contain" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const LoveLetters = ({ motionEnabled = true }: { motionEnabled?: boolean }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
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
    <section id="letters" className="section-surface section-letters py-32">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <Sparkles className="mx-auto text-rose-gold/40 mb-8" size={48} />

        <div className="flex justify-center px-2 sm:px-0">
          <motion.div className="relative w-full max-w-[22rem] sm:max-w-[24rem] md:max-w-[26rem] h-[14rem] sm:h-[14.5rem] md:h-[15rem]" initial={{ scale: 0.98 }} whileHover={motionEnabled ? { scale: 1.02 } : undefined}>
            <motion.button
              aria-label="Open letter"
              className="envelope w-full h-full rounded-[1.6rem] cursor-pointer focus:outline-none"
              onClick={() => setOpen(true)}
              whileTap={motionEnabled ? { scale: 0.98 } : undefined}
            >
              <div className="envelope-shell absolute inset-0 rounded-[1.6rem] overflow-hidden">
                <div className="envelope-fold envelope-fold-back" />
                <div className="envelope-fold envelope-fold-front" />
                <div className="envelope-label">
                  <span className="font-sans uppercase tracking-[0.35em] text-rose-gold/70 text-[10px]">A letter for you</span>
                  <span className="font-serif text-stone-700 text-xl sm:text-2xl italic">Open me</span>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence>
          {open && (
            <RootPortal>
              <motion.div className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center overflow-hidden sm:overflow-y-auto overscroll-contain p-0 sm:p-4 md:p-6" variants={containerVariant} initial="hidden" animate="visible" exit="exit">
                <motion.div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)} />

                <motion.div role="dialog" aria-modal="true" aria-label="Love letter" variants={modalVariant} initial="hidden" animate="visible" exit="exit" transition={{ duration: motionEnabled ? 0.32 : 0 }} className="letter-shell relative z-[105] flex h-[100dvh] w-full max-w-none flex-col overflow-hidden min-h-0 rounded-none sm:h-[min(92dvh,46rem)] sm:max-h-[min(92dvh,46rem)] sm:w-[min(94vw,52rem)] sm:rounded-[1.8rem] sm:p-5 md:p-6 lg:p-8">
                  <div className="letter-sheet relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-none sm:rounded-[1.45rem] text-left text-base md:text-lg leading-relaxed font-sans text-stone-800">
                    <div className="letter-ribbon" />
                    <button aria-label="Close letter" onClick={() => setOpen(false)} className="absolute right-4 top-4 sm:right-6 sm:top-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-900 border border-stone-200 shadow-lg transition-transform hover:scale-110 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-gold/30 focus:ring-offset-2 focus:ring-offset-white">
                      <X size={20} strokeWidth={2.6} />
                    </button>

                    <div className="letter-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-6 md:px-8 md:pb-8 md:pt-8 lg:px-10 lg:pb-10 lg:pt-10">
                      <div className="mb-4 flex items-center justify-between gap-2 rounded-[1.25rem] border border-rose-gold/8 bg-[linear-gradient(180deg,rgba(255,251,247,0.92),rgba(250,240,230,0.82))] px-3 py-3 pr-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:mb-6 sm:gap-4 sm:px-4 sm:py-4 sm:pr-20">
                        <div>
                          <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-rose-gold/70 mb-1 sm:text-[10px] sm:tracking-[0.4em] sm:mb-2">A private note</div>
                          <h3 className="font-serif text-lg md:text-3xl italic text-stone-700 sm:text-2xl">For the one I love</h3>
                        </div>
                        <div className="hidden lg:block text-right text-xs uppercase tracking-[0.35em] text-stone-500">
                          <div>Scroll</div>
                          <div>Read</div>
                          <div>Keep</div>
                        </div>
                      </div>

                      <div className="motion-safe:animate-[scrollHint_2.5s_ease-in-out_infinite] mb-4 hidden items-center gap-2 text-xs uppercase tracking-[0.35em] text-rose-gold/55 sm:flex lg:hidden">
                        <span className="inline-block h-2 w-2 rounded-full bg-rose-gold/40" />
                        Swipe up to read more
                      </div>

                      <motion.div variants={listVariant} initial="hidden" animate="visible">
                        {loveLetterText.split('\n\n').map((para, i) => (
                          <motion.p key={i} className="mb-4" variants={paraVariant}>{para}</motion.p>
                        ))}
                      </motion.div>

                    <div className="mt-6 flex items-end justify-between gap-3 border border-rose-gold/15 pt-4 pb-[env(safe-area-inset-bottom)] bg-[rgb(255,245,235)] backdrop-blur-[2px] sm:mt-8 sm:gap-4 sm:pt-5">
                      <div className="text-xs sm:text-sm text-stone-500">— Always</div>
                      <button onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-full bg-[rgb(255,243,233)] text-stone-900 font-medium shadow-sm border border-rose-gold/15 sm:px-4">Close</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </RootPortal>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const MusicSection = ({ motionEnabled = true }: { motionEnabled?: boolean }) => {
  const tracks = useMemo(() => musicTracks, []);

  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const active = useMemo(() => tracks[activeTrack], [tracks, activeTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      setAudioReady(true);
      setDuration(audio.duration || 0);
      setProgress(audio.currentTime / (audio.duration || 1));
    };

    const handleTime = () => {
      setProgress(audio.currentTime / (audio.duration || 1));
    };

    const handleEnded = () => {
      setActiveTrack((prev) => (prev + 1) % tracks.length);
      setIsPlaying(true);
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = active.src;
    audio.load();
    setAudioReady(false);
    setProgress(0);
    setDuration(0);

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => setIsPlaying(false));
      }
    }
  }, [active.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePrev = () => {
    setActiveTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setActiveTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setActiveTrack(index);
    setIsPlaying(true);
  };

  const formattedTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <section id="music" className="section-surface section-music py-24 text-stone-800 relative overflow-hidden">
      <audio ref={audioRef} preload="metadata" className="hidden" />
      <div className="absolute inset-0 opacity-22 mix-blend-multiply">
        <img src={photos[3]?.src ?? ''} loading="lazy" decoding="async" onLoad={(e: any) => e.currentTarget.classList.add('loaded')} className="w-full h-full object-cover fade-in" alt="Vinyl" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Music className="mx-auto mb-8 text-rose-gold" size={48} />
          <h2 className="font-serif text-4xl md:text-6xl italic mb-4">The Soundtrack to Us</h2>
          <p className="font-sans text-stone-600 tracking-widest text-sm mb-8 uppercase">Our favorite melodies through every chapter</p>
        </div>

        <div className="theme-card rounded-[1.8rem] p-6 md:p-8 border border-white/40 shadow-2xl backdrop-blur-xl bg-white/75 backdrop-saturate-150 overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-start">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-rose-gold font-sans text-xs tracking-[0.38em] uppercase">Now Playing</span>
                  <h3 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight leading-tight">{active.title}</h3>
                  <p className="text-stone-600 mt-2 text-sm md:text-base">{active.artist}</p>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-stone-500">
                  <span className={`inline-flex h-2 w-2 rounded-full ${isPlaying ? 'bg-rose-gold' : 'bg-stone-300'}`} />
                  {audioReady ? (isPlaying ? 'Playing' : 'Paused') : 'Loading…'}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-rose-gold/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(255,248,242,0.95))] p-4">
                <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-gold via-rose-gold/80 to-rose-gold/40 transition-all" style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }} />
                </div>
                <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  <span>{formattedTime(progress * duration)}</span>
                  <span>{formattedTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <button onClick={handlePrev} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-gold/10 focus:outline-none focus:ring-2 focus:ring-rose-gold/30">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handlePlayPause} className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-gold text-white shadow-[0_18px_40px_rgba(183,110,121,0.22)] transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-gold">
                  {isPlaying ? <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg> : <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M8 5v14l11-7L8 5z" /></svg>}
                </button>
                <button onClick={handleNext} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-gold/10 focus:outline-none focus:ring-2 focus:ring-rose-gold/30">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {tracks.map((track, index) => (
                  <button
                    key={track.title}
                    onClick={() => selectTrack(index)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${index === activeTrack ? 'border-rose-gold bg-rose-gold/10 shadow-inner' : 'border-white/70 bg-white/80 hover:border-rose-gold hover:bg-rose-gold/5'}`}>
                    <p className="font-semibold text-sm text-stone-900">{track.title}</p>
                    <p className="text-xs text-stone-500 mt-1">{track.artist}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(249,239,231,0.95))] border border-rose-gold/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-900/5 p-4">
                <img src={(active.cover || photos[4]?.src) ?? ''} alt={active.title} loading="lazy" decoding="async" className="h-60 w-full rounded-[1.25rem] object-cover object-center brightness-95 contrast-[1.02]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-8 right-4 text-white">
                  <div className="mb-2 text-xs uppercase tracking-[0.35em] text-white/70">Live soundtrack</div>
                  <div className="text-lg font-semibold">{active.title}</div>
                  <div className="text-xs text-white/70 mt-1">{active.artist}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[repeat(3,auto)] gap-2 justify-center">
                {[...Array(3)].map((_, index) => (
                  <span key={index} className={`block h-10 w-2 rounded-full transition-all ${isPlaying ? 'bg-rose-gold animate-equalize' : 'bg-stone-300'}`} />
                ))}
              </div>

              <div className="mt-6 text-center text-xs uppercase tracking-[0.35em] text-stone-500">
                {audioReady ? 'The Music That Defines Our Love' : 'Loading local audio…'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-rose-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-14 right-10 h-24 w-24 rounded-full bg-white/50 blur-3xl" />
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="section-surface section-footer py-20 text-center">
      <div className="container mx-auto px-6">
        <Heart className="mx-auto text-rose-gold mb-6 fill-rose-gold" size={32} />
        <h2 className="font-serif text-3xl italic mb-2">Our Story Continues</h2>
        <p className="text-stone-500 font-light text-sm tracking-widest uppercase mb-12">Handcrafted with love by us</p>
        <div className="w-full h-[1px] bg-rose-gold/10 mb-12" />
        <p className="text-stone-400 font-sans text-xs tracking-widest">ALL RIGHTS RESERVED. FOR PERSONAL USE ONLY.</p>
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
      const lowMemory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2;
      const slowConnection = typeof navigator !== 'undefined' && (navigator as any).connection && ['2g', 'slow-2g'].includes((navigator as any).connection.effectiveType);
      const smallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
      setMotionEnabled(!(prefersReduced || saveData || lowMemory || slowConnection || smallScreen));
    };
    update();
    window.addEventListener('resize', update, { passive: true });
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
    <div ref={containerRef} className="site-shell selection:bg-rose-gold/20 scroll-smooth">
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

