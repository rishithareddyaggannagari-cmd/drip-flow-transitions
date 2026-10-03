<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the filter-coffee story in one chapter data module and render its 14 chapter URLs through one dynamic route, so navigation and page metadata stay consistent.
- Use TanStack Router's native View Transitions for internal links, with CSS motion fallbacks and reduced-motion handling, so transitions remain accessible.
- AI recommendations run in a server function (src/lib/recommend.*) via the AI gateway; chapter suggestions are validated against the chapter data module so links never break.
