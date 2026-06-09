import { useRef, useState } from 'react';
import { T, NFLYING_LOGO } from '../lib/tokens';
import { exportFilename, headerDate, reportMailto } from '../lib/utils';
import { useStore } from '../store/useStore';
import PocaCard from '../components/PocaCard';
import { TopBar } from './DetailScreen';
import { IcoShare } from '../components/icons';

export default function PhotobookExportScreen() {
  const navigate = useStore((s) => s.navigate);
  const bookCards = useStore((s) => s.bookCards);
  const cards = bookCards();
  const previewRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [filename] = useState(() => exportFilename());
  const [date] = useState(() => headerDate());

  const renderCanvas = async () => {
    // html2canvas 는 내보내기 시점에만 동적 로드 (초기 번들 경량화)
    const { default: html2canvas } = await import('html2canvas');
    return html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
  };

  const savePng = async () => {
    if (!cards.length || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('이미지 저장에 실패했습니다: ' + (e.message || e));
    } finally {
      setBusy(false);
    }
  };

  const shareImage = async () => {
    if (!cards.length || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'N.Flying POCA' });
      } else {
        // 폴백: 다운로드
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (e) {
      if (e?.name !== 'AbortError') alert('공유에 실패했습니다: ' + (e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <TopBar title="포토북 내보내기" onBack={() => navigate({ name: 'book-edit' })} />
      <div className="scroll-y" style={{ flex: 1, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 캡처 대상 프리뷰 */}
        <div
          ref={previewRef}
          className="photobook-export-preview"
          style={{
            background: T.s,
            borderRadius: 16,
            border: `1px solid ${T.b}`,
            overflow: 'hidden',
            boxShadow: '0 6px 28px rgba(0,0,0,0.06)',
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              padding: '12px 18px',
              borderBottom: `1px solid ${T.b}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={NFLYING_LOGO} alt="N.Flying" crossOrigin="anonymous" style={{ height: 20, width: 'auto' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.tm, letterSpacing: '0.06em' }}>POCA</span>
            </div>
            <p style={{ fontSize: 11, color: T.tl }}>{date}</p>
          </div>
          {/* 4열 고정 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 14 }}>
            {cards.map((card) => (
              <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <PocaCard card={card} radius={6} />
                <p style={{ fontSize: 8, color: T.tl, textAlign: 'center', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {card.members.join('/')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 파일명 */}
        <p style={{ fontSize: 11, color: T.tl, textAlign: 'center' }}>{filename}</p>

        {/* 공유 / 저장 */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={shareImage}
            disabled={busy}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 12,
              border: `1.5px solid ${T.b}`,
              background: T.s,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: busy ? 0.6 : 1,
            }}
          >
            <IcoShare />
            <span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>공유하기</span>
          </button>
          <button
            onClick={savePng}
            disabled={busy}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 12,
              border: `1.5px solid ${T.b}`,
              background: T.s,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: busy ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize: 15, color: T.t }}>↓</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>{busy ? '처리 중…' : 'PNG 저장'}</span>
          </button>
        </div>

        {/* 오류 제보 */}
        <a
          href={reportMailto()}
          style={{
            height: 42,
            borderRadius: 10,
            border: `1px solid ${T.b}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 12, color: T.tl }}>✉ 오류 제보 · 문의</span>
        </a>
      </div>
    </div>
  );
}
