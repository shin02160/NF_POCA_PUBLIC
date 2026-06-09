import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_KEY;
const TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'poca_cards';

export const supabase = URL && KEY ? createClient(URL, KEY) : null;

// Supabase 행 → 앱 카드 모델 정규화
function normalize(row) {
  const members = Array.isArray(row.members)
    ? row.members.filter(Boolean)
    : row.members
      ? [row.members]
      : [];
  // 사진: image_url 우선, 없으면 photos 배열 첫 항목
  const image =
    row.image_url || (Array.isArray(row.photos) && row.photos[0]) || null;
  // 출처/앨범: album 우선, origin 보조
  const album = row.album || row.origin || '기타';
  return {
    id: String(row.id),
    name: row.name || '(이름 없음)',
    members,
    member: members[0] || '단체', // 대표 멤버 (플레이스홀더 색상 등)
    kind: row.kind || '기타',
    album,
    year: row.year || '',
    date: row.date || '',
    source: row.source || row.origin || '',
    note: row.note || '',
    image,
  };
}

/**
 * 전체 카드를 페이지네이션(1000행 단위)으로 순차 fetch.
 * onProgress(loaded, total?) 콜백으로 진행 상황 보고.
 * Supabase 미설정 시 빈 배열 반환.
 */
export async function fetchAllCards(onProgress) {
  if (!supabase) {
    throw new Error(
      'Supabase 환경변수가 없습니다. .env 의 VITE_SUPABASE_URL / VITE_SUPABASE_KEY 를 확인하세요.',
    );
  }
  const PAGE = 1000;
  let from = 0;
  let all = [];
  let total = null;
  // 정렬: 발매(date) → year → name (PRD: 발매 오름차순 → 포카명 오름차순)
  for (;;) {
    const { data, error, count } = await supabase
      .from(TABLE)
      .select('*', { count: 'estimated' })
      .order('year', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (total === null && typeof count === 'number') total = count;
    all = all.concat((data || []).map(normalize));
    onProgress?.(all.length, total);
    if (!data || data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}
