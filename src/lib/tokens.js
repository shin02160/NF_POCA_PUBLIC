// ── Wanted Design System tokens (디자인 핸드오프 기준) ─────────
export const T = {
  bg: '#f7f7f8', // 페이지 배경 (cool-neutral-99)
  s: '#ffffff', // surface
  b: '#dbdcdf', // border
  bl: '#f4f4f5', // border-light / chip bg
  t: 'rgb(23,23,25)', // label-normal (본문)
  tm: 'rgb(112,115,124)', // text-mid (보조)
  tl: 'rgb(152,155,162)', // text-light (힌트)
  p: 'rgb(51,102,255)', // primary-normal
  pb: 'rgb(234,242,254)', // primary-bg
  dim: 'rgba(15,15,18,0.48)', // 모달 딤
  f: `'Pretendard JP', -apple-system, BlinkMacSystemFont, sans-serif`,
};

// 카드 비율: aspect-ratio 대신 padding-bottom 해킹 (모든 브라우저 완벽 지원)
// 사용처: PocaCard 의 .poca-ratio 클래스 (index.css 의 --card-ratio)
export const CARD_RATIO_PCT = '133.33%';

// 멤버별 팔레트 (플레이스홀더/강조용)
export const MC = {
  승협: { g0: '#ede0ff', g1: '#bba0e8', dot: '#7a48cc', dark: '#5a28aa' },
  훈: { g0: '#d8f2e8', g1: '#96d4b2', dot: '#28a86a', dark: '#148850' },
  재현: { g0: '#d8eaf8', g1: '#96c8e8', dot: '#2888c0', dark: '#1468a0' },
  회승: { g0: '#fce8d4', g1: '#e8b890', dot: '#d06828', dark: '#a84810' },
  동성: { g0: '#f8f0cc', g1: '#dcc880', dot: '#c09820', dark: '#906800' },
  단체: { g0: '#e0e0f8', g1: '#a8a8dc', dot: '#5050a8', dark: '#303080' },
  전체: { g0: '#ebebf5', g1: '#b8b8d8', dot: '#6060a0', dark: '#404080' },
};

export const NFLYING_LOGO = '/assets/nflying-logo.png';

// 멤버 표시 순서 (필터 정렬용)
export const MEMBER_ORDER = ['승협', '훈', '재현', '회승', '동성', '단체'];

// 오류 제보 메일
export const REPORT_EMAIL = 'n.seunghyub1031@gmail.com';
