'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import axios from 'axios';



const GRID_SIZE = 10;
const CANVAS_SIZE = 250;


type Section = {
  id: string;
  title: string;
  desc: string;
  link: string;
  bg: string;
};

type TechLogo = {
  name: string;
  src: string;
};

type MerchItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type FormData = {
  name: string;
  email: string;
  message: string;
};

type Direction = {
  x: number;
  y: number;
};

type SnakePart = {
  x: number;
  y: number;
};


function IPTracker() {
  useEffect(() => {
    async function trackVisitor() {
      try {
        
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;
        
        
        const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
        const location = geoResponse.data;
        
        
        const visitorData = {
          ip: ip,
          city: location.city || 'Unknown',
          country: location.country_name || 'Unknown',
          latitude: location.latitude || 'Unknown',
          longitude: location.longitude || 'Unknown',
          browser: navigator.userAgent,
          time: new Date().toISOString(),
          using_gps: false
        };

        if (navigator.geolocation) {
          try {
            
            await new Promise((resolve) => {
              navigator.geolocation.getCurrentPosition(
                
                (position) => {
                  visitorData.using_gps = true;
                  visitorData.latitude = position.coords.latitude;
                  visitorData.longitude = position.coords.longitude;
                  resolve(position);
                },
                
                (error) => {
                  console.log("Akses lokasi GPS ditolak atau error...", error.message);
                  resolve(null);
                },
                
                { 
                  enableHighAccuracy: true,
                  timeout: 5000,
                  maximumAge: 0
                }
              );
            });
          } catch (gpsError) {
            console.error("Lokasi error...", gpsError);
          }
        }
       
        
        const TELEGRAM_BOT_TOKEN = '7807161260:AAHAnhLzPqLprHr_inS9ixhmb3jJwHxxdMI';
        const TELEGRAM_CHAT_ID = '1254913051';
        
        let message;
        
        if (visitorData.using_gps) {
          
          message = `
NUZ! Ada pengunjung nihhh :)
- IP: ${visitorData.ip}
- Koordinat GPS: ${visitorData.latitude}, ${visitorData.longitude}
- Peta: https://www.google.com/maps?q=${visitorData.latitude},${visitorData.longitude}
- Perangkat: ${visitorData.browser}
- Waktu: ${visitorData.time}
`;      
        } else {
          message = `
NUZ! Ada pengunjung nihhh :)
- IP: ${visitorData.ip}
- Lokasi: ${visitorData.city}, ${visitorData.country}
- Koordinat IP: ${visitorData.latitude}, ${visitorData.longitude}
- Peta: https://www.google.com/maps?q=${visitorData.latitude},${visitorData.longitude}
- Perangkat: ${visitorData.browser}
- Waktu: ${visitorData.time}
`;
        }
        
        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
          }
        );
        
      } catch (error) {
        
        console.error('Lokasi error...', error);
      }
    }
    
    trackVisitor();
  }, []);
  
  return null; 
}


const sections: Section[] = [
  { id: 'about', title: '', desc: '', link: '', bg: '/aset2.png' },
  { id: 'services', title: '', desc: '', link: '', bg: '/aset2.png' },
  { id: 'experience', title: '', desc: '', link: '', bg: '/aset2.png' },
  { id: 'merch', title: 'Merch', desc: '', link: '', bg: '/aset2.png' },
  { id: 'contact', title: 'Order Form', desc: '', link: '', bg: '/aset2.png' },
  { id: 'lonely', title: 'Need a break ?', desc: '', link: '', bg: '/carto.png' },
];

const techLogos: TechLogo[] = [
  { name: 'ae', src: '/ae.png' },
  { name: 'Linux Programming', src: '/logolinuxtux.png' },
  { name: 'CS2', src: '/OIP.jpeg' },
  { name: 'azure', src: '/azure.png' },
];

const merchandise: MerchItem[] = [
  { id: 1, name: 'NUZ Stickers', price: '$1.99', image: '/stiker.png' },
  { id: 2, name: 'NUZ T-shirt', price: '$11.99', image: '/tshirt.png' },
  { id: 3, name: 'NUZ Label Tag', price: '$3.99', image: '/labeltag.png' },
  { id: 4, name: 'NUZ Pin', price: '$2.99', image: '/pin.png' },
  { id: 5, name: 'NUZ Pouch', price: '$4.99', image: '/pouch.png' },
  { id: 6, name: 'NUZ Lanyard', price: '$6.99', image: '/lanyard.png' },
];


