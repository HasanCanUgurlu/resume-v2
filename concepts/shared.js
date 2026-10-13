'use strict';

// Shared factual content; each prototype presents it differently.
const work = {
  product: { title: 'Features that helped win accounts', short: 'Product impact', company: 'WhereTo', category: 'product', symbol: '↗', metric: '~$1M / year', badge: 'Closer', summary: 'Enterprise features with a business outcome.', problem: 'Enterprise sales needed better ways to propose trips and invite travelers.', role: 'I led frontend on Trip Proposals and Trip Invites.', decisions: ['Built the frontend for both enterprise features.', 'Connected product delivery with the needs of sales.'], result: 'Sales used the features to win enterprise accounts worth about $1M a year.', stack: 'Frontend engineering · Trip Proposals · Trip Invites' },
  react: { title: 'A new foundation for 150+ packages', short: 'Frontend foundations', company: 'WhereTo', category: 'systems', symbol: '⌘', metric: 'React 16 → 19', badge: 'Time Traveler', summary: 'A major migration across a React monorepo.', problem: 'An older React foundation stood in the way of a shared component library.', role: 'I upgraded our React monorepo from 16 to 19 across 150+ packages.', decisions: ['Updated the React foundation across the monorepo.', 'Cleared the way for a shared component library and Storybook.'], result: 'The codebase moved onto React 19, opening the path to shared UI foundations.', stack: 'React · Monorepo · Storybook' },
  state: { title: 'Less state code. Fewer repeat requests.', short: 'State & caching', company: 'WhereTo', category: 'systems', symbol: '½', metric: '−60% repeat API calls', badge: 'Half Off', summary: 'About half the state code, with smarter caching.', problem: 'Older Redux patterns meant more state code and repeated API requests.', role: 'I replaced old Redux code with Redux Toolkit and RTK Query.', decisions: ['Used Redux Toolkit for state management.', 'Moved server data and caching into RTK Query.'], result: 'About half the state code went away. Caching cut repeat API calls by 60%.', stack: 'Redux Toolkit · RTK Query · Caching' },
  feedback: { title: 'Feedback, ready before the workday', short: 'Feedback agent', company: 'WhereTo', category: 'ai', symbol: '☾', metric: 'Overnight → Slack', badge: 'Night Shift', summary: 'An agent that turns feedback into a ranked report.', problem: 'In-app feedback mixes bugs with confusion about how the product works.', role: 'At WhereTo, I built an agent that reads feedback overnight.', decisions: ['Separated real bugs from user confusion.', 'Ranked findings and delivered them to Slack before the team logged on.'], result: 'The team starts its day with a ranked feedback report.', stack: 'AI agents · Feedback triage · Slack' },
  pii: { title: 'PII detection with a human review step', short: 'PII scrubber', company: 'CaseHuddle', category: 'product', symbol: '◎', metric: 'Detect → review → redact', badge: 'Privacy by Design', summary: 'A review workflow for sensitive clinical case drafts.', problem: 'Clinical case drafts can contain identifying patient details.', role: 'I integrated self-hosted GLiNER and built detection filtering, review, and redaction into the composer.', decisions: ['Combined model predictions with TypeScript rules and configurable thresholds.', 'Resolved overlapping entity spans and preserved offsets during replacement.', 'Let authors review repeated mentions together and recheck edited drafts.', 'Built fixture-based evaluation for misses and false positives.'], result: 'Authors can review and redact flagged details before posting. Evaluation tools make detector changes easier to assess.', stack: 'GLiNER · TypeScript · Entity spans · Human review' },
  qa: { title: 'QA, from ticket to browser', short: 'QA agent', company: 'CaseHuddle', category: 'ai', symbol: '✓', metric: 'Jira → browser → tests', badge: 'Second Set of Eyes', summary: 'An agent that checks what a ticket says should work.', problem: 'Acceptance criteria need to be checked against the actual product.', role: 'I built a QA agent that reads Jira tickets and checks acceptance criteria in a real browser.', decisions: ['Reported failures with suggested fixes.', 'Extended the agent to write and update automated tests in CI.'], result: 'Ticket criteria become browser checks, actionable findings, and automated tests.', stack: 'Jira · Browser automation · CI' },
  builds: { title: 'Faster builds, less waiting', short: 'Developer experience', company: 'WhereTo', category: 'systems', symbol: '»', metric: '2× faster dev builds', badge: 'Fast Forward', summary: 'Build tooling that gives the team time back.', problem: 'Development builds and CI were areas where the team could spend less time and money.', role: 'I moved our builds to Webpack 5 and Vite.', decisions: ['Updated the development build tooling.', 'Focused on build speed and CI cost.'], result: 'Dev builds got about twice as fast, and CI got cheaper to run.', stack: 'Webpack 5 · Vite · CI' },
  booking: { title: 'A shorter path to a booked trip', short: 'Booking experience', company: 'WhereTo', category: 'product', symbol: '↝', metric: '−20% booking time', badge: 'Clear the Path', summary: 'Using behavior data to find and fix friction.', problem: 'Travelers were getting stuck during booking.', role: 'I used Mixpanel to find those spots and fixed them.', decisions: ['Used booking behavior to identify friction.', 'Made focused improvements to the booking experience.'], result: 'Fixing those spots cut average booking time by 20%.', stack: 'Mixpanel · Product analytics · Frontend' },
  casehuddle: { title: 'CaseHuddle, from zero to product', short: 'CaseHuddle', company: 'CaseHuddle', category: 'product', symbol: 'ch', metric: 'Built end to end', badge: 'From Zero', summary: 'A private consultation platform for licensed therapists.', problem: 'Therapists need a place to get peer input on hard cases.', role: 'I co-founded CaseHuddle and built it from the ground up.', decisions: ['Built the application, data layer, authentication, and deployment.', 'Used Next.js, tRPC, Drizzle, and PostgreSQL.', 'Integrated PII detection and review for case writing.'], result: 'An invite-only platform where every member is a verified licensed clinician.', stack: 'Next.js · tRPC · Drizzle · PostgreSQL' }
};

