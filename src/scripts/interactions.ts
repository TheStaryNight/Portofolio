const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector<HTMLElement>('.hero')!;
const toggle = document.querySelector<HTMLButtonElement>('.motion-toggle')!;
let paused = reducedMotion.matches;
const syncMotion = () => {
  document.body.classList.toggle('motion-paused', paused);
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.innerHTML = paused ? 'Resume motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
};
toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; syncMotion(); });
syncMotion();

// One frame at a time, and only while the pointer is over the hero.
let pointerFrame = 0;
hero.addEventListener('pointermove', event => {
  if (paused || reducedMotion.matches || !finePointer.matches) return;
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    hero.style.setProperty('--pointer-x', `${x * 100}%`);
    hero.style.setProperty('--pointer-y', `${y * 100}%`);
    hero.style.setProperty('--portrait-x', `${(x - .5) * 18}px`);
    hero.style.setProperty('--portrait-y', `${(y - .5) * 12}px`);
    hero.classList.add('pointer-active');
  });
});
hero.addEventListener('pointerleave', () => {
  cancelAnimationFrame(pointerFrame);
  hero.classList.remove('pointer-active');
  hero.style.setProperty('--portrait-x', '0px');
  hero.style.setProperty('--portrait-y', '0px');
});

const cards = document.querySelectorAll<HTMLElement>('.project');
cards.forEach(card => card.classList.add('reveal-ready'));
const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
    else {
      const rect = entry.target.getBoundingClientRect();
      if (rect.top >= innerHeight || rect.bottom <= 0) entry.target.classList.remove('is-visible');
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -70px 0px' });
cards.forEach(card => reveal.observe(card));
const workIntro = document.querySelector<HTMLElement>('.work-intro');
if (workIntro) { workIntro.classList.add('reveal-ready'); reveal.observe(workIntro); }
cards.forEach(card => card.addEventListener('focusin', () => card.classList.add('is-visible')));

document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach(button => {
  const modal = document.getElementById(`project-${button.dataset.project}`) as HTMLDialogElement;
  button.addEventListener('click', () => {
    modal.showModal(); modal.scrollTop = 0;
    document.body.classList.add('viewer-open');
  });
  modal.querySelector('.project-close')!.addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('close', () => document.body.classList.remove('viewer-open'));
});

const progress = document.querySelector<HTMLElement>('.reading-progress')!;
let scrollFrame = 0;
const updateProgress = () => {
  const length = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${length > 0 ? Math.min(1, scrollY / length) : 0})`;
  document.body.classList.toggle('has-scrolled', scrollY > 70);
  scrollFrame = 0;
};
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();

type Gallery = {id: string; name: string; images: string[]};
const galleries: Gallery[] = JSON.parse(document.querySelector('#gallery-data')!.textContent!);
const dialog = document.querySelector<HTMLDialogElement>('.image-viewer')!;
const image = dialog.querySelector<HTMLImageElement>('.viewer-image')!;
const previous = dialog.querySelector<HTMLButtonElement>('.viewer-prev')!;
const next = dialog.querySelector<HTMLButtonElement>('.viewer-next')!;
let active: Gallery;
let index = 0;
const showImage = () => {
  image.src = `/images/${active.images[index]}`;
  image.alt = `${active.name}, image ${index + 1} of ${active.images.length}`;
  dialog.querySelector('.viewer-title')!.textContent = active.name;
  dialog.querySelector('.viewer-count')!.textContent = `${index + 1} / ${active.images.length}`;
  previous.disabled = next.disabled = active.images.length < 2;
};
document.querySelectorAll<HTMLButtonElement>('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    const gallery = galleries.find(item => item.id === button.dataset.gallery);
    if (!gallery) return;
    active = gallery; index = 0; showImage(); dialog.showModal();
    document.body.classList.add('viewer-open');
  });
});
const move = (direction: number) => { index = (index + direction + active.images.length) % active.images.length; showImage(); };
previous.addEventListener('click', () => move(-1));
next.addEventListener('click', () => move(1));
dialog.querySelector('.viewer-close')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('viewer-open'));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
});
