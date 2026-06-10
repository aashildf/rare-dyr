import React, { useRef, useEffect, useState } from 'react';
import {
  View, Image, TouchableOpacity, StyleSheet,
  Animated, Text, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EGG_SPARKLES = [
  { dx: -55, dy: -60, size: 8,  color: '#E5D8A4', delay: 0,   period: 1100 },
  { dx:  60, dy: -45, size: 6,  color: '#ffffff', delay: 220, period: 900  },
  { dx:  65, dy:  30, size: 7,  color: '#C1D47F', delay: 450, period: 1300 },
  { dx: -50, dy:  50, size: 6,  color: '#E5D8A4', delay: 180, period: 800  },
  { dx:  20, dy: -75, size: 5,  color: '#ffffff', delay: 380, period: 1050 },
  { dx: -70, dy:  10, size: 7,  color: '#E5D8A4', delay: 600, period: 950  },
  { dx:  40, dy:  65, size: 5,  color: '#C1D47F', delay: 300, period: 1200 },
  { dx: -30, dy: -80, size: 6,  color: '#ffffff', delay: 500, period: 850  },
];

function EggSparkles() {
  const { width, height } = useWindowDimensions();
  const anims = useRef(EGG_SPARKLES.map(() => new Animated.Value(0))).current;

  // Egget er ca. midt på skjermen, litt under midten
  const cx = width  * 0.50;
  const cy = height * 0.58;

  useEffect(() => {
    const loops = anims.map((anim, i) => {
      const s = EGG_SPARKLES[i];
      return Animated.loop(Animated.sequence([
        Animated.delay(s.delay),
        Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 350, useNativeDriver: false }),
        Animated.delay(s.period - 570),
      ]));
    });
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  return (
    <>
      {EGG_SPARKLES.map((s, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: cx + s.dx - s.size / 2,
            top:  cy + s.dy - s.size / 2,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: s.color,
            opacity: anims[i],
            transform: [{ scale: anims[i] }],
          }}
        />
      ))}
    </>
  );
}
import { useVideoPlayer, VideoView } from 'expo-video';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '../theme';
import { scale, rf } from '../utils/responsive';
import AppHeader from '../components/AppHeader';
import TabBar from '../components/TabBar';

const ICON_SOURCES = [
  { label: 'Luft', icon: require('../../assets/ikoner/luft_ikonet_fylt.png'), category: 'luft', tabIndex: 1, xPct: 0.15, yPct: 0.28 },
  { label: 'Land', icon: require('../../assets/ikoner/land_ikonet_fylt.png'), category: 'land', tabIndex: 2, xPct: 0.50, yPct: 0.18 },
  { label: 'Vann', icon: require('../../assets/ikoner/vann_ikonet_fylt.png'), category: 'vann', tabIndex: 3, xPct: 0.85, yPct: 0.28 },
];

