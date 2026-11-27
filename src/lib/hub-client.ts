/**
 * Knowledge Hub behaviour. Read state is stored on the studio progress key so a
 * later studio save does not drop it. Nothing is sent anywhere.
 */
import { foldSearch } from '@/lib/search';

const STORAGE_KEY = 'studio-progress';

interface RecentItem {
  key: string;
  title: string;
  href: string;
  field: string;
  kind: string;
  at: number;
}

interface Memory {
  read: string[];
  recent: RecentItem[];
}

interface Hit {
  key: string;
  kind: string;
  title: string;
  sub: string;
  field: string;
  fieldTitle: string;
  href: string;
  text: string;
}

interface Filters {
  type: string;
  level: string;
  status: string;
  tag: string;
  q: string;
  sort: string;
}

const SCOPES: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'note', label: 'Notes' },
  { id: 'guide', label: 'Guides' },
  { id: 'figure', label: 'Live figures' },
  { id: 'step', label: 'Path steps' },
  { id: 'entry', label: 'Field map' },
];

export function mountHub(root: HTMLElement): void {
  const fields = [...root.querySelectorAll<HTMLElement>('[data-hub-field]')];
  const sheet = document.querySelector<HTMLDialogElement>('#hub-sheet');
  const filterDialog = document.querySelector<HTMLDialogElement>('#hub-filters');
  const palette = document.querySelector<HTMLDialogElement>('#hub-palette');
  const sheetBody = sheet?.querySelector<HTMLElement>('[data-sheet-body]');
  const hits = readHits();
  let memory = loadMemory();
  const persist = () => persistMemory(memory);
  const controls = (field: HTMLElement): ParentNode =>
    field.querySelector('[data-filter-bar]') ?? document.querySelector('#hub-filters [data-filter-bar]') ?? field;
  let scope = 'all';
  let activeHit = 0;
  let returnFocus: HTMLElement | null = null;

  const fieldById = (id: string) => fields.find((field) => field.dataset.hubField === id);

  const activeField = () => fields.find((field) => field.dataset.active === 'true') ?? fields[0];

  const paintRead = () => {
    const read = new Set(memory.read);
    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-read]')) {
      const key = button.dataset.read ?? '';
      const on = read.has(key);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      const card = button.closest<HTMLElement>('[data-hub-card]');
      if (card) card.dataset.readState = on ? 'read' : 'unread';
    }
    for (const field of fields) {
      const cards = [...field.querySelectorAll<HTMLElement>('[data-hub-card]')];
      const done = cards.filter((card) => card.dataset.readState === 'read').length;
      const label = field.querySelector('[data-read-label]');
      if (label) label.textContent = cards.length === 0 ? 'No items' : `${done} of ${cards.length} read`;
      const arc = field.querySelector<SVGCircleElement>('[data-ring-arc]');
      if (arc) {
        const fraction = cards.length === 0 ? 0 : done / cards.length;
        arc.style.strokeDashoffset = String(94.2 * (1 - fraction));
      }
      const bar = root.querySelector<HTMLElement>(`[data-hub-bar="${field.dataset.hubField ?? ''}"]`);
      if (bar) bar.style.width = cards.length === 0 ? '0' : `${(done / cards.length) * 100}%`;
      for (const step of field.querySelectorAll<HTMLButtonElement>('[data-done-key]')) {
        const key = step.dataset.doneKey ?? '';
        const complete = key.length > 0 && read.has(key);
        step.classList.toggle('border-ok', complete);
        step.classList.toggle('border-accent', !complete && step === firstOpen(field));
      }
    }
    const next = firstUnreadStep();
    const nextLink = root.querySelector<HTMLAnchorElement>('[data-hub-next]');
    if (nextLink && next) {
      nextLink.textContent = `Step ${next.n}`;
      nextLink.href = `#${next.fieldId}`;
    }
    paintResume();
  };

  const firstOpen = (field: HTMLElement) => {
    const steps = [...field.querySelectorAll<HTMLButtonElement>('[data-done-key]')];
    return steps.find((step) => {
      const key = step.dataset.doneKey ?? '';
      return key.length === 0 || !memory.read.includes(key);
    });
  };

  const firstUnreadStep = () => {
    for (const field of fields) {
      const step = firstOpen(field);
      const n = step?.dataset.openStep;
      const fieldId = field.dataset.hubField;
      if (step && n && fieldId) return { n, fieldId };
    }
    return null;
  };

  const paintResume = () => {
    const slot = root.querySelector<HTMLElement>('[data-hub-resume]');
    const start = root.querySelector<HTMLElement>('[data-hub-start]');
    if (!slot || !start) return;
    if (memory.recent.length === 0 && memory.read.length === 0) {
      slot.hidden = true;
      start.hidden = false;
      return;
    }
    start.hidden = true;
    slot.hidden = false;
    slot.replaceChildren();
    const heading = document.createElement('p');
    heading.className = 'mono-label text-ink-faint lg:col-span-4';
    heading.textContent = 'Continue where you left off';
    slot.append(heading);
    const next = firstUnreadStep();
    if (next) {
      const field = fieldById(next.fieldId);
      const button = field?.querySelector<HTMLButtonElement>(`[data-open-step="${next.n}"]`);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'rounded-lg border border-accent/40 bg-surface p-4 text-left';
      card.innerHTML = `<p class="mono-label text-accent">Up next · step ${next.n}</p><p class="mt-2 font-serif text-lg text-ink">${button?.querySelector('.font-serif')?.textContent ?? 'Next step'}</p>`;
      card.addEventListener('click', () => {
        showField(next.fieldId);
        button?.click();
      });
      slot.append(card);
    }
    for (const item of memory.recent.slice(0, 3)) {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'rounded-lg border border-line bg-surface p-4';
      const when = relTime(item.at);
      link.innerHTML = `<p class="mono-label text-ink-faint">${item.kind} · ${item.field}</p><p class="mt-2 font-serif text-lg text-ink"></p><p class="mt-1 text-sm text-ink-muted">${when}</p>`;
      const title = link.querySelector('.font-serif');
      if (title) title.textContent = item.title;
      slot.append(link);
    }
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'mono-label justify-self-start text-ink-faint hover:text-ink';
    clear.textContent = 'Clear history';
    clear.addEventListener('click', () => {
      memory = { read: memory.read, recent: [] };
      persist();
      paintRead();
    });
    slot.append(clear);
  };

  const showField = (id: string) => {
    const next = fieldById(id) ?? fields[0];
    if (!next) return;
    for (const field of fields) {
      const on = field === next;
      field.dataset.active = on ? 'true' : 'false';
      field.hidden = !on;
    }
    for (const link of root.querySelectorAll<HTMLAnchorElement>('[data-hub-jump]')) {
      const on = link.dataset.hubJump === next.dataset.hubField;
      if (on) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    const chip = root.querySelector<HTMLAnchorElement>(`[data-hub-jump="${next.dataset.hubField ?? ''}"]`);
    chip?.scrollIntoView({ inline: 'center', block: 'nearest' });
    applyFilters(next);
  };

  const filtersOf = (field: HTMLElement): Filters => {
    const root = controls(field);
    const chosen = (name: string, fallback: string) =>
      root.querySelector<HTMLButtonElement>(`[data-filter="${name}"][aria-checked="true"]`)?.dataset.value ?? fallback;
    return {
      type: chosen('type', 'all'),
      level: chosen('level', 'any'),
      status: chosen('status', 'all'),
      tag: root.querySelector<HTMLButtonElement>('[data-filter-tag][aria-pressed="true"]')?.dataset.filterTag ?? '',
      q: root.querySelector<HTMLInputElement>('[data-filter-q]')?.value ?? '',
      sort: root.querySelector<HTMLSelectElement>('[data-filter-sort]')?.value ?? 'path',
    };
  };

  const writeUrl = (field: HTMLElement) => {
    const filters = filtersOf(field);
    const params = new URLSearchParams();
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.level !== 'any') params.set('level', filters.level);
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.q.trim()) params.set('q', filters.q.trim());
    if (filters.sort !== 'path') params.set('sort', filters.sort);
    const query = params.toString();
    const hash = `#${field.dataset.hubField ?? ''}`;
    const next = `${window.location.pathname}${query ? `?${query}` : ''}${hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
      history.replaceState(null, '', next);
    }
  };

  const applyFilters = (field: HTMLElement) => {
    const filters = filtersOf(field);
    const grid = field.querySelector<HTMLElement>('[data-hub-grid]');
    const cards = [...field.querySelectorAll<HTMLElement>('[data-hub-card]')];
    const query = foldSearch(filters.q.trim());
    const visible = cards.filter((card) => {
      if (filters.type !== 'all' && card.dataset.kind !== filters.type) return false;
      if (filters.level !== 'any' && card.dataset.level !== filters.level) return false;
      if (filters.status === 'read' && card.dataset.readState !== 'read') return false;
      if (filters.status === 'unread' && card.dataset.readState === 'read') return false;
      if (filters.tag && !(card.dataset.tags ?? '').split('|').includes(filters.tag)) return false;
      if (query && !foldSearch(card.dataset.text ?? '').includes(query)) return false;
      return true;
    });
    visible.sort((a, b) => compareCards(a, b, filters.sort));
    if (grid) {
      for (const card of visible) grid.append(card);
      for (const card of cards) {
        if (!visible.includes(card)) grid.append(card);
      }
    }
    for (const card of cards) card.hidden = !visible.includes(card);
    const count = field.querySelector('[data-filter-count]');
    if (count) count.textContent = `${visible.length} of ${cards.length}`;
    const empty = field.querySelector<HTMLElement>('[data-filter-empty]');
    if (empty) empty.hidden = visible.length > 0 || cards.length === 0;
    const active =
      (filters.type !== 'all' ? 1 : 0) +
      (filters.level !== 'any' ? 1 : 0) +
      (filters.status !== 'all' ? 1 : 0) +
      (filters.tag ? 1 : 0) +
      (filters.q.trim() ? 1 : 0);
    for (const button of field.querySelectorAll<HTMLButtonElement>('[data-filter-clear]')) {
      button.hidden = active === 0;
      button.textContent = active > 0 ? `Clear ${active}` : 'Clear';
    }
    const live = field.querySelector('[data-hub-live]');
    const title = field.querySelector('h2')?.textContent ?? 'This field';
    if (live) live.textContent = `${title}: ${visible.length} items shown`;
    const apply = filterDialog?.querySelector('[data-filter-apply]');
    if (apply) apply.textContent = `Show ${visible.length} items`;
  };

  const clearFilters = (field: HTMLElement) => {
    const box = controls(field);
    const sort = box.querySelector<HTMLSelectElement>('[data-filter-sort]')?.value ?? 'path';
    setRadio(box, 'type', 'all');
    setRadio(box, 'level', 'any');
    setRadio(box, 'status', 'all');
    for (const tag of box.querySelectorAll<HTMLButtonElement>('[data-filter-tag]')) {
      tag.setAttribute('aria-pressed', 'false');
    }
    const input = box.querySelector<HTMLInputElement>('[data-filter-q]');
    if (input) input.value = '';
    const select = box.querySelector<HTMLSelectElement>('[data-filter-sort]');
    if (select) select.value = sort;
    applyFilters(field);
    writeUrl(field);
  };

  const readUrlInto = (field: HTMLElement) => {
    const box = controls(field);
    const params = new URLSearchParams(window.location.search);
    setRadio(box, 'type', params.get('type') ?? 'all');
    setRadio(box, 'level', params.get('level') ?? 'any');
    setRadio(box, 'status', params.get('status') ?? 'all');
    const tag = params.get('tag') ?? '';
    for (const button of box.querySelectorAll<HTMLButtonElement>('[data-filter-tag]')) {
      button.setAttribute('aria-pressed', button.dataset.filterTag === tag ? 'true' : 'false');
    }
    const input = box.querySelector<HTMLInputElement>('[data-filter-q]');
    if (input) input.value = params.get('q') ?? '';
    const select = box.querySelector<HTMLSelectElement>('[data-filter-sort]');
    if (select) select.value = params.get('sort') ?? 'path';
  };

  const openSheetFrom = (template: HTMLTemplateElement | null, focus: HTMLElement) => {
    if (!sheet || !sheetBody || !template) return;
    returnFocus = focus;
    sheetBody.replaceChildren(template.content.cloneNode(true));
    for (const button of sheetBody.querySelectorAll<HTMLButtonElement>('[data-read]')) {
      const key = button.dataset.read ?? '';
      button.setAttribute('aria-pressed', memory.read.includes(key) ? 'true' : 'false');
    }
    if (!sheet.open) sheet.showModal();
    sheet.focus();
  };

  const openItem = (field: HTMLElement, key: string, focus: HTMLElement) => {
    const template = field.querySelector<HTMLTemplateElement>(`template[data-sheet-item="${cssEscape(key)}"]`);
    openSheetFrom(template, focus);
    remember(key, focus);
  };

  const openStep = (field: HTMLElement, n: string, focus: HTMLElement) => {
    const template = field.querySelector<HTMLTemplateElement>(`template[data-sheet-step="${n}"]`);
    openSheetFrom(template, focus);
    const button = field.querySelector<HTMLButtonElement>(`[data-open-step="${n}"]`);
    const title = button?.querySelector('.font-serif')?.textContent ?? '';
    const article = template?.content.querySelector('a')?.getAttribute('href') ?? '';
    if (title) pushRecent({ key: `step:${field.dataset.hubField}:${n}`, title, href: article || `#${field.dataset.hubField}`, field: fieldTitle(field), kind: 'Path step', at: Date.now() });
  };

  const toggleRead = (key: string) => {
    if (!key) return;
    memory = {
      ...memory,
      read: memory.read.includes(key) ? memory.read.filter((item) => item !== key) : [...memory.read, key],
    };
    persist();
    paintRead();
    const field = activeField();
    if (field) applyFilters(field);
    if (sheetBody) {
      for (const button of sheetBody.querySelectorAll<HTMLButtonElement>(`[data-read="${cssEscape(key)}"]`)) {
        button.setAttribute('aria-pressed', memory.read.includes(key) ? 'true' : 'false');
      }
    }
  };

  const remember = (key: string, focus: HTMLElement) => {
    const card = focus.closest<HTMLElement>('[data-hub-card]') ?? root.querySelector<HTMLElement>(`[data-key="${cssEscape(key)}"]`);
    const title = card?.querySelector('h3')?.textContent?.trim() ?? key;
    const href = card?.querySelector('a')?.getAttribute('href') ?? '';
    const field = card?.closest<HTMLElement>('[data-hub-field]');
    pushRecent({
      key,
      title,
      href,
      field: field ? fieldTitle(field) : '',
      kind: card?.dataset.kind ?? 'note',
      at: Date.now(),
    });
  };

  const pushRecent = (item: RecentItem) => {
    memory = {
      ...memory,
      recent: [item, ...memory.recent.filter((candidate) => candidate.key !== item.key)].slice(0, 8),
    };
    persist();
    paintResume();
  };

  const renderPalette = () => {
    if (!palette) return;
    const input = palette.querySelector<HTMLInputElement>('[data-palette-q]');
    const list = palette.querySelector<HTMLUListElement>('#hub-palette-list');
    const status = palette.querySelector('[data-palette-status]');
    const site = palette.querySelector<HTMLAnchorElement>('[data-palette-site]');
    if (!input || !list || !status) return;
    const terms = foldSearch(input.value).split(/\s+/).filter(Boolean);
    if (site) {
      const params = new URLSearchParams();
      if (input.value.trim()) params.set('q', input.value.trim());
      site.href = params.size > 0 ? `/search?${params}` : '/search';
    }
    const scopes = palette.querySelector('[data-palette-scopes]');
    if (scopes && scopes.childElementCount === 0) {
      for (const item of SCOPES) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.scope = item.id;
        button.className = 'mono-label rounded-sm px-2 py-1 text-ink-faint aria-pressed:bg-raised aria-pressed:text-ink';
        button.textContent = item.label;
        scopes.append(button);
      }
    }
    for (const button of palette.querySelectorAll<HTMLButtonElement>('[data-scope]')) {
      const count = hits.filter((hit) => button.dataset.scope === 'all' || hit.kind === button.dataset.scope).length;
      button.setAttribute('aria-pressed', button.dataset.scope === scope ? 'true' : 'false');
      button.textContent = `${SCOPES.find((item) => item.id === button.dataset.scope)?.label ?? ''} ${count}`;
    }
    if (terms.length === 0) {
      list.replaceChildren();
      const recent = memory.recent.slice(0, 5);
      if (recent.length > 0) appendGroup(list, 'Recently opened', recent.map((item) => ({ href: item.href, kind: item.kind, title: item.title, sub: item.field })));
      appendGroup(
        list,
        'Fields',
        hits.filter((hit) => hit.kind === 'field').map((hit) => ({ href: hit.href, kind: 'Field', title: hit.title, sub: hit.sub })),
      );
      status.textContent = 'Recently opened, and the fields.';
      activeHit = 0;
      markPalette();
      return;
    }
    const matched = hits
      .map((hit) => ({ hit, score: scoreHit(hit, terms) }))
      .filter((row) => row.score > 0 && (scope === 'all' || row.hit.kind === scope))
      .sort((a, b) => b.score - a.score);
    list.replaceChildren();
    const groups = ['figure', 'note', 'guide', 'step', 'entry', 'field'] as const;
    for (const kind of groups) {
      const rows = matched.filter((row) => row.hit.kind === kind).slice(0, 6);
      if (rows.length === 0) continue;
      appendGroup(
        list,
        groupLabel(kind),
        rows.map((row) => ({
          href: row.hit.href,
          kind: `${row.hit.fieldTitle}${memory.read.includes(row.hit.key) ? ' · Read' : ''}`,
          title: row.hit.title,
          sub: row.hit.sub,
        })),
      );
    }
    status.textContent = matched.length === 0 ? 'No matches.' : `${matched.length} ${matched.length === 1 ? 'match' : 'matches'}.`;
    activeHit = 0;
    markPalette();
  };

  const markPalette = () => {
    const list = palette?.querySelector<HTMLUListElement>('#hub-palette-list');
    const input = palette?.querySelector<HTMLInputElement>('[data-palette-q]');
    const options = [...(list?.querySelectorAll<HTMLAnchorElement>('a[role="option"]') ?? [])];
    if (options.length === 0) {
      input?.removeAttribute('aria-activedescendant');
      return;
    }
    if (activeHit >= options.length) activeHit = 0;
    options.forEach((option, index) => {
      const selected = index === activeHit;
      option.setAttribute('aria-selected', selected ? 'true' : 'false');
      option.classList.toggle('bg-raised', selected);
      if (selected) option.scrollIntoView({ block: 'nearest' });
    });
  };

  root.classList.add('hub-ready');
  const hash = window.location.hash.slice(1);
  const initial = fieldById(hash) ?? fields[0];
  if (initial) {
    readUrlInto(initial);
    showField(initial.dataset.hubField ?? '');
  }
  paintRead();
  root.querySelector('[data-hub-bottom]')?.classList.remove('hidden');
  root.querySelector('[data-hub-bottom]')?.classList.add('flex');

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const jump = target.closest<HTMLAnchorElement>('[data-hub-jump]');
    if (jump?.dataset.hubJump) {
      showField(jump.dataset.hubJump);
      return;
    }
    const read = target.closest<HTMLButtonElement>('[data-read]');
    if (read) {
      event.preventDefault();
      event.stopPropagation();
      toggleRead(read.dataset.read ?? '');
      return;
    }
    const itemLink = target.closest<HTMLAnchorElement>('[data-open-item]');
    if (itemLink && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
      event.preventDefault();
      const field = itemLink.closest<HTMLElement>('[data-hub-field]');
      if (field) openItem(field, itemLink.dataset.openItem ?? '', itemLink);
      return;
    }
    const step = target.closest<HTMLButtonElement>('[data-open-step]');
    if (step?.dataset.openStep) {
      const field = step.closest<HTMLElement>('[data-hub-field]') ?? activeField();
      if (field) openStep(field, step.dataset.openStep, step);
      return;
    }
    const radio = target.closest<HTMLButtonElement>('[data-filter][data-value]');
    if (radio?.dataset.filter && radio.dataset.value) {
      const field = radio.closest<HTMLElement>('[data-hub-field]') ?? activeField();
      if (!field) return;
      setRadio(controls(field), radio.dataset.filter, radio.dataset.value);
      applyFilters(field);
      writeUrl(field);
      return;
    }
    const tag = target.closest<HTMLButtonElement>('[data-filter-tag]');
    if (tag) {
      const field = tag.closest<HTMLElement>('[data-hub-field]') ?? activeField();
      if (!field) return;
      const on = tag.getAttribute('aria-pressed') === 'true';
      for (const button of controls(field).querySelectorAll<HTMLButtonElement>('[data-filter-tag]')) {
        button.setAttribute('aria-pressed', 'false');
      }
      if (!on) tag.setAttribute('aria-pressed', 'true');
      applyFilters(field);
      writeUrl(field);
      return;
    }
    if (target.closest('[data-filter-clear]')) {
      const field = target.closest<HTMLElement>('[data-hub-field]') ?? activeField();
      if (field) clearFilters(field);
      return;
    }
    if (target.closest('[data-open-filters]')) {
      const field = activeField();
      const bar = field?.querySelector('[data-filter-bar]');
      const slot = filterDialog?.querySelector('[data-filter-slot]');
      if (field && bar && slot && filterDialog) {
        slot.replaceChildren(bar);
        filterDialog.showModal();
      }
      return;
    }
    if (target.closest('[data-hub-search]')) {
      openPalette();
      return;
    }
    if (target.closest('[data-hub-reset]')) {
      memory = { read: [], recent: [] };
      persist();
      paintRead();
      const field = activeField();
      if (field) applyFilters(field);
    }
  });

  root.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.matches('[data-filter-q]')) return;
    const field = target.closest<HTMLElement>('[data-hub-field]') ?? activeField();
    if (!field) return;
    applyFilters(field);
    writeUrl(field);
  });

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || !target.matches('[data-filter-sort]')) return;
    const field = target.closest<HTMLElement>('[data-hub-field]') ?? activeField();
    if (!field) return;
    applyFilters(field);
    writeUrl(field);
  });

  filterDialog?.addEventListener('close', () => {
    const bar = filterDialog.querySelector('[data-filter-bar]');
    const field = activeField();
    const host = field?.querySelector('[data-hub-filters] [data-filter-bar]') ? null : field?.querySelector('[data-hub-filters]');
    if (bar && host) host.append(bar);
  });

  filterDialog?.querySelector('[data-filter-apply]')?.addEventListener('click', () => filterDialog.close());

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-dialog-close]')) {
      sheet?.close();
      filterDialog?.close();
      palette?.close();
    }
    const scopeButton = target.closest<HTMLButtonElement>('[data-scope]');
    if (scopeButton?.dataset.scope) {
      scope = scopeButton.dataset.scope;
      renderPalette();
    }
  });

  sheet?.addEventListener('close', () => {
    returnFocus?.focus();
    returnFocus = null;
  });

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (fieldById(id)) showField(id);
  });

  document.addEventListener('keydown', (event) => {
    const meta = event.metaKey || event.ctrlKey;
    if (meta && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (palette?.open) palette.close();
      else openPalette();
      return;
    }
    if (event.key === '/' && !isTyping(event.target) && !palette?.open && !sheet?.open && !filterDialog?.open) {
      event.preventDefault();
      openPalette();
      return;
    }
    if ((event.key === '[' || event.key === ']') && !isTyping(event.target) && !sheet?.open && !palette?.open) {
      event.preventDefault();
      const current = fields.findIndex((field) => field.dataset.active === 'true');
      const delta = event.key === ']' ? 1 : -1;
      const next = fields[(current + delta + fields.length) % fields.length];
      if (next?.dataset.hubField) {
        history.replaceState(null, '', `#${next.dataset.hubField}`);
        showField(next.dataset.hubField);
      }
      return;
    }
    if (!palette?.open) return;
    const options = [...(palette.querySelectorAll<HTMLAnchorElement>('a[role="option"]') ?? [])];
    if (event.key === 'ArrowDown' && options.length > 0) {
      event.preventDefault();
      activeHit = (activeHit + 1) % options.length;
      markPalette();
    } else if (event.key === 'ArrowUp' && options.length > 0) {
      event.preventDefault();
      activeHit = (activeHit - 1 + options.length) % options.length;
      markPalette();
    } else if (event.key === 'Enter') {
      const chosen = options[activeHit];
      if (!chosen) return;
      event.preventDefault();
      window.location.assign(chosen.href);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const index = SCOPES.findIndex((item) => item.id === scope);
      const next = SCOPES[(index + 1) % SCOPES.length];
      if (next) {
        scope = next.id;
        renderPalette();
      }
    }
  });

  palette?.querySelector('[data-palette-q]')?.addEventListener('input', () => renderPalette());
  palette?.querySelector('[data-palette-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const chosen = palette.querySelectorAll<HTMLAnchorElement>('a[role="option"]')[activeHit];
    if (chosen) window.location.assign(chosen.href);
  });

  function openPalette() {
    if (!palette) return;
    const menu = document.querySelector('#site-menu');
    if (menu instanceof HTMLDialogElement && menu.open) menu.close();
    if (!palette.open) palette.showModal();
    const input = palette.querySelector<HTMLInputElement>('[data-palette-q]');
    input?.focus();
    input?.select();
    renderPalette();
  }
}

