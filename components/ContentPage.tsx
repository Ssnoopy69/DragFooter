import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import File from '../assets/icons/file.svg';

const PaperclipIcon = () => (
  <View className="h-6 items-center justify-center w-10 border-r-2 border-gray-500">
    <Text className="rotate-45 transform text-2xl font-light text-gray-500"><File/></Text>
  </View>
);
interface UpArrowIconProps {
  isActive: boolean;
}
const UpArrowIcon: React.FC<UpArrowIconProps> = ({ isActive }) => (
  <View
    className={`h-8 w-8 items-center justify-center rounded-full ${isActive ? 'bg-gray-600' : 'bg-gray-300'}`}>
    <Text className="font-bold text-2xl text-white">↑</Text>
  </View>
);

export default function ThryveAIChatUI() {
  const [message, setMessage] = useState('');
  const [isGPT5Enabled, setIsGPT5Enabled] = useState(false);

  const handleButtonPress = (mode: string) => {
    console.log(`${mode} button pressed!`);
  };

  const isMessageEmpty = message.trim().length === 0;

  return (
    <SafeAreaView className="mx-2 flex-1 justify-center bg-gray-50">
      <View className="mb-6 px-2 pt-6">
        <Text className="text-center text-2xl font-normal text-gray-900">
          What can I help with, Julian?
        </Text>
      </View>

      <View className="mb-2 px-3">
        <View className="w-full rounded-2xl border border-transparent bg-white px-4 shadow-xl shadow-gray-100">
          <View className="flex-row items-center justify-between">
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Message ThryveAI..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <View className="mt-4 flex-row items-center justify-between pb-2">
            <View className="flex-row items-center space-x-3">
              <TouchableOpacity className="p-1">
                <PaperclipIcon />
              </TouchableOpacity>
              <View className="flex-row items-center space-x-1">
                <Text className="font-normal text-gray-700 pl-2">GPT 5</Text>
                <Switch
                  value={isGPT5Enabled}
                  onValueChange={setIsGPT5Enabled}
                  trackColor={{ false: '#E5E7EB', true: '#E5EEFA' }}
                  thumbColor={isGPT5Enabled ? '#1E40AF' : '#F9FAFB'}
                  className="scale-90"
                />
                <Text
                  className={`text-sm font-semibold ${
                    !isGPT5Enabled ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                  Other Mode
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => console.log('Send Message:', message)}
              disabled={isMessageEmpty}
              className={`ml-3`}>
              <UpArrowIcon isActive={!isMessageEmpty} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-around px-5 pt-2">
        <TouchableOpacity
          className="rounded-[50px] bg-white px-5 py-3 shadow-sm shadow-gray-200"
          onPress={() => handleButtonPress('Learn & Study')}>
          <Text className="text-xs font-normal text-gray-800">Learn & Study</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-[50px] bg-white px-5 py-3 shadow-sm shadow-gray-200"
          onPress={() => handleButtonPress('Summarize')}>
          <Text className="text-xs font-normal text-gray-800">Summarize</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-[50px] bg-white px-5 py-3 shadow-sm shadow-gray-200"
          onPress={() => handleButtonPress('Study Notes')}>
          <Text className="text-xs font-normal text-gray-800">Study Notes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