const mode = document.body.dataset.concept;
const dialog = document.querySelector('#story-dialog');
const dialogBody = document.querySelector('#dialog-body');
const status = document.querySelector('#selection-status');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const marks = {
  product: 'M4 19V5 M4 19h16 M7 14l4-4 4 2 5-7 M16 5h4v4',
  react: 'M12 3 2 8l10 5 10-5-10-5Z M2 12l10 5 10-5 M2 16l10 5 10-5',
  state: 'M7 5v7 M4 8l3-3 3 3 M17 19v-7 M14 16l3 3 3-3 M10 20l4-16',
  feedback: 'M19 15A8 8 0 0 1 9 5a8 8 0 1 0 10 10Z',
  pii: 'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z M8 12l3 3 5-6',
  qa: 'M5 12l4 4L19 6 M4 4h6 M4 4v6 M20 20h-6 M20 20v-6',
  builds: 'm13 2-9 12h7l-1 8 10-13h-8l1-7Z',
  booking: 'M3 17h6l4-10h8 M17 3l4 4-4 4 M5 8h3 M4 12h2',
  casehuddle: 'M5 5h14v10H9l-4 4V5Z M9 9h6 M9 12h4'
};

function medal(id) {
  return `<svg class="medal ${work[id].category}" width="100" height="112" viewBox="0 0 100 112" aria-hidden="true"><path class="ribbon" d="m31 73-5 31 15-7 9 10 2-28M69 73l5 31-15-7-9 10-2-28"/><path class="outer" d="M50 5 84 24v42L50 85 16 66V24Z"/><path class="inner" d="m50 12 28 16v34L50 78 22 62V28Z"/><path class="laurel" d="M13 77C2 58 6 38 13 28 M10 66 4 63 M8 55l-5-5 M9 44l-4-6 M87 77c11-19 7-39 0-49 M90 66l6-3 M92 55l5-5 M91 44l4-6"/><path class="medal-mark" transform="translate(32 27) scale(1.5)" d="${marks[id]}"/><path fill="currentColor" opacity=".55" d="m50 15 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></svg>`;
}
function storyMarkup(id) {
  const item = work[id];
  const demo = id === 'pii' ? `<section class="dialog-demo" aria-labelledby="demo-title"><h3 id="demo-title">A small example of the review interaction</h3><p id="pii-example"><mark>Jordan Vale</mark> can be reached at <mark>jordan@example.com</mark>.</p><button type="button" data-demo-redact aria-pressed="false">Replace flagged details</button><small>Fictional example. This illustrates the review interface; it does not run a detector.</small></section>` : '';
  return `${mode === 'achievements' ? medal(id) : ''}<p class="eyebrow">${escapeHtml(item.company)} / ${escapeHtml(item.short)}</p><h2 id="dialog-title">${escapeHtml(item.title)}</h2><p class="dialog-intro">${escapeHtml(item.summary)}</p><div class="story-result"><span class="eyebrow">THE OUTCOME</span><strong>${escapeHtml(item.metric)}</strong><p>${escapeHtml(item.result)}</p></div><div class="story-facts"><section><h3>The problem</h3><p>${escapeHtml(item.problem)}</p></section><section><h3>My role</h3><p>${escapeHtml(item.role)}</p></section><section><h3>The decisions</h3><ul>${item.decisions.map(text=>`<li>${escapeHtml(text)}</li>`).join('')}</ul></section><section><h3>Technical context</h3><p>${escapeHtml(item.stack)}</p></section></div>${demo}${id === 'casehuddle' ? '<p class="story-tech"><a class="text-link" href="https://casehuddle.com" target="_blank" rel="noopener noreferrer">Visit CaseHuddle ↗ (opens in a new tab)</a></p>' : ''}`;
}
function openStory(id, updateUrl = true) {
  if (!Object.hasOwn(work, id)) return;
  dialogBody.innerHTML = storyMarkup(id);
  document.querySelector('#dialog-context').textContent = `${work[id].company} / ${work[id].short}`;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  if (updateUrl && (mode === 'launchpad' || mode === 'app-store')) history.replaceState(null, '', `#${id}`);
}
function closeStory() { dialog.close(); }
dialog.addEventListener('close', () => {
  if (mode === 'launchpad' || mode === 'app-store') history.replaceState(null, '', location.pathname + location.search);
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeStory();
});

