(() => {
  'use strict';
  const data = window.SITE_DATA;
  let language = 'zh';
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
  function profileCard(person) {
    const card = el('article', 'profile-card'); const info = el('div','profile-info');
    if (translate(person.badge)) info.append(el('span','draft-tag',translate(person.badge)));
    info.append(el('h4','',translate(person.name)));
    if (person.englishName) info.append(el('span','person-name-en',person.englishName));
    info.append(el('p','person-role',translate(person.role)),el('p','person-bio',translate(person.bio)));
    if (person.profileUrl) info.append(external(person.profileUrl,translate(person.profileLabel),'text-link profile-link'));
    if (translate(person.note)) info.append(el('p','advisor-note',translate(person.note)));
    card.append(portrait(person),info);
    return card;
  }
  function renderPeople() {
    document.getElementById('faculty-list').replaceChildren(...data.faculty.map(profileCard));
    document.getElementById('advisor-list').replaceChildren(profileCard(data.advisor));
    document.getElementById('mentor-list').replaceChildren(...data.postdocs.map(person=>{
      const card=profileCard(person);card.classList.add('mentor-card');return card;
    }));
    renderMemberGroups();
  }
  function renderMemberGroups() {
    const container=document.getElementById('student-list');
    const expanded=new Set([...container.querySelectorAll('details[open]')].map(group=>group.dataset.degree));
    container.replaceChildren();
    const groups=[
      {key:'phd',heading:'doctoralHeading',members:data.students.filter(person=>person.degree==='phd')},
      {key:'masters',heading:'mastersHeading',members:data.students.filter(person=>person.degree==='masters')}
    ];
    groups.forEach(({key,heading,members})=>{
      const group=el('details','student-group');group.id=`members-${key}`;group.dataset.degree=key;group.open=expanded.has(key);
      const summary=el('summary','member-group-summary'),copy=el('div','member-group-copy');
      const title=el('div','member-group-heading');title.append(el('h4','student-group-title',t(heading)));
      if(members.length)title.append(el('span','member-group-count',String(members.length)));
      copy.append(title);
      if(!members.length)copy.append(el('p','member-group-meta',t('memberDetailsPending')));
      const action=el('span','member-group-action'),actionText=el('span','',t(group.open?'collapseGroup':'expandGroup'));
      const icon=el('span','member-group-icon');icon.setAttribute('aria-hidden','true');action.append(actionText,icon);
      summary.append(copy,action);group.append(summary);
      const body=el('div','member-group-body');
      if(!members.length){
        body.append(el('p','member-empty',t('memberDetailsPending')));
      }else{
        body.append(memberGrid(members,key));
      }
      group.append(body);group.addEventListener('toggle',()=>{actionText.textContent=t(group.open?'collapseGroup':'expandGroup');});container.append(group);
    });
  }
  function memberGrid(members,degree) {
    const grid=el('div','student-grid');
    members.forEach(person=>{
      const card=el('article','student-card');
      const meta=el('div','student-meta');
      const role=t(degree==='phd'?'doctoralRole':'mastersRole');
      meta.append(el('h5','student-name',translate(person.name)),el('p','student-degree',role));
      const year=person.enrollmentYear ? t('studentCohort').replace('{year}',String(person.enrollmentYear)) : t('studentYearPending');
      meta.append(el('p','student-year',year));
      if(translate(person.interest))meta.append(el('p','student-interest',translate(person.interest)));
      card.append(portrait(person),meta);
      const links=studentLinks(person);if(links.childElementCount)card.append(links);
      grid.append(card);
    });
    return grid;
  }
  function studentLinks(person) {
    const links=el('div','student-links');
    for(const field of ['scholar','email','website']){
      const value=person[field];if(!value)continue;
      const label=t(`student${field[0].toUpperCase()+field.slice(1)}`);
      let link;
      if(field==='email'){
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))continue;
        link=el('a','student-profile-link');link.href=`mailto:${value}`;
      }else{
        link=external(value,'','student-profile-link');if(link.tagName!=='A')continue;
      }
      link.setAttribute('aria-label',`${translate(person.name)} · ${label}`);link.title=label;
      const icon=el('img');icon.src=`assets/student-${field}.svg`;icon.alt='';icon.width=19;icon.height=19;
      link.append(icon);links.append(link);
    }
    return links;
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
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',t(open?'closeMenu':'openMenu'));nav.classList.toggle('is-open',open);});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  matchMedia('(min-width: 901px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  render();
  // Resolve shared section links after dynamic profiles and the hero finish laying out.
  if(location.hash){
    const revealSection=()=>requestAnimationFrame(()=>{
      try{document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({block:'start',behavior:'instant'});}catch{}
    });
    if(document.readyState==='complete')revealSection();
    else window.addEventListener('load',revealSection,{once:true});
  }
})();
