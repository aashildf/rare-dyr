import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#29676A' },
};

import IntroScreen from '../screens/IntroScreen';
import HomeScreen from '../screens/HomeScreen';
import AnimalListScreen from '../screens/AnimalListScreen';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import VideoScreen from '../screens/VideoScreen';
import DiscoveryBookScreen from '../screens/DiscoveryBookScreen';
import GameScreen from '../screens/GameScreen';

import { colors, radius } from '../theme';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const VerdenerStack = createStackNavigator();

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Hjem" component={HomeScreen} />
      <HomeStack.Screen name="DyrDetalj" component={AnimalDetailScreen} />
      <HomeStack.Screen name="Video" component={VideoScreen} />
    </HomeStack.Navigator>
  );
}

function makeAnimalStack(category) {
  const S = createStackNavigator();
  return function AnimalStack() {
    return (
      <S.Navigator screenOptions={{ headerShown: false }}>
        <S.Screen name="DyrListe" component={AnimalListScreen} initialParams={{ category }} />
        <S.Screen name="DyrDetalj" component={AnimalDetailScreen} />
        <S.Screen name="Video" component={VideoScreen} />
      </S.Navigator>
    );
  };
}

const LandStack = makeAnimalStack('land');
const VannStack = makeAnimalStack('vann');
const LuftStack = makeAnimalStack('luft');

function tabIcon(source, focused) {
  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconActive]}>
      <Image source={source} style={styles.tabIcon} resizeMode="contain" />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabItem,
        tabBarIconStyle: styles.tabIconContainer,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarHideOnKeyboard: true,
        tabBarShadowVisible: false,
      }}
      safeAreaInsets={{ bottom: 0 }}
    >
      <Tab.Screen
        name="HjemTab"
        component={HomeStackNav}
        options={{ tabBarIcon: ({ focused }) => tabIcon(require('../../assets/ikoner/hjem_ikonet_fylt.png'), focused) }}
      />
      <Tab.Screen
        name="SkogTab"
        component={LandStack}
        options={{ tabBarIcon: ({ focused }) => tabIcon(require('../../assets/ikoner/land_ikonet_fylt.png'), focused) }}
      />
      <Tab.Screen
        name="VannTab"
        component={VannStack}
        options={{ tabBarIcon: ({ focused }) => tabIcon(require('../../assets/ikoner/vann_ikonet_fylt.png'), focused) }}
      />
      <Tab.Screen
        name="LuftTab"
        component={LuftStack}
        options={{ tabBarIcon: ({ focused }) => tabIcon(require('../../assets/ikoner/luft_ikonet_fylt.png'), focused) }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: '#29676A' }}>
      <NavigationContainer theme={AppTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'transparent' } }}>
          <RootStack.Screen name="Intro" component={IntroScreen} />
          <RootStack.Screen name="Main" component={MainTabs} />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 96,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  tabBarBg: {
    flex: 1,
    borderRadius: 154,
    backgroundColor: 'rgba(245, 223, 223, 0.18)',
  },
  tabItem: {
    flex: 1,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    marginTop: -40,
  },
  tabIconContainer: {
    width: 160,
    height: 160,
    overflow: 'visible',
  },
  tabIcon: { width: 100, height: 100 },
  tabIconWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabIconActive: {
    borderColor: '#E5D8A4',
  },
});