export default function IntroScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const iconSize = Math.round(width * 0.22); // ~22% av skjermbredden
  const [phase, setPhase] = useState('paused');
  const audioPlayer = useAudioPlayer(require('../../assets/audio/silva_intro.m4a'));

  useEffect(() => {
    setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => { audioPlayer.remove(); };
  }, []);

  const stopSound = () => { try { audioPlayer.pause(); audioPlayer.seekTo(0); } catch (_) {} };

  // Egg-peker-animasjoner
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.8)).current;
  const bounceAnim   = useRef(new Animated.Value(0)).current;

  // Per-ikon: opacity, scale, glow
  const opacity0 = useRef(new Animated.Value(0)).current;
  const scale0   = useRef(new Animated.Value(0.2)).current;
  const opacity1 = useRef(new Animated.Value(0)).current;
  const scale1   = useRef(new Animated.Value(0.2)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const scale2   = useRef(new Animated.Value(0.2)).current;

  // Individuelle puls — ulike hastigheter = ikke synkronisert
  const pulse0 = useRef(new Animated.Value(1)).current;
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;

  const iconAnims = [
    { opacity: opacity0, scale: scale0, pulse: pulse0 },
    { opacity: opacity1, scale: scale1, pulse: pulse1 },
    { opacity: opacity2, scale: scale2, pulse: pulse2 },
  ];

  // Egg-animasjoner
  useEffect(() => {
    const p = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.6, duration: 900, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 1,   duration: 900, useNativeDriver: false }),
    ]));
    const o = Animated.loop(Animated.sequence([
      Animated.timing(pulseOpacity, { toValue: 0,   duration: 900, useNativeDriver: false }),
      Animated.timing(pulseOpacity, { toValue: 0.8, duration: 900, useNativeDriver: false }),
    ]));
    const b = Animated.loop(Animated.sequence([
      Animated.timing(bounceAnim, { toValue: -12, duration: 500, useNativeDriver: false }),
      Animated.timing(bounceAnim, { toValue: 0,   duration: 500, useNativeDriver: false }),
    ]));
    p.start(); o.start(); b.start();
    return () => { p.stop(); o.stop(); b.stop(); };
  }, []);

  function appearIcon(anim) {
    return Animated.parallel([
      Animated.timing(anim.opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.spring(anim.scale, { toValue: 1, tension: 90, friction: 6, useNativeDriver: false }),
    ]);
  }

  function startPulse(anim, period) {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1.07, duration: period,     useNativeDriver: false }),
      Animated.timing(anim, { toValue: 1,    duration: period,     useNativeDriver: false }),
    ])).start();
  }

  function startChooseAnimation() {
    Animated.sequence([
      Animated.delay(150),
      appearIcon(iconAnims[0]),
      Animated.delay(130),
      appearIcon(iconAnims[1]),
      Animated.delay(130),
      appearIcon(iconAnims[2]),
    ]).start(() => {
      // Individuelle pulser — forskjellig tempo
      startPulse(pulse0, 900);
      startPulse(pulse1, 1150);
      startPulse(pulse2, 750);
    });
  }

  // Video
  const player = useVideoPlayer(
    require('../../assets/videoer/introvideo.mp4'),
    (p) => { p.loop = false; p.muted = true; p.rate = 0.3; p.pause(); }
  );

  useEffect(() => {
    const sub = player.addListener('playToEnd', () => {
      stopSound();
      setPhase('choose');
      startChooseAnimation();
    });
    return () => sub.remove();
  }, []);

  const handleTap = () => {
    if (phase !== 'paused') return;
    setPhase('playing');
    player.play();
    setTimeout(() => { audioPlayer.play(); }, 1400);
  };

  const handleCategoryPress = (tabIndex) => {
    navigation.reset({
      index: 0,
      routes: [{
        name: 'Main',
        state: {
          index: tabIndex,
          routes: [
            { name: 'HjemTab' },
            { name: 'LuftTab' },
            { name: 'SkogTab' },
            { name: 'VannTab' },
          ],
        },
      }],
    });
  };

  // ─── Alltid VideoView — aldri bytt komponent ──────────────────
  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />

      {/* Topp-scrim — fader fra mørk til gjennomsiktig */}
      <LinearGradient
        colors={['rgba(20,35,25,0.85)', 'rgba(20,35,25,0.4)', 'rgba(20,35,25,0)']}
        style={styles.scrimTop}
        pointerEvents="none"
      />

      {/* Bunn-scrim */}
      <LinearGradient
        colors={['rgba(20,35,25,0)', 'rgba(20,35,25,0.4)', 'rgba(20,35,25,0.85)']}
        style={styles.scrimBottom}
        pointerEvents="none"
      />

      <View style={[styles.headerArea, { top: insets.top }]}>
        <AppHeader navigation={navigation} />
      </View>

      {/* Tap-overlay — synlig når pauset */}
      {phase === 'paused' && (
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleTap}>
          <EggSparkles />
          <View style={styles.pointerWrapper}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }], opacity: pulseOpacity }]} />
            <Text style={styles.tapText}>Trykk på egget!</Text>
            <Animated.Text style={[styles.handIcon, { transform: [{ translateY: bounceAnim }] }]}>👇</Animated.Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Hopp over — bare under avspilling */}
      {phase === 'playing' && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => { stopSound(); navigation.replace('Main'); }}
        >
          <Text style={styles.skipText}>Hopp over</Text>
        </TouchableOpacity>
      )}

      <TabBar navigation={navigation} activeTab="HjemTab" />

      {/* Kategori-ikoner i bue */}
      {ICON_SOURCES.map((item, i) => {
        const anim = iconAnims[i];
        const left = width * item.xPct - iconSize / 2;
        const top  = height * item.yPct;
        return (
          <Animated.View
            key={item.category}
            style={[
              styles.iconWrapper,
              {
                left,
                top,
                opacity: anim.opacity,
                transform: [{ scale: Animated.multiply(anim.scale, anim.pulse) }],
              },
            ]}
          >
            {/* Sparkles — vises når alle er synlige */}
            <SparkleRing iconSize={iconSize} visible={phase === 'choose'} />

            <TouchableOpacity
              onPress={() => handleCategoryPress(item.tabIndex)}
              activeOpacity={0.75}
              disabled={phase !== 'choose'}
            >
              <Image source={item.icon} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
              <Text style={styles.iconLabel}>{item.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

// Sparkle-partikkel rundt hvert ikon
const SPARKLE_DEFS = [
  { dx: -32, dy: -36, size: 7,  delay: 0,   period: 1100 },
  { dx:  36, dy: -28, size: 5,  delay: 280, period: 900  },
  { dx:  38, dy:  22, size: 6,  delay: 500, period: 1300 },
  { dx: -28, dy:  32, size: 4,  delay: 180, period: 800  },
  { dx:  14, dy: -46, size: 4,  delay: 400, period: 1050 },
  { dx: -44, dy:  6,  size: 5,  delay: 650, period: 950  },
];

function SparkleRing({ iconSize, visible }) {
  const anims = useRef(SPARKLE_DEFS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!visible) return;
    const loops = anims.map((anim, i) => {
      const def = SPARKLE_DEFS[i];
      return Animated.loop(Animated.sequence([
        Animated.delay(def.delay),
        Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: false }),
        Animated.delay(def.period - 500),
      ]));
    });
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [visible]);

  if (!visible) return null;
  const cx = iconSize / 2;
  const cy = iconSize / 2;
  return (
    <>
      {SPARKLE_DEFS.map((def, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: cx + def.dx - def.size / 2,
            top:  cy + def.dy - def.size / 2,
            width: def.size,
            height: def.size,
            borderRadius: def.size / 2,
            backgroundColor: i % 2 === 0 ? '#E5D8A4' : '#ffffff',
            opacity: anims[i],
            transform: [{ scale: anims[i] }],
          }}
        />
      ))}
    </>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  scrimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '28%',
    zIndex: 5,
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '22%',
    zIndex: 5,
  },

  video: { flex: 1 },

  headerArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },

  // Egg-peker
  pointerWrapper: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: scale(8),
  },
  pulseRing: {
    position: 'absolute',
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    borderWidth: 3,
    borderColor: colors.secondary,
    backgroundColor: 'rgba(229,216,164,0.2)',
  },
  handIcon: { fontSize: rf(44) },
  tapText: {
    fontFamily: 'Quicksand_700Bold',
    ...typography.h3,
    color: colors.secondary,
    textShadow: '0px 2px 4px rgba(0,0,0,0.6)',
    marginTop: scale(8),
  },

  // Hopp over
  skipButton: {
    position: 'absolute',
    bottom: '14%',
    right: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    zIndex: 20,
  },
  skipText: {
    fontFamily: 'Quicksand_600SemiBold',
    ...typography.body,
    color: colors.cream,
  },

  // Kategori-ikoner (størrelse settes dynamisk i render)
  iconWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
  },
  iconLabel: {
    fontFamily: 'Quicksand_700Bold',
    ...typography.h3,
    color: '#eed15d',
    textAlign: 'center',
    marginTop: scale(4),
    textShadow: '0px 0px 10px rgba(0,0,0,1), 0px 2px 8px rgba(0,0,0,1)',
    WebkitTextStrokeWidth: '0.2px',
    WebkitTextStrokeColor: 'rgba(0,0,0,0.8)',
  },
});
