import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, MoveUpRight } from 'lucide-react';
import { chapters, chapterPath } from '@/lib/chapters';
import heroImage from '@/assets/coffee-hero.jpg';
import pourImage from '@/assets/coffee-pour.jpg';
import filterImage from '@/assets/coffee-filter.jpg';
import beansImage from '@/assets/coffee-beans.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Kappi — An Ode to Filter Coffee' },
    { name: 'description', content: 'A fifteen-page journey through the ritual, craft, and culture of South Indian filter coffee.' },
    { property: 'og:title', content: 'Kappi — An Ode to Filter Coffee' },
    { property: 'og:description', content: 'A fifteen-page journey through the ritual, craft, and culture of South Indian filter coffee.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Home,
});

function Home() {
  return <main className="home-page">
    <section className="home-hero">
      <img src={heroImage} alt="South Indian filter coffee in a steel tumbler and davara" className="home-hero-image" width={1536} height={1024} fetchPriority="high" />
      <div className="home-hero-overlay" />
      <div className="hero-side-note">A STORY IN FIFTEEN SIPS <span>✳</span> A STORY IN FIFTEEN SIPS</div>
      <div className="hero-content">
        <div className="hero-eyebrow"><span className="little-star">✳</span> SLOW BREW. BIG FEELING.</div>
        <h1>Not just<br /><em>coffee.</em><br />A feeling<span>.</span></h1>
        <p>From the first fragrant drop to the last lingering sip. Step into the world of South Indian filter coffee.</p>
        <Link to={chapterPath} params={{ slug: chapters[0].slug }} viewTransition className="hero-cta">BEGIN THE STORY <span><ArrowRight size={21}/></span></Link>
      </div>
      <div className="hero-bottom"><span>FILTER COFFEE, UNFILTERED.</span><a href="#chapters">SCROLL TO EXPLORE <ArrowDown size={15}/></a><span>01 / 15</span></div>
    </section>

    <section className="intro-band">
      <span className="eyebrow">THE GOOD STUFF TAKES TIME</span>
      <p>A little <em>patience.</em> A lot of <em>heart.</em><br/>And a cup that feels like <span>home.</span></p>
      <span className="intro-asterisk">✳</span>
    </section>

    <section className="featured-section" id="chapters">
      <div className="section-heading"><div><span className="eyebrow">THE JOURNEY</span><h2>Follow the <em>pour.</em></h2></div><span className="section-count">14 CHAPTERS TO EXPLORE <ArrowDown size={16}/></span></div>
      <div className="feature-grid">
        <Link to={chapterPath} params={{ slug: 'the-land' }} viewTransition className="feature-card"><img src={beansImage} alt="Roasted coffee beans" loading="lazy" width={1024} height={1280}/><div className="feature-shade"/><div className="feature-caption"><span>02 / THE ORIGINS</span><strong>It starts in<br/>the shade.</strong><MoveUpRight size={23}/></div></Link>
        <Link to={chapterPath} params={{ slug: 'the-filter' }} viewTransition className="feature-card"><img src={filterImage} alt="A traditional stainless steel coffee filter" loading="lazy" width={1024} height={1280}/><div className="feature-shade"/><div className="feature-caption"><span>06 / THE METHOD</span><strong>Built to<br/>slow down.</strong><MoveUpRight size={23}/></div></Link>
        <Link to={chapterPath} params={{ slug: 'the-pour' }} viewTransition className="feature-card"><img src={pourImage} alt="Coffee poured from a steel tumbler" loading="lazy" width={1024} height={1280}/><div className="feature-shade"/><div className="feature-caption"><span>10 / THE CUP</span><strong>The art of<br/>the pour.</strong><MoveUpRight size={23}/></div></Link>
      </div>
    </section>

    <section className="all-chapters">
      <div className="section-heading"><div><span className="eyebrow">PICK YOUR MOMENT</span><h2>The whole <em>story.</em></h2></div><span className="section-count">FROM BEAN TO CUP</span></div>
      <div className="chapter-list">{chapters.map((chapter, index) => <Link to={chapterPath} params={{ slug: chapter.slug }} viewTransition className="chapter-row" key={chapter.slug}><span className="row-number">{String(index + 2).padStart(2, '0')}</span><strong>{chapter.title}</strong><span className="row-category">{chapter.category}</span><ArrowRight size={22}/></Link>)}</div>
    </section>
    <section className="closing-band"><span className="eyebrow">UNTIL THE NEXT CUP</span><p>Some stories are best<br/><em>savoured slowly.</em></p><Link to={chapterPath} params={{ slug: chapters[0].slug }} viewTransition>START READING <ArrowRight size={19}/></Link> <Link to="/find-your-cup" viewTransition>FIND YOUR CUP <ArrowRight size={19}/></Link></section>
  </main>;
}
