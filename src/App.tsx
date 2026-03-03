import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Instagram, Mail, ExternalLink, 
  ChevronRight, Play, Layout, Film, User, Send,
  Settings, LogOut, Plus, Trash2, Edit2, Eye
} from 'lucide-react';
import { Project, Message } from './types';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'STAGE VISUALS', path: '/stage' },
    { name: 'MOTION GRAPHICS', path: '/motion' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  if (isAdmin) return null;

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
          DONGKWON <span className="font-light text-white/50">PORTFOLIO</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs tracking-widest hover:text-white transition-colors ${
                location.pathname === link.path ? 'text-white font-bold' : 'text-white/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 py-8 px-6 flex flex-col space-y-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg tracking-widest font-medium"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void; key?: any }) => (
  <motion.div
    layoutId={`project-${project.id}`}
    onClick={onClick}
    className="group relative aspect-video overflow-hidden cursor-pointer bg-zinc-900 rounded-sm"
    whileHover={{ scale: 0.98 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
  >
    <img
      src={project.thumbnail}
      alt={project.title}
      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
      <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-1">
        {project.category === 'stage' ? 'Stage Visual Artist' : 'Motion Designer'}
      </p>
      <h3 className="text-xl font-medium tracking-tight">{project.title}</h3>
    </div>
  </motion.div>
);

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={`project-${project.id}`}
        className="w-full max-w-6xl bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-black">
          <iframe
            src={project.videoUrl.replace('watch?v=', 'embed/')}
            className="w-full h-full"
            allowFullScreen
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h2>
              <p className="text-white/60 leading-relaxed mb-8">{project.description}</p>
              
              {project.category === 'stage' ? (
                <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Venue</p>
                    <p className="text-sm">{project.venue}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Usage</p>
                    <p className="text-sm">{project.usage}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Role</p>
                    <p className="text-sm">{project.role}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Period</p>
                    <p className="text-sm">{project.period}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Purpose</p>
                    <p className="text-sm">{project.usage}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Concept</p>
                    <p className="text-sm">{project.concept}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Scope</p>
                    <p className="text-sm">{project.scope}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Result</p>
                    <p className="text-sm">{project.result}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Pages ---

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Stage Visuals Side */}
        <Link 
          to="/stage"
          className="group relative flex-1 overflow-hidden border-b md:border-b-0 md:border-r border-white/10"
        >
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://picsum.photos/seed/stage-hero/1920/1080?blur=2" 
              className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[10px] tracking-[0.4em] text-white/50 uppercase mb-4 block">Stage Visual Artist</span>
              <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Performance & Immersive</h2>
              <div className="inline-flex items-center space-x-2 border border-white/20 px-6 py-3 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                <span className="text-xs tracking-widest">VIEW WORKS</span>
                <ChevronRight size={14} />
              </div>
            </motion.div>
          </div>
        </Link>

        {/* Motion Graphics Side */}
        <Link 
          to="/motion"
          className="group relative flex-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://picsum.photos/seed/motion-hero/1920/1080?blur=2" 
              className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-[10px] tracking-[0.4em] text-white/50 uppercase mb-4 block">2.5D Motion Designer</span>
              <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Branding & Commercial</h2>
              <div className="inline-flex items-center space-x-2 border border-white/20 px-6 py-3 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                <span className="text-xs tracking-widest">VIEW WORKS</span>
                <ChevronRight size={14} />
              </div>
            </motion.div>
          </div>
        </Link>
      </div>

      {/* Hero Subtext */}
      <div className="bg-[#050505] py-12 px-6 text-center border-t border-white/10">
        <p className="text-sm text-white/40 tracking-widest uppercase max-w-2xl mx-auto leading-relaxed">
          Stage Visuals for Live Performance & Modern Motion Graphics for Brands
        </p>
      </div>
    </div>
  );
};

const PortfolioPage = ({ category }: { category: 'stage' | 'motion' }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <header className="mb-16">
        <span className="text-[10px] tracking-[0.5em] text-white/40 uppercase mb-4 block">
          {category === 'stage' ? 'Stage Visuals' : 'Motion Graphics'}
        </span>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6">
          {category === 'stage' ? 'Immersive Stages' : 'Dynamic Motion'}
        </h1>
        <p className="text-white/50 max-w-xl leading-relaxed">
          {category === 'stage' 
            ? '공연의 몰입감을 극대화하는 무대 영상 디자인. LED, 프로젝션 맵핑 등 다양한 기술을 활용한 시각적 경험을 제공합니다.'
            : '브랜드의 가치를 전달하는 2.5D 모션 그래픽. 광고, 타이틀, SNS 영상 등 감각적이고 완성도 높은 결과물을 제작합니다.'}
        </p>
      </header>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)} 
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const About = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-[10px] tracking-[0.5em] text-white/40 uppercase mb-4 block">About Me</span>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-12">Dongkwon</h1>
          <div className="space-y-6 text-white/70 leading-relaxed text-lg">
            <p>
              안녕하세요, 2.5D 모션 디자이너이자 스테이지 비주얼 아티스트로 활동하고 있는 동권입니다.
            </p>
            <p>
              3년간 공연 영상 제작사에서 재직하며 다수의 뮤지컬 배경 영상 및 대형 콘서트 비주얼을 제작해왔습니다. 무대라는 특수한 환경에 최적화된 영상미와 안정적인 기술 구현을 최우선으로 생각합니다.
            </p>
            <p>
              또한 브랜딩 및 광고를 위한 2.5D 모션 그래픽 작업을 통해 브랜드의 메시지를 감각적으로 전달합니다. 빠른 작업 속도와 정확한 피드백 반영으로 클라이언트와의 신뢰를 쌓아가고 있습니다.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Film size={20} className="text-white/50" />
              Experience
            </h3>
            <div className="space-y-8">
              <div>
                <p className="text-xs text-white/40 mb-1">2021 - Present</p>
                <h4 className="font-medium">Stage Visual Artist</h4>
                <p className="text-sm text-white/60">공연 영상 제작사 재직 (뮤지컬, 콘서트 배경 영상 제작)</p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Freelance</p>
                <h4 className="font-medium">2.5D Motion Designer</h4>
                <p className="text-sm text-white/60">브랜드 광고, 타이틀 시퀀스, SNS 홍보 영상 제작</p>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layout size={20} className="text-white/50" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {['After Effects', 'Cinema 4D', 'Photoshop', 'Illustrator', 'Premiere Pro', 'Resolume Arena', 'Watchout'].map(skill => (
                <span key={skill} className="px-4 py-2 bg-white/5 rounded-full text-xs tracking-widest border border-white/10">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Stage Visuals',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', type: 'Stage Visuals', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
      <header className="mb-16 text-center">
        <span className="text-[10px] tracking-[0.5em] text-white/40 uppercase mb-4 block">Get In Touch</span>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Let's Create</h1>
        <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
          새로운 프로젝트 제안이나 협업 문의는 언제든 환영합니다.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Project Type</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Stage Visuals', 'Motion Graphics', 'Other'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({...formData, type})}
                className={`px-6 py-4 rounded-xl border text-sm transition-all ${
                  formData.type === type 
                    ? 'bg-white text-black border-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Message</label>
          <textarea 
            required
            rows={6}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-white/30 transition-colors resize-none"
            placeholder="Tell me about your project..."
          />
        </div>

        <button 
          disabled={status === 'sending'}
          className="w-full py-6 bg-white text-black font-bold tracking-widest rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === 'sending' ? 'SENDING...' : status === 'success' ? 'SENT SUCCESSFULLY!' : (
            <>
              SEND MESSAGE
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// --- Admin ---

const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      const { token } = await res.json();
      onLogin(token);
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass p-12 rounded-3xl">
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Access</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-white/30"
            placeholder="Password"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full py-4 bg-white text-black font-bold rounded-xl">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(setProjects);
    fetch('/api/messages').then(res => res.json()).then(setMessages);
  }, []);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProject?.id ? 'PUT' : 'POST';
    const url = editingProject?.id ? `/api/projects/${editingProject.id}` : '/api/projects';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProject)
    });

    if (res.ok) {
      setEditingProject(null);
      fetch('/api/projects').then(res => res.json()).then(setProjects);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Delete this project?')) {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetch('/api/projects').then(res => res.json()).then(setProjects);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 p-8 flex flex-col">
        <h2 className="text-xl font-bold mb-12 tracking-tighter">ADMIN PANEL</h2>
        <nav className="space-y-4 flex-1">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'projects' ? 'bg-white text-black' : 'text-white/50 hover:bg-white/5'}`}
          >
            <Layout size={18} /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'messages' ? 'bg-white text-black' : 'text-white/50 hover:bg-white/5'}`}
          >
            <Mail size={18} /> Messages
          </button>
        </nav>
        <button 
          onClick={() => { localStorage.removeItem('adminToken'); window.location.reload(); }}
          className="text-white/30 hover:text-white flex items-center gap-2 text-sm mt-auto"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {activeTab === 'projects' ? (
          <div>
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-3xl font-bold">Manage Projects</h1>
              <button 
                onClick={() => setEditingProject({ category: 'stage', title: '', description: '', thumbnail: '', videoUrl: '', displayOrder: 0 })}
                className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <Plus size={18} /> ADD PROJECT
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {projects.map(p => (
                <div key={p.id} className="glass p-6 rounded-2xl flex gap-6 items-center">
                  <img src={p.thumbnail} className="w-32 aspect-video object-cover rounded-lg" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{p.category}</p>
                    <h3 className="font-bold">{p.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProject(p)} className="p-2 hover:bg-white/10 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteProject(p.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-12">Messages</h1>
            <div className="space-y-6">
              {messages.map(m => (
                <div key={m.id} className="glass p-8 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{m.name}</h3>
                      <p className="text-white/50 text-sm">{m.email} • {m.type}</p>
                    </div>
                    <p className="text-[10px] text-white/30">{new Date(m.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-white/70 leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-[#0a0a0a] rounded-3xl p-12 max-h-[90vh] overflow-y-auto border border-white/10">
            <h2 className="text-2xl font-bold mb-8">{editingProject.id ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSaveProject} className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Category</label>
                <select 
                  value={editingProject.category}
                  onChange={e => setEditingProject({...editingProject, category: e.target.value as 'stage' | 'motion'})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <option value="stage">Stage Visuals</option>
                  <option value="motion">Motion Graphics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Title</label>
                <input 
                  value={editingProject.title}
                  onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Description</label>
                <textarea 
                  value={editingProject.description}
                  onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Thumbnail URL</label>
                <input 
                  value={editingProject.thumbnail}
                  onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Video URL (YouTube)</label>
                <input 
                  value={editingProject.videoUrl}
                  onChange={e => setEditingProject({...editingProject, videoUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                />
              </div>

              {editingProject.category === 'stage' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Venue</label>
                    <input value={editingProject.venue} onChange={e => setEditingProject({...editingProject, venue: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Usage</label>
                    <input value={editingProject.usage} onChange={e => setEditingProject({...editingProject, usage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Role</label>
                    <input value={editingProject.role} onChange={e => setEditingProject({...editingProject, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Period</label>
                    <input value={editingProject.period} onChange={e => setEditingProject({...editingProject, period: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Purpose</label>
                    <input value={editingProject.usage} onChange={e => setEditingProject({...editingProject, usage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Concept</label>
                    <input value={editingProject.concept} onChange={e => setEditingProject({...editingProject, concept: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Scope</label>
                    <input value={editingProject.scope} onChange={e => setEditingProject({...editingProject, scope: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Result</label>
                    <input value={editingProject.result} onChange={e => setEditingProject({...editingProject, result: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
                  </div>
                </>
              )}

              <div className="col-span-2 flex gap-4 mt-8">
                <button type="submit" className="flex-1 py-4 bg-white text-black font-bold rounded-xl">SAVE PROJECT</button>
                <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-4 bg-white/5 border border-white/10 font-bold rounded-xl">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  const handleLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stage" element={<PortfolioPage category="stage" />} />
          <Route path="/motion" element={<PortfolioPage category="motion" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/admin" 
            element={adminToken ? <AdminDashboard /> : <Login onLogin={handleLogin} />} 
          />
        </Routes>
        
        {/* Footer */}
        <footer className="bg-[#050505] border-t border-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold tracking-tighter mb-2">DONGKWON</h3>
              <p className="text-xs text-white/30 tracking-widest uppercase">© 2026 ALL RIGHTS RESERVED</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-white/50 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="mailto:leedk4463@gmail.com" className="text-white/50 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
            <Link to="/admin" className="text-[10px] text-white/10 hover:text-white/30 transition-colors uppercase tracking-[0.2em]">Admin Access</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}
