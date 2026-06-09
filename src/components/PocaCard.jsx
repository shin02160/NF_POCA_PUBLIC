import { T, NFLYING_LOGO } from '../lib/tokens';

// 비율 고정: aspect-ratio 대신 height:0; padding-bottom 해킹 (모든 브라우저 완벽 지원)
// 내부 콘텐츠는 position:absolute; top:0; left:0 으로 명시적 배치
const Ratio = ({ radius = 8, children, shadow }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: 0,
      paddingBottom: 'var(--card-ratio)',
      borderRadius: radius,
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: shadow || 'none',
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      {children}
    </div>
  </div>
);

// 이미지 없는 경우 플레이스홀더
const EmptyCard = ({ radius }) => (
  <Ratio radius={radius}>
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#dbeafe',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '10px 8px',
      }}
    >
      <img
        src={NFLYING_LOGO}
        alt="NFlying"
        crossOrigin="anonymous"
        style={{
          width: '68%',
          height: 'auto',
          filter: 'invert(1) sepia(1) saturate(6) hue-rotate(200deg) brightness(0.7)',
        }}
      />
      <p
        style={{
          fontSize: 7.5,
          color: '#3b82f6',
          textAlign: 'center',
          fontWeight: 500,
          fontFamily: T.f,
          lineHeight: 1.5,
        }}
      >
        업데이트
        <br />
        예정입니다.
      </p>
    </div>
  </Ratio>
);

// POCA 카드 — 실제 사진 있으면 표시, 없으면 플레이스홀더
export default function PocaCard({
  card,
  radius = 8,
  showName = false,
  shadow,
}) {
  const member = card?.member || '단체';
  const imgSrc = card?.image || null;
  if (!imgSrc) return <EmptyCard radius={radius} />;
  return (
    <Ratio radius={radius} shadow={shadow || '0 2px 12px rgba(0,0,0,0.14)'}>
      <img
        src={imgSrc}
        alt={card?.name || member}
        crossOrigin="anonymous"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          display: 'block',
        }}
      />
      {showName && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px 6px 7px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.48))',
          }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 700,
              color: '#fff',
              fontFamily: T.f,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {member}
          </p>
        </div>
      )}
    </Ratio>
  );
}

export function Pill({ label, blue }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 8px',
        borderRadius: 5,
        background: blue ? T.pb : T.bl,
        color: blue ? T.p : T.tm,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: T.f,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
