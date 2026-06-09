import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { T } from '../lib/tokens';
import { cardSubtitle } from '../lib/utils';
import { useStore } from '../store/useStore';
import PocaCard from '../components/PocaCard';
import { TopBar } from './DetailScreen';
import { IcoDrag, IcoClose, IcoBook } from '../components/icons';

function SortableRow({ card }) {
  const removeFromBook = useStore((s) => s.removeFromBook);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging ? '0 6px 20px rgba(0,0,0,0.14)' : 'none',
    background: T.s,
    position: 'relative',
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        gap: 12,
        padding: '11px 16px',
        borderBottom: `1px solid ${T.b}`,
        alignItems: 'center',
      }}
    >
      <button
        {...attributes}
        {...listeners}
        style={{ flexShrink: 0, touchAction: 'none', cursor: 'grab', display: 'flex' }}
      >
        <IcoDrag />
      </button>
      <div style={{ width: 46, flexShrink: 0 }}>
        <PocaCard card={card} radius={8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.t,
            marginBottom: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {card.name}
        </p>
        <p style={{ fontSize: 11, color: T.tm, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {cardSubtitle(card)}
        </p>
      </div>
      <button
        onClick={() => removeFromBook(card.id)}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: T.bl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IcoClose c={T.tm} sz={9} />
      </button>
    </div>
  );
}

export default function PhotobookEditScreen() {
  const navigate = useStore((s) => s.navigate);
  const photobook = useStore((s) => s.photobook);
  const reorderBook = useStore((s) => s.reorderBook);
  const clearBook = useStore((s) => s.clearBook);
  const bookCards = useStore((s) => s.bookCards);
  const cards = bookCards();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (e) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIdx = photobook.indexOf(active.id);
      const newIdx = photobook.indexOf(over.id);
      reorderBook(arrayMove(photobook, oldIdx, newIdx));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <TopBar
        onBack={() => navigate({ name: 'main' })}
        right={
          cards.length > 0 && (
            <button
              onClick={clearBook}
              style={{
                height: 32,
                padding: '0 14px',
                borderRadius: 100,
                border: `1.5px solid ${T.b}`,
                fontSize: 12,
                color: T.tm,
                fontWeight: 500,
              }}
            >
              전체 비우기
            </button>
          )
        }
      />
      {/* 타이틀 + N장 뱃지 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 16px 10px',
          background: T.s,
          borderBottom: `1px solid ${T.b}`,
          marginTop: -1,
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 600, color: T.t }}>포토북</span>
        <div style={{ height: 22, padding: '0 9px', borderRadius: 100, background: T.pb, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: T.p, fontWeight: 700 }}>{cards.length}장</span>
        </div>
      </div>

      {cards.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: T.tl }}>
          <IcoBook c={T.b} sz={40} />
          <p style={{ fontSize: 14 }}>담은 포카가 없습니다.</p>
          <button
            onClick={() => navigate({ name: 'main' })}
            style={{ fontSize: 13, color: T.p, fontWeight: 600 }}
          >
            포카 담으러 가기 →
          </button>
        </div>
      ) : (
        <>
          <div style={{ background: T.pb, padding: '9px 16px', flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: T.p }}>💡 드래그해서 순서를 바꿀 수 있어요</span>
          </div>
          <div className="scroll-y" style={{ flex: 1, background: T.s }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={photobook} strategy={verticalListSortingStrategy}>
                {cards.map((card) => (
                  <SortableRow key={card.id} card={card} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <div style={{ padding: '12px 16px 26px', background: T.s, borderTop: `1px solid ${T.b}`, flexShrink: 0 }}>
            <button
              onClick={() => navigate({ name: 'book-export' })}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 14,
                background: T.p,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(51,102,255,0.26)',
              }}
            >
              <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>포토북 내보내기</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>→</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
