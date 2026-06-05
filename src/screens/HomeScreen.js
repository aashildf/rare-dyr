import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, Pressable, StyleSheet, useWindowDimensions, Animated,
} from 'react-native';
import * as Speech from 'expo-speech';
import AppHeader from '../components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, spacing, radius, typography } from '../theme';
import { rf, scale } from '../utils/responsive';
import { todaysAdventure } from '../data/animals';

const GREETING_TEXT = 'Hei Anne! Bli med meg og oppdag rare dyr fra hele verden. Hvor vil du utforske først?';

function SpeakButton() {
  const [speaking, setSpeaking] = useState(false);
  const glimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glimmer, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(glimmer, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      Speech.speak(GREETING_TEXT, {
        language: 'nb-NO',
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    }
  };

  const borderColor = glimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['rgba(229,216,164,0.3)', 'rgba(229,216,164,1)', 'rgba(229,216,164,0.3)'],
  });

  const shadowOpacity = glimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.9, 0.2],
  });

  return (
    <Animated.View style={[
      styles.speakBtnOuter,
      {
        borderColor,
        boxShadow: shadowOpacity.interpolate
          ? undefined
          : undefined,
      },
    ]}>
      <TouchableOpacity
        style={[styles.speakBtn, speaking && styles.speakBtnActive]}
        onPress={handlePress}
        activeOpacity={0.75}
      >
        <Image
          source={require('../../assets/ikoner/lyd_symbol.png')}
          style={styles.speakIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const SPARKLE_POS = [
  { dx: -38, dy: -32, size: 7,  color: '#E5D8A4' },
  { dx:  36, dy: -28, size: 5,  color: '#ffffff' },
  { dx:  40, dy:  18, size: 6,  color: '#C1D47F' },
  { dx: -28, dy:  30, size: 5,  color: '#E5D8A4' },
  { dx:  12, dy: -46, size: 4,  color: '#ffffff' },
  { dx: -46, dy:   4, size: 6,  color: '#E5D8A4' },
];

function GlitterIcon({ icon, label, tab, elevated, iconWidth, navigation }) {
  const scale   = useRef(new Animated.Value(1)).current;
  const sparkles = useRef(SPARKLE_POS.map(() => new Animated.Value(0))).current;

  const handleHoverIn = () => {
    Animated.spring(scale, { toValue: 1.18, tension: 80, friction: 6, useNativeDriver: false }).start();
    sparkles.forEach((anim, i) =>
      Animated.sequence([
        Animated.delay(i * 40),
        Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 280, useNativeDriver: false }),
      ]).start()
    );
  };

  const handleHoverOut = () => {
    Animated.spring(scale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: false }).start();
  };

  return (
    <Pressable
      style={[styles.arcItem, elevated && styles.arcItemElevated]}
      onPress={() => navigation.navigate(tab)}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <View style={{ width: iconWidth, height: iconWidth }}>
        {/* Sparkle-partikler */}
        {SPARKLE_POS.map((s, i) => (
          <Animated.View key={i} style={{
            position: 'absolute',
            left: iconWidth / 2 + s.dx - s.size / 2,
            top:  iconWidth / 2 + s.dy - s.size / 2,
            width: s.size, height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: s.color,
            opacity: sparkles[i],
            transform: [{ scale: sparkles[i] }],
          }} />
        ))}
        {/* Ikon */}
        <Animated.Image
          source={icon}
          style={[styles.arcIcon, { width: iconWidth, height: iconWidth, transform: [{ scale }] }]}
          resizeMode="contain"
        />
      </View>
      {/* Tekst under ikonet */}
      <Text style={[styles.arcLabel, { width: iconWidth, textAlign: 'center' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();

  return (
    <LinearGradient
      colors={gradients.background}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.2, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <AppHeader navigation={navigation} />

          {/* Portal-blokk med radial-gradient */}
          <View style={styles.portalWrapper}>
            {/* Tekst-seksjon over bildet */}
            <View style={styles.greetingSection}>
              <View style={styles.greetingRow}>
                <Text style={styles.greeting}>Hei Anne!</Text>
                <SpeakButton />
              </View>
              <Text style={styles.greetingSubtitle}>
                Bli med meg og oppdag rare dyr fra hele verden. Hvor vil du utforske først?
              </Text>
            </View>

            {/* Bilde med ikoner */}
            <View style={styles.portalImageBox}>
              <Image
                source={require("../../assets/homescreen_silva_pointing.png")}
                style={[styles.portalImage, { height: width * 1.1 }]}
                resizeMode="cover"
              />
              <View style={styles.categoryArc}>
                <GlitterIcon icon={require("../../assets/ikoner/luft_ikonet_fylt.png")} label="Luft" tab="LuftTab"                  iconWidth={width * 0.27} navigation={navigation} />
                <GlitterIcon icon={require("../../assets/ikoner/land_ikonet_fylt.png")} label="Land" tab="SkogTab" elevated          iconWidth={width * 0.27} navigation={navigation} />
                <GlitterIcon icon={require("../../assets/ikoner/vann_ikonet_fylt.png")} label="Vann" tab="VannTab"                  iconWidth={width * 0.27} navigation={navigation} />
              </View>
            </View>
          </View>

          {/* Spill og Moro */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spill og moro</Text>
            <View style={styles.gameRow}>
              {[
                {
                  src: require("../../assets/animalquiz.png"),
                  label: "Dyrequiz",
                },
                {
                  src: require("../../assets/dyrespor.png"),
                  label: "Finn sporene",
                },
              ].map(({ src, label }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.gameCard}
                  onPress={() => navigation.navigate("Spill")}
                >
                  <Image
                    source={src}
                    style={styles.gameCardImg}
                    resizeMode="contain"
                  />
                  <View style={styles.gameCardOverlay}>
                    <Text style={styles.gameCardLabel}>{label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Min Oppdagelsesbok */}
          <TouchableOpacity
            style={styles.discoveryWidget}
            onPress={() => navigation.navigate("Oppdagelsesbok")}
            activeOpacity={0.85}
          >
            <Image
              source={require("../../assets/oppdagelsesbok.png")}
              style={styles.silvaMini}
              resizeMode="contain"
            />
            <View style={styles.discoveryCenter}>
              <Text style={styles.discoveryTitle}>Min Oppdagelsesbok</Text>
              <Text style={styles.discoveryCount}>12 av 40 dyr funnet</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "30%" }]} />
              </View>
            </View>
            <Text style={styles.discoveryLink}>Se alle</Text>
          </TouchableOpacity>

          {/* Dagens eventyr */}
          <View style={styles.adventureCard}>
            <View style={styles.adventureHeader}>
              <Text style={styles.adventureTitle}>{todaysAdventure.title}</Text>
            </View>
            <Image
              source={require("../../assets/dagns_eventyr.jpg")}
              style={styles.adventureImage}
              resizeMode="cover"
            />
            <Text style={styles.adventureTeaser}>{todaysAdventure.teaser}</Text>
          </View>

          {/* Dagens dyr — fremhevet */}
          <TouchableOpacity
            style={styles.featuredCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("DyrDetalj", { animalId: 1 })}
          >
            <View style={styles.featuredImageBox}>
              <Image
                source={require("../../assets/frosk.png")}
                style={styles.featuredImg}
                resizeMode="contain"
              />
              <View style={styles.dagensTag}>
                <Text style={styles.dagensTagText}>DAGENS TEMA</Text>
              </View>
            </View>
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredName}>GLASSFROSKEN</Text>
              <Text style={styles.featuredSubtitle}>
                Møt denne gjennomsiktige krabaten
              </Text>
              <View style={styles.featuredFooter}>
                <View style={styles.locationChip}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.locationText}>Afrika & Asia</Text>
                </View>
                <TouchableOpacity style={styles.utforskButton}>
                  <Text style={styles.utforskText}>Utforsk</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient:  { flex: 1 },
  safeArea:  { flex: 1 },
  scroll:    { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  menuButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  menuButtonText: {
    fontSize: rf(26),
    color: colors.cream,
    lineHeight: rf(28),
  },

  // Portal
  portalWrapper: {
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    width: '100%',
    backgroundImage: 'radial-gradient(52.74% 52.75% at 48.84% 47.26%, #8E8E3A 0%, #3F3F17 100%)',
    backgroundColor: '#3F3F17',
    paddingBottom: spacing.xl,
  },
  greetingSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingRight: spacing.xl,
  },
  greeting: {
    fontFamily: typography.fonts.logo,
    ...typography.display,
    color: '#E5D8A4',
    textShadow: '0px 2px 8px rgba(0,0,0,0.6)',
    WebkitTextStrokeWidth: '1px',
    WebkitTextStrokeColor: 'rgba(0,0,0,0.3)',
    flex: 1,
  },
  speakBtnOuter: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  speakBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(229,216,164,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakBtnActive: { backgroundColor: 'rgba(229,216,164,0.45)' },
  speakIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#E5D8A4',
  },
  greetingSubtitle: {
    fontFamily: typography.fonts.body,
    ...typography.h3,
    color: colors.cream,
    textAlign: 'left',
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  portalImageBox: {
    width: '100%',
    position: 'relative',
  },
  portalImage: { width: '100%' },

  // Kategori-bue over Silva
  categoryArc: {
    position: 'absolute',
    top: '2%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  arcItem: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  arcItemElevated: {
    marginBottom: spacing.xl,
  },
  arcIcon: {
    aspectRatio: 1,
  },
  arcLabel: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.body,
    color: colors.cream,
    textShadow: '0px 0px 8px rgba(0,0,0,1), 0px 2px 6px rgba(0,0,0,0.9)',
    WebkitTextStrokeWidth: '0.5px',
    WebkitTextStrokeColor: 'rgba(0,0,0,0.6)',
    marginTop: -15,
  },

  // Seksjoner
  section:      { marginBottom: spacing.lg },
  sectionTitle: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h2,
    color: colors.cream,
    marginBottom: spacing.sm,
  },

  // Spill-kort
  gameRow: { flexDirection: 'row', gap: spacing.sm },
  gameCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.surfaceDark,
  },
  gameCardImg: {
    width: '100%',
    height: '100%',
  },
  gameCardOverlay: {
    backgroundColor: 'rgba(0,0,0,0.38)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  gameCardLabel: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.body,
    color: colors.cream,
    textAlign: 'center',
  },

  // Oppdagelsesbok
  discoveryWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  silvaMini:       { width: scale(48), height: scale(48) },
  discoveryCenter: { flex: 1 },
  discoveryTitle:  {
    fontFamily: typography.fonts.bodyBold,
    ...typography.body,
    color: colors.primary,
  },
  discoveryCount: {
    fontFamily: typography.fonts.bodyRegular,
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(63,74,57,0.15)',
    borderRadius: radius.full,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.land.main,
    borderRadius: radius.full,
  },
  discoveryLink: {
    fontFamily: typography.fonts.body,
    ...typography.caption,
    color: colors.teal,
  },

  // Eventyr
  adventureCard: {
    backgroundColor: 'rgba(244,239,230,0.12)',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  adventureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  adventureTitle: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h3,
    color: colors.secondary,
    flex: 1,
  },
  adventureImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  adventureTeaser: {
    fontFamily: typography.fonts.bodyRegular,
    ...typography.body,
    color: colors.cream,
  },

  // Fremhevet dyr
  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  featuredImageBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    backgroundColor: colors.vann.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImg: {
    width: '100%',
    height: '100%',
  },
  dagensTag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  dagensTagText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(11),
    color: colors.primary,
  },
  featuredInfo:     { padding: spacing.md },
  featuredName: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h2,
    color: colors.primary,
    letterSpacing: 1,
  },
  featuredSubtitle: {
    fontFamily: typography.fonts.bodyRegular,
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  locationIcon: { fontSize: rf(12) },
  locationText: {
    fontFamily: typography.fonts.bodyRegular,
    ...typography.caption,
    color: colors.textSecondary,
  },
  utforskButton: {
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  utforskText: {
    fontFamily: typography.fonts.body,
    ...typography.body,
    color: colors.cream,
  },
});
