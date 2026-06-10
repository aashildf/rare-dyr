import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = [
  { icon: require('../../assets/ikoner/silva_navbar.png'), route: 'HjemTab',  tabIndex: 0 },
  { icon: require('../../assets/ikoner/luft_navbar.png'),  route: 'LuftTab',  tabIndex: 1 },
  { icon: require('../../assets/ikoner/land_navbar.png'),  route: 'SkogTab',  tabIndex: 2 },
  { icon: require('../../assets/ikoner/vann_navbar.png'),  route: 'VannTab',  tabIndex: 3 },
];

export default function TabBar({ navigation, activeTab, state }) {
  const currentActive = state ? state.routes[state.index]?.name : activeTab;

  const CATEGORY_TABS = ['LuftTab', 'SkogTab', 'VannTab'];

  const goTo = (tab) => {
    if (state) {
      if (CATEGORY_TABS.includes(tab.route)) {
        navigation.navigate(tab.route, { screen: 'DyrListe' });
      } else {
        navigation.navigate(tab.route);
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Main',
          state: {
            index: tab.tabIndex,
            routes: [
              { name: 'HjemTab' },
              { name: 'LuftTab' },
              { name: 'SkogTab' },
              { name: 'VannTab' },
            ],
          },
        }],
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        <View style={styles.pillBg} />
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.route}
            style={styles.item}
            onPress={() => goTo(tab)}
            activeOpacity={0.7}
          >
            <Image
              source={tab.icon}
              style={[styles.icon, currentActive === tab.route && styles.iconActive]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
    height: 84,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 154,
    borderWidth: 0.5,
    borderColor: '#979797',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  pillBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 154,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 68,
    height: 68,
    opacity: 0.75,
  },
  iconActive: {
    opacity: 1,
  },
});
