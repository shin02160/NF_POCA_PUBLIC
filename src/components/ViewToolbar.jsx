import { T } from '../lib/tokens';
import { useStore } from '../store/useStore';
import { IcoBook, IcoSearch, IcoList, IcoGrid } from './icons';

export default function ViewToolbar() {
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const bookCount = useStore((s) => s.photobook.length);
  const navigate = useStore((s) => s.navigate);
  const setSearchModal = useStore((s) => s.setSearchModal);

  return (
    <div
      style={{
        height: 46,
        background: T.s,
        borderBottom: `1px solid ${T.b}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        flexShrink: 0,
      }}
    >
      {/* 포토북 */}
      <button
        onClick={() => navigate({ name: 'book-edit' })}
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: 9,
          background: bookCount > 0 ? T.pb : T.bl,
          border: `1.5px solid ${bookCount > 0 ? T.p : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IcoBook c={bookCount > 0 ? T.p : T.tm} />
        {bookCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: T.p,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              boxShadow: '0 2px 6px rgba(51,102,255,0.4)',
            }}
          >
            <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>{bookCount}</span>
          </div>
        )}
      </button>

      {/* 검색 */}
      <button
        onClick={() => setSearchModal(true)}
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: T.bl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IcoSearch c={T.tm} />
      </button>

      <div style={{ flex: 1 }} />

      {/* 리스트/그리드 토글 */}
      <div style={{ display: 'flex', background: T.bl, borderRadius: 9, padding: 3, gap: 2 }}>
        {[
          { id: 'list', Ico: IcoList },
          { id: 'grid', Ico: IcoGrid },
        ].map(({ id, Ico }) => (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            style={{
              width: 32,
              height: 30,
              borderRadius: 6,
              background: viewMode === id ? T.s : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: viewMode === id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
            }}
          >
            <Ico c={viewMode === id ? T.t : T.tl} />
          </button>
        ))}
      </div>
    </div>
  );
}
