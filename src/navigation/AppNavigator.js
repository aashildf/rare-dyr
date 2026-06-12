import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TabBar from '../components/TabBar';

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

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();

const CARD_STYLE = { flex: 1, backgroundColor: 'transparent' };

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, cardStyle: CARD_STYLE }}>
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
      <S.Navigator screenOptions={{ headerShown: false, cardStyle: CARD_STYLE }}>
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


// Placeholder-høyde: pill (84) + bunn-margin (16) = 100px reservert i layout
const TAB_BAR_HEIGHT = 100;

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => {
        const activeTab = props.state.routes[props.state.index];
        const activeScreen = activeTab?.state?.routes?.[activeTab.state?.index ?? 0]?.name;
        if (activeScreen === 'DyrDetalj' || activeScreen === 'Video') return null;
        return (
          <View style={{ height: TAB_BAR_HEIGHT, zIndex: 100, backgroundColor: '#00000000', pointerEvents: 'box-none' }}>
            <TabBar navigation={props.navigation} state={props.state} />
          </View>
        );
      }}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarHideOnKeyboard: true,
      }}
      safeAreaInsets={{ bottom: 0 }}
    >
      <Tab.Screen name="HjemTab" component={HomeStackNav} />
      <Tab.Screen name="LuftTab" component={LuftStack} />
      <Tab.Screen name="SkogTab" component={LandStack} />
      <Tab.Screen name="VannTab" component={VannStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: '#29676A' }}>
      <NavigationContainer theme={AppTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false, cardStyle: CARD_STYLE }}>
          <RootStack.Screen name="Intro" component={IntroScreen} />
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen name="OppdagelsesTab" component={DiscoveryBookScreen} />
          <RootStack.Screen name="SpillTab" component={GameScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}