const achievementIds = ['product','react','state','feedback','casehuddle','pii','qa','builds','booking'];
let selectedBadge = 'react';
let category = 'all';
function renderAchievements() {
  const visible = achievementIds.filter(id => category === 'all' || work[id].category === category);
  if (!visible.includes(selectedBadge)) selectedBadge = visible[0];
  document.querySelector('#badge-grid').innerHTML = visible.map(id => `<button type="button" class="badge-button" data-badge="${id}" aria-pressed="${id === selectedBadge}" aria-controls="featured-achievement">${medal(id)}<strong>${work[id].badge}</strong><small>${work[id].company.toUpperCase()} / UNLOCKED</small></button>`).join('');
  const item = work[selectedBadge];
  document.querySelector('#featured-achievement').innerHTML = `<p class="feature-number">ACHIEVEMENT ${String(achievementIds.indexOf(selectedBadge)+1).padStart(2,'0')} / 09</p>${medal(selectedBadge)}<h2 id="featured-title">${item.badge}</h2><p class="feature-outcome">${item.metric}</p><p class="feature-description">${item.summary}</p><button type="button" class="feature-button" data-story="${selectedBadge}" aria-haspopup="dialog">READ THE STORY →</button>`;
  document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter === category)));
  status.textContent = `Selected achievement: ${item.badge}`;
}

