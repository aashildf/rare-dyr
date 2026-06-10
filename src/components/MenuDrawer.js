import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Modal, Pressable,
  StyleSheet, Animated, Easing, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tannhjulSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11L21.54 9.37C21.73 9.22 21.78 8.95 21.67 8.72L19.67 5.28C19.56 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.44 5.05 4.33 5.28L2.33 8.72C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.21 15.05 2.33 15.28L4.33 18.72C4.44 18.95 4.73 19.03 4.95 18.95L7.44 17.94C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.68 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.56 18.95 19.67 18.72L21.67 15.28C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z" fill="#3F4A39"/></svg>`;

const kryssSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L19 19M19 5L5 19" stroke="#004D56" stroke-width="2.8" stroke-linecap="round"/></svg>`;

const hengelasSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#3F4A39"/></svg>`;

function HoverNavItem({ item, onPress }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={[navItemStyles.pressable, hovered && navItemStyles.pressableHovered]}
    >
      {item.icon
        ? <Image
            source={item.icon}
            style={navItemStyles.icon}
            resizeMode="contain"
          />
        : <View style={navItemStyles.placeholder} />
      }
      <Text style={[navItemStyles.label, hovered && navItemStyles.labelHovered]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const navItemStyles = StyleSheet.create({
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    gap: spacing.md,
    marginHorizontal: spacing.sm,
    marginVertical: 5,
    borderRadius: 8.708,
    backgroundColor: "#d3cdb7",
    boxShadow: "8px 8px 10px 0px #0F1F11",
    cursor: "pointer",
  },
  pressableHovered: {
    backgroundColor: "#c2edb6",
  },
  container: {},
  containerHovered: {},
  icon: { width: scale(56), height: scale(56), transform: [{ scale: 1.5 }] },
  iconHovered: {
    width: scale(56),
    height: scale(56),
    transform: [{ scale: 1.5 }],
    opacity: 1,
  },
  placeholder: {
    width: scale(42),
    height: scale(42),
    backgroundColor: "rgba(125, 221, 200, 0.1)",
    borderRadius: radius.md,
  },
  label: {
    fontFamily: "RumRaisin_400Regular",
    fontSize: rf(24),
    lineHeight: rf(30),
    color: "#29332A",
  },
  labelHovered: {
    color: "#1A2A1A",
  },
});
import { colors, spacing, radius, typography } from '../theme';
import { rf, scale } from '../utils/responsive';

const NAV_ITEMS = [
  {
    label: 'Hjem',
    icon: require('../../assets/ikoner/silva_navbar.png'),
    route: 'HjemTab',
    tab: true,
  },
  {
    label: 'Rare dyr i lufta',
    icon: require('../../assets/ikoner/luft_navbar.png'),
    route: 'LuftTab',
    tab: true,
  },
  {
    label: 'Rare dyr på land',
    icon: require('../../assets/ikoner/land_navbar.png'),
    route: 'SkogTab',
    tab: true,
  },
  {
    label: 'Rare dyr i vann',
    icon: require('../../assets/ikoner/vann_navbar.png'),
    route: 'VannTab',
    tab: true,
  },
  {
    label: 'Oppdagelsesbok',
    icon: require('../../assets/oppdagelsesbok.png'),
    route: 'OppdagelsesTab',
    tab: false,
  },
  {
    label: 'Spill og moro',
    icon: require('../../assets/spill_og_moro.png'),
    route: 'SpillTab',
    tab: false,
  },
];

export default function MenuDrawer({ visible, onClose, navigation }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const drawerWidth = Math.min(width * 0.78, 340);
  const slideAnim  = useRef(new Animated.Value(drawerWidth)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 420,
          easing: Easing.bezier(0.16, 1, 0.3, 1), // expo-out — rask start, myk stopp
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.55,
          duration: 320,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: drawerWidth,
          duration: 420,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNav = (item) => {
    onClose();
    setTimeout(() => {
      if (item.tab) {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Main',
            state: {
              index: ['HjemTab','LuftTab','SkogTab','VannTab'].indexOf(item.route),
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
    }, 250);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={[styles.root, { height }]}>
        {/* Mørk overlay bak skuff */}
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
        </Pressable>

        {/* Skuff */}
        <Animated.View
          style={[
            styles.drawerShell,
            {
              width: drawerWidth,
              height,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#3F4A39", "#B6D2C6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.drawerGradient, { paddingTop: Math.max(insets.top, spacing.xl) }]}
          >
            {/* Header */}
            <View style={styles.drawerHeader}>
              <Image
                source={require("../../assets/logo/rare_dyr_logo_silva_land.png")}
                style={[styles.drawerLogo, { width: drawerWidth * 0.55 }]}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <SvgXml xml={kryssSvg} width={scale(18)} height={scale(18)} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Navigasjon */}
            <View style={styles.navSection}>
              {NAV_ITEMS.map((item) => (
                <HoverNavItem
                  key={item.label}
                  item={item}
                  onPress={() => handleNav(item)}
                />
              ))}
            </View>

            {/* Bunn — innstillinger og foreldrekontroll */}
            <View style={styles.bottomSection}>
              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.innstillingerBtn}
                activeOpacity={0.8}
              >
                <Image
                  source={require("../../assets/instillinger_ikon.png")}
                  style={styles.foreldreLIcon}
                  resizeMode="contain"
                />
                <Text style={styles.innstillingerLabel}>Innstillinger</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.foreldreBtn} activeOpacity={0.7}>
                <Image
                  source={require("../../assets/hengelaasikon.png")}
                  style={styles.foreldreLIcon}
                  resizeMode="contain"
                />
                <Text style={styles.foreldreLabel}>Foreldrekontroll</Text>
              </TouchableOpacity>

              <Text style={styles.copyright}>
                Rare dyr © Åshild Færøy  2026
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const ICON_SIZE = scale(52);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },

  // Skuff — ytre ramme med skygge og buet venstre kant
  drawerShell: {
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: `rgba(229, 216, 164, 0.25)`,
    borderRightWidth: 0,
    // Skygge
    boxShadow: '-6px 0px 20px rgba(0,0,0,0.45)',
    elevation: 20,
  },
  drawerGradient: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },

  // Header
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  drawerLogo: {
    aspectRatio: 2,
  },
  closeBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5D8A4',
    boxShadow: '3px 3px 6px rgba(0,0,0,0.6)',
  },
  closeText: {
    color: '#004D56',
    fontSize: rf(22),
    fontFamily: typography.fonts.bodyBold,
    lineHeight: rf(24),
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },

  // Nav-items
  navSection: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  navIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  navIconPlaceholder: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
  },
  navLabel: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h2,
    color: colors.cream,
  },

  // Bunn
  bottomSection: {
    paddingBottom: spacing.md,
    marginTop: spacing.sm,
  },
  copyright: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(10),
    color: '#29332A',
    textAlign: 'center',
    marginTop: spacing.sm,
    opacity: 0.6,
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  bottomIconBox: {
    width: scale(30),
    height: scale(30),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIconText: {
    fontSize: rf(18),
    color: '#29332A',
  },
  bottomLabel: {
    fontFamily: typography.fonts.body,
    ...typography.h3,
    color: colors.cream,
  },
  lockedItem: {
    opacity: 0.65,
  },
  lockedIconBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  lockSymbol: {
    fontSize: rf(13),
  },
  lockedTextGroup: { gap: 1 },
  lockedSub: {
    fontFamily: typography.fonts.bodyRegular,
    ...typography.caption,
    color: colors.textMuted,
  },

  // Innstillinger-knapp (liten, nedtonet)
  innstillingerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginVertical: 2,
    borderRadius: 8.708,
    borderWidth: 1,
    borderColor: 'rgba(30,89,105,0.78)',
    backgroundColor: 'rgba(193,219,208,0.6)',
    opacity: 0.75,
  },
  innstillingerLabel: {
    fontFamily: typography.fonts.body,
    ...typography.body,
    color: '#29332A',
    flex: 1,
  },

  // Foreldrekontroll-knapp (liten, nedtonet)
  foreldreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginVertical: 2,
    borderRadius: 8.708,
    borderWidth: 1,
    borderColor: 'rgba(30,89,105,0.83)',
    backgroundColor: 'rgba(229,216,164,0.6)',
    opacity: 0.65,
  },
  foreldreLIcon: {
    width: scale(24),
    height: scale(24),
  },
  foreldreLabel: {
    fontFamily: typography.fonts.body,
    ...typography.body,
    color: '#29332A',
    flex: 1,
  },
  lockSymbol: {
    color: '#29332A',
    fontSize: rf(16),
  },
});
