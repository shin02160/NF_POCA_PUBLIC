import { T } from '../lib/tokens';

export const IcoSearch = ({ c = T.tm }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.2" stroke={c} strokeWidth="1.6" />
    <path d="M12 12L15.5 15.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IcoBook = ({ c = T.tm, sz = 18 }) => (
  <svg width={sz} height={sz} viewBox="0 0 18 18" fill="none">
    <path d="M4 2h7l4 4v11H4V2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M11 2v4h4" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 9h5M7 12h3.5" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const IcoPlus = ({ c = T.tm, sz = 13 }) => (
  <svg width={sz} height={sz} viewBox="0 0 13 13" fill="none">
    <path d="M6.5 2v9M2 6.5h9" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IcoCheck = ({ c = '#fff', sz = 12 }) => (
  <svg width={sz} height={sz} viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6.2l2.3 2.3L9.5 3.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IcoClose = ({ c = T.tm, sz = 9 }) => (
  <svg width={sz} height={sz} viewBox="0 0 9 9" fill="none">
    <path d="M1 1l7 7M8 1L1 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IcoBack = ({ c = T.t }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M14 4.5L8 11L14 17.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IcoChev = ({ c = T.tm }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1l4 4 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IcoList = ({ c = T.tm }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5.5 4h8M5.5 8h8M5.5 12h8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="2.5" cy="4" r="1.2" fill={c} />
    <circle cx="2.5" cy="8" r="1.2" fill={c} />
    <circle cx="2.5" cy="12" r="1.2" fill={c} />
  </svg>
);

export const IcoGrid = ({ c = T.tm }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" />
    <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" />
    <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" />
    <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" />
  </svg>
);

export const IcoShare = ({ c = T.t }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2.5v8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5.5 5L8 2.5 10.5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 8.5v5h8v-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IcoDrag = ({ c = T.b }) => (
  <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
    {[3, 9, 15].map((y) =>
      [3, 9].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={c} />),
    )}
  </svg>
);
