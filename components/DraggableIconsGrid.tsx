import React, { JSX, useRef, useState } from 'react';
import { View, Text, PanResponder, Animated } from 'react-native';
import { DragItem } from './Footer';
import OctopusIcon from '../assets/icons/octopus.svg';

type Props = {
  items: DragItem[];
  setItems: (items: DragItem[]) => void;
  onDropOnFooter: (item: DragItem, dropX: number, dropY: number) => void;
  onGridLayout: (layout: {
    absoluteX: number;
    absoluteY: number;
    width: number;
    height: number;
  }) => void;
  renderIcon: (iconName: string, color: string, size?: number) => JSX.Element;
  onDragStart: () => void;
  onDragMove: (item: DragItem, dropX: number, dropY: number) => void;
};

export default function DraggableIconsGrid({
  items,
  onDropOnFooter,
  onGridLayout,
  onDragStart,
  onDragMove,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const gridRef = useRef<View>(null);

  const itemWidth = 80;
  const itemHeight = 78;
  const margin = 8;

  const handleGridLayout = () => {
    gridRef.current?.measure((x, y, width, height, pageX, pageY) => {
      onGridLayout({
        absoluteX: pageX,
        absoluteY: pageY,
        width,
        height,
      });
    });
  };

  const calculatePosition = (index: number) => {
    const numColumns = 4;
    const groupGap = 32;
    const row = Math.floor(index / numColumns);
    const col = index % numColumns;

    const x = col * (itemWidth + margin);

    let y = row * (itemHeight + margin);
    if (index >= numColumns) {
      y += groupGap;
    }
    return { x, y };
  };

  const createPanResponder = (item: DragItem, index: number) => {
    const position = calculatePosition(index);

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDraggingId(item.id);
        pan.setValue({ x: position.x, y: position.y });
        pan.extractOffset();
        onDragStart();
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.x.setValue(gestureState.dx);
        pan.y.setValue(gestureState.dy);

        gridRef.current?.measure((x, y, width, height, pageX, pageY) => {
          const absoluteX = pageX + position.x + gestureState.dx + itemWidth / 2;
          const absoluteY = pageY + position.y + gestureState.dy + itemHeight / 2;

          console.log('Absolute drag position:', absoluteX, absoluteY);
          onDragMove(item, absoluteX, absoluteY);
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();

        gridRef.current?.measure((x, y, width, height, pageX, pageY) => {
          const itemCenterX = pageX + position.x + gestureState.dx + itemWidth / 2;
          const itemCenterY = pageY + position.y + gestureState.dy + itemHeight / 2;

          onDropOnFooter(item, itemCenterX, itemCenterY);
        });

        setDraggingId(null);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderTerminate: () => {
        setDraggingId(null);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderTerminationRequest: () => false,
    });
  };

  return (
    <View className="mt-8 items-center">
      <Text className="font-poppins w-[295px] h-20 text-center text-base font-medium">
        Drag & drop to arrange your nav bar
      </Text>

      <View ref={gridRef} onLayout={handleGridLayout} className="relative w-full items-center">
        <Text className="absolute left-2 text-xs font-medium text-slate-600" style={{ top: -18 }}>
          First group
        </Text>

        <Text
          className="absolute left-2 text-xs font-medium text-slate-600"
          style={{
            top: itemHeight + 14,
          }}>
          Second group
        </Text>

        <View className="h-[172px] w-full">
          {items.map((item, index) => {
            const position = calculatePosition(index);
            const panResponder = createPanResponder(item, index);
            const isDragging = draggingId === item.id;

            return (
              <Animated.View
                key={item.id}
                {...panResponder.panHandlers}
                className="absolute"
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  transform: isDragging
                    ? [{ translateX: pan.x }, { translateY: pan.y }, { scale: 1.1 }]
                    : [{ translateX: position.x }, { translateY: position.y }],
                  zIndex: isDragging ? 999 : 1,
                }}>
                <View className="h-[78px] w-20 items-center justify-center rounded-[24px] border-2 border-slate-50 bg-slate-50 shadow-md">
                  <OctopusIcon width={42} height={42} />
                  <Text className="mt-1 text-center text-xs text-slate-600">{item.label}</Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
