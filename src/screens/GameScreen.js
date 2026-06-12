import React from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, radius } from '../theme';
import { rf, scale } from '../utils/responsive';
import AppHeader from '../components/AppHeader';
import TabBar from '../components/TabBar';

const pilSvg = (color) => `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="${color}"/></svg>`;

const svg = (path) => `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="white"/></svg>`;

const BADGE_ICONS = {
  fargelegg:        svg('M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z'),
  puslespill:       svg('M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z'),
  finn_dyret:       svg('M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'),
  hvem_lager_lyden: svg('M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'),
  spor:             svg('M4.5 9.5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3-5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm5 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm3 5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM12 11.5c-2.33 0-7 1.17-7 3.5V17h14v-2c0-2.33-4.67-3.5-7-3.5z'),
  fakta_quiz:       svg('M7 2v11h3v9l7-12h-4l4-8z'),
};

const BADGE = scale(34);

const GAMES = [
  {
    id: 'fargelegg',
    title: 'Fargelegg et dyr',
    image: require('../../assets/spill_og_moro/fargelegg.png'),
    gradient: ['#EBF4DC', '#D4E8B4'],
    accentDark: '#3F4A39',
    badgeColor: ['#8FCC68', '#6AAE44'],
    ready: false,
  },
  {
    id: 'puslespill',
    title: 'Pusle et dyr',
    image: require('../../assets/spill_og_moro/puslespill.png'),
    gradient: ['#F5F0E4', '#E8DFC4'],
    accentDark: '#6A5E30',
    badgeColor: ['#E8C46A', '#CFA040'],
    ready: false,
  },
  {
    id: 'finn_dyret',
    title: 'Finn dyret',
    image: require('../../assets/spill_og_moro/finn_dyret.png'),
    gradient: ['#DFF0F2', '#C0E4E8'],
    accentDark: '#004D56',
    badgeColor: ['#4DBFD4', '#28A0B8'],
    ready: false,
  },
  {
    id: 'hvem_lager_lyden',
    title: 'Hvem sin lyd?',
    image: require('../../assets/spill_og_moro/hvem_lager_lyden.png'),
    gradient: ['#E4EEF4', '#C8DCE8'],
    accentDark: '#3A657A',
    badgeColor: ['#6AAECE', '#4490B0'],
    ready: false,
  },
  {
    id: 'spor',
    title: 'Hvilket spor?',
    image: require('../../assets/spill_og_moro/hvilket_spor.png'),
    gradient: ['#F2EBD8', '#E4D8B8'],
    accentDark: '#4A3E20',
    badgeColor: ['#C8926A', '#A86E44'],
    ready: false,
  },
  {
    id: 'fakta_quiz',
    title: 'Rask fakta-quiz',
    image: require('../../assets/spill_og_moro/quiz.png'),
    gradient: ['#F4F0E0', '#E8E0C4'],
    accentDark: '#798447',
    badgeColor: ['#BACA50', '#96AA28'],
    ready: false,
  },
];

// Statiske rader — klar for 6. spill når bilde er klart
const ROWS = [
  [GAMES[0], GAMES[1]],
  [GAMES[2], GAMES[3]],
  [GAMES[4], GAMES[5]],
];

function GameCard({ game, onPress }) {
  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.cardTouch}>
        <LinearGradient
          colors={game.gradient}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.cardTitle} numberOfLines={2}>{game.title}</Text>

          <View style={styles.imageFrame}>
            <Image source={game.image} style={styles.frameImage} resizeMode="cover" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <LinearGradient
        colors={game.badgeColor}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.75, y: 1 }}
        style={[styles.badge, { width: BADGE, height: BADGE, borderRadius: BADGE / 2 }]}
      >
        <SvgXml xml={BADGE_ICONS[game.id]} width={BADGE * 0.55} height={BADGE * 0.55} />
      </LinearGradient>
    </View>
  );
}

export default function GameScreen({ navigation }) {
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pad = spacing.lg;
  const gap = spacing.md;

  return (
    <View style={[styles.screen, { height: H }]}>
      {/* View-wrapper med pointerEvents="none" er nødvendig — prop på Image fungerer ikke pålitelig */}
      {/* Bakgrunn — absolutt, ingen touch-håndtering, rendres før innhold */}
      <Image
        source={require('../../assets/spill_og_moro/bg_spillogmoro.png')}
        style={[StyleSheet.absoluteFillObject, { width: W, height: H }]}
        resizeMode="cover"
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.32)', 'rgba(0,0,0,0)']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 130 }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.28)']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 }}
        pointerEvents="none"
      />

      {/* Innhold — vanlig View med manuell top-inset, mer pålitelig på Android */}
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <AppHeader
          navigation={navigation}
          onLogoPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Main', state: { index: 0, routes: [{ name: 'HjemTab' }, { name: 'LuftTab' }, { name: 'SkogTab' }, { name: 'VannTab' }] } }],
          })}
        />

        <Image
          source={require('../../assets/spill_skilt.png')}
          style={styles.headerBilde}
          resizeMode="cover"
        />

        <View style={styles.grid}>
          {ROWS.map((row, i) => (
            <View key={i} style={styles.row}>
              <GameCard
                game={row[0]}
                onPress={() => row[0].ready && navigation.navigate(row[0].id)}
              />
              {row[1]
                ? <GameCard game={row[1]} onPress={() => row[1].ready && navigation.navigate(row[1].id)} />
                : <View style={styles.cardWrapper} />
              }
            </View>
          ))}
        </View>
      </View>

      <TabBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#2A4A2A" },
  safeArea: { flex: 1 },

  headerBilde: {
    width: "100%",
    height: scale(150),
    marginBottom: spacing.xs,
  },

  grid: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: spacing.xs,
    paddingBottom: 150,
    gap: spacing.md,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.md,
  },

  cardWrapper: {
    flex: 1,
    position: "relative",
  },
  cardTouch: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: scale(22),
    borderWidth: 3,
    borderColor: "#F7F1D9",
    overflow: "hidden",
    boxShadow: "0px 8px 16px rgba(0,0,0,0.12), 0px 3px 6px rgba(0,0,0,0.08)",
    elevation: 6,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },

  cardTitle: {
    fontFamily: "Quicksand_700Bold",
    fontSize: rf(13),
    color: "#2A2010",
    textAlign: "center",
    lineHeight: rf(17),
    marginBottom: spacing.xs,
    paddingBottom: spacing.xs,
  },

  imageFrame: {
    flex: 1,
    borderRadius: scale(12),
    borderWidth: 3,
    borderColor: "#F7F1D9",
    backgroundColor: "rgba(255,255,255,0.35)",
    // marginBottom: spacing.xs,
    overflow: "hidden",
    
  },
  frameImage: {
    width: "100%",
    height: "100%",
  },

  arrowCircle: {
    width: scale(23),
    height: scale(23),
    borderRadius: scale(15),
    backgroundColor: "#F0E9D2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    alignSelf: "flex-end",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.22)",
    elevation: 4,
  },
  arrowArea: {
    alignItems: "flex-end",
  },

  badge: {
    position: "absolute",
    top: -scale(8),
    left: -scale(8),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    boxShadow: "0px 5px 12px rgba(0,0,0,0.4), 0px 2px 4px rgba(0,0,0,0.2)",
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
});
