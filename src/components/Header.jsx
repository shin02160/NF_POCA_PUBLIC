import { T, NFLYING_LOGO } from '../lib/tokens';
import { reportMailto } from '../lib/utils';
import { useStore } from '../store/useStore';
import { IcoChev } from './icons';

const FILTER_KEYS = [
  { key: 'selectedMembers', tab: 0, label: '멤버' },
  { key: 'selectedKinds', tab: 1, label: '종류' },
  { key: 'selectedAlbums', tab: 2, label: '앨범/콘서트' },
  { key: 'selectedYears', tab: 3, label: '연도' },
];

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 0,
        height: 38,
        borderRadius: 9,
        border: `${active ? 1.5 : 1}px solid ${active ? T.p : T.b}`,
        background: active ? T.pb : T.s,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 11px',
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          color: active ? T.p : T.t,
          fontFamily: T.f,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          textAlign: 'left',
        }}
      >
        {label}
      </span>
      <IcoChev c={active ? T.p : T.tm} />
    </button>
  );
}

function summarize(sel, fallback) {
  if (!sel.length) return `${fallback}: 전체`;
  if (sel.length === 1) return `${fallback}: ${sel[0]}`;
  return `${fallback}: ${sel[0]} 외 ${sel.length - 1}`;
}

export default function Header() {
  const openFilter = useStore((s) => s.openFilter);
  const sel = {
    selectedMembers: useStore((s) => s.selectedMembers),
    selectedKinds: useStore((s) => s.selectedKinds),
    selectedAlbums: useStore((s) => s.selectedAlbums),
    selectedYears: useStore((s) => s.selectedYears),
  };

  return (
    <>
      {/* 로고 + 포카 제보 */}
      <div
        style={{
          height: 54,
          background: T.s,
          borderBottom: `1px solid ${T.b}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        <img src={NFLYING_LOGO} alt="N.Flying" style={{ height: 40, width: 'auto' }} />
        <a
          href={reportMailto()}
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 100,
            border: `1.5px solid ${T.b}`,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 13 }}>✉️</span>
          <span style={{ fontSize: 12, color: T.tm, fontWeight: 500, fontFamily: T.f }}>
            포카 제보
          </span>
        </a>
      </div>

      {/* 필터 드롭다운 2×2 */}
      <div
        style={{
          background: T.s,
          borderBottom: `1px solid ${T.b}`,
          padding: '10px 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {FILTER_KEYS.slice(0, 2).map((f) => (
            <FilterBtn
              key={f.key}
              label={summarize(sel[f.key], f.label)}
              active={sel[f.key].length > 0}
              onClick={() => openFilter(f.tab)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTER_KEYS.slice(2).map((f) => (
            <FilterBtn
              key={f.key}
              label={summarize(sel[f.key], f.label)}
              active={sel[f.key].length > 0}
              onClick={() => openFilter(f.tab)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
