import { REPORT_EMAIL } from './tokens';

// 포카 제보 mailto 링크 (PRD 4-4)
export function reportMailto() {
  const subject = encodeURIComponent('N.Flying 포카 제보');
  const body = '포카명:%0A멤버:%0A출처:%0A기타 정보:';
  return `mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`;
}

// 카드 부제목: "멤버 · 앨범 · 연도"
export function cardSubtitle(card) {
  return [card.members.join('/'), card.album, card.year]
    .filter(Boolean)
    .join(' · ');
}

// 캡처 파일명: nf_poca_YYYYMMDD_HHMMSS.png
export function exportFilename(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `nf_poca_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.png`;
}

// 헤더용 날짜 표기: YYYY.MM.DD · HH:MM
export function headerDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} · ${p(d.getHours())}:${p(d.getMinutes())}`;
}
