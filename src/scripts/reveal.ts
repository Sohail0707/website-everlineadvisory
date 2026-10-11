/**
 * Scroll reveal: adds `.is-in` to [data-reveal] elements as they enter the viewport.
 * One observer for the whole page; each element is unobserved after it reveals (no replay).
 */
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    // No negative bottom margin: elements at the very end of the page (the footer) must
    // still be able to trigger on tall viewports where they can't scroll any higher.
    { rootMargin: '0px', threshold: 0 },
  );
  targets.forEach((el) => io.observe(el));
}
