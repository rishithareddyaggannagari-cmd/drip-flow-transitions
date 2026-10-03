import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chapters, chapterPath } from '@/lib/chapters';

export const Route = createFileRoute('/chapters/$slug')({
  loader: ({ params }) => {
    const index = chapters.findIndex((chapter) => chapter.slug === params.slug);
    if (index < 0) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const chapter = chapters[loaderData?.index ?? 0];
    return { meta: [
      { title: `${chapter.title} — Kappi` },
      { name: 'description', content: chapter.description },
      { property: 'og:title', content: `${chapter.title} — Kappi` },
      { property: 'og:description', content: chapter.description },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ] };
  },
  component: ChapterPage,
});

function ChapterPage() {
  const { index } = Route.useLoaderData();
  const chapter = chapters[index];
  const next = chapters[index + 1];
  const previous = chapters[index - 1];
  const number = String(index + 2).padStart(2, '0');
  return (
    <main className="chapter-page" key={chapter.slug}>
      <section className="chapter-hero">
        <div className="chapter-image-wrap"><img src={chapter.image} alt={chapter.imageAlt} className="chapter-image" width={1024} height={1280} /></div>
        <div className="chapter-hero-shade" />
        <div className="chapter-topline"><span>CHAPTER {number} / 15</span><span>{chapter.category.toUpperCase()}</span></div>
        <div className="chapter-title-block">
          <span className="eyebrow chapter-kicker"><span className="little-star">✳</span> {chapter.kicker}</span>
          <h1>{chapter.title}<span className="title-dot">.</span></h1>
          <p>{chapter.line}</p>
        </div>
        <div className="chapter-hero-bottom"><span>KAPPI — THE FILTER COFFEE CHRONICLES</span><a href="#story" className="scroll-cue">SCROLL TO READ <ArrowDown size={15}/></a></div>
      </section>
      <section className="chapter-story" id="story">
        <div className="story-index"><span>{number}</span><span> / THE STORY</span></div>
        <div className="story-copy"><span className="eyebrow">A MOMENT IN THE MAKING</span><h2>{chapter.line}</h2><p className="story-lead">{chapter.description}</p><p>{chapter.detail}</p></div>
      </section>
      <section className="chapter-next">
        <div className="next-top"><span>KEEP THE STORY MOVING</span><span>{index + 2} / 15</span></div>
        {next ? <Link to={chapterPath} params={{ slug: next.slug }} viewTransition className="next-link"><span className="next-overline">UP NEXT <span>— {String(index + 3).padStart(2, '0')}</span></span><strong>{next.title}<span>.</span></strong><span className="next-arrow"><ArrowRight size={32}/></span></Link> : <Link to="/" viewTransition className="next-link"><span className="next-overline">BACK TO THE BEGINNING <span>— 01</span></span><strong>One more cup<span>?</span></strong><span className="next-arrow"><ArrowRight size={32}/></span></Link>}
        <div className="next-bottom">{previous ? <Button variant="link" asChild><Link to={chapterPath} params={{ slug: previous.slug }} viewTransition><ArrowLeft size={15}/> PREVIOUS CHAPTER</Link></Button> : <Button variant="link" asChild><Link to="/" viewTransition><ArrowLeft size={15}/> BACK HOME</Link></Button>}<span>BREWED SLOWLY. ENJOYED FULLY.</span></div>
      </section>
    </main>
  );
}
