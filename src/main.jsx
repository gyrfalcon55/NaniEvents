import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Camera, ChevronDown, Flower2, Mail, MapPin, Menu, Music, Palette, Phone, Sparkles, UtensilsCrossed, X } from 'lucide-react';
import './styles.css';

function Instagram({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>;
}

const photos = {
  bridal: '/images/bridal-entry.jpg',
  reception: '/images/decor-reception.jpg',
  arch: '/images/decor-arch-stage.jpg',
  engagement: '/images/decor-engagement.jpg',
  dhol: '/images/dhol-team.jpg',
  catering1: '/images/catering-1.jpg',
  catering2: '/images/catering-2.jpg',
  haldi: '/images/haldi.jpg',
  naming: '/images/naming-ceremony.jpg'
};

const events = [
  { id: 1, name: 'Bridal Entry', category: 'Wedding', image: photos.bridal, description: 'A floral frame entry with dancers, confetti and fog that turns the bride\'s arrival into a moment to remember.' },
  { id: 2, name: 'Haldi Celebration', category: 'Haldi', image: photos.haldi, description: 'Marigold arches, a lush green backdrop and petal rangoli for a bright, traditional haldi ceremony.' },
  { id: 3, name: 'Naming Ceremony', category: 'Naming Ceremony', image: photos.naming, description: 'A themed cradle setup with flowers and soft styling for the baby\'s first celebration.' },
  { id: 4, name: 'Reception Stage Décor', category: 'Wedding', image: photos.reception, description: 'A flower-wall backdrop with a carved sofa and floral arrangements for the couple\'s stage.' },
  { id: 5, name: 'Engagement Stage', category: 'Engagement', image: photos.engagement, description: 'A heart-motif stage with a white sofa, lattice panels and a warm, welcoming glow.' },
  { id: 6, name: 'Dhol Team Entry', category: 'Dhol Team', image: photos.dhol, description: 'A coordinated dhol team in matching outfits to give the entrance real energy.' }
];

const gallery = [
  { src: photos.reception, alt: 'Reception stage with flower wall and carved sofa' },
  { src: photos.haldi, alt: 'Haldi ceremony setup with marigold arch' },
  { src: photos.dhol, alt: 'Dhol team at a floral entrance' },
  { src: photos.arch, alt: 'Stage with circular floral arch' },
  { src: photos.naming, alt: 'Naming ceremony cradle decoration' },
  { src: photos.catering1, alt: 'Catering counter at an outdoor event' },
  { src: photos.engagement, alt: 'Engagement stage with heart motif' },
  { src: photos.bridal, alt: 'Bridal entry with floral frame and confetti' },
  { src: photos.catering2, alt: 'Buffet counters at dusk' }
];

const services = [
  { icon: Flower2, title: 'Décor & Stage Styling', text: 'Stages, entrances and floral setups for every celebration.' },
  { icon: Music, title: 'Dhol Teams', text: 'Dhol teams available to bring energy to entries and processions.' },
  { icon: Camera, title: 'Photography', text: 'Photographers available to capture the day.' },
  { icon: UtensilsCrossed, title: 'Catering', text: 'Catering and food counters arranged for your guests.' },
  { icon: Sparkles, title: 'Beautician', text: 'Beautician services for the family and the bride.' },
  { icon: Palette, title: 'Bridal Mehandi', text: 'Bridal mehandi artists for weddings and mehndi functions.' }
];

const occasions = ['Birthday', 'Half Saree', 'Naming Ceremony', 'Haldi', 'Engagement', 'Wedding', 'Mehndi', 'Sangeet'];

const googleFormsConfig = {
  inquiry: {
    endpoint: 'https://docs.google.com/forms/d/e/1FAIpQLSfVdUBYlFX0m8FA4XMtbOlaydnEjvDWeiY94TwqqB8MHuOzFQ/formResponse',
    fields: {
      name: 'entry.465995193', phone: 'entry.142554416', email: 'entry.228757449', eventType: 'entry.2043987083', date: 'entry.2045161773', message: 'entry.1534081682'
    }
  }
};

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: .12 });
    nodes.forEach(n => observer.observe(n));
    return () => observer.disconnect();
  }, []);
}

