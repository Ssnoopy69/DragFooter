import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, AppState, Platform } from "react-native"; 
import * as NavigationBar from "expo-navigation-bar"; // <-- Use the working Expo API

import Footer from "./components/Footer";
import ContentPage from "./components/ContentPage";
import "./global.css";

// Function to hide the bar persistently
const hideSystemNavigationBar = async () => {
  if (Platform.OS !== "android") return;
  
  try {
    // 🎯 Step 1: Hide the bar immediately
    await NavigationBar.setVisibilityAsync("hidden"); 
    
    // 🎯 Step 2: Set the behavior to 'immersive' (Android's most aggressive hiding mode)
    // This setting keeps the bar hidden until the user manually swipes from the edge.
    // This is the direct equivalent of 'stickyImmersive' for the Expo API.
    await NavigationBar.setBehaviorAsync('overlay-swipe');
    
  } catch (e) {
    // This catches errors when the app is run in an environment (like a web browser or a very old simulator) 
    // that doesn't support the API.
    console.warn("Could not set navigation bar visibility:", e);
  }
};

export default function App() {
  
  useEffect(() => {
    // 1. Initial Hide: Run immediately on app start
    hideSystemNavigationBar();

    // 2. Persistent Hiding: Re-run the function every time the app comes into focus
    // This prevents the bar from popping back up after events like showing the keyboard.
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        hideSystemNavigationBar();
      }
    });

    // 3. Cleanup: Restore the bar when the app is closed/unmounted
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