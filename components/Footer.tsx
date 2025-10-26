import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, LayoutRectangle } from 'react-native';
import { BlurView } from 'expo-blur';
import DraggableIconsGrid from './DraggableIconsGrid';

import Arrow from '../assets/icons/arrow.svg';
import Menu from '../assets/icons/menu.svg';
import Camera from '../assets/icons/camera.svg';
import Calendar from '../assets/icons/calendar.svg';
import Box from '../assets/icons/box.svg';
import Barrow from '../assets/icons/barrow.svg';

import BackIcon from '../assets/icons/MenuList/back.svg';
import BellIcon from '../assets/icons/MenuList/bell.svg';
import BulbIcon from '../assets/icons/MenuList/bulb.svg';
import CenterIcon from '../assets/icons/MenuList/center.svg';
import CloseIcon from '../assets/icons/MenuList/close.svg';
import OutIcon from '../assets/icons/MenuList/out.svg';
import PlusIcon from '../assets/icons/MenuList/plus.svg';
import SettingsIcon from '../assets/icons/MenuList/settings.svg';

export type DragItem = {
  id: string;
  label: string;
  color: string;
  icon: string;
};

export default function Footer() {
  const [activeGroup, setActiveGroup] = useState<'group1' | 'group2'>('group1');
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'main' | 'plus'>('main');

  const isDraggingRef = useRef(false);
  const dropPositionRef = useRef<number | null>(null);
  const dropZoneColorRef = useRef('#3B82F6');
  const dropZoneRef = useRef<View>(null);
  const [_, setForceUpdate] = useState(0);

  const [group1Buttons, setGroup1Buttons] = useState<DragItem[]>([
    { id: 'camera', label: 'Chat', color: '#fff', icon: 'camera' },
    { id: 'calendar', label: 'Calendar', color: '#fff', icon: 'calendar' },
    { id: 'box', label: 'Docs', color: '#fff', icon: 'box' },
    { id: 'box2', label: 'Docs', color: '#fff', icon: 'box' },
    { id: 'more', label: 'More', color: '#fff', icon: 'arrow' },
  ]);

  const [group2Buttons, setGroup2Buttons] = useState<DragItem[]>([
    { id: 'back', label: 'More', color: '#fff', icon: 'barrow' },
    { id: 'camera', label: 'Chat', color: '#fff', icon: 'camera' },
    { id: 'calendar', label: 'Calendar', color: '#fff', icon: 'calendar' },
    { id: 'box', label: 'Docs', color: '#fff', icon: 'box' },
    { id: 'box2', label: 'Docs', color: '#fff', icon: 'box' },
  ]);

  const [dragItems, setDragItems] = useState<DragItem[]>([
    { id: '1', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
    { id: '2', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
    { id: '3', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
    { id: '4', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
    { id: '5', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
    { id: '6', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
    { id: '7', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
    { id: '8', label: 'Drive', color: '#e0e0e0', icon: 'octopus' },
  ]);

  const currentFooterButtons = activeGroup === 'group1' ? group1Buttons : group2Buttons;
  const setCurrentFooterButtons = activeGroup === 'group1' ? setGroup1Buttons : setGroup2Buttons;

  const footerButtonLayouts = useRef<
    Record<string, LayoutRectangle & { absoluteX: number; absoluteY: number }>
  >({});
  const footerContainerRef = useRef<View>(null);
  const gridLayoutRef = useRef<{
    absoluteX: number;
    absoluteY: number;
    width: number;
    height: number;
  } | null>(null);

  const handleFooterButtonLayout = (id: string) => (e: any) => {
    const layout = e.nativeEvent.layout;

    footerContainerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      footerButtonLayouts.current[id] = {
        ...layout,
        absoluteX: pageX + layout.x,
        absoluteY: pageY + layout.y,
      };
    });
  };

  const handleGridLayout = (layout: {
    absoluteX: number;
    absoluteY: number;
    width: number;
    height: number;
  }) => {
    gridLayoutRef.current = layout;
  };

  const handleFooterButtonPress = (button: DragItem) => {
    if (button.id === 'more' && activeGroup === 'group1') {
      setActiveGroup('group2');
    } else if (button.id === 'back' && activeGroup === 'group2') {
      setActiveGroup('group1');
    } else {
      console.log(`Pressed: ${button.label}`);
    }
  };

  const renderIcon = (iconName: string, color: string, size: number = 24) => {
    const iconProps = { width: size, height: size, fill: color };

    switch (iconName) {
      case 'arrow':
        return <Arrow {...iconProps} />;
      case 'search':
        return <Menu {...iconProps} />;
      case 'camera':
        return <Camera {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'box':
        return <Box {...iconProps} />;
      case 'barrow':
        return <Barrow {...iconProps} />;
      case 'group2':
        return <Barrow {...iconProps} />;
      default:
        return (
          <View
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: size / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#000', fontSize: size - 10, fontWeight: 'bold' }}>
              {iconName.charAt(0).toUpperCase()}
            </Text>
          </View>
        );
    }
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    dropPositionRef.current = null;
    dropZoneColorRef.current = '#3B82F6';
    setForceUpdate((prev) => prev + 1);
  };

  const handleDragMove = (item: DragItem, dropX: number, dropY: number) => {
    if (!isDraggingRef.current) return;

    if (footerContainerRef.current) {
      footerContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
        const toleranceArea = 150;
        const isOverFooterArea =
          dropX >= pageX &&
          dropX <= pageX + width &&
          dropY >= pageY - toleranceArea &&
          dropY <= pageY + height + toleranceArea;

        let newPosition: number | null = null;
        let newColor = '#3B82F6';

        if (isOverFooterArea) {
          const footerWidth = width;
          const positionWidth = footerWidth / 4;
          const relativeX = dropX - pageX;
          const position = Math.floor(relativeX / positionWidth);
          newPosition = Math.min(3, Math.max(0, position));
          newColor = '#10B981'; // Green when over drop zone
        }

        const positionChanged = dropPositionRef.current !== newPosition;
        const colorChanged = dropZoneColorRef.current !== newColor;

        dropPositionRef.current = newPosition;
        dropZoneColorRef.current = newColor;

        if (dropZoneRef.current && (positionChanged || colorChanged)) {
          dropZoneRef.current.setNativeProps({
            style: {
              backgroundColor: newColor,
            },
          });
        }
      });
    }
  };

  const handleDropOnFooter = (item: DragItem, dropX: number, dropY: number) => {
    if (dropPositionRef.current !== null) {
      const replaceableButtons = currentFooterButtons
        .filter((btn) => btn.id !== 'group2' && btn.id !== 'back')
        .slice(0, 4);

      if (replaceableButtons[dropPositionRef.current]) {
        const targetButton = replaceableButtons[dropPositionRef.current];

        setCurrentFooterButtons((prev) =>
          prev.map((b) =>
            b.id === targetButton.id
              ? {
                  ...b,
                  label: item.label,
                  color: item.color,
                  icon: item.icon,
                }
              : b
          )
        );
      }
    }

    isDraggingRef.current = false;
    dropPositionRef.current = null;
    dropZoneColorRef.current = '#3B82F6';
    setForceUpdate((prev) => prev + 1);
  };

  const mainMenuItems = [
    {
      id: '1',
      color: '#408DFF',
      label: 'Create',
      textColor: 'transparent',
      icon: 'plus',
      svg: PlusIcon,
    },
    {
      id: '2',
      color: '#fff',
      label: 'Quick Tour',
      textColor: 'transparent',
      icon: 'bulb',
      svg: BulbIcon,
    },
    {
      id: '3',
      color: '#fff',
      label: 'Help Center',
      textColor: 'transparent',
      icon: 'center',
      svg: CenterIcon,
    },
    {
      id: '4',
      color: '#fff',
      label: 'Notifications',
      textColor: 'transparent',
      icon: 'bell',
      svg: BellIcon,
    },
    {
      id: '5',
      color: '#fff',
      label: 'Settings',
      textColor: 'transparent',
      icon: 'settings',
      svg: SettingsIcon,
    },
    {
      id: '6',
      color: '#fff',
      label: 'Log out',
      textColor: 'transparent',
      icon: 'out',
      svg: OutIcon,
    },
    {
      id: '7',
      color: '#eaebf0',
      label: '',
      textColor: 'transparent',
      icon: 'close',
      svg: CloseIcon,
      close: true,
    },
  ];

  const plusMenuItems = [
    {
      id: 'p1',
      color: '#eaebf0',
      label: 'Back',
      textColor: 'transparent',
      icon: 'back',
      svg: BackIcon,
      back: true,
    },
    {
      id: 'p2',
      color: '#408DFF',
      label: 'Study Set',
      textColor: 'transparent',
      icon: 'plus',
      svg: PlusIcon,
    },
    {
      id: 'p3',
      color: '#408DFF',
      label: 'Doc',
      textColor: 'transparent',
      icon: 'plus',
      svg: PlusIcon,
    },
    {
      id: 'p4',
      color: '#408DFF',
      label: 'Quiz',
      textColor: 'transparent',
      icon: 'plus',
      svg: PlusIcon,
    },
    {
      id: 'p5',
      color: '#408DFF',
      label: 'Flashcards',
      textColor: 'transparent',
      icon: 'plus',
      svg: PlusIcon,
    },
    {
      id: 'p6',
      color: '#408DFF',
      label: 'Podcast',
      textColor: 'transparent',
      icon: 'plus',
      svg: PlusIcon,
    },
    {
      id: 'p7',
      color: '#408DFF',
      label: 'Mind Map',
      textColor: 'transparent',
      icon: 'plus',
      svg: PlusIcon,
    },
    {
      id: 'p8',
      color: '#eaebf0',
      label: '',
      textColor: 'transparent',
      icon: 'close',
      svg: CloseIcon,
      close: true,
    },
  ];

  const currentMenuItems = activeMenu === 'main' ? mainMenuItems : plusMenuItems;
  const handleMenuPress = (item: any) => {
    if (item.close) {
      setShowOverlay(false);
      setActiveMenu('main');
    } else if (item.back) {
      setActiveMenu('main');
    } else if (item.id === '1' && activeMenu === 'main') {
      setActiveMenu('plus');
    } else {
      console.log(`Menu pressed: ${item.label}`);
    }
  };

  return (
    <>
      <View
        ref={footerContainerRef}
        className="absolute bottom-6 w-full flex-row items-center justify-between px-4 h-14">
        <View className="w-72 flex-row items-center rounded-full bg-white pb-2 py-2 shadow-md">
          {currentFooterButtons.map((btn, idx) => (
            <View key={btn.id} className="flex-1 items-center">
              <TouchableOpacity
                onPress={() => handleFooterButtonPress(btn)}
                activeOpacity={0.7}
                onLayout={handleFooterButtonLayout(btn.id)}
                className={`items-center justify-center rounded-full ${
                  idx === 0 ? 'pl-2' : idx === currentFooterButtons.length - 1 ? 'pr-2' : 'px-3'
                }`}
                style={{
                  minWidth: 50,
                  minHeight: 32,
                  backgroundColor: btn.color !== '#fff' ? btn.color : 'transparent',
                  marginHorizontal: 0,
                }}>
                {renderIcon(btn.icon, btn.color !== '#fff' ? '#fff' : '#000', 20)}
              </TouchableOpacity>
              <Text
                className="mt-[0px] text-xs text-gray-600"
                style={{
                  fontSize: 8,
                  lineHeight: 12,
                }}>
                {btn.label}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setShowOverlay(true)}
          activeOpacity={0.8}
          className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
          <Text className="text-xl font-bold">
            <Menu />
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showOverlay} transparent animationType="fade">
        <View className="flex-1" pointerEvents="box-none">
          {isDraggingRef.current && (
            <View
              ref={dropZoneRef}
              className="absolute bottom-20 left-4 right-20 z-50 rounded-2xl border-2 border-blue-400 p-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 20,
                height: 140,
                backgroundColor: dropZoneColorRef.current,
                opacity: 0.95,
              }}
              pointerEvents="none">
              <Text className="mb-3 text-center text-sm font-bold text-white">
                {dropPositionRef.current !== null
                  ? `✅ Drop to replace position ${dropPositionRef.current + 1}`
                  : 'Drag over footer to select position'}
              </Text>

              <View className="flex-row justify-between">
                {[0, 1, 2, 3].map((position) => (
                  <View
                    key={position}
                    className={`h-14 w-14 items-center justify-center rounded-xl ${
                      dropPositionRef.current === position
                        ? 'border-2 border-white bg-white'
                        : 'border-2 border-blue-300 bg-blue-400/50'
                    }`}>
                    <Text
                      className={`text-sm font-bold ${
                        dropPositionRef.current === position ? 'text-green-600' : 'text-white'
                      }`}>
                      {position + 1}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <BlurView
            intensity={90}
            tint="light"
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
            pointerEvents="box-none">
            <View className="absolute top-0 w-full p-4">
              <DraggableIconsGrid
                items={dragItems}
                setItems={setDragItems}
                onDropOnFooter={handleDropOnFooter}
                onGridLayout={handleGridLayout}
                renderIcon={renderIcon}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
              />
            </View>

            <View className="w-full flex-row justify-end pb-4 pr-4">
              <View className="w-40 items-end gap-3 space-y-2">
                {currentMenuItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleMenuPress(item)}
                    className="flex-row justify-start">
                    <Text className="text-center font-medium" style={{ color: item.textColor }}>
                      {item.label}
                    </Text>
                    <View
                      className="items-center justify-center"
                      style={{
                        backgroundColor: item.color,
                        width: 42,
                        height: 42,
                      }}>
                      <item.svg width={42} height={42} fill={item.textColor} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>
    </>
  );
}
