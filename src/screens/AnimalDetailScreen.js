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

function parseSizeLevel(str = '') {
  const nums = (str.match(/\d+/g) || []).map(Number);
  if (!nums.length) return 3;
  const max = Math.max(...nums);
  const inM = /\d\s*m(?!g|m)/i.test(str);
  const cm  = inM ? max * 100 : max;
  if (cm < 15)  return 1;
  if (cm < 50)  return 2;
  if (cm < 150) return 3;
  if (cm < 300) return 4;
  return 5;
}

function parseWeightLevel(str = '') {
  const nums = (str.match(/\d+/g) || []).map(Number);
  if (!nums.length) return 3;
  const max = Math.max(...nums);
  const g = /tonn/i.test(str) ? max * 1e6 : /kg/i.test(str) ? max * 1000 : max;
  if (g < 200)    return 1;
  if (g < 2000)   return 2;
  if (g < 20000)  return 3;
  if (g < 200000) return 4;
  return 5;
}

function LevelDots({ level, color = '#29676A' }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4, marginTop: 4, marginBottom: 2 }}>
      {[1,2,3,4,5].map(i => (
        <View key={i} style={{
          width: 7, height: 7, borderRadius: 4,
          backgroundColor: i <= level ? color : '#D0CCC4',
        }} />
      ))}
    </View>
  );
}

