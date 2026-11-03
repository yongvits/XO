'use strict';
const UI_ICONS={
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
