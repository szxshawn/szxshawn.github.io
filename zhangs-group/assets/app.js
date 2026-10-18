(() => {
  'use strict';
  const data = window.SITE_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const node = (tag, className = '', text = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  // Only known web and local asset destinations are rendered as links.
  const safeURL = (value) => {
    if (typeof value !== 'string') return null;
    if (/^https?:\/\//i.test(value)) {
      try { return new URL(value).href; } catch { return null; }
    }
    if (/^assets\/[a-zA-Z0-9_./%\-]+$/.test(value) && !value.includes('..')) return value;
    return null;
  };
  const link = (label, url, className = '') => {
    const href = safeURL(url);
    if (!href) return null;
    const a = node('a', className, label);
    a.href = href;
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  };
  $('[data-content="description"]').textContent = data.description;
  $('#year').textContent = String(new Date().getFullYear());

  const diagrams = {
    autonomous: '<path d="m39 116 83-85 84 85M74 116l49-85 48 85" stroke="#c3d6e5"/><path d="M123 41v10m0 11v10m0 10v10m0 10v10" stroke-dasharray="5 5"/><rect x="102" y="68" width="42" height="59" rx="12" fill="#f6fafd"/><path d="m108 81 5-7h20l5 7-3 15h-24Z" fill="#d8e8f3"/><path d="M110 114h26M103 101v12m40-12v12"/><path d="M90 61a48 48 0 0 1 66 0M80 50a63 63 0 0 1 86 0M69 38a79 79 0 0 1 108 0" stroke="#8eb6d1"/><circle cx="123" cy="64" r="3" fill="#00529b"/>',
    spatial: '<path d="m47 92 74-43 76 44-74 44Z" stroke="#c3d6e5"/><path d="m123 137 1-88M84 71l75 44M84 114l75-43" stroke="#c3d6e5"/><path d="m88 95 35-20 35 20-35 20Z" fill="#e8f1f7"/><path d="M88 95V51l35-20 35 20v44M88 51l35 20 35-20M123 71v44M123 31v44"/><path d="M65 63v-19l16-9m84 0 16 9v19M65 101v13l16 9m84 0 16-9v-13" stroke="#8eb6d1"/><circle cx="123" cy="71" r="3" fill="#00529b"/>',
    energy: '<path d="M50 121h145M50 121V38M50 94h145M50 67h145M80 38v83m29-83v83m29-83v83m29-83v83" stroke="#d0dfe9"/><path d="m53 109 21-9 16 6 19-30 18 10 22-32 18 8 24-23" stroke-width="2"/><path d="m53 113 21-4 16 6 19-17 18 3 22-17 18 3 24-17" stroke="#4bafa9" stroke-dasharray="3 4"/><circle cx="149" cy="54" r="4" fill="#fff"/><path d="m181 38 10 1-1 10"/><path d="m113 26-7 13h9l-6 12" stroke="#4bafa9"/>'
  };
  for (const item of data.research) {
    const article = node('article', 'research-card');
    const top = node('div', 'research-card-top');
    top.append(node('span', 'research-number', item.number), node('span', 'card-axis', 'RESEARCH AREA'));
    const art = node('div', 'research-art');
    art.setAttribute('aria-hidden', 'true');
    art.innerHTML = `<svg viewBox="0 0 246 154">${diagrams[item.id] || ''}</svg>`;
    const body = node('div', 'research-card-body');
    body.append(node('p', 'research-en', item.en), node('h3', '', item.title), node('p', 'research-summary', item.summary));
    const tags = node('div', 'research-tags');
    item.tags.forEach((tag) => tags.append(node('span', '', tag)));
    const details = node('details', 'research-details');
    const summary = node('summary', '', '了解研究主题');
    summary.setAttribute('aria-label', `了解${item.title}的研究主题`);
    const detailBody = node('div', 'research-detail-body');
    detailBody.append(node('strong', '', item.question), node('p', '', item.detail));
    const list = node('ul');
    item.topics.forEach((topic) => list.append(node('li', '', topic)));
    detailBody.append(list);
    details.append(summary, detailBody);
    body.append(tags, details);
    article.append(top, art, body);
    $('#research-grid').append(article);
  }

  let selectedFilter = 'all';
  const renderPublications = () => {
    const query = $('#publication-search').value.trim().toLocaleLowerCase();
    const publications = data.publications.filter((paper) => {
      const authors = Array.isArray(paper.authors) ? paper.authors.join(', ') : (paper.authors || '');
      return (selectedFilter === 'all' || (paper.areas || []).includes(selectedFilter)) &&
        `${paper.title} ${authors} ${paper.venue || ''}`.toLocaleLowerCase().includes(query);
    }).sort((a, b) => Number(b.year) - Number(a.year));
    const container = $('#publication-list');
    container.replaceChildren();
    if (!publications.length) {
      const empty = node('div', 'empty-publications');
      const icon = node('div', 'document-icon'); icon.setAttribute('aria-hidden', 'true');
      const text = node('div');
      text.append(node('h3', '', data.publications.length ? '没有找到符合条件的成果' : '学术成果，正在整理'), node('p', '', data.publications.length ? '试试其他关键词，或切换研究方向。' : '论文、项目与开放资源将在资料补充后陆续呈现。'));
      empty.append(icon, text, node('span', 'empty-status', 'RESEARCH IN PROGRESS'));
      container.append(empty);
      return;
    }
    for (const paper of publications) {
      const article = node('article', 'publication-row');
      const info = node('div');
      const authors = Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors;
      info.append(node('h3', 'publication-title', paper.title), node('p', 'publication-authors', authors), node('p', 'publication-venue', paper.venue || ''));
      const links = node('div', 'publication-links');
      for (const [label, url] of [['论文 ↗', paper.url], ['代码 ↗', paper.code], ['PDF ↗', paper.pdf]]) {
        const anchor = link(label, url); if (anchor) links.append(anchor);
      }
      article.append(node('div', 'publication-year', String(paper.year)), info, links);
      container.append(article);
    }
  };
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    selectedFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((other) => {
      const isActive = other === button;
      other.classList.toggle('active', isActive);
      other.setAttribute('aria-pressed', String(isActive));
    });
    renderPublications();
  }));
  $('#publication-search').addEventListener('input', renderPublications);
  renderPublications();

  const people = $('#people-list');
  if (!data.people.length) {
    const empty = node('div', 'people-placeholder');
    const symbol = node('div', 'people-symbol'); symbol.setAttribute('aria-hidden', 'true');
    ['Z', 'G', '+'].forEach((letter) => symbol.append(node('span', '', letter)));
    empty.append(symbol, node('h3', '', '认识 zhang’s group'), node('p', '', '导师与团队成员介绍正在整理，敬请期待。'), node('p', 'small-label', 'PEOPLE BEHIND THE IDEAS'));
    people.append(empty);
  } else {
    people.className = 'people-cards';
    for (const person of data.people) {
      const card = node('article', 'person');
      const photo = safeURL(person.photo);
      if (photo) {
        const image = node('img'); image.src = photo; image.alt = `${person.name}的照片`; image.loading = 'lazy';
        card.append(image);
      } else card.append(node('div', 'person-initial', person.name.slice(0, 1)));
      card.append(node('h3', '', person.name), node('p', '', person.role || ''), node('p', '', person.bio || ''));
      const profile = link('个人主页 ↗', person.url); if (profile) card.append(profile);
      people.append(card);
    }
  }
  const news = $('#news-list');
  if (!data.news.length) {
    const empty = node('div', 'news-placeholder');
    empty.append(node('span', '', 'STAY TUNED'), node('p', '', '研究进展、学术交流与课题组近况，将在这里更新。'));
    news.append(empty);
  } else {
    [...data.news].sort((a, b) => b.date.localeCompare(a.date)).forEach((item) => {
      const row = node('article', 'news-row');
      const date = node('time', '', item.date); date.dateTime = item.date;
      const body = node('div');
      const heading = node('h3');
      const anchor = link(item.title, item.url);
      if (anchor) heading.append(anchor); else heading.textContent = item.title;
      body.append(heading); if (item.summary) body.append(node('p', '', item.summary));
      row.append(date, body); news.append(row);
    });
  }
  const contact = $('#contact-details');
  if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    const email = node('a', 'contact-email', data.email + ' ↗');
    email.href = `mailto:${encodeURIComponent(data.email).replace('%40', '@')}`;
    contact.append(email);
  } else contact.append(node('p', 'contact-details-status', '课题组联系方式正在整理，稍后更新。'));
  if (data.affiliation) contact.append(node('p', 'contact-address', data.affiliation));
  if (data.address) contact.append(node('p', 'contact-address', data.address));
  if (data.recruitment) contact.append(node('p', 'contact-address', data.recruitment));

  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', '打开导航菜单'); nav.classList.remove('open'); };
  toggle.addEventListener('click', () => {
    const opened = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? '关闭导航菜单' : '打开导航菜单');
    nav.classList.toggle('open', opened);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });
})();
