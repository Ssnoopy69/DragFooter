import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, AppState, Platform } from "react-native"; 
import * as NavigationBar from "expo-navigation-bar"; 

import Footer from "./components/Footer";
import ContentPage from "./components/ContentPage";
import "./global.css";

const hideSystemNavigationBar = async () => {
  if (Platform.OS !== "android") return;
  
  try {
    await NavigationBar.setVisibilityAsync("hidden"); 
    await NavigationBar.setBehaviorAsync('overlay-swipe');
  } catch (e) {
    console.warn("Could not set navigation bar visibility:", e);
  }
};

export default function App() {
  
  useEffect(() => {
    hideSystemNavigationBar();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        hideSystemNavigationBar();
      }
    });

    return () => {
      subscription.remove();
      if (Platform.OS === "android") {
         NavigationBar.setVisibilityAsync("visible").catch(() => {});
      }
    };
  }, []); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ContentPage />
        <Footer /> 
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}