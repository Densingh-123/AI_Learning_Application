import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from '../components/Home';
import ExploreScreen from './explore';
import ProgressScreen from './Progress';
import ProfileScreen from './Profile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        
        tabBarActiveTintColor: '#1E90FF', // Blue color for active tab
        tabBarInactiveTintColor: '#A9A9A9', // Gray color for inactive tabs
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff', // White background for the tab bar
          position: 'absolute',
          bottom: 0, // Position at the bottom of the screen
          left: 0,
          right: 0,
          height: 80, // Slightly taller for better touch area
          borderTopWidth: 0, // Remove the default border
          borderTopRightRadius: 25, // Corrected property name
          borderTopLeftRadius: 25, // Corrected property name
          elevation: 10, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -5 },
          shadowRadius: 10,
        },
        
        tabBarItemStyle: {
          paddingVertical: 8, // Add padding for better spacing
        },
        tabBarLabelStyle: {
          fontSize: 12, // Smaller font size for labels
          fontWeight: 'bold', // Bold labels
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="home" size={size} color={color} />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#1E90FF',
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="search" size={size} color={color} />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#1E90FF',
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="progress"
        component={ProgressScreen}
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="bar-chart" size={size} color={color} />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#1E90FF',
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" size={size} color={color} />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#1E90FF',
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}