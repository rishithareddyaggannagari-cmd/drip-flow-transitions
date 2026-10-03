import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { chapters, chapterPath } from '@/lib/chapters';
import { Button } from '@/components/ui/button';

export function CoffeeFrame() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" viewTransition className="brand" aria-label="Kappi home"><span className="brand-mark">✳</span> KAPPI<span className="brand-period">.</span></Link>
        <div className="header-center">AN ODE TO FILTER COFFEE <span className="header-divider">/</span> EST. IN THE EVERYDAY</div>
        <Button variant="outline" size="sm" className="menu-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close chapters menu' : 'Open chapters menu'} aria-expanded={menuOpen}>
          <span>{menuOpen ? 'CLOSE' : 'EXPLORE'}</span>{menuOpen ? <X size={16} /> : <Menu size={16} />}
        </Button>
      </header>
      <div className="page-stage"><Outlet /></div>
      <footer className="site-footer">
        <span>KAPPI © 2026</span><span>MADE FOR THE LOVE OF A GOOD CUP</span>
        <Link to="/" viewTransition>BACK TO THE BEGINNING <ArrowRight size={14} /></Link>
      </footer>
      <div className={`chapter-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="chapter-menu-head"><span>THE WHOLE STORY</span><span>01 — 15</span></div>
        <div className="chapter-menu-scroll">
          <Link to="/" viewTransition tabIndex={menuOpen ? 0 : -1} className="chapter-menu-link"><span>01</span><strong>Home</strong><ArrowRight size={20}/></Link>
          {chapters.map((chapter, i) => <Link key={chapter.slug} to={chapterPath} params={{ slug: chapter.slug }} viewTransition tabIndex={menuOpen ? 0 : -1} className="chapter-menu-link"><span>{String(i + 2).padStart(2, '0')}</span><strong>{chapter.title}</strong><ArrowRight size={20}/></Link>)}
          <Link to="/find-your-cup" viewTransition tabIndex={menuOpen ? 0 : -1} className="chapter-menu-link"><span>✳</span><strong>Find your cup</strong><ArrowRight size={20}/></Link>
        </div>
        <div className="chapter-menu-bottom">FIFTEEN PAGES. ONE VERY GOOD CUP.</div>
      </div>
    </div>
  );
}