const comparisons = {
  state: {title:'Repeat API calls',after:40,max:100,delta:'60% fewer',driver:'A smaller state layer. Smarter caching.',body:'I replaced old Redux code with Redux Toolkit and RTK Query. About half the state code went away, and caching cut repeat API calls by 60%.',tags:['Redux Toolkit','RTK Query','Caching']},
  booking: {title:'Average booking time',after:80,max:100,delta:'20% less time',driver:'Find the friction. Fix the path.',body:'I used Mixpanel to find where travelers got stuck while booking. Fixing those spots cut average booking time by 20%.',tags:['Mixpanel','Product analytics','UX improvements']},
  builds: {title:'Development build speed',after:200,max:200,delta:'About 2× as fast',driver:'Less waiting in the development loop.',body:'I moved builds to Webpack 5 and Vite. Development builds got about twice as fast, and CI got cheaper to run.',tags:['Webpack 5','Vite','CI']},
  product: {title:'Enterprise account value',driver:'Product work with a commercial outcome.',body:'I led frontend on Trip Proposals and Trip Invites. Sales used those features to win enterprise accounts worth about $1M a year.',tags:['Trip Proposals','Trip Invites','Enterprise accounts']}
};
let selectedMetric = 'state';
function comparisonChart(data) {
  const height = value => (value / data.max) * 130;
  const ticks = [0,.25,.5,.75,1].map(fraction => {
    const y = 175-fraction*130;
    return `<line class="gridline" x1="55" y1="${y}" x2="535" y2="${y}"/><text x="37" y="${y+3}" text-anchor="end">${Math.round(data.max*fraction)}</text>`;
  }).join('');
  return `<div class="chart-wrap"><svg class="comparison-chart" width="560" height="220" viewBox="0 0 560 220" role="img" aria-label="${data.title}: before index 100, after index ${data.after}. ${data.delta}.">${ticks}<rect x="151" y="${175-height(100)}" width="88" height="${height(100)}" rx="3" fill="#d2e0dc"/><rect x="346" y="${175-height(data.after)}" width="88" height="${height(data.after)}" rx="3" fill="#4a9782"/><text class="bar-label" x="195" y="${164-height(100)}" text-anchor="middle">100</text><text class="bar-label" x="390" y="${164-height(data.after)}" text-anchor="middle">${data.after}</text><text x="195" y="194" text-anchor="middle">Before</text><text x="390" y="194" text-anchor="middle">After</text><text x="535" y="17" text-anchor="end">${data.delta}</text></svg></div><p class="chart-caption">${data.title}. Relative comparison, with the before value set to 100.</p>`;
}
function renderResult() {
  const data = comparisons[selectedMetric];
  document.querySelector('#chart-title').textContent = data.title;
  document.querySelector('.chart-legend').hidden = selectedMetric === 'product';
  document.querySelector('#chart-content').innerHTML = selectedMetric === 'product' ? '<div class="revenue-flow"><div><span>Trip Proposals</span><span>Trip Invites</span></div><span aria-hidden="true">→</span><div><strong>~$1M</strong><small>annual enterprise account value</small></div></div><p class="chart-caption">Features used by sales to win accounts. A contribution to the outcome, not revenue solely attributed to me.</p>' : comparisonChart(data);
  document.querySelector('#insight-content').innerHTML = `<p class="eyebrow">ENGINEERING CONTRIBUTION</p><h3>${data.driver}</h3><p>${data.body}</p><div class="insight-tags">${data.tags.map(tag=>`<span>${tag}</span>`).join('')}</div><button class="insight-button" type="button" data-story="${selectedMetric}" aria-haspopup="dialog">Read the full story ↗</button>`;
  document.querySelectorAll('.metric-tile').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.metric===selectedMetric)));
  document.querySelectorAll('.report-rail button').forEach(button=>button.classList.toggle('active',button.dataset.metric===selectedMetric));
  status.textContent = `Showing ${data.title}`;
}
function setStoreSection(section) {
  const names = ['overview','previews','versions','about'];
  if (!names.includes(section)) return;
  document.querySelectorAll('[data-store-panel]').forEach(panel=>{panel.hidden=panel.dataset.storePanel!==section;});
  document.querySelectorAll('[data-section]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.section===section)));
  document.querySelector('.store-content').scrollTop = 0;
  status.textContent = `Showing ${section === 'versions' ? 'version history' : section}`;
}
// Native buttons and dialogs handle keyboard activation, Escape, and focus return.
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-close')) return closeStory();
  if (button.dataset.story) return openStory(button.dataset.story);
  if (button.dataset.badge) {
    selectedBadge=button.dataset.badge;
    history.replaceState(null,'',`#${selectedBadge}`);
    renderAchievements();
    document.querySelector(`[data-badge="${selectedBadge}"]`)?.focus({preventScroll:true});
  }
  if (button.dataset.filter) {
    category=button.dataset.filter;
    renderAchievements();
    history.replaceState(null,'',`#${selectedBadge}`);
  }
  if (button.dataset.metric) {
    selectedMetric=button.dataset.metric;
    history.replaceState(null,'',`#${selectedMetric}`);
    renderResult();
  }
  if (button.dataset.section) setStoreSection(button.dataset.section);
  if (button.hasAttribute('data-demo-redact')) {
    const redacted=button.getAttribute('aria-pressed')!=='true';
    document.querySelector('#pii-example').innerHTML=redacted ? '<span class="redacted">[NAME]</span> can be reached at <span class="redacted">[EMAIL]</span>.' : '<mark>Jordan Vale</mark> can be reached at <mark>jordan@example.com</mark>.';
    button.setAttribute('aria-pressed',String(redacted));
    button.textContent=redacted?'Reset example':'Replace flagged details';
  }
});
function restoreRoute() {
  const id=location.hash.slice(1);
  if (mode==='achievements') {
    selectedBadge=achievementIds.includes(id)?id:'react';
    if (category!=='all' && work[selectedBadge].category!==category) category='all';
    renderAchievements();
  } else if (mode==='results') {
    selectedMetric=Object.hasOwn(comparisons,id)?id:'state';
    renderResult();
  } else if (Object.hasOwn(work,id)) openStory(id,false);
  else if (dialog.open) closeStory();
}
window.addEventListener('hashchange',restoreRoute);
restoreRoute();
