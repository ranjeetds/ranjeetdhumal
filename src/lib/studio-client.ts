/**
 * Browser-only studio behaviour: mode, local progress, search, and checks.
 * Nothing here is sent anywhere. The storage key is `studio-progress`.
 */

const STORAGE_KEY = 'studio-progress';
const MODE_KEY = 'studio-mode';

type Mode = 'learn' | 'explore';

interface LastVisit {
  module: string;
  title: string;
  mode: Mode;
  chapter?: string;
  path?: string;
}

interface Progress {
  last?: LastVisit;
  completed: Record<string, string[]>;
}

function emptyProgress(): Progress {
  return { completed: {} };
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyProgress();
    const record = parsed as { last?: unknown; completed?: unknown };
    const completed: Record<string, string[]> = {};
    if (record.completed && typeof record.completed === 'object') {
      for (const [key, value] of Object.entries(record.completed)) {
        if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
          completed[key] = value;
        }
      }
    }
    return { last: isLast(record.last) ? record.last : undefined, completed };
  } catch {
    return emptyProgress();
  }
}

function isLast(value: unknown): value is LastVisit {
  if (!value || typeof value !== 'object') return false;
  const last = value as { module?: unknown; title?: unknown; mode?: unknown };
  return (
    typeof last.module === 'string' &&
    typeof last.title === 'string' &&
    (last.mode === 'learn' || last.mode === 'explore')
  );
}

function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function resumeHref(last: LastVisit): string {
  const params = new URLSearchParams();
  params.set('mode', last.mode);
  if (last.path) params.set('path', last.path);
  const hash = last.chapter ? `#chapter-${last.chapter}` : '';
  return `/studio/${last.module}?${params}${hash}`;
}

interface SearchHit {
  href: string;
  title: string;
  kind: string;
  text: string;
}

function isSearchHit(value: unknown): value is SearchHit {
  if (!value || typeof value !== 'object') return false;
  const hit = value as { href?: unknown; title?: unknown; kind?: unknown; text?: unknown };
  return (
    typeof hit.href === 'string' &&
    typeof hit.title === 'string' &&
    typeof hit.kind === 'string' &&
    typeof hit.text === 'string'
  );
}

export function mountStudioHome(root: HTMLElement): void {
  const progress = loadProgress();
  const continueBlock = root.querySelector('[data-continue]');
  const link = root.querySelector('[data-continue-link]');
  const meta = root.querySelector('[data-continue-meta]');
  if (progress.last && continueBlock instanceof HTMLElement && link instanceof HTMLAnchorElement) {
    link.href = resumeHref(progress.last);
    link.textContent = progress.last.title;
    if (meta) {
      const where = progress.last.chapter ? 'mid-lesson' : progress.last.mode === 'learn' ? 'in the lesson' : 'in the experiment';
      meta.textContent = where;
    }
    continueBlock.hidden = false;
  }

  const clear = root.querySelector('[data-clear-progress]');
  clear?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MODE_KEY);
    if (continueBlock instanceof HTMLElement) continueBlock.hidden = true;
  });

  const input = root.querySelector('[data-search]');
  const results = root.querySelector('[data-search-results]');
  const source = root.querySelector('[data-search-index]');
  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLElement) || !(source instanceof HTMLScriptElement)) {
    return;
  }
  let hits: SearchHit[] = [];
  try {
    const parsed: unknown = JSON.parse(source.textContent ?? '[]');
    if (Array.isArray(parsed)) hits = parsed.filter(isSearchHit);
  } catch {
    hits = [];
  }

  const render = () => {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (query.length < 2) return;
    const matched = hits
      .filter((hit) => `${hit.title} ${hit.kind} ${hit.text}`.toLowerCase().includes(query))
      .slice(0, 8);
    if (matched.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'py-3 text-sm text-ink-muted';
      empty.textContent = 'Nothing in the studio matches that.';
      results.append(empty);
      return;
    }
    for (const hit of matched) {
      const item = document.createElement('li');
      item.className = 'border-t border-line';
      const anchor = document.createElement('a');
      anchor.href = hit.href;
      anchor.className = 'flex items-baseline justify-between gap-4 py-3';
      const title = document.createElement('span');
      title.className = 'text-ink';
      title.textContent = hit.title;
      const kind = document.createElement('span');
      kind.className = 'mono-label text-ink-faint';
      kind.textContent = hit.kind;
      anchor.append(title, kind);
      item.append(anchor);
      results.append(item);
    }
  };
  input.addEventListener('input', render);
  input.form?.addEventListener('submit', (event) => event.preventDefault());
}

