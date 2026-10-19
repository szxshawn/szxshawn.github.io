(() => {
  'use strict';
  const data = window.SITE_DATA;
  let language = 'zh';
  let filter = 'all';
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  try { language = localStorage.getItem('zhangs-group-language') === 'en' ? 'en' : 'zh'; } catch {}
  if (queryLanguage === 'en' || queryLanguage === 'zh') language = queryLanguage;
  const translate = value => typeof value === 'string' ? value : value?.[language] ?? value?.zh ?? '';
  const t = key => translate(data.ui[key]);
  const el = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const external = (url, label, className = 'text-link') => {
    const link = el('a', className, label);
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return el('span', className, label);
      link.href = parsed.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } catch { return el('span', className, label); }
    return link;
  };
  const portrait = person => {
    const frame = el('div', 'portrait');
    const img = el('img');
    img.src = person.photo;
    img.width = 600; img.height = 750; img.loading = 'lazy'; img.decoding = 'async';
    const placeholder = () => {
      img.alt = '';
      if (!frame.querySelector('.portrait-label')) frame.append(el('span','portrait-label',t('photoPlaceholder')));
    };
    img.alt = t('portraitAlt').replace('{name}', translate(person.name));
    img.addEventListener('error', () => { img.src = 'assets/portrait-placeholder.svg'; placeholder(); }, {once:true});
    frame.append(img);
    return frame;
  };
  function renderResearch() {
    const container = document.getElementById('research-list'); container.replaceChildren();
    data.research.forEach(item => {
      const card = el('article', 'research-card'); card.id = item.id;
      const top = el('div', 'research-card-top'); top.append(el('span','research-index',item.number));
      const icon = el('img','research-icon'); icon.src = `assets/${item.icon}-icon.svg`; icon.alt = ''; icon.width = 60; icon.height = 45; top.append(icon);
      card.append(top, el('h3','',translate(item.title)), el('span','research-en',item.subtitle), el('p','',translate(item.description)));
      const tags = el('ul','research-tags'); item.tags.forEach(tag => tags.append(el('li','',translate(tag)))); card.append(tags);
      const bottom = el('div','research-bottom'); bottom.append(el('div','research-question',translate(item.question))); card.append(bottom); container.append(card);
    });
  }
  function renderPeople() {
    const person = data.advisor;
    const advisor = el('article', 'advisor-card'); const info = el('div','advisor-info');
    if (translate(person.badge)) info.append(el('span','draft-tag',translate(person.badge)));
    info.append(el('h4','',translate(person.name)),el('span','person-name-en',person.englishName),el('p','person-role',translate(person.role)),el('p','person-bio',translate(person.bio)));
    if (person.profileUrl) info.append(external(person.profileUrl,translate(person.profileLabel),'text-link profile-link'));
    if (translate(person.note)) info.append(el('p','advisor-note',translate(person.note)));
    advisor.append(portrait(person),info); document.getElementById('advisor-list').replaceChildren(advisor);
    const faculty = document.getElementById('faculty-list'); faculty.replaceChildren();
    data.faculty.forEach(person => {
      const card=el('article','faculty-card'); const info=el('div','faculty-info');
      info.append(el('h4','',translate(person.name)),el('span','person-name-en',person.englishName),el('p','person-role',translate(person.role)),el('p','person-bio',translate(person.bio)));
      card.append(portrait(person),info);faculty.append(card);
    });
    const students = document.getElementById('student-list'); students.replaceChildren();
    data.students.forEach(person => {
      const card=el('article','student-card'); card.dataset.degree=person.degree;
      const meta=el('div','student-meta');meta.append(el('h4','',translate(person.name)),el('span','student-degree',t(person.degree==='phd'?'phdStudents':'mastersStudents')));
      card.append(portrait(person),meta,el('p','student-interest',translate(person.interest)));students.append(card);
    });
    filterStudents(false);
  }
  function filterStudents(announce = true) {
    let count=0;
    document.querySelectorAll('.student-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.degree!==filter;if(!card.hidden)count++;});
    document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===filter)));
    document.querySelector('.empty-filter')?.remove();
    if(!count)document.getElementById('student-list').append(el('p','empty-filter',t('emptyStudents')));
    if(announce)document.getElementById('student-status').textContent=t('studentCount').replace('{count}',String(count));
    else document.getElementById('student-status').textContent='';
  }
  function renderPublications() {
    const target=document.getElementById('publication-list');target.replaceChildren();
    if(!data.publications.length){
      const empty=el('div','empty-publications');const icon=el('img','empty-icon');icon.src='assets/publication-icon.svg';icon.alt='';icon.width=52;icon.height=60;
      const copy=el('div');copy.append(el('h3','',t('publicationsEmptyTitle')),el('p','',t('publicationsEmptyText')));
      empty.append(icon,copy,el('span','empty-index','—'));target.append(empty);return;
    }
    data.publications.forEach(publication=>{
      const article=el('article','publication');const body=el('div');
      body.append(el('h3','',translate(publication.title)),el('p','',translate(publication.authors)),el('p','',translate(publication.venue)));
      const links=el('div');[['paper','paperLink'],['code','codeLink'],['project','projectLink']].forEach(([field,key])=>{if(publication[field])links.append(external(publication[field],t(key),'publication-link'));});
      body.append(links);article.append(el('span','publication-year',String(publication.year)),body);target.append(article);
    });
  }
  const menu=document.querySelector('.menu-toggle');const nav=document.getElementById('navigation');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',t('openMenu'));nav.classList.remove('is-open');}
  function render() {
    document.documentElement.lang=language==='zh'?'zh-CN':'en';
    document.title=data.name;
    document.querySelector('meta[name=description]').content=t('description');
    document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));
    document.querySelectorAll('[data-i18n-aria]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.i18nAria)));
    document.querySelectorAll('[data-i18n-alt]').forEach(node=>node.alt=t(node.dataset.i18nAlt));
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
    renderResearch();renderPeople();renderPublications();
    const email=document.getElementById('contact-email');
    if(data.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)){
      const link=el('a','contact-email',data.contactEmail);link.href=`mailto:${data.contactEmail}`;email.replaceChildren(link);document.querySelector('.contact-note').hidden=true;
    }else{email.replaceChildren(el('span','contact-email',t('emailPending')));document.querySelector('.contact-note').hidden=false;}
    document.getElementById('year').textContent=String(new Date().getFullYear());
    menu.setAttribute('aria-label',t(menu.getAttribute('aria-expanded')==='true'?'closeMenu':'openMenu'));
  }
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{
    language=button.dataset.lang;try{localStorage.setItem('zhangs-group-language',language);}catch{}
    // Keep shareable language URLs in sync without a reload, including when opened as a local file.
    try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch{}
    render();
  }));
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;filterStudents();}));
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',t(open?'closeMenu':'openMenu'));nav.classList.toggle('is-open',open);});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  matchMedia('(min-width: 901px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  render();
})();
