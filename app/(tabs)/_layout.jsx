import React from "react";
import { StyleSheet } from "react-native";

import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

import TabHeaderStyle from "../../constants/TabHeaderStyle.js";
import Colors from "../../constants/Colors.js";
import FontSize from "../../constants/FontSize.js";
import * as Haptics from "expo-haptics";

export default function TabLayout() {
  const ICON_SIZE = 24;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { ...styles.tabBar },
        tabBarLabelStyle: { ...styles.tabBarLabel },
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerTitleStyle: { ...styles.headerTitle },
        tabBarIconStyle: { marginBottom: -12 },
      }}
    >
      <Tabs.Screen
        listeners={({ tabPress }) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }}
        name="index"
        options={{
          title: "Dashboard",
          ...TabHeaderStyle,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="grid"
              size={ICON_SIZE}
              color={focused ? Colors.textPrimary : Colors.iconBlur}
            />
          ),
        }}
      />

      <Tabs.Screen
        listeners={({ tabPress }) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }}
        name="transactions"
        options={{
          tabBarLabel: "Transactions",
          title: "All Transactions",
          ...TabHeaderStyle,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="list"
              size={ICON_SIZE}
              color={focused ? Colors.textPrimary : Colors.iconBlur}
            />
          ),
        }}
      />

      <Tabs.Screen
        listeners={({ tabPress }) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }}
        name="baki-parties"
        options={{
          title: "Customers",
          ...TabHeaderStyle,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="users"
              size={ICON_SIZE}
              color={focused ? Colors.textPrimary : Colors.iconBlur}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 20,
    backgroundColor: Colors.bgTabBar,
  },
  tabBarLabel: {
    fontSize: FontSize.f12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