function SectionHeading({ eyebrow, title, text, light = false }) {
  return <div className={`section-heading reveal ${light ? 'light' : ''}`}><span className="eyebrow"><Sparkles size={13}/>{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [galleryImage, setGalleryImage] = useState(null);
  const [inquiryStatus, setInquiryStatus] = useState('idle');
  const [eventType, setEventType] = useState('');
  useReveal();

  useEffect(() => {
    const open = selectedEvent || galleryImage;
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = e => { if (e.key === 'Escape') { setSelectedEvent(null); setGalleryImage(null); } };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [selectedEvent, galleryImage]);

  const navigate = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  async function submitGoogleForm(kind, form, setStatus) {
    setStatus('loading');
    const config = googleFormsConfig[kind];
    const formData = new FormData(form);
    const payload = new URLSearchParams();
    Object.entries(config.fields).forEach(([name, entry]) => {
      const value = formData.get(name) || '';
      if (name === 'date') {
        const [y = '', m = '', d = ''] = String(value).split('-');
        payload.append(`${entry}_year`, y); payload.append(`${entry}_month`, m ? String(Number(m)) : ''); payload.append(`${entry}_day`, d ? String(Number(d)) : '');
      } else if (name === 'eventType' && value === 'Other') {
        payload.append(entry, '__other_option__');
        payload.append(`${entry}.other_option_response`, formData.get('eventTypeOther') || '');
      } else payload.append(entry, value);
    });
    if (config.endpoint.includes('PASTE_')) { setStatus('demo'); return; }
    const url = config.endpoint.replace(/\/viewform.*$/, '/formResponse');
    try {
      await fetch(url, { method: 'POST', mode: 'no-cors', body: payload });
      setStatus('success'); form.reset(); setEventType('');
    } catch { setStatus('error'); }
  }

  return <div>
    <header className="navbar">
      <div className="container nav-inner">
        <button className="brand" onClick={() => navigate('home')} aria-label="Nani Events Vizag home"><span className="brand-mark">NE</span><span><strong>Nani Events</strong><small>VIZAG</small></span></button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>{['home','about','services','events','gallery','contact'].map(id => <button key={id} onClick={() => navigate(id)}>{id[0].toUpperCase()+id.slice(1)}</button>)}<button className="nav-cta" onClick={() => navigate('contact')}>Get in Touch <ArrowRight size={15}/></button></nav>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <main>
      <section id="home" className="hero">
        <img className="hero-image" src={photos.reception} alt="Floral reception stage by Nani Events Vizag" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="eyebrow light"><Sparkles size={13}/> Event Management · Visakhapatnam</span>
          <h1>Creating moments.<br/><em>Designing memories.</em></h1>
          <p>Thoughtfully planned celebrations, beautifully executed. Discover the Nani Events Vizag experience.</p>
          <div className="hero-actions"><button className="btn primary" onClick={() => navigate('events')}>Explore Our Events <ArrowRight size={17}/></button><button className="btn ghost" onClick={() => navigate('contact')}>Contact Us</button></div>
          <div className="hero-note"><span/> Visakhapatnam, Andhra Pradesh</div>
        </div>
        <button className="scroll-cue" onClick={() => navigate('about')} aria-label="Scroll to about"><ChevronDown/></button>
      </section>

      <section id="about" className="section about"><div className="container about-grid"><div className="about-visual reveal"><img src={photos.engagement} alt="Engagement stage decoration"/><div className="floating-card"><span>01</span><strong>Details matter.</strong><p>From first idea to final guest.</p></div></div><div><SectionHeading eyebrow="Our approach" title="Events with intention, detail & character." text="Nani Events Vizag brings together planning, styling and coordination to help turn important occasions into memorable experiences."/><div className="feature-list"><div><b>Thoughtful planning</b><span>Clear coordination around your event's needs.</span></div><div><b>Beautiful presentation</b><span>Visual details that create the right atmosphere.</span></div><div><b>Guest-first experience</b><span>A smooth experience from arrival to the final moment.</span></div></div></div></div></section>

      <section id="services" className="section services-section"><div className="container"><SectionHeading eyebrow="What we do" title="Everything for your celebration." text="From décor to dhol teams, we help with the details that make family functions feel complete."/><div className="service-grid">{services.map(({ icon: Icon, title, text }) => <article className="service-card reveal" key={title}><Icon size={22}/><h3>{title}</h3><p>{text}</p></article>)}</div><div className="occasions reveal"><span>Occasions we celebrate</span><div>{occasions.map(o => <b key={o}>{o}</b>)}</div></div></div></section>

      <section id="events" className="section dark-section"><div className="container"><SectionHeading light eyebrow="Selected events" title="A glimpse into the celebrations." text="A look at celebrations styled by Nani Events Vizag, from bridal entries to haldi and naming ceremonies."/><div className="event-grid">{events.map(event => <article className="event-card reveal" key={event.id} role="button" tabIndex={0} onClick={() => setSelectedEvent(event)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEvent(event); } }}><div className="event-image"><img src={event.image} alt={event.name} loading="lazy"/><span>{event.category}</span></div><div className="event-info"><div><h3>{event.name}</h3><p>{event.description}</p></div></div></article>)}</div></div></section>

      <section id="gallery" className="section gallery-section"><div className="container"><SectionHeading eyebrow="The gallery" title="Moments worth remembering." text="Stages, entrances, haldi, naming ceremonies and catering from our recent events."/><div className="gallery-grid">{gallery.map((image, i) => <button className="gallery-item reveal" key={image.src} onClick={() => setGalleryImage(image)}><img src={image.src} alt={image.alt} loading="lazy"/><span>View</span></button>)}</div></div></section>

      <section className="instagram-strip"><div className="container instagram-inner"><div><span className="eyebrow light"><Instagram size={14}/> On Instagram</span><h2>See the latest from Nani Events Vizag.</h2><p>Replace the placeholder link with the organization's official Instagram profile.</p></div><a className="btn ghost" href="#" onClick={e => e.preventDefault()}>Follow Us <ArrowRight size={17}/></a></div></section>

      <section id="contact" className="section contact-section"><div className="container form-grid"><div><SectionHeading eyebrow="Let's talk" title="Planning something special?" text="Tell us what you're imagining and we'll call you back to talk it through."/><div className="contact-details"><div><MapPin/><span><b>Location</b>Visakhapatnam, Andhra Pradesh</span></div><div><Phone/><span><b>Phone</b>Placeholder — replace before launch</span></div><div><Mail/><span><b>Email</b>Placeholder — replace before launch</span></div></div></div><form className="form-card reveal" onSubmit={e => { e.preventDefault(); submitGoogleForm('inquiry', e.currentTarget, setInquiryStatus); }}><div className="form-row"><label>Name<input name="name" required placeholder="Your name"/></label><label>Phone Number<input name="phone" required inputMode="tel" placeholder="+91 XXXXX XXXXX"/></label></div><div className="form-row"><label>Email<input name="email" type="email" required placeholder="you@example.com"/></label><label>Event Type<select name="eventType" required value={eventType} onChange={e => setEventType(e.target.value)}><option value="" disabled>Select type</option><option>Wedding Event</option><option>Birthday Event</option><option>Engagement Event</option><option>Private</option><option>Other</option></select></label></div>{eventType === 'Other' && <label>Please specify<input name="eventTypeOther" required placeholder="e.g. Half Saree, Haldi, Naming Ceremony"/></label>}<label>Preferred Event Date<input name="date" type="date" required/></label><label>Message / Requirements<textarea name="message" rows="5" required placeholder="Tell us a little about your event…"/></label><button type="submit" className="btn primary full" disabled={inquiryStatus==='loading'}>{inquiryStatus==='loading' ? 'Sending…' : 'Send Inquiry'} <ArrowRight size={17}/></button>{inquiryStatus==='success' && <p className="status success">Your inquiry has been received.</p>}{inquiryStatus==='demo' && <p className="status demo">Demo mode: configure the Google Form endpoint and field IDs in <code>src/main.jsx</code>.</p>}{inquiryStatus==='error' && <p className="status error">Something went wrong. Please try again.</p>}</form></div></section>
    </main>

    <footer><div className="container footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-mark">NE</span><span><strong>Nani Events</strong><small>VIZAG</small></span></button><p>Creating moments. Designing memories.</p></div><div><h4>Explore</h4><button onClick={() => navigate('about')}>About</button><button onClick={() => navigate('events')}>Events</button><button onClick={() => navigate('gallery')}>Gallery</button></div><div><h4>Connect</h4><button onClick={() => navigate('contact')}>Contact</button><a href="#" onClick={e => e.preventDefault()}>Instagram</a><span>Visakhapatnam, AP</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Nani Events Vizag. All rights reserved.</span><span>Website designed & developed by [Developer Name]</span></div></footer>

    {selectedEvent && <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}><div className="event-modal" onClick={e => e.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setSelectedEvent(null)}><X/></button><img src={selectedEvent.image} alt={selectedEvent.name}/><div><span className="eyebrow">{selectedEvent.category}</span><h2>{selectedEvent.name}</h2><p>{selectedEvent.description}</p><button className="btn primary" onClick={() => { setSelectedEvent(null); navigate('contact'); }}>Plan an event <ArrowRight size={17}/></button></div></div></div>}
    {galleryImage && <div className="lightbox" onClick={() => setGalleryImage(null)}><button aria-label="Close" onClick={() => setGalleryImage(null)}><X/></button><img src={galleryImage.src} alt={galleryImage.alt}/></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
