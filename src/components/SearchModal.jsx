import { useEffect, useRef } from 'react';
import { T } from '../lib/tokens';
import { useStore } from '../store/useStore';
import { IcoSearch, IcoClose } from './icons';

export default function SearchModal() {
  const open = useStore((s) => s.searchModal);
  const setOpen = useStore((s) => s.setSearchModal);
  const search = useStore((s) => s.search);
  const setSearch = useStore((s) => s.setSearch);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
      <div
        className="dim-enter"
        onClick={() => setOpen(false)}
        style={{ position: 'absolute', inset: 0, background: T.dim }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: T.s,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}
      >
        <div
          style={{
            flex: 1,
            height: 42,
            borderRadius: 100,
            background: T.bl,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 14px',
          }}
        >
          <IcoSearch c={T.tm} />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="포카명 검색"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              color: T.t,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: T.b,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IcoClose c="#fff" sz={8} />
            </button>
          )}
        </div>
        <button onClick={() => setOpen(false)} style={{ fontSize: 14, color: T.p, fontWeight: 600 }}>
          완료
        </button>
      </div>
    </div>
  );
}
