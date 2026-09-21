import { diverQuestions } from '../data/diver';

const chat = document.querySelector<HTMLElement>('.diver-chat')!;
const output = chat.querySelector<HTMLElement>('.diver-visible-answer')!;
const announcement = chat.querySelector<HTMLElement>('.diver-announcement')!;
const skip = chat.querySelector<HTMLButtonElement>('.diver-skip')!;
const reset = chat.querySelector<HTMLButtonElement>('.diver-reset')!;
const character = chat.querySelector<HTMLButtonElement>('.diver-character')!;
const buttons = chat.querySelectorAll<HTMLButtonElement>('[data-question]');
const panels = chat.querySelectorAll<HTMLElement>('[data-answer-links]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const greeting = 'Hey, I’m Steven! Welcome aboard. Pick a question below and I’ll show you around.';
let timer: ReturnType<typeof setInterval> | undefined;
let currentText = greeting;
let selected: string | null = null;
const clearTimer = () => { if (timer !== undefined) clearInterval(timer); timer = undefined; };
const finish = () => {
  clearTimer(); output.textContent = currentText; skip.hidden = true;
  chat.classList.remove('is-talking');
  panels.forEach(panel => { panel.hidden = panel.dataset.answerLinks !== selected; });
};
const say = (text: string, id: string | null) => {
  clearTimer(); currentText = text; selected = id;
  announcement.textContent = text;
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.question === id)));
  panels.forEach(panel => { panel.hidden = true; });
  if (reduced.matches || document.body.classList.contains('motion-paused')) { finish(); return; }
  output.textContent = ''; skip.hidden = false; chat.classList.add('is-talking');
  const characters = Array.from(text); let position = 0;
  timer = setInterval(() => {
    position = Math.min(position + 2, characters.length);
    output.textContent = characters.slice(0, position).join('');
    if (position === characters.length) finish();
  }, 23);
};
buttons.forEach(button => {
  button.disabled = false;
  button.addEventListener('click', () => {
    const question = diverQuestions.find(q => q.id === button.dataset.question);
    if (question) say(question.answer, question.id);
  });
});
character.disabled = reset.disabled = false;
character.addEventListener('click', () => say('Hey there! Pixel Steven, reporting for duty. Ask me about my projects, toolkit, or the AI engineering internship I’m looking for.', null));
reset.addEventListener('click', () => say(greeting, null));
skip.addEventListener('click', finish);
reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
new MutationObserver(() => { if (document.body.classList.contains('motion-paused')) finish(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