function FactCard({ label, value, icon, full, level, levelColor, color }) {
  return (
    <View style={[styles.factCard, full && styles.factCardFull, color && { backgroundColor: color }]}>
      {icon && (
        <View style={styles.factIconBox}>
          <Image source={icon} style={styles.factIcon} resizeMode="contain" />
        </View>
      )}
      <View style={styles.factContent}>
        <Text style={styles.factLabel}>{label}</Text>
        {level !== undefined && <LevelDots level={level} color={levelColor ?? '#29676A'} />}
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

  const PANEL_COLORS = { land: '#3F4A39', vann: '#004D56', luft: '#DEE0E4' };
  const panelBg = PANEL_COLORS[animal.category] ?? cat.panelColor;

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

        {/* YTRE PANEL — kategorifargen, smal, avrundet */}
        <View style={[styles.outerPanel, { backgroundColor: panelBg }]}>

          {/* NAV-BAR inni ytre panel */}
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.backArrow, { color: cat.textColor }]}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.navTitle, { color: cat.textColor }]}>{animal.name}</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* INNHOLDSFLATEN */}
          <ScrollView
            style={[styles.panel, { backgroundColor: cat.color }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            nestedScrollEnabled={true}
          >

            {/* BILDE MED NAVN-OVERLAY */}
            <View style={[styles.imageBox, { height: width * 0.72, marginTop: spacing.xl, marginHorizontal: spacing.lg }]}>
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
                onPress={() => navigation.navigate('Video', { animalId: animal.id })}
                activeOpacity={0.8}
              >
                <Image source={require('../../assets/ikoner/play_symbol.png')} style={[styles.btnIcon, { tintColor: '#FAF9F5' }]} resizeMode="contain" />
                <Text style={styles.btnVideoText}>SE VIDEO</Text>
              </TouchableOpacity>
            </View>

            {/* FAKTAGRID — 2 kolonner */}
            <View style={styles.factGrid}>
              <View style={styles.factRow}>
                <FactCard label="Størrelse" value={animal.size}   icon={require('../../assets/ikoner/storrelse.png')} level={parseSizeLevel(animal.size)}   levelColor="#798447" />
                <FactCard label="Vekt"      value={animal.weight} icon={require('../../assets/ikoner/vekt.png')}      level={parseWeightLevel(animal.weight)} levelColor="#798447" />
              </View>
              <View style={styles.factRow}>
                <FactCard label="Hvor lever den?" value={animal.location} icon={require('../../assets/ikoner/levested.png')} />
                <FactCard label="Hva spiser den?" value={animal.diet}     icon={require('../../assets/ikoner/spiser.png')} />
              </View>
              <View style={styles.factRow}>
                <FactCard label="Sporene" value={animal.tracks} icon={require('../../assets/ikoner/spor.png')} />
                {/* Dag eller natt */}
                {(() => {
                  const t    = (animal.activeTime ?? '').toLowerCase();
                  const dag  = t.includes('dag')  || t.includes('begge');
                  const natt = t.includes('natt') || t.includes('begge');
                  return (
                    <View style={[styles.factCard, { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={styles.factLabel}>Dag eller natt?</Text>
                      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: 8 }}>
                        {dag && <Image source={require('../../assets/ikoner/dag.png')} style={{ width: scale(54), height: scale(54) }} resizeMode="contain" />}
                        {natt && <Image source={require('../../assets/ikoner/natt.png')} style={{ width: scale(54), height: scale(54) }} resizeMode="contain" />}
                      </View>
                    </View>
                  );
                })()}
              </View>
              <View style={styles.factRow}>
                {/* Sjeldenthet — full bredde */}
                <View style={[styles.factCard, { backgroundColor: '#FDF5D7' }]}>
                  <Image source={require('../../assets/ikoner/skjelden.png')} style={styles.factIcon} resizeMode="contain" />
                  <View style={styles.factContent}>
                    <Text style={styles.factLabel}>Sjeldenthet</Text>
                    <View style={{ flexDirection: 'row', gap: 4, marginTop: 6, marginBottom: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <Text key={i} style={{ color: i <= rarityConfig.stars ? '#E5A800' : '#D0CCC4', fontSize: rf(22) }}>★</Text>
                      ))}
                    </View>
                    <Text style={styles.factValue}>{rarityConfig.label}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.factRow}>
                {/* Som kjæledyr */}
                <View style={[styles.factCard, { backgroundColor: '#E9F9F3' }]}>
                  <Image source={require('../../assets/ikoner/kjaeledyr.png')} style={styles.factIcon} resizeMode="contain" />
                  <View style={styles.factContent}>
                    <Text style={styles.factLabel}>Som kjæledyr</Text>
                    <View style={{ flexDirection: 'row', gap: 4, marginTop: 6, marginBottom: 2 }}>
                      {[1,2,3,4,5,6].map(i => (
                        <Image
                          key={i}
                          source={require('../../assets/ikoner/kjeledyr.png')}
                          style={{ width: scale(22), height: scale(22), opacity: i <= animal.petScore ? 1 : 0.15 }}
                          resizeMode="contain"
                        />
                      ))}
                    </View>
                    <Text style={styles.factValue}>{animal.petComment}</Text>
                  </View>
                </View>
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
              <Text style={[styles.moreInfoText, { color: cat.textColor }]}>{animal.moreInfo}</Text>
            )}

            {/* NOEL Å UNDRE SEG OVER */}
            {animal.wonderQuestion && (
              <View style={styles.wonderCard}>
                <Text style={styles.wonderTitle}>🌟 Noe å undre seg over</Text>
                <Text style={styles.wonderText}>{animal.wonderQuestion}</Text>
              </View>
            )}

            {/* SE OGSÅ */}
            {animal.related?.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={[styles.relatedTitle, { color: cat.textColor }]}>Se også</Text>
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
                  {(animal.subImages.length > 2 ? animal.subImages.slice(0, -1) : animal.subImages).map((img, i) => (
                    <View key={i} style={styles.galleryCardShadow}>
                      <View style={styles.galleryCard}>
                        <Image source={img} style={styles.galleryImg} resizeMode="cover" />
                      </View>
                    </View>
                  ))}
                </View>
                {animal.subImages.length > 2 && (
                  <View style={[styles.galleryCardShadow, { marginTop: spacing.sm }]}>
                    <View style={[styles.galleryCard, { aspectRatio: 16 / 9 }]}>
                      <Image source={animal.subImages[animal.subImages.length - 1]} style={styles.galleryImg} resizeMode="cover" />
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={{ height: spacing.xxl * 3 }} />
          </ScrollView>
        </View>{/* ytre panel */}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1 },
  safeArea: { flex: 1 },

  outerPanel: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    height: 64,
  },
  backBtn: { justifyContent: 'center', alignItems: 'center' },
  backArrow: {
    fontSize: rf(32),
    lineHeight: rf(36),
  },
  navTitle: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(20),
  },

  panel: {
    flex: 1,
    backgroundColor: '#F4EFE6',
  },
  scroll: { paddingBottom: spacing.xxl },

  // ── BILDE ───────────────────────────────────────────────────────────
  imageBox: {
    overflow: 'hidden',
    backgroundColor: '#1a2e1a',
    borderRadius: radius.xl,
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
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  btn: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: '#FAF9F5',
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
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  factRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  factCard: {
    flex: 1,
    backgroundColor: '#F4EFE6',
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    boxShadow: '0px 4px 10px rgba(0,0,0,0.14)',
  },
  factCardFull: {
    flex: 0,
    alignSelf: 'stretch',
  },
  factIconBox: {
    width: scale(56),
    height: scale(56),
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
  factIcon: { width: scale(76), height: scale(76) },
  factContent: { flex: 1 },

  dayNightRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 6,
    marginBottom: 2,
  },
  dayNightHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.lg,
    gap: 3,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  dayNightInactive: {
    opacity: 0.25,
  },
  dayActive: {
    backgroundColor: '#FFF3C4',
    borderColor: '#E5A800',
    opacity: 1,
  },
  nightActive: {
    backgroundColor: '#1E2447',
    borderColor: '#5A6ACC',
    opacity: 1,
  },
  dayNightImg: {
    width: scale(32),
    height: scale(32),
  },
  dayNightLabel: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(11),
  },
  factLabel: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(12),
    color: '#29332A',
    marginBottom: 3,
  },
  factValue: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(12),
    color: '#2E2B26',
    lineHeight: rf(18),
  },

  // ── VISSTE DU? ──────────────────────────────────────────────────────
  funFactCard: {
    backgroundColor: '#1A8A8E',
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: '#E5D8A4',
    boxShadow: '0px 4px 16px rgba(0,0,0,0.4)',
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
    width: scale(72),
    height: scale(72),
    alignSelf: 'flex-start',
    flexShrink: 0,
  },

  // ── MER INFO ────────────────────────────────────────────────────────
  moreInfoText: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(14),
    color: '#29332A',
    lineHeight: rf(22),
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },

  // ── SE OGSÅ ─────────────────────────────────────────────────────────
  relatedSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  relatedTitle: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(15),
    color: '#29332A',
    marginBottom: spacing.md,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: '#F4EFE6',
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
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'RumRaisin_400Regular',
    fontSize: rf(22),
    color: '#E5D8A4',
    marginBottom: spacing.lg,
    letterSpacing: 0.5,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  galleryCardShadow: {
    flex: 1,
    borderRadius: radius.lg,
    boxShadow: '3px 3px 10px rgba(0,0,0,0.28)',
    elevation: 5,
  },
  galleryCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },

  // ── UNDRE SEG OVER ──────────────────────────────────────────────────
  wonderCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(229,216,164,0.15)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(229,216,164,0.4)',
  },
  wonderTitle: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: rf(14),
    color: '#E5D8A4',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  wonderText: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: rf(15),
    color: '#F4EFE6',
    lineHeight: rf(24),
    fontStyle: 'italic',
  },
});
