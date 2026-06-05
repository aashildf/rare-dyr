import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors, spacing, radius, typography } from '../theme';
import { rf, scale } from '../utils/responsive';
import { getById, getByCategory, CATEGORIES, rarityColor } from '../data/animals';
import AppHeader from '../components/AppHeader';

// ─── Hjelpefunksjoner ────────────────────────────────────────────────────────

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function definitForm(word) {
  if (!word) return '';
  if (word.endsWith('dyr'))  return word + 'et';
  if (word.endsWith('fisk')) return word + 'en';
  if (word.endsWith('fugl')) return word + 'en';
  if (word.endsWith('ie'))   return word.slice(0, -1) + 'en';
  return word + 'en';
}

// ─── Relaterte dyr-kort ──────────────────────────────────────────────────────

function RelatedCard({ animal, navigation, half }) {
  return (
    <TouchableOpacity
      style={[styles.relCard, { width: half }]}
      onPress={() => navigation.navigate('DyrDetalj', { animalId: animal.id })}
      activeOpacity={0.85}
    >
      {animal.image
        ? <Image source={animal.image} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        : <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#1a2e1a', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: rf(32) }}>{animal.emoji}</Text>
          </View>
      }
      <View style={styles.relCardOverlay}>
        <Text style={styles.relCardName} numberOfLines={2}>{animal.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Hovedskjerm ─────────────────────────────────────────────────────────────

export default function VideoScreen({ route, navigation }) {
  const animalId = route?.params?.animalId ?? route?.params?.animal?.id ?? 1;
  const animal   = getById(animalId);
  const { width } = useWindowDimensions();
  const cat = CATEGORIES[animal?.category ?? 'land'] ?? CATEGORIES.land;

  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const timerRef = useRef(null);

  const player = useVideoPlayer(
    animal?.video ?? null,
    p => { p.loop = false; p.muted = false; }
  );

  useEffect(() => {
    const sub = player.addListener('playingChange', e => setIsPlaying(e.isPlaying));
    return () => sub.remove();
  }, []);

  // Poller currentTime hvert sekund
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (player.duration > 0) {
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
        setProgress(player.currentTime / player.duration);
      }
    }, 500);
    return () => clearInterval(timerRef.current);
  }, []);

  const togglePlay = () => isPlaying ? player.pause() : player.play();

  const videoH   = width * 0.56;
  const halfCard = (width - 6 * 2 - 24 * 2 - spacing.sm) / 2;

  // Relaterte dyr (samme kategori, ikke seg selv)
  const related = getByCategory(animal?.category ?? 'land')
    .filter(a => a.id !== animalId)
    .slice(0, 4);

  if (!animal) return null;

  // Tags fra dyredata
  const tags = [animal.location, animal.diet, animal.activeTime].filter(Boolean);

  return (
    <LinearGradient
      colors={cat.gradient}
      locations={cat.gradientLocations ?? undefined}
      start={cat.gradientStart}
      end={cat.gradientEnd}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <AppHeader navigation={navigation} />

        {/* Navfelt — X + dyrenavn */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>{animal.name}</Text>
          <View style={{ width: scale(32) }} />
        </View>

        {/* Panel */}
        <View style={[styles.panel, { backgroundColor: cat.panelColor, marginHorizontal: 6 }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* Videospiller */}
            <View style={[styles.videoBox, { height: videoH }]}>
              {animal.video
                ? <VideoView player={player} style={StyleSheet.absoluteFillObject} contentFit="cover" nativeControls={false} />
                : (
                  <View style={styles.videoPlaceholder}>
                    {animal.image
                      ? <Image source={animal.image} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                      : <Text style={{ fontSize: rf(64) }}>{animal.emoji}</Text>
                    }
                  </View>
                )
              }

              {/* Play/pause overlay */}
              <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </TouchableOpacity>

              {/* Progressbar */}
              <View style={styles.progressArea}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  <Image
                    source={cat.silva}
                    style={[styles.progressThumb, { left: `${progress * 100}%` }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Tittel */}
            <Text style={[styles.videoTitle, { color: cat.textColor }]}>
              Møt {definitForm(animal.animalType)}{'\n'}{animal.name}
            </Text>

            {/* Beskrivelse */}
            {animal.moreInfo && (
              <Text style={[styles.description, { color: cat.textColor }]}>{animal.moreInfo}</Text>
            )}

            {/* Tags + hjerte */}
            <View style={styles.tagsRow}>
              <View style={styles.tags}>
                {tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText} numberOfLines={1}>{tag}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity>
                <Text style={styles.heart}>♡</Text>
              </TouchableOpacity>
            </View>

            {/* LAGRE-knapp */}
            <TouchableOpacity style={styles.lagreBtn}>
              <Image source={require('../../assets/ikoner/lyd_symbol.png')} style={styles.lagreIcon} resizeMode="contain" />
              <Text style={styles.lagreTxt}>LAGRE</Text>
            </TouchableOpacity>

            {/* Utforsk flere dyr */}
            {related.length > 0 && (
              <View style={styles.relSection}>
                <Text style={[styles.relTitle, { color: cat.textColor }]}>Utforsk flere dyr</Text>
                <View style={styles.relGrid}>
                  {related.map(a => (
                    <RelatedCard key={a.id} animal={a} navigation={navigation} half={halfCard} />
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: spacing.xxl }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  panel:    { flex: 1, overflow: 'hidden' },

  // Nav
  navBar: {
    backgroundColor: '#F4EFE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 20,
    marginHorizontal: 6,
  },
  closeBtn:  { padding: spacing.xs },
  closeText: { fontSize: rf(18), color: '#004D56', fontWeight: '600' },
  navTitle:  {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
    color: '#004D56',
    flex: 1,
    textAlign: 'right',
  },

  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: spacing.xxl },

  // Video
  videoBox: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: spacing.lg,
    justifyContent: 'flex-end',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a2e1a',
  },
  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#004D56',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: { fontSize: rf(22), color: '#fff', marginLeft: 3 },

  progressArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  timeText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: rf(11),
    color: '#fff',
    minWidth: 32,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E5D8A4',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -8,
    marginLeft: -10,
    width: 20,
    height: 20,
  },

  // Tittel og tekst
  videoTitle: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 28,
    lineHeight: 36,
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: rf(14),
    lineHeight: rf(22),
    marginBottom: spacing.lg,
    opacity: 0.9,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, flex: 1 },
  tag: {
    height: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(130, 160, 150, 0.25)',
    justifyContent: 'center',
  },
  tagText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: rf(12),
    color: '#005138',
  },
  heart: { fontSize: rf(28), color: colors.primary, opacity: 0.4 },

  // Lagre-knapp
  lagreBtn: {
    flexDirection: 'row',
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FAF9F5',
    backgroundColor: '#004D56',
    marginBottom: spacing.xl,
  },
  lagreIcon: { width: scale(22), height: scale(22), tintColor: '#fff' },
  lagreTxt: {
    fontFamily: 'Quicksand_700Bold',
    ...typography.h3,
    color: '#fff',
    letterSpacing: 1,
  },

  // Relaterte dyr
  relSection: { gap: spacing.md },
  relTitle: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: rf(20),
    marginBottom: spacing.xs,
  },
  relGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relCard: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#1a2e1a',
  },
  relCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  relCardName: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: rf(12),
    color: '#fff',
  },
});
