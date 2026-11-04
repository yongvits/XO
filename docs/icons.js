'use strict';
const UI_ICONS={
robot:'M8 3h8v3H8ZM5 7h14v12H5ZM2 11h3m14 0h3M9 11v2m6-2v2m-6 3h6M9 19v3m6-3v3',
leaf:'M20 4c-1 8-3 14-9 14a6 6 0 0 1-6-6c0-6 8-7 15-8ZM5 20l9-10',
levels:'M5 16v4m7-10v10m7-16v16',
flame:'M13 3c1 5-3 6-3 9 0 2 2 3 3 1 3 1 4 3 3 5-1 4-9 4-11-1C2 11 9 9 13 3Z',
arrow:'M5 12h14m-5-5 5 5-5 5',
refresh:'M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.5-1L20 9M4 15l2.4 3A7 7 0 0 0 18 17',
share:'M12 16V3m-5 5 5-5 5 5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',
leave:'M9 4H5v16h4m4-13 5 5-5 5m-5-5h14',
users:'M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M8 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m8 .13a4 4 0 0 1 0 7.75',
play:'m9 5 11 7-11 7Z',
check:'m5 12 4 4L19 6',
lock:'M5 11h14v10H5Zm3 0V7a4 4 0 0 1 8 0v4',
draw:'M6 9h12M6 15h12',
flag:'M5 21V4m0 0c5-4 9 4 14 0v9c-5 4-9-4-14 0',
book:'M12 5v16M3 3c3-1 6 0 9 2 3-2 6-3 9-2v16c-3-1-6 0-9 2-3-2-6-3-9-2Z',
spark:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
crown:'m3 7 4 4 5-7 5 7 4-4-3 13H6ZM7 16h10',
close:'m6 6 12 12M18 6 6 18'
};
function icon(name){return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="'+(UI_ICONS[name]||UI_ICONS.play)+'"/></svg>'}
function setButton(el,symbol,label){el.innerHTML=icon(symbol);const span=document.createElement('span');span.textContent=label;el.append(span)}