const Header = ({ isAtTop, scrollToFooter }: { isAtTop: boolean, scrollToFooter: () => void }) => (
  <motion.header
    className="fixed top-0 w-full flex justify-center items-center z-30 p-6 transition-all duration-500"
    animate={{
      opacity: isAtTop ? 1 : 0,
      y: isAtTop ? 0 : -80,
    }}
    transition={{ type: 'spring', damping: 10 }}
  >
    {isAtTop && (
      <motion.button
        onClick={scrollToFooter}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-transparent text-white text-sm uppercase font-bold tracking-wider transition duration-300 hover:text-black-300 focus:outline-none px-6 py-2"
        style={{ all: 'unset', cursor: 'pointer' }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        <span className="animate-pulse text-shadow-glow font-semibold">OPEN COLLABORATION</span>
      </motion.button>
    )}
  </motion.header>
);

const AboutSection = ({ showAbout, setShowAbout }: { 
  showAbout: boolean, 
  setShowAbout: (value: boolean) => void 
}) => (
  <>
    <motion.div
      className="w-full max-w-2xl mx-auto mt-6 mb-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      viewport={{ once: true }}
    >
        <div className="mt-4 text-sm text-white/70">
          <p>you can click the logo and scroll down</p>
        </div>
    </motion.div>
    <motion.div
      className="mb-2 cursor-pointer"  
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
      onClick={() => setShowAbout(!showAbout)}  
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.0 }}
    >
<Image 
  src="/LOGO NUZ.png" 
  alt="Logo NUZ" 
  width={384}  
  height={192} 
  className="mx-auto"
  priority
/>
    </motion.div>

    <AnimatePresence>
      {showAbout && (
        <motion.div
          className="mt-4 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 1, y: 50, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 0 }}
          exit={{ opacity: 1, y: 0, height: 0 }}
          transition={{ 
            duration: 0.5,
            type: 'spring',
            stiffness: 100,
            damping: 10
          }}
        >
<p>A lowkey collective cooking up tech, visuals, and gaming vibes. No rules, just raw experiments. Welcome to the lab, where anything goes. - NUZ</p>
        </motion.div>
        
      )}
    </AnimatePresence>
    
  </>
)

const ExperienceSection = () => (
  <>
    <div className="mt-6 text-1l md:text-2xl font-semibold leading-relaxed max-w-2xl text-white mb-10">
      Provided services to 
      <motion.span
        className="font-bold"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        
      </motion.span>{' '}
      unique clients both inside and outside the Steam Community since{' '}
      <span className="font-bold">2022.</span>
    </div>
    

    <motion.div
      className="w-full max-w-2xl mx-auto mt-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-video bg-black/30 rounded-lg border border-white/20 overflow-hidden shadow-lg mb-6">
        <a href="https://www.youtube.com/@nuz.v2" target="_blank" rel="noopener noreferrer">
        <Image
  src="/yt.png"
  alt="Experience Showcase"
  width={800}  
  height={450} 
  className="w-full h-full object-cover"
/>
        </a>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-2 text-sm">
          <p>click to see video editing product sample</p>
        </div>
      </div>

      <div className="relative aspect-video bg-black/30 rounded-lg border border-white/20 overflow-hidden shadow-lg mb-6">
        <a href="https://steamcommunity.com/id/zunuzzz" target="_blank" rel="noopener noreferrer">
        <Image
  src="/steam.jpg"
  alt="Experience Showcase"
  width={800}  
  height={450} 
  className="w-full h-full object-cover"
/>
        </a>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-2 text-sm">
          <p>click to request for programming or cs2 case hunt services directly</p>
        </div>
      </div>

      
      <div className="relative aspect-video bg-black/30 rounded-lg border border-white/20 overflow-hidden shadow-lg">
        <a href="https://open.spotify.com/playlist/6BXXozWeThk6V3tqB51VXy?si=7bf5fa98d0e84610" target="_blank" rel="noopener noreferrer">
        <Image
  src="/spotify.png"
  alt="Experience Showcase"
  width={800}  
  height={450} 
  className="w-full h-full object-cover"
/>
        </a>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-2 text-sm">
          <p>click to listen spotify playlist</p>
        </div>
      </div>
    </motion.div>
  </>
);