function setRadio(field: ParentNode, name: string, value: string): void {
  const buttons = [...field.querySelectorAll<HTMLButtonElement>(`[data-filter="${name}"]`)];
  if (buttons.length === 0) return;
  const match = buttons.some((button) => button.dataset.value === value);
  for (const button of buttons) {
    const on = match ? button.dataset.value === value : button.dataset.value === 'all' || button.dataset.value === 'any';
    button.setAttribute('aria-checked', on ? 'true' : 'false');
  }
}

function compareCards(a: HTMLElement, b: HTMLElement, sort: string): number {
  if (sort === 'short') return Number(a.dataset.minutes ?? 0) - Number(b.dataset.minutes ?? 0);
  if (sort === 'new') return (b.dataset.published ?? '').localeCompare(a.dataset.published ?? '');
  return Number(a.dataset.order ?? 999) - Number(b.dataset.order ?? 999);
}

function fieldTitle(field: HTMLElement): string {
  return field.querySelector('h2')?.textContent?.trim() ?? '';
}

function relTime(at: number): string {
  const minutes = Math.max(1, Math.round((Date.now() - at) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

function loadMemory(): Memory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { read: [], recent: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { read: [], recent: [] };
    const readValue = Reflect.get(parsed, 'read');
    const recentValue = Reflect.get(parsed, 'recent');
    const read = Array.isArray(readValue) && readValue.every((item) => typeof item === 'string') ? readValue : [];
    const recent = Array.isArray(recentValue) ? recentValue.flatMap((item) => (isRecent(item) ? [item] : [])) : [];
    return { read, recent };
  } catch {
    return { read: [], recent: [] };
  }
}

function persistMemory(memory: Memory): void {
  let existing: Record<string, unknown> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') existing = { ...(parsed as Record<string, unknown>) };
    }
  } catch {
    existing = {};
  }
  existing.read = memory.read;
  existing.recent = memory.recent;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

function isRecent(value: unknown): value is RecentItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<RecentItem>;
  return typeof item.key === 'string' && typeof item.title === 'string' && typeof item.href === 'string' && typeof item.at === 'number';
}

