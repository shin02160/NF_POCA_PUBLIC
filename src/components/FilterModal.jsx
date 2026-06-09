import { useEffect, useState } from 'react';
import { T } from '../lib/tokens';
import { useStore } from '../store/useStore';
import { IcoCheck, IcoClose } from './icons';

const TABS = [
  { name: '멤버', facet: 'members', key: 'selectedMembers', mode: 'list' },
  { name: '종류', facet: 'kinds', key: 'selectedKinds', mode: 'chips' },
  { name: '앨범/콘서트', facet: 'albums', key: 'selectedAlbums', mode: 'list' },
  { name: '연도', facet: 'years', key: 'selectedYears', mode: 'chips' },
];

export default function FilterModal() {
  const tabIdx = useStore((s) => s.filterModal);
  const close = useStore((s) => s.closeFilter);
  const facets = useStore((s) => s.facets);
  const setFilter = useStore((s) => s.setFilter);
  const open = tabIdx !== null;

  const [tab, setTab] = useState(0);
  // 로컬 드래프트 (적용 전까지 스토어 미반영)
  const [draft, setDraft] = useState({});

  useEffect(() => {
    if (open) {
      setTab(tabIdx);
      const s = useStore.getState();
      setDraft({
        selectedMembers: [...s.selectedMembers],
        selectedKinds: [...s.selectedKinds],
        selectedAlbums: [...s.selectedAlbums],
        selectedYears: [...s.selectedYears],
      });
    }
  }, [open, tabIdx]);

  if (!open) return null;

  const f = facets();
  const cur = TABS[tab];
  const options = f[cur.facet];
  const selected = draft[cur.key] || [];

  const toggle = (val) =>
    setDraft((d) => {
      const arr = d[cur.key] || [];
      return {
        ...d,
        [cur.key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
      };
    });

  const apply = () => {
    setFilter('selectedMembers', draft.selectedMembers);
    setFilter('selectedKinds', draft.selectedKinds);
    setFilter('selectedAlbums', draft.selectedAlbums);
    setFilter('selectedYears', draft.selectedYears);
    close();
  };

  const totalSelected =
    (draft.selectedMembers?.length || 0) +
    (draft.selectedKinds?.length || 0) +
    (draft.selectedAlbums?.length || 0) +
    (draft.selectedYears?.length || 0);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40 }}>
      <div
        className="dim-enter"
        onClick={close}
        style={{ position: 'absolute', inset: 0, background: T.dim }}
      />
      <div
        className="sheet-enter"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '82%',
          background: T.s,
          borderRadius: '22px 22px 0 0',
          overflow: 'hidden',
          boxShadow: '0 -12px 48px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 핸들 */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 100, background: T.bl }} />
        </div>

        {/* 탭바 */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.b}`, marginTop: 8, flexShrink: 0 }}>
          {TABS.map((t, i) => {
            const cnt = draft[t.key]?.length || 0;
            return (
              <button
                key={i}
                onClick={() => setTab(i)}
                style={{
                  flex: 1,
                  height: 46,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  borderBottom: i === tab ? `2.5px solid ${T.p}` : '2.5px solid transparent',
                  marginBottom: -1,
                }}
              >
                <span
                  style={{
                    fontSize: t.name.length > 4 ? 10.5 : 12.5,
                    fontWeight: i === tab ? 700 : 400,
                    color: i === tab ? T.p : T.tm,
                    fontFamily: T.f,
                  }}
                >
                  {t.name}
                </span>
                {cnt > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: i === tab ? T.p : T.tl }}>
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 콘텐츠 */}
        <div className="scroll-y" style={{ flex: 1, minHeight: 120 }}>
          {options.length === 0 && (
            <p style={{ padding: 24, fontSize: 13, color: T.tl, textAlign: 'center' }}>
              항목이 없습니다.
            </p>
          )}
          {cur.mode === 'list'
            ? options.map((item) => {
                const on = selected.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 13,
                      padding: '13px 22px',
                      borderBottom: `1px solid ${T.b}`,
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: on ? T.p : 'transparent',
                        border: on ? 'none' : `1.5px solid ${T.b}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: on ? '0 2px 8px rgba(51,102,255,0.28)' : 'none',
                      }}
                    >
                      {on && <IcoCheck c="#fff" sz={12} />}
                    </div>
                    <span
                      style={{ fontSize: 15, color: T.t, fontWeight: on ? 600 : 400, flex: 1 }}
                    >
                      {item}
                    </span>
                    {on && (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: T.bl,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IcoClose c={T.tm} sz={9} />
                      </div>
                    )}
                  </button>
                );
              })
            : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '16px 22px' }}>
                {options.map((item) => {
                  const on = selected.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggle(item)}
                      style={{
                        height: 36,
                        padding: '0 16px',
                        borderRadius: 100,
                        background: on ? T.p : T.bl,
                        border: `1.5px solid ${on ? T.p : T.b}`,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: on ? '#fff' : T.t }}
                      >
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
        </div>

        {/* 적용 버튼 */}
        <div style={{ padding: '14px 22px 28px', flexShrink: 0, display: 'flex', gap: 10 }}>
          {totalSelected > 0 && (
            <button
              onClick={() =>
                setDraft({
                  selectedMembers: [],
                  selectedKinds: [],
                  selectedAlbums: [],
                  selectedYears: [],
                })
              }
              style={{
                width: 92,
                height: 54,
                borderRadius: 14,
                border: `1.5px solid ${T.b}`,
                background: T.s,
                fontSize: 14,
                fontWeight: 600,
                color: T.tm,
              }}
            >
              초기화
            </button>
          )}
          <button
            onClick={apply}
            style={{
              flex: 1,
              height: 54,
              borderRadius: 14,
              background: T.p,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(51,102,255,0.28)',
            }}
          >
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>
              적용하기{totalSelected > 0 ? ` (${totalSelected})` : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
