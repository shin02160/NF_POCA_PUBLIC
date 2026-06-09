import { useEffect } from 'react';
import { T, NFLYING_LOGO } from './lib/tokens';
import { useStore } from './store/useStore';
import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';
import PhotobookEditScreen from './screens/PhotobookEditScreen';
import PhotobookExportScreen from './screens/PhotobookExportScreen';
import FilterModal from './components/FilterModal';
import SearchModal from './components/SearchModal';

function Loading() {
  const loaded = useStore((s) => s.loaded);
  const total = useStore((s) => s.total);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <img src={NFLYING_LOGO} alt="N.Flying" style={{ height: 44, opacity: 0.9 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 16, height: 16, border: `2px solid ${T.b}`, borderTopColor: T.p, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: 13, color: T.tm }}>
          로딩 중… {loaded}{total ? ` / ${total}` : ''}
        </span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ErrorView({ message }) {
  const loadCards = useStore((s) => s.loadCards);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, textAlign: 'center' }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <p style={{ fontSize: 14, color: T.t, fontWeight: 600 }}>데이터를 불러오지 못했습니다</p>
      <p style={{ fontSize: 12, color: T.tm, lineHeight: 1.6, wordBreak: 'break-word' }}>{message}</p>
      <button
        onClick={loadCards}
        style={{ marginTop: 4, height: 40, padding: '0 20px', borderRadius: 100, background: T.p, color: '#fff', fontSize: 13, fontWeight: 600 }}
      >
        다시 시도
      </button>
    </div>
  );
}

export default function App() {
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);
  const route = useStore((s) => s.route);
  const loadCards = useStore((s) => s.loadCards);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  let screen;
  if (loading) screen = <Loading />;
  else if (error) screen = <ErrorView message={error} />;
  else if (route.name === 'detail') screen = <DetailScreen id={route.id} />;
  else if (route.name === 'book-edit') screen = <PhotobookEditScreen />;
  else if (route.name === 'book-export') screen = <PhotobookExportScreen />;
  else screen = <MainScreen />;

  return (
    <div className="app-shell">
      {screen}
      {!loading && !error && route.name === 'main' && (
        <>
          <FilterModal />
          <SearchModal />
        </>
      )}
    </div>
  );
}