function scoreHit(hit: Hit, terms: string[]): number {
  const title = foldSearch(hit.title);
  const body = foldSearch(hit.text);
  if (!terms.every((term) => body.includes(term))) return 0;
  if (terms.every((term) => title.startsWith(term))) return 3;
  if (terms.every((term) => title.includes(term))) return 2;
  return 1;
}

function groupLabel(kind: string): string {
  if (kind === 'figure') return 'Live figures';
  if (kind === 'note') return 'Notes';
  if (kind === 'guide') return 'Guides';
  if (kind === 'step') return 'Learning path steps';
  if (kind === 'entry') return 'From the field essays';
  return 'Fields';
}

function appendGroup(list: HTMLUListElement, label: string, rows: { href: string; kind: string; title: string; sub: string }[]): void {
  const head = document.createElement('li');
  head.className = 'mono-label px-2 pt-3 pb-1 text-ink-faint';
  head.textContent = label;
  list.append(head);
  for (const row of rows) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = row.href;
    link.role = 'option';
    link.className = 'grid gap-0.5 rounded-md px-2 py-2 text-ink hover:bg-raised';
    const kind = document.createElement('span');
    kind.className = 'mono-label text-ink-faint';
    kind.textContent = row.kind;
    const title = document.createElement('span');
    title.className = 'text-sm';
    title.textContent = row.title;
    const sub = document.createElement('span');
    sub.className = 'line-clamp-1 text-xs text-ink-muted';
    sub.textContent = row.sub;
    link.append(kind, title, sub);
    item.append(link);
    list.append(item);
  }
}

function readHits(): Hit[] {
  const node = document.querySelector('#hub-index');
  if (!(node instanceof HTMLScriptElement)) return [];
  try {
    const parsed: unknown = JSON.parse(node.textContent ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => (isHit(item) ? [item] : []));
  } catch {
    return [];
  }
}

function isHit(value: unknown): value is Hit {
  if (!value || typeof value !== 'object') return false;
  const hit = value as Partial<Hit>;
  return typeof hit.key === 'string' && typeof hit.title === 'string' && typeof hit.href === 'string' && typeof hit.text === 'string' && typeof hit.kind === 'string';
}

function cssEscape(value: string): string {
  return window.CSS?.escape ? window.CSS.escape(value) : value.replace(/"/g, '\\"');
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}