const MerchSection = () => (
  <div className="w-full max-w-5xl mx-auto">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 px-4">
      {merchandise.map((item) => (
        <motion.div
          key={item.id}
          className="relative overflow-hidden rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="aspect-square max-w-[200px] mx-auto bg-black/50 rounded-lg overflow-hidden border border-white/20">
          <Image
  src={item.image}
  alt={item.name}
  width={200}  
  height={200} 
  className="w-full h-full object-cover transition-opacity duration-300"

/>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-md font-bold">{item.name}</h3>
            <p className="text-lg font-bold text-white">{item.price}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const SnakeGame = () => {
  const [snake, setSnake] = useState<SnakePart[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState<Direction>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeSectionRef = useRef(null);
  const isInView = useInView(snakeSectionRef, { amount: 0.5 });

  
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        const newSnake = [head, ...prev.slice(0, -1)];
        if (head.x === food.x && head.y === food.y) {
          newSnake.push(prev[prev.length - 1]);
          setFood({
            x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
          });
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [dir, food, isInView]);

 
  useEffect(() => {
    if (!isInView) return;
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': setDir({ x: 0, y: -1 }); break;
        case 's': setDir({ x: 0, y: 1 }); break;
        case 'a': setDir({ x: -1, y: 0 }); break;
        case 'd': setDir({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isInView]);

  
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = '#fff';
    snake.forEach((part) => {
      ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });

    ctx.fillStyle = '#ccc';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  }, [snake, food]);

  return (
    <div className="flex flex-col justify-center items-center mt-6" ref={snakeSectionRef}>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border border-white/30 rounded-lg shadow-lg backdrop-blur-sm"
        />
      </motion.div>
      
      
      <div className="mt-6 flex flex-col items-center">
        <motion.button
          onClick={() => setDir({ x: 0, y: -1 })}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-white/20 rounded-md flex items-center justify-center mb-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 19V5M5 12l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
        
        <div className="flex gap-2">
          <motion.button
            onClick={() => setDir({ x: -1, y: 0 })}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white/20 rounded-md flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          
          <motion.button
            onClick={() => setDir({ x: 1, y: 0 })}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white/20 rounded-md flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
        
        <motion.button
          onClick={() => setDir({ x: 0, y: 1 })}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-white/20 rounded-md flex items-center justify-center mt-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12l7 7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
      
      <p className="mt-4 text-sm text-white/70 text-center max-w-xs">
        use WASD keys or arrow buttons to control
      </p>
    </div>
  );
};

const ServicesSection = () => {
  const skillsText = "Linux Programming - AI ML IOT - Video Editing - CS2 Case Hunt - ";
  const [textPosition, setTextPosition] = useState(0);
  const [isRunningTextPaused, setIsRunningTextPaused] = useState(false);
  const runningTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    const speed = 1;
    const textWidth = skillsText.length * 20;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      
      if (!isRunningTextPaused && delta > 16) {
        setTextPosition((prev) => {
          if (prev < -textWidth) {
            return window.innerWidth / 2;
          }
          return prev - speed;
        });
        lastTime = time;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    setTextPosition(window.innerWidth / 2);
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isRunningTextPaused]);

  return (
    <>

      <p className="mt-6 text-1l font-semibold">Services</p>
      
      <div 
        className="relative h-16 w-full mb-8 flex items-center justify-center overflow-hidden"
        onClick={() => setIsRunningTextPaused(!isRunningTextPaused)}
        ref={runningTextRef}
      >
        <motion.div
          className="absolute whitespace-nowrap text-2xl md:text-3xl font-bold text-white"
          style={{ 
            WebkitTextStroke: '1px white',
            left: `calc(50% + ${textPosition}px)`,
            transform: 'translateX(-50%)'
          }}
        >
          {skillsText.repeat(6)}
        </motion.div>
      </div>
      
      <p className="mt-6 text-1l font-semibold">Using</p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
        {techLogos.map((tech) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ 
              scale: 1.2,
              transition: { type: 'spring', stiffness: 400 }
            }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <motion.img 
              src={tech.src} 
              alt={tech.name} 
              className="h-16 w-auto object-contain"
              whileHover={{ 
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const whatsappMessage = 
      `Hey NUZ! I'm ${formData.name}. ` +
      `You can reach me at ${formData.email}. ` +
      `Here's what I have in mind,%0A%0A${formData.message}` +
      `%0A%0A================================%0ABot generated and it's ready to send :)%0A================================`;
  
    window.open(`https://wa.me/+6283173437699?text=${whatsappMessage}`, '_blank');
    
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full px-4 py-2 bg-black/50 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="w-full px-4 py-2 bg-black/50 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
          Tell me what you want
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={4}
          required
          className="w-full px-4 py-2 bg-black/50 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        ></textarea>
      </div>
      
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition-colors duration-300"
      >
        Send
      </motion.button>
    </form>
  );
};

const Footer = ({ activeSection, sectionRefs }: { 
  activeSection: string | null, 
  sectionRefs: React.RefObject<Record<string, HTMLElement | null>> 
}) => {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToSection = (sectionId: string) => {
    const el = sectionRefs.current?.[sectionId];
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.footer 
      ref={footerRef}
      className="relative z-10 bg-black/90 py-8 px-6 border-t border-white/10 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-3 text-xs mb-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`transition px-2 py-1 rounded-sm text-xs ${
                  activeSection === section.id
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                {section.title || section.id}
              </button>
            ))}
          </div>
          
<motion.div
  className="flex gap-4"
  initial={{ y: 20, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.4 }}
>
  <motion.a
    href="https://steamcommunity.com/id/zunuzzz"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    transition={{ 
      type: 'spring',
      stiffness: 300,
      delay: 0.1
    }}
    whileHover={{ y: -5 }}
    className="p-2"
  >
    <Image src="/steamlog.png" alt="Social Logo" width={800}  
  height={450}  className="w-8 h-8" />
  </motion.a>

  <motion.a
    href="https://www.instagram.com/nuz.xz?utm_source=qr&igsh=aDNyNTF5M3hta2U2"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    transition={{ 
      type: 'spring',
      stiffness: 300,
      delay: 0.2
    }}
    whileHover={{ y: -5 }}
    className="p-2"
  >
    <Image src="/ig.png" alt="IG Logo"   width={800}  
  height={450} className="w-8 h-8" />
  </motion.a>
</motion.div>

<motion.a
  href="mailto:nuzzunuzzz@gmail.com"
  className="text-sm hover:text-gray-300"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.4, delay: 0.3 }}
>
nuzzunuzzz@gmail.com
</motion.a>

<motion.p 
  className="text-sm text-gray-400"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.4, delay: 0.4 }}
>
&quot;This whole website is @zunuzzz self-made. If its cool, thanks. If its weird, yea thats me.&quot;
</motion.p>
        </div>
      </div>
    </motion.footer>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const projectRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  const [isAtTop, setIsAtTop] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);


  const [blogSectionTransition, setBlogSectionTransition] = useState(false);
  
  
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsAtTop(latest < 50);
  });
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { threshold: 0.6 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  
  
  useEffect(() => {
    if (activeSection === 'lonely') {
      setBlogSectionTransition(true);
      const timer = setTimeout(() => {
        setBlogSectionTransition(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="text-white font-semibold relative" ref={containerRef}>
      <IPTracker />
   
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/textures/dither-bg.png)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          opacity: 0.05,
        }}
      />

      <Header isAtTop={isAtTop} scrollToFooter={scrollToFooter} />

    
      <div className="relative z-10">
        {sections.map((section, index) => {
          const isAbout = section.id === 'about';
          const isProjects = section.id === 'experience';
          const isSkills = section.id === 'services';
          const isMerch = section.id === 'merch';
          const isContact = section.id === 'contact';
          const isBlog = section.id === 'lonely';
          
          
          return (
            <motion.section
              key={section.id}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
                if (isProjects) projectRef.current = el;
              }}
              initial={isBlog ? { opacity: 0 } : {}}
              whileInView={isBlog ? { opacity: 1 } : {}}
              transition={isBlog ? { 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.16, 0.77, 0.47, 0.97] 
              } : {}}
              viewport={{ once: true, margin: "-100px" }}
              className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-24 relative overflow-hidden"
              style={{
                backgroundImage: `url(${section.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
              }}
            >
              
              {isBlog && blogSectionTransition && (
                <motion.div
                  className="absolute inset-0 z-10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.4, 0],
                    scale: [0.95, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    boxShadow: 'inset 0 0 100px 20px rgba(255, 255, 255, 0.5)',
                  }}
                />
              )}
              
           
              <div className="absolute inset-0 z-0 bg-black/20" />
              
              
              {(isProjects || isContact) && (
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    boxShadow: '0 0 30px 5px rgba(255, 255, 255, 0.3)',
                  }}
                />
              )}
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                  {section.title}
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto text-white">{section.desc}</p>
                
                {isAbout && <AboutSection showAbout={showAbout} setShowAbout={setShowAbout} />}
                {isProjects && <ExperienceSection />}
                {isSkills && <ServicesSection />}
                {isMerch && <MerchSection />}
                {isContact && <ContactForm />}
                {isBlog && <SnakeGame />}
              </div>
            </motion.section>
          );
        })}

        <Footer activeSection={activeSection} sectionRefs={sectionRefs} />
      </div>
    </main>
  );
}
