import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { spacing } from '../theme';
import MenuDrawer from './MenuDrawer';

const DEFAULT_LOGO = require('../../assets/logo/rare_dyr_logo_silva_land.png');

export default function AppHeader({ navigation, logo }) {
  const { width } = useWindowDimensions();
  const logoW    = Math.min(width * 0.58, 260);
  const menuSize = Math.max(Math.min(width * 0.10, 52), 40);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => navigation?.getParent()?.navigate('HjemTab') ?? navigation?.navigate('Hjem')}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={logo ?? DEFAULT_LOGO}
            style={{ width: logoW, height: logoW / 2 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Image
            source={require('../../assets/meny.png')}
            style={{ width: menuSize, height: menuSize }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <MenuDrawer
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        navigation={navigation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
