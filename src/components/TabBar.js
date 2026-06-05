import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = [
  { icon: require('../../assets/ikoner/hjem_ikonet_fylt.png'),   route: 'HjemTab',  tabIndex: 0 },
  { icon: require('../../assets/ikoner/land_ikonet_fylt.png'),   route: 'SkogTab',  tabIndex: 1 },
  { icon: require('../../assets/ikoner/vann_ikonet_fylt.png'),   route: 'VannTab',  tabIndex: 2 },
  { icon: require('../../assets/ikoner/luft_ikonet_fylt.png'),   route: 'LuftTab',  tabIndex: 3 },
];

export default function TabBar({ navigation, activeTab }) {
  const goTo = (tabIndex) => {
    navigation.reset({
      index: 0,
      routes: [{
        name: 'Main',
        state: {
          index: tabIndex,
          routes: [
            { name: 'HjemTab' },
            { name: 'SkogTab' },
            { name: 'VannTab' },
            { name: 'LuftTab' },
          ],
        },
      }],
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        <View style={styles.pillBg} />
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab.route}
            style={styles.item}
            onPress={() => goTo(tab.tabIndex)}
            activeOpacity={0.7}
          >
            <Image
              source={tab.icon}
              style={[styles.icon, activeTab === tab.route && styles.iconActive]}
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
