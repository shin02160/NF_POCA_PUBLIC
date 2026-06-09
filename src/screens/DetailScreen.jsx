import { T } from '../lib/tokens';
import { useStore } from '../store/useStore';
import PocaCard, { Pill } from '../components/PocaCard';
import { IcoBack, IcoBook, IcoShare, IcoCheck } from '../components/icons';

export default function DetailScreen({ id }) {
  const navigate = useStore((s) => s.navigate);
  const card = useStore((s) => s.allCards.find((c) => c.id === id));
  const inBook = useStore((s) => s.photobook.includes(id));
  const toggleBook = useStore((s) => s.toggleBook);

  if (!card) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TopBar onBack={() => navigate({ name: 'main' })} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl }}>
          카드를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const share = async () => {
    const url = window.location.href;
    const text = `${card.name} — ${card.members.join('/')} · ${card.album}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'N.Flying POCA', text, url });
      } catch {
        /* 사용자 취소 */
      }
    } else {
      await navigator.clipboard?.writeText(`${text}\n${url}`);
      alert('링크가 복사되었습니다.');
    }
  };

  const meta = [
    ['멤버', card.members.join(', ')],
    ['출처', card.album],
    ['매체', card.source],
    ['종류', card.kind],
    ['발매', card.date || card.year],
  ].filter(([, v]) => v);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <TopBar title="카드 상세" onBack={() => navigate({ name: 'main' })} />
      <div className="scroll-y" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 히어로 이미지 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 188, filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.14))' }}>
            <PocaCard card={card} radius={14} />
          </div>
        </div>

        {/* 메타데이터 카드 */}
        <div
          style={{
            background: T.s,
            borderRadius: 16,
            padding: 18,
            border: `1px solid ${T.b}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <p style={{ fontSize: 23, fontWeight: 700, color: T.t, marginBottom: 3, letterSpacing: '-0.03em' }}>
            {card.members.join('/')}
          </p>
          <p style={{ fontSize: 14, color: T.t, fontWeight: 600, marginBottom: 12 }}>{card.name}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
            {meta.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                <span style={{ color: T.tl, width: 40, flexShrink: 0 }}>{k}</span>
                <span style={{ color: T.tm, lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Pill label={card.kind} blue />
            {card.album && <Pill label={card.album} />}
            {card.year && <Pill label={card.year} />}
          </div>
        </div>

        {/* 포토북에 담기 */}
        <button
          onClick={() => toggleBook(card.id)}
          style={{
            height: 54,
            borderRadius: 14,
            background: inBook ? T.s : T.p,
            border: inBook ? `1.5px solid ${T.p}` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexShrink: 0,
            boxShadow: inBook ? 'none' : '0 4px 20px rgba(51,102,255,0.28)',
          }}
        >
          {inBook ? <IcoCheck c={T.p} sz={16} /> : <IcoBook c="#fff" sz={17} />}
          <span style={{ color: inBook ? T.p : '#fff', fontSize: 15, fontWeight: 700 }}>
            {inBook ? '포토북에 담음' : '포토북에 담기'}
          </span>
        </button>

        {/* 공유 */}
        <button
          onClick={share}
          style={{
            height: 48,
            borderRadius: 12,
            border: `1.5px solid ${T.b}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            flexShrink: 0,
            background: T.s,
          }}
        >
          <IcoShare />
          <span style={{ color: T.t, fontSize: 14, fontWeight: 500 }}>공유</span>
        </button>
      </div>
    </div>
  );
}

export function TopBar({ title, onBack, right }) {
  return (
    <div
      style={{
        height: 54,
        background: T.s,
        borderBottom: `1px solid ${T.b}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px 0 4px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={onBack} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcoBack />
        </button>
        {title && <span style={{ fontSize: 17, fontWeight: 600, color: T.t }}>{title}</span>}
      </div>
      {right}
    </div>
  );
}
