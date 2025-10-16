import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/layout/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme as keyof typeof Colors].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="folder.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="voting"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="hand.thumbsup.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
