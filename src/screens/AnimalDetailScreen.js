import React from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { rf, scale } from '../utils/responsive';
import { getById, CATEGORIES, rarityColor } from '../data/animals';
import AppHeader from '../components/AppHeader';

// Lille ikonbokser for kortfakta
const FACT_ICONS = {
  defense: { bg: '#3A4A3A', symbol: '🛡' },
  food:    { bg: '#3A3A1A', symbol: '🍽' },
  habitat: { bg: '#1A3A3A', symbol: '🌿' },
  special: { bg: '#3A1A3A', symbol: '✦' },
};

function FactRow({ label, value, valueColor, last, textColor }) {
  return (
    <View style={[styles.factRow, last && styles.factRowLast]}>
      <Text style={[styles.factLabel, textColor && { color: textColor, opacity: 0.65 }]}>{label}</Text>
      <Text style={[styles.factValue, textColor && { color: textColor }, valueColor && { color: valueColor }]} numberOfLines={3}>
        {value}
      </Text>
    </View>
  );
}

function SpeechBubble({ text }) {
  return (
    <View style={styles.bubbleWrapper}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{text}</Text>
      </View>
      {/* Hale på boblen */}
      <View style={styles.bubbleTail} />
    </View>
  );
}

function TopCard({ animal, cat }) {
  const { width } = useWindowDimensions();
  const mainH = width * 0.72;
  const subH  = width * 0.30;

  return (
    <View style={styles.topCard}>
      {/* Stort bilde — ingen ramme, border-radius 24 */}
      <View style={[styles.mainImageBox, { height: mainH }]}>
        {animal.image
          ? <Image source={animal.image} style={styles.fillImage} resizeMode="cover" />
          : (
            <View style={[styles.imagePlaceholder, { backgroundColor: cat.color + '44' }]}>
              <Text style={{ fontSize: rf(80) }}>{animal.emoji}</Text>
            </View>
          )
        }
        {/* Raritets-chip + snakkeboble over bilde */}
        <View style={[styles.rarityIcon, { backgroundColor: rarityColor(animal.rarity) }]}>
          <Text style={styles.rarityIconText}>{animal.rarityText}</Text>
        </View>
        <SpeechBubble text={animal.funFact} />
      </View>

      {/* To små bilder under — ingen ramme */}
      <View style={styles.subRow}>
        {animal.shortFacts?.map((fact, i) => {
          const iconConf = FACT_ICONS[fact.icon] ?? FACT_ICONS.special;
          const subImg   = animal.subImages?.[i] ?? animal.image ?? null;
          return (
            <View key={i} style={styles.subCard}>
              <View style={[styles.subImageBox, { height: subH, backgroundColor: iconConf.bg }]}>
                {subImg
                  ? <Image source={subImg} style={styles.fillImage} resizeMode="cover" />
                  : null
                }
              </View>
              <Text style={[styles.subCaption, { color: cat.textColor }]}>{fact.text}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function AnimalDetailScreen({ route, navigation }) {
  const animalId = route?.params?.animalId ?? 1;
  const animal   = getById(animalId);
  const { width } = useWindowDimensions();

  if (!animal) return null;

  const cat   = CATEGORIES[animal.category] ?? CATEGORIES.land;
  const index = route?.params?.listIndex ?? animal.id;

  return (
    <LinearGradient
      colors={cat.gradient}
      locations={cat.gradientLocations ?? undefined}
      start={cat.gradientStart}
      end={cat.gradientEnd}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>

        <AppHeader navigation={navigation} logo={cat.logo} />

        {/* Nav-bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={require('../../assets/svg/pil.svg')} style={styles.backArrow} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{animal.name}</Text>
          <View style={styles.navSpacer} />
        </View>

        {/* Panel med rett kant, marg mot gradienten */}
        <View style={[styles.panel, { backgroundColor: cat.panelColor, marginHorizontal: 6 }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* TOPPKORT */}
          <TopCard animal={animal} cat={cat} />

          {/* HØR FAKTA + SE VIDEO */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btn, styles.btnFakta]}>
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

          {/* Faktabolk */}
          <View style={styles.factBlock}>
            <FactRow label="Hvor lever den?" value={animal.location}    textColor={cat.textColor} />
            <FactRow label="Størrelse"       value={animal.size}        textColor={cat.textColor} />
            <FactRow label="Vekt"            value={animal.weight}      textColor={cat.textColor} />
            <FactRow label="Hva spiser den?" value={animal.diet}        textColor={cat.textColor} />
            <FactRow label="Dag eller natt?" value={animal.activeTime}  textColor={cat.textColor} />
            <FactRow label="Sporene"         value={animal.tracks}      textColor={cat.textColor} />
            <FactRow
              label="Hvor sjelden?"
              value={`${animal.rarityText} — ${animal.rarityDetail}`}
              textColor={cat.textColor}
            />
            <FactRow
              label="Som kjæledyr"
              value={`${animal.petScore < 0 ? animal.petScore : animal.petScore}/10 — ${animal.petComment}`}
              textColor={cat.textColor}
              last
            />
          </View>

          {/* Visste du at */}
          <View style={styles.section}>
            <Text style={[styles.sectionQ, { color: cat.textColor }]}>Visste du at...?</Text>
            <View style={styles.funFactBox}>
              <Text style={[styles.funFactText, { color: cat.textColor }]}>{animal.funFact}</Text>
            </View>
          </View>

          {/* Mer info */}
          {animal.moreInfo && (
            <View style={styles.section}>
              <Text style={[styles.bodyText, { color: cat.textColor }]}>{animal.moreInfo}</Text>
            </View>
          )}

          {/* Oppdagelsesreise */}
          <View style={styles.discoveryBar}>
            <Image source={require('../../assets/oppdagelsesbok.png')} style={styles.discoverysilva} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.discoveryLabel, { color: cat.textColor }]}>Din oppdagelsesreise</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '80%' }]} />
              </View>
              <Text style={[styles.discoveryHint, { color: cat.textColor, opacity: 0.7 }]}>
                Svar på en oppgave for å få {animal.name}-merket!
              </Text>
            </View>
            <Text style={[styles.discoveryPct, { color: cat.textColor }]}>80%</Text>
          </View>

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
        </View>{/* panel */}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },

  panel: {
    flex: 1,
    overflow: 'hidden',
  },

  navBar: {
    backgroundColor: '#F4EFE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingLeft: 20,
    paddingRight: 20,
    marginHorizontal: 6,
  },
  backBtn:   { justifyContent: 'center', alignItems: 'center' },
  backArrow: { width: 24, height: 24, tintColor: '#004D56' },
  navTitle: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    color: '#004D56',
    flex: 1,
    textAlign: 'right',
  },
  navSpacer: { width: 24 },

  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: spacing.xxl },

  // ── TOPPKORT — ingen ramme ───────────────────────────────────────────
  topCard: {
    marginBottom: spacing.lg,
  },
  rarityIcon: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  rarityIconText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(11),
    color: colors.cream,
  },

  // Stort bilde — radius 24, ingen ramme
  mainImageBox: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#1a2e1a',
    borderRadius: 24,
    justifyContent: 'flex-end',
  },
  fillImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Snakkeboble
  bubbleWrapper: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    alignItems: 'flex-end',
  },
  bubble: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  bubbleText: {
    fontFamily: typography.fonts.bubble,
    fontSize: rf(12),
    color: colors.primary,
    lineHeight: rf(17),
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.cream,
    marginRight: spacing.lg,
  },

  // Sub-bilder
  subRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  subCard: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  subImageBox: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  subIconOverlay: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radius.sm,
    padding: 4,
  },
  subIcon:    { fontSize: rf(14) },
  subCaption: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(12),
    color: colors.cream,
    lineHeight: rf(17),
  },

  // ── KNAPPER ────────────────────────────────────────────────────────
  buttonRow: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  btn: {
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FAF9F5',
  },
  btnIcon: {
    width: scale(24),
    height: scale(24),
  },
  btnFakta: {
    backgroundColor: '#E5D8A4',
  },
  btnFaktaText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
    color: '#29332A',
    letterSpacing: 0.5,
  },
  btnVideo: {
    backgroundColor: '#004D56',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnVideoText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
    color: '#FAF9F5',
    letterSpacing: 0.5,
  },

  // ── FAKTABOLK ────────────────────────────────────────────────────────
  factBlock: {
    backgroundColor: 'rgba(244,239,230,0.12)',
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#F4EFE6',
  },
  factRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  factRowLast: {
    borderBottomWidth: 0,
  },
  factLabel: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: rf(13),
    lineHeight: rf(20),
    width: '38%',
    paddingTop: 1,
    // farge settes via textColor-prop i FactRow
  },
  factValue: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: rf(14),
    lineHeight: rf(21),
    flex: 1,
    // farge settes via textColor-prop i FactRow
  },

  // ── SEKSJONER ────────────────────────────────────────────────────────
  section: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionQ: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h3,
    color: colors.secondary,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h3,
    color: colors.cream,
  },
  funFactBox: {
    backgroundColor: 'rgba(244,239,230,0.12)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 3,
    borderColor: '#F4EFE6',
  },
  funFactText: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.body,
    color: colors.cream,
    lineHeight: rf(24),
  },
  bodyText: {
    fontFamily: typography.fonts.bodyRegular,
    ...typography.body,
    color: colors.cream,
    lineHeight: rf(22),
  },
  habitatImg: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },


  // ── OPPDAGELSESREISE ────────────────────────────────────────────────
  discoveryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  discoverysilva: { width: scale(44), height: scale(44) },
  discoveryLabel: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.caption,
    color: colors.cream,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
  },
  discoveryHint: {
    fontFamily: typography.fonts.bodyRegular,
    fontSize: rf(11),
    color: colors.textMuted,
    marginTop: 4,
  },
  discoveryPct: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h3,
    color: colors.secondary,
  },
});
