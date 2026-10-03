import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { chapterPath } from '@/lib/chapters';
import { getRecommendation } from '@/lib/recommend.functions';
import type { Recommendation } from '@/lib/recommend.server';

export const Route = createFileRoute('/find-your-cup')({
  head: () => ({ meta: [
    { title: 'Find your cup — Kappi' },
    { name: 'description', content: 'Describe the flavors you love and get AI-powered filter coffee and chapter recommendations.' },
    { property: 'og:title', content: 'Find your cup — Kappi' },
    { property: 'og:description', content: 'Describe the flavors you love and get AI-powered filter coffee recommendations.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: FindYourCup,
});

const suggestions = ['Strong and bold, a little bitter', 'Mellow, milky, gently sweet', 'Chocolatey with a nutty finish', 'Fragrant and floral, not too strong'];

function FindYourCup() {
  const recommend = useServerFn(getRecommendation);
  const [taste, setTaste] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Recommendation | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (taste.trim().length < 3 || loading) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await recommend({ data: { taste } })); }
    catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLoading(false); }
  }

  return <main className="cup-page">
    <section className="cup-intro">
      <span className="eyebrow">AI-POWERED TASTING NOTES</span>
      <h1>Find your <em>cup.</em></h1>
      <p>Tell us the flavors you enjoy, and we will pour out a few filter coffees and chapters made for your palate.</p>
    </section>
    <form className="cup-form" onSubmit={submit}>
      <label htmlFor="taste" className="eyebrow">WHAT DO YOU LOVE IN A CUP?</label>
      <textarea id="taste" value={taste} onChange={(e) => setTaste(e.target.value)} maxLength={600} rows={4} placeholder="e.g. I like it strong with lots of froth, a hint of chocolate, not too sweet…" />
      <div className="cup-chips">{suggestions.map((s) => <button type="button" key={s} onClick={() => setTaste(s)}>{s}</button>)}</div>
      <button type="submit" className="cup-submit" disabled={loading || taste.trim().length < 3}>
        {loading ? <><Loader2 size={18} className="animate-spin" /> BREWING IDEAS…</> : <>RECOMMEND MY CUP <ArrowRight size={18} /></>}
      </button>
      {error && <p className="cup-error" role="alert">{error}</p>}
    </form>
    {result && <section className="cup-results" aria-live="polite">
      <p className="cup-summary">{result.summary}</p>
      <span className="eyebrow">YOUR FILTER COFFEES</span>
      <div className="cup-grid">{result.coffees.map((c, i) => <article key={i} className="cup-card"><span>{String(i + 1).padStart(2, '0')}</span><h3>{c.name}</h3><p>{c.why}</p><p className="cup-brew">✳ {c.brew}</p></article>)}</div>
      {result.chapters.length > 0 && <>
        <span className="eyebrow">CHAPTERS TO READ NEXT</span>
        <div className="chapter-list">{result.chapters.map((c) => <Link key={c.slug} to={chapterPath} params={{ slug: c.slug }} viewTransition className="chapter-row"><span className="row-number">✳</span><strong>{c.title}</strong><span className="row-category">{c.why}</span><ArrowRight size={22} /></Link>)}</div>
      </>}
    </section>}
  </main>;
}