interface PathStep {
  id: string;
  title: string;
  status: 'live' | 'planned';
}

interface PathIndex {
  id: string;
  steps: PathStep[];
}

function isPathIndex(value: unknown): value is PathIndex {
  if (!value || typeof value !== 'object') return false;
  const path = value as { id?: unknown; steps?: unknown };
  if (typeof path.id !== 'string' || !Array.isArray(path.steps)) return false;
  return path.steps.every((step) => {
    if (!step || typeof step !== 'object') return false;
    const item = step as { id?: unknown; title?: unknown; status?: unknown };
    return (
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      (item.status === 'live' || item.status === 'planned')
    );
  });
}

function setParam(name: string, value: string): void {
  const params = new URLSearchParams(window.location.search);
  params.set(name, value);
  const next = `${window.location.pathname}?${params}${window.location.hash}`;
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
    window.history.replaceState(null, '', next);
  }
}

export function mountStudioModule(root: HTMLElement): void {
  const moduleId = root.dataset.module;
  const titleElement = root.querySelector('h1');
  if (!moduleId || !(titleElement instanceof HTMLElement)) return;

  const params = new URLSearchParams(window.location.search);
  const pathId = params.get('path') ?? undefined;
  const storedMode = localStorage.getItem(MODE_KEY);
  const initialMode: Mode =
    params.get('mode') === 'learn' || window.location.hash.startsWith('#chapter-')
      ? 'learn'
      : params.get('mode') === 'explore'
        ? 'explore'
        : storedMode === 'learn'
          ? 'learn'
          : 'explore';

  const exploreButton = root.querySelector('[data-set-mode="explore"]');
  const learnButton = root.querySelector('[data-set-mode="learn"]');
  const explorePanel = root.querySelector('[data-panel="explore"]');
  const learnPanel = root.querySelector('[data-panel="learn"]');

  const remember = (partial: { mode?: Mode; chapter?: string }) => {
    const current = loadProgress();
    const mode = partial.mode ?? (localStorage.getItem(MODE_KEY) === 'learn' ? 'learn' : 'explore');
    const chapter = partial.chapter ?? current.last?.chapter;
    const next: LastVisit = {
      module: moduleId,
      title: titleElement.textContent?.trim() || moduleId,
      mode,
    };
    if (chapter) next.chapter = chapter;
    if (pathId) next.path = pathId;
    current.last = next;
    saveProgress(current);
  };

  const applyMode = (mode: Mode, writeUrl: boolean) => {
    if (explorePanel instanceof HTMLElement) explorePanel.hidden = mode !== 'explore';
    if (learnPanel instanceof HTMLElement) learnPanel.hidden = mode !== 'learn';
    if (exploreButton instanceof HTMLButtonElement) exploreButton.setAttribute('aria-pressed', String(mode === 'explore'));
    if (learnButton instanceof HTMLButtonElement) learnButton.setAttribute('aria-pressed', String(mode === 'learn'));
    localStorage.setItem(MODE_KEY, mode);
    if (writeUrl) setParam('mode', mode);
    remember({ mode });
  };

  applyMode(initialMode, false);

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const modeButton = target.closest('[data-set-mode]');
    if (modeButton instanceof HTMLButtonElement) {
      const mode = modeButton.dataset.setMode;
      if (mode === 'learn' || mode === 'explore') applyMode(mode, true);
      return;
    }
    const preset = target.closest('[data-studio-preset]');
    if (preset instanceof HTMLButtonElement && preset.dataset.studioPreset) {
      window.dispatchEvent(new CustomEvent('studio-preset', { detail: preset.dataset.studioPreset }));
    }
  });

  const chapters = [...root.querySelectorAll('[data-chapter]')].filter(
    (section): section is HTMLElement => section instanceof HTMLElement && typeof section.dataset.chapter === 'string',
  );
  const toc = root.querySelector('[data-toc]');
  if (toc) {
    toc.replaceChildren();
    for (const section of chapters) {
      const id = section.dataset.chapter;
      const heading = section.querySelector('h2');
      if (!id || !heading) continue;
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = `#chapter-${id}`;
      anchor.className = 'flex items-baseline justify-between gap-3 py-1.5 text-sm text-ink-muted hover:text-ink';
      anchor.dataset.tocChapter = id;
      const label = document.createElement('span');
      label.textContent = heading.textContent;
      const mark = document.createElement('span');
      mark.className = 'mono-label text-ink-faint';
      mark.dataset.tocMark = id;
      anchor.append(label, mark);
      item.append(anchor);
      toc.append(item);
    }
  }

  const progress = loadProgress();
  const done = new Set(progress.completed[moduleId] ?? []);

  const paint = () => {
    const label = root.querySelector('[data-progress]');
    const bar = root.querySelector('[data-progress-bar]');
    const total = chapters.length;
    const count = chapters.filter((section) => done.has(section.dataset.chapter ?? '')).length;
    if (label) label.textContent = total === 0 ? 'No parts' : count === 0 ? 'Nothing marked yet' : `${count} of ${total} parts marked`;
    if (bar instanceof HTMLElement) bar.style.width = total === 0 ? '0%' : `${Math.round((count / total) * 100)}%`;
    for (const section of chapters) {
      const id = section.dataset.chapter;
      if (!id) continue;
      const button = section.querySelector('[data-mark-chapter]');
      const marked = done.has(id);
      if (button instanceof HTMLButtonElement) {
        button.setAttribute('aria-pressed', String(marked));
        button.textContent = marked ? 'Marked' : 'Mark this part read';
      }
      const tick = root.querySelector(`[data-toc-mark="${CSS.escape(id)}"]`);
      if (tick) tick.textContent = marked ? 'Read' : '';
    }
  };

  const persistCompleted = () => {
    const current = loadProgress();
    current.completed[moduleId] = [...done];
    saveProgress(current);
    paint();
  };

  remember({ mode: initialMode });
  paint();

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest('[data-mark-chapter]');
    if (!(button instanceof HTMLButtonElement)) return;
    const id = button.dataset.markChapter;
    if (!id) return;
    if (done.has(id)) done.delete(id);
    else done.add(id);
    persistCompleted();
  });

  for (const form of root.querySelectorAll('[data-check]')) {
    if (!(form instanceof HTMLFormElement)) continue;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const answer = form.dataset.answer ?? '';
      const selected = form.querySelector('input[type="radio"]:checked');
      const verdict = form.querySelector('[data-verdict]');
      const correct = selected instanceof HTMLInputElement && selected.value === answer;
      if (verdict instanceof HTMLElement) {
        verdict.hidden = false;
        verdict.classList.remove('hidden');
        verdict.textContent = correct ? 'That’s the reading this lesson argues for.' : 'Not that one. The explanation is below.';
      }
      const details = form.querySelector('details');
      if (details instanceof HTMLDetailsElement) details.open = true;
      if (!correct) return;
      form.dataset.solved = 'true';
      const section = form.closest('[data-chapter]');
      if (!(section instanceof HTMLElement)) return;
      const checks = [...section.querySelectorAll('[data-check]')];
      const allSolved = checks.every((check) => check instanceof HTMLFormElement && check.dataset.solved === 'true');
      const id = section.dataset.chapter;
      if (allSolved && id) {
        done.add(id);
        persistCompleted();
      }
    });
  }

  const focusChapter = (section: HTMLElement) => {
    const id = section.dataset.chapter;
    const heading = section.querySelector('h2');
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus();
    }
    section.scrollIntoView({ block: 'start' });
    if (id) remember({ chapter: id, mode: 'learn' });
  };

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-chapter-prev]') || target.closest('[data-chapter-next]')) {
      const currentHash = window.location.hash.replace('#chapter-', '');
      const index = chapters.findIndex((section) => section.dataset.chapter === currentHash);
      const forward = Boolean(target.closest('[data-chapter-next]'));
      const next = forward ? chapters[index + 1] ?? (index < 0 ? chapters[0] : undefined) : chapters[index - 1];
      if (next) focusChapter(next);
      return;
    }
    const tocLink = target.closest('[data-toc-chapter]');
    if (tocLink instanceof HTMLAnchorElement) {
      const id = tocLink.dataset.tocChapter;
      const section = chapters.find((item) => item.dataset.chapter === id);
      if (section) remember({ chapter: id, mode: 'learn' });
    }
  });

  const clear = root.querySelector('[data-clear-progress]');
  clear?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    done.clear();
    paint();
    const block = root.querySelector('[data-cleared]');
    if (block instanceof HTMLElement) {
      block.hidden = false;
      block.textContent = 'Progress on this browser was cleared.';
    }
  });

  const source = root.querySelector('[data-path-index]');
  if (!(source instanceof HTMLScriptElement) || !pathId) return;
  let paths: PathIndex[] = [];
  try {
    const parsed: unknown = JSON.parse(source.textContent ?? '[]');
    if (Array.isArray(parsed)) paths = parsed.filter(isPathIndex);
  } catch {
    return;
  }
  const path = paths.find((item) => item.id === pathId);
  if (!path) return;
  const index = path.steps.findIndex((step) => step.id === moduleId);
  if (index < 0) return;

  const previous = index > 0 ? path.steps[index - 1] : undefined;
  const next = path.steps[index + 1];
  const applyStep = (name: 'prev' | 'next', step: PathStep | undefined) => {
    const anchor = root.querySelector(`[data-step="${name}"]`);
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (!step || step.status !== 'live') {
      anchor.hidden = true;
      return;
    }
    const query = new URLSearchParams({ path: pathId, mode: localStorage.getItem(MODE_KEY) === 'learn' ? 'learn' : 'explore' });
    anchor.href = `/studio/${step.id}?${query}`;
    anchor.textContent = name === 'prev' ? `Previous: ${step.title}` : `Next: ${step.title}`;
    anchor.hidden = false;
  };
  applyStep('prev', previous);
  applyStep('next', next);

  const drawer = root.querySelector('[data-drawer-list]');
  if (!drawer) return;
  const summary = root.querySelector('[data-drawer-summary]');
  if (summary) summary.textContent = 'In this path';
  drawer.replaceChildren();
  for (const step of path.steps) {
    const item = document.createElement('li');
    if (step.status === 'live') {
      const anchor = document.createElement('a');
      anchor.href = `/studio/${step.id}?path=${encodeURIComponent(pathId)}`;
      anchor.className = 'block py-1 text-sm text-ink-muted hover:text-ink';
      anchor.textContent = step.title;
      if (step.id === moduleId) anchor.setAttribute('aria-current', 'page');
      item.append(anchor);
    } else {
      const label = document.createElement('span');
      label.className = 'block py-1 text-sm text-ink-faint';
      label.textContent = `${step.title} · Not built`;
      item.append(label);
    }
    drawer.append(item);
  }
}
