import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet, useWindowDimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { rf, scale } from '../utils/responsive';
import { getById, CATEGORIES, rarityColor } from '../data/animals';
import AppHeader from '../components/AppHeader';

const RARITY_STARS = {
  ikke_truet:    { stars: 1, label: 'Vanlig' },
  sjelden:       { stars: 2, label: 'Uvanlig' },
  truet:         { stars: 3, label: 'Sjelden' },
  sterkt_truet:  { stars: 4, label: 'Ekstremt sjelden' },
  kritisk_truet: { stars: 5, label: 'Nesten mytisk' },
};

function FactCard({ label, value, icon, full }) {
  return (
    <View style={[styles.factCard, full && styles.factCardFull]}>
      {icon && <Image source={icon} style={styles.factIcon} resizeMode="contain" />}
      <View style={styles.factContent}>
        <Text style={styles.factLabel}>{label}</Text>
        <Text style={styles.factValue}>{value}</Text>
      </View>
    </View>
  );
}

function RarityCard() {
  return null;
}

export default function AnimalDetailScreen({ route, navigation }) {
  const animalId = route?.params?.animalId ?? 1;
  const animal   = getById(animalId);
  const { width } = useWindowDimensions();
  const [speaking, setSpeaking] = useState(false);

  if (!animal) return null;

  const cat = CATEGORIES[animal.category] ?? CATEGORIES.land;

  const handleSpeak = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
    } else {
      const text = `${animal.name}. ${animal.funFact ?? ''} ${animal.moreInfo ?? ''}`.trim();
      setSpeaking(true);
      Speech.speak(text, {
        language: 'nb-NO',
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    }
  };

  const rarityConfig = RARITY_STARS[animal.rarity] ?? { stars: 1, label: 'Ukjent' };

  return (
    <LinearGradient
      colors={cat.gradient}
      locations={cat.gradientLocations ?? undefined}
      start={cat.gradientStart}
      end={cat.gradientEnd}
      style={styles.screen}
    >
      <SafeAreaView style={styles.safeArea}>
        <AppHeader navigation={navigation} logo={cat.logo} />

        {/* NAV-BAR */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>{animal.name}</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* PANEL */}
        <View style={styles.panel}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* BILDE MED NAVN-OVERLAY */}
            <View style={[styles.imageBox, { height: width * 0.72 }]}>
              {animal.image
                ? <Image source={animal.image} style={styles.fillImage} resizeMode="cover" />
                : <View style={[styles.imagePlaceholder, { backgroundColor: cat.color + '44' }]}>
                    <Text style={{ fontSize: rf(80) }}>{animal.emoji}</Text>
                  </View>
              }
              {/* Gradient over bilde for lesbarhet */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.65)']}
                style={styles.imageOverlay}
              />
              {/* Navn og tags på bildet */}
              <View style={styles.imageInfo}>
                <Text style={styles.imageName}>{animal.name}</Text>
                <View style={styles.imageTags}>
                  <View style={[styles.imageTag, { backgroundColor: rarityColor(animal.rarity) }]}>
                    <Text style={styles.imageTagText}>{animal.rarityText}</Text>
                  </View>
                  <View style={[styles.imageTag, { backgroundColor: 'rgba(244,239,230,0.2)' }]}>
                    <Text style={styles.imageTagText}>{animal.animalType}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* KNAPPER */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.btn, styles.btnFakta, speaking && styles.btnActive]} onPress={handleSpeak} activeOpacity={0.8}>
                <Image source={require('../../assets/ikoner/lyd_symbol.png')} style={[styles.btnIcon, { tintColor: '#29332A' }]} resizeMode="contain" />
                <Text style={styles.btnFaktaText}>HØR FAKTA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnVideo]}
                onPress={() => animal.video && navigation.navigate('Video', { animalId: animal.id })}
                activeOpacity={0.8}
              >
                <Image source={require('../../assets/ikoner/play_symbol.png')} style={[styles.btnIcon, { tintColor: '#FAF9F5' }]} resizeMode="contain" />
                <Text style={styles.btnVideoText}>SE VIDEO</Text>
              </TouchableOpacity>
            </View>

            {/* FAKTAGRID — 2 kolonner */}
            <View style={styles.factGrid}>
              <View style={styles.factRow}>
                <FactCard label="Størrelse"       value={animal.size}     icon={require('../../assets/ikoner/storrelse.png')} />
                <FactCard label="Vekt"            value={animal.weight}   icon={require('../../assets/ikoner/vekt.png')} />
              </View>
              <View style={styles.factRow}>
                <FactCard label="Hvor lever den?" value={animal.location} icon={require('../../assets/ikoner/levested.png')} />
                <FactCard label="Hva spiser den?" value={animal.diet}     icon={require('../../assets/ikoner/spiser.png')} />
              </View>
              <View style={styles.factRow}>
                <FactCard label="Sporene"         value={animal.tracks}   icon={require('../../assets/ikoner/spor.png')} />
                <View style={styles.factCard}>
                  <Image source={require('../../assets/ikoner/skjelden.png')} style={styles.factIcon} resizeMode="contain" />
                  <View style={styles.factContent}>
                    <Text style={styles.factLabel}>Sjeldenthet</Text>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      {[1,2,3,4,5].map(i => (
                        <Text key={i} style={{ color: i <= rarityConfig.stars ? '#E5A800' : '#D0CCC4', fontSize: rf(12) }}>★</Text>
                      ))}
                    </View>
                    <Text style={[styles.factValue, { fontSize: rf(11) }]}>{rarityConfig.label}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.factRow}>
                <FactCard label="Dag eller natt?" value={animal.activeTime} icon={require('../../assets/ikoner/dag_eller_natt.png')} />
              </View>
              <View style={styles.factRow}>
                <FactCard
                  label="Som kjæledyr"
                  value={`${animal.petScore}/10 — ${animal.petComment}`}
                  icon={require('../../assets/ikoner/kjeledyr.png')}
                />
              </View>
            </View>

            {/* VISSTE DU? */}
            <View style={styles.funFactCard}>
              <Image source={require('../../assets/ikoner/visste_du.png')} style={styles.funFactIcon} resizeMode="contain" />
              <View style={{ flex: 1 }}>
                <Text style={styles.funFactTitle}>Visste du?</Text>
                <Text style={styles.funFactText}>{animal.funFact}</Text>
              </View>
              {animal.image && (
                <Image source={animal.image} style={styles.funFactImg} resizeMode="contain" />
              )}
            </View>

            {/* MER INFO */}
            {animal.moreInfo && (
              <Text style={styles.moreInfoText}>{animal.moreInfo}</Text>
            )}

            {/* SE OGSÅ */}
            {animal.related?.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={styles.relatedTitle}>Se også</Text>
                {animal.related.map(id => {
                  const rel = getById(id);
                  if (!rel) return null;
                  return (
                    <TouchableOpacity
                      key={id}
                      style={styles.relatedCard}
                      onPress={() => navigation.push('DyrDetalj', { animalId: id })}
                      activeOpacity={0.8}
                    >
                      {rel.image
                        ? <Image source={rel.image} style={styles.relatedImg} resizeMode="cover" />
                        : <View style={[styles.relatedImg, { backgroundColor: '#C8D4F5', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ fontSize: rf(32) }}>{rel.emoji}</Text>
                          </View>
                      }
                      <View style={styles.relatedInfo}>
                        <Text style={styles.relatedName}>{rel.name}</Text>
                        <Text style={styles.relatedFact} numberOfLines={2}>{rel.funFact}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* GALLERI */}
            {animal.subImages?.length > 0 && (
              <View style={styles.gallerySection}>
                <Text style={styles.sectionTitle}>Bildegalleri</Text>
                <View style={styles.galleryRow}>
                  {animal.subImages.map((img, i) => (
                    <View key={i} style={styles.galleryCard}>
                      <Image source={img} style={styles.galleryImg} resizeMode="cover" />
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: spacing.xxl * 3 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1 },
  safeArea: { flex: 1 },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4EFE6',
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  backBtn: { justifyContent: 'center', alignItems: 'center' },
  backArrow: {
    fontSize: rf(32),
    color: '#29332A',
    lineHeight: rf(36),
  },
  navTitle: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(20),
    color: '#004D56',
  },

  panel: {
    flex: 1,
    backgroundColor: '#F4EFE6',
    overflow: 'hidden',
  },
  scroll: { paddingBottom: spacing.xxl },

  // ── BILDE ───────────────────────────────────────────────────────────
  imageBox: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#1a2e1a',
  },
  fillImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  imageInfo: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
  },
  imageName: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(28),
    color: '#F4EFE6',
    marginBottom: spacing.xs,
  },
  imageTags: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  imageTagText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(12),
    color: '#F4EFE6',
  },

  // ── KNAPPER ─────────────────────────────────────────────────────────
  buttonRow: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  btn: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
  },
  btnIcon: { width: scale(22), height: scale(22) },
  btnFakta: {
    backgroundColor: '#E5D8A4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  btnActive: { backgroundColor: '#C9C090' },
  btnFaktaText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(18),
    color: '#29332A',
    letterSpacing: 0.5,
  },
  btnVideo: {
    backgroundColor: '#004D56',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  btnVideoText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(18),
    color: '#FAF9F5',
    letterSpacing: 0.5,
  },

  // ── FAKTAGRID ───────────────────────────────────────────────────────
  factGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  factRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  factCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  factCardFull: {
    flex: 0,
    alignSelf: 'stretch',
  },
  factIconBox: {
    width: scale(70),
    height: scale(70),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  factIconDot: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  factIcon: { width: scale(56), height: scale(56) },
  factContent: { flex: 1 },
  factLabel: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(12),
    color: '#29332A',
    marginBottom: 3,
  },
  factValue: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(12),
    color: '#766E66',
    lineHeight: rf(18),
  },

  // ── VISSTE DU? ──────────────────────────────────────────────────────
  funFactCard: {
    backgroundColor: '#29676A',
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  funFactTitle: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(16),
    color: '#F4EFE6',
    marginBottom: 6,
  },
  funFactText: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(13),
    color: '#F4EFE6',
    lineHeight: rf(20),
    flex: 1,
  },
  funFactImg: {
    width: scale(90),
    height: scale(90),
  },
  funFactIcon: {
    width: scale(56),
    height: scale(56),
    alignSelf: 'flex-start',
  },

  // ── MER INFO ────────────────────────────────────────────────────────
  moreInfoText: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(14),
    color: '#29332A',
    lineHeight: rf(22),
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },

  // ── SE OGSÅ ─────────────────────────────────────────────────────────
  relatedSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  relatedTitle: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(15),
    color: '#29332A',
    marginBottom: spacing.sm,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedImg: {
    width: scale(80),
    height: scale(80),
  },
  relatedInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  relatedName: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(14),
    color: '#29332A',
    marginBottom: 4,
  },
  relatedFact: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(12),
    color: '#766E66',
    lineHeight: rf(18),
  },

  // ── GALLERI ─────────────────────────────────────────────────────────
  gallerySection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(15),
    color: '#29332A',
    marginBottom: spacing.sm,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  galleryCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },
});
