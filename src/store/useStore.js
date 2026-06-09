import { create } from 'zustand';
import { MEMBER_ORDER } from '../lib/tokens';
import { fetchAllCards } from '../lib/supabase';

const sortByOrder = (arr, order) =>
  [...arr].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, 'ko');
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

// 앨범/콘서트: 오름차순 정렬하되 N.Fia·기타는 항상 맨 뒤
const ALBUM_TAIL = ['N.Fia', '기타'];
const sortAlbums = (arr) => {
  const head = [];
  const tail = [];
  for (const a of arr) (ALBUM_TAIL.includes(a) ? tail : head).push(a);
  head.sort((x, y) => x.localeCompare(y, 'ko'));
  tail.sort((x, y) => ALBUM_TAIL.indexOf(x) - ALBUM_TAIL.indexOf(y));
  return [...head, ...tail];
};

// 정렬 옵션 (PRD: 발매 오름차순 → 포카명 / 멤버별 / 출처별)
export const SORT_OPTIONS = [
  { id: 'release', label: '발매순' },
  { id: 'member', label: '멤버순' },
  { id: 'album', label: '출처순' },
];

const byName = (a, b) => a.name.localeCompare(b.name, 'ko');
const albumRank = (album) => {
  const i = ALBUM_TAIL.indexOf(album);
  return i === -1 ? `0_${album}` : `1_${i}`;
};
const sortCards = (cards, sortBy) => {
  const arr = [...cards];
  if (sortBy === 'member') {
    return arr.sort((a, b) => {
      const ia = MEMBER_ORDER.indexOf(a.member);
      const ib = MEMBER_ORDER.indexOf(b.member);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || byName(a, b);
    });
  }
  if (sortBy === 'album') {
    return arr.sort(
      (a, b) => albumRank(a.album).localeCompare(albumRank(b.album), 'ko') || byName(a, b),
    );
  }
  // release: 발매(year) 오름차순 → 포카명 오름차순 (연도 없으면 맨 뒤)
  return arr.sort((a, b) => {
    const ya = a.year || '9999';
    const yb = b.year || '9999';
    return ya.localeCompare(yb) || byName(a, b);
  });
};

export const useStore = create((set, get) => ({
  // ── 데이터 로딩 ────────────────────────────────
  allCards: [],
  loading: true,
  loaded: 0,
  total: null,
  error: null,

  loadCards: async () => {
    set({ loading: true, error: null, loaded: 0 });
    try {
      const cards = await fetchAllCards((loaded, total) =>
        set({ loaded, total }),
      );
      set({ allCards: cards, loading: false });
    } catch (e) {
      set({ error: e.message || String(e), loading: false });
    }
  },

  // ── 필터 상태 ([] = 전체) ──────────────────────
  selectedMembers: [],
  selectedKinds: [],
  selectedAlbums: [],
  selectedYears: [],
  search: '',

  setSearch: (search) => set({ search }),
  setFilter: (key, values) => set({ [key]: values }),
  toggleFilter: (key, value) =>
    set((s) => {
      const cur = s[key];
      return {
        [key]: cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value],
      };
    }),
  clearFilters: () =>
    set({
      selectedMembers: [],
      selectedKinds: [],
      selectedAlbums: [],
      selectedYears: [],
      search: '',
    }),

  // ── 뷰 모드 / 정렬 ─────────────────────────────
  viewMode: 'list', // 'list' | 'grid'
  setViewMode: (viewMode) => set({ viewMode }),
  sortBy: 'release', // 'release' | 'member' | 'album'
  setSortBy: (sortBy) => set({ sortBy }),

  // ── 화면 라우팅 ────────────────────────────────
  route: { name: 'main' }, // {name:'main'} | {name:'detail', id} | {name:'book-edit'} | {name:'book-export'}
  navigate: (route) => set({ route }),

  // 모달
  filterModal: null, // null | 0..3 (활성 탭 인덱스)
  openFilter: (tab = 0) => set({ filterModal: tab }),
  closeFilter: () => set({ filterModal: null }),
  searchModal: false,
  setSearchModal: (searchModal) => set({ searchModal }),

  // ── 포토북 (새로고침 시 초기화) ────────────────
  photobook: [], // 카드 id 배열 (순서 보존)
  isInBook: (id) => get().photobook.includes(id),
  toggleBook: (id) =>
    set((s) => ({
      photobook: s.photobook.includes(id)
        ? s.photobook.filter((x) => x !== id)
        : [...s.photobook, id],
    })),
  removeFromBook: (id) =>
    set((s) => ({ photobook: s.photobook.filter((x) => x !== id) })),
  clearBook: () => set({ photobook: [] }),
  reorderBook: (photobook) => set({ photobook }),

  // ── 파생값(셀렉터) ─────────────────────────────
  facets: () => {
    const { allCards } = get();
    const members = new Set();
    const kinds = new Set();
    const albums = new Set();
    const years = new Set();
    for (const c of allCards) {
      c.members.forEach((m) => members.add(m));
      if (c.kind) kinds.add(c.kind);
      if (c.album) albums.add(c.album);
      if (c.year) years.add(c.year);
    }
    // 멤버는 단체 포함 전체 로스터를 항상 노출 (데이터에 없어도)
    MEMBER_ORDER.forEach((m) => members.add(m));
    return {
      members: sortByOrder([...members], MEMBER_ORDER),
      kinds: [...kinds].sort((a, b) => a.localeCompare(b, 'ko')),
      albums: sortAlbums([...albums]),
      years: [...years].sort((a, b) => a.localeCompare(b)), // 오름차순
    };
  },

  filteredCards: () => {
    const s = get();
    const q = s.search.trim().toLowerCase();
    const filtered = s.allCards.filter((c) => {
      if (
        s.selectedMembers.length &&
        !c.members.some((m) => s.selectedMembers.includes(m))
      )
        return false;
      if (s.selectedKinds.length && !s.selectedKinds.includes(c.kind))
        return false;
      if (s.selectedAlbums.length && !s.selectedAlbums.includes(c.album))
        return false;
      if (s.selectedYears.length && !s.selectedYears.includes(c.year))
        return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
    return sortCards(filtered, s.sortBy);
  },

  bookCards: () => {
    const { allCards, photobook } = get();
    const byId = new Map(allCards.map((c) => [c.id, c]));
    return photobook.map((id) => byId.get(id)).filter(Boolean);
  },
}));
