import { useMemo, useState } from 'react';
import { VList } from 'virtua';
import { T } from '../lib/tokens';
import { cardSubtitle } from '../lib/utils';
import { useStore, SORT_OPTIONS } from '../store/useStore';
import Header from '../components/Header';
import ViewToolbar from '../components/ViewToolbar';
import PocaCard, { Pill } from '../components/PocaCard';
import { IcoPlus, IcoCheck, IcoBook, IcoChev } from '../components/icons';

// ── 리스트 아이템 ────────────────────────────────
function ListItem({ card }) {
  const navigate = useStore((s) => s.navigate);
  const inBook = useStore((s) => s.photobook.includes(card.id));
  const toggleBook = useStore((s) => s.toggleBook);

  return (
    <div
      onClick={() => navigate({ name: 'detail', id: card.id })}
      style={{
        display: 'flex',
        gap: 12,
        padding: '11px 16px',
        borderBottom: `1px solid ${T.b}`,
        alignItems: 'center',
        background: T.s,
      }}
    >
      <div style={{ width: 46, flexShrink: 0 }}>
        <PocaCard card={card} radius={8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: T.t,
            marginBottom: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {card.name}
        </p>
        <p
          style={{
            fontSize: 12,
            color: T.tm,
            marginBottom: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {cardSubtitle(card)}
        </p>
        <div style={{ display: 'flex', gap: 5 }}>
          <Pill label={card.kind} blue />
          {card.year && <Pill label={card.year} />}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBook(card.id);
        }}
        style={{
          height: 30,
          padding: '0 11px',
          borderRadius: 100,
          border: `1.5px solid ${T.p}`,
          background: inBook ? T.p : 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
        }}
      >
        {inBook ? <IcoCheck c="#fff" sz={11} /> : <IcoPlus c={T.p} sz={11} />}
        <span style={{ fontSize: 11, color: inBook ? '#fff' : T.p, fontWeight: 700 }}>
          {inBook ? '담음' : '담기'}
        </span>
      </button>
    </div>
  );
}

// ── 그리드 셀 ────────────────────────────────────
function GridCell({ card }) {
  const navigate = useStore((s) => s.navigate);
  const inBook = useStore((s) => s.photobook.includes(card.id));
  const toggleBook = useStore((s) => s.toggleBook);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <div
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => navigate({ name: 'detail', id: card.id })}
      >
        <PocaCard card={card} radius={8} showName />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBook(card.id);
          }}
          style={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: inBook ? '#fff' : T.p,
            border: inBook ? `1.5px solid ${T.p}` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(51,102,255,0.4)',
          }}
        >
          {inBook ? <IcoCheck c={T.p} sz={11} /> : <IcoPlus c="#fff" sz={11} />}
        </button>
      </div>
      <p
        style={{
          fontSize: 10,
          color: T.tm,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {card.name}
      </p>
    </div>
  );
}

// ── 결과 카운트 행 + 정렬 셀렉트 ─────────────────
function ResultRow({ count }) {
  const sel = useStore((s) => s.selectedMembers);
  const sortBy = useStore((s) => s.sortBy);
  const setSortBy = useStore((s) => s.setSortBy);
  const [open, setOpen] = useState(false);
  const label = sel.length ? `${sel.join('/')} · 총 ${count}개` : `총 ${count}개`;
  const curLabel = SORT_OPTIONS.find((o) => o.id === sortBy)?.label || '발매순';

  return (
    <div
      style={{
        height: 36,
        background: T.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <span style={{ fontSize: 12, color: T.tm, fontFamily: T.f }}>{label}</span>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            height: 24,
            padding: '0 10px',
            borderRadius: 100,
            background: T.s,
            border: `1px solid ${open ? T.p : T.b}`,
          }}
        >
          <span style={{ fontSize: 11, color: open ? T.p : T.t, fontWeight: 500 }}>{curLabel}</span>
          <IcoChev c={open ? T.p : T.tm} />
        </button>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
            <div
              style={{
                position: 'absolute',
                top: 30,
                right: 0,
                minWidth: 120,
                background: T.s,
                borderRadius: 12,
                border: `1px solid ${T.b}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                zIndex: 11,
              }}
            >
              {SORT_OPTIONS.map((o) => {
                const on = o.id === sortBy;
                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSortBy(o.id);
                      setOpen(false);
                    }}
                    style={{
                      width: '100%',
                      height: 40,
                      padding: '0 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      background: on ? T.pb : T.s,
                    }}
                  >
                    <span style={{ fontSize: 13, color: on ? T.p : T.t, fontWeight: on ? 700 : 500 }}>
                      {o.label}
                    </span>
                    {on && <span style={{ color: T.p, fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MainScreen() {
  const viewMode = useStore((s) => s.viewMode);
  const navigate = useStore((s) => s.navigate);
  const bookCount = useStore((s) => s.photobook.length);
  // 의존 상태를 개별 구독 (새 배열 반환 셀렉터는 무한 루프 유발)
  const filteredCards = useStore((s) => s.filteredCards);
  const allCards = useStore((s) => s.allCards);
  const selectedMembers = useStore((s) => s.selectedMembers);
  const selectedKinds = useStore((s) => s.selectedKinds);
  const selectedAlbums = useStore((s) => s.selectedAlbums);
  const selectedYears = useStore((s) => s.selectedYears);
  const search = useStore((s) => s.search);
  const sortBy = useStore((s) => s.sortBy);
  const cards = useMemo(
    () => filteredCards(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allCards, selectedMembers, selectedKinds, selectedAlbums, selectedYears, search, sortBy],
  );

  // 그리드: 3열로 청크
  const rows = useMemo(() => {
    if (viewMode !== 'grid') return [];
    const out = [];
    for (let i = 0; i < cards.length; i += 3) out.push(cards.slice(i, i + 3));
    return out;
  }, [cards, viewMode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: T.bg }}>
      <Header />
      <ViewToolbar />
      <ResultRow count={cards.length} />

      {cards.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.tl,
            fontSize: 14,
          }}
        >
          조건에 맞는 포카가 없습니다.
        </div>
      ) : viewMode === 'list' ? (
        <VList style={{ flex: 1, background: T.s }}>
          {cards.map((card) => (
            <ListItem key={card.id} card={card} />
          ))}
        </VList>
      ) : (
        <VList style={{ flex: 1, padding: '12px 14px' }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                marginBottom: 10,
              }}
            >
              {row.map((card) => (
                <GridCell key={card.id} card={card} />
              ))}
            </div>
          ))}
        </VList>
      )}

      {/* 그리드 하단 플로팅 바 */}
      {viewMode === 'grid' && bookCount > 0 && (
        <div
          style={{
            height: 62,
            background: T.s,
            borderTop: `1px solid ${T.b}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => navigate({ name: 'book-edit' })}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 100,
              background: T.p,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 20px rgba(51,102,255,0.32)',
            }}
          >
            <IcoBook c="#fff" sz={16} />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>
              포토북에 {bookCount}장 담기
            </span>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
