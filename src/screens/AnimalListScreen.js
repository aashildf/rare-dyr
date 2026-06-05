import React, { useState } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { rf, scale } from '../utils/responsive';
import { getByCategory, CATEGORIES, rarityColor } from '../data/animals';
import AppHeader from '../components/AppHeader';

const RARITY_ICONS = {
  kritisk_truet: '🚨',
  sterkt_truet:  '🚨',
  truet:         '🚨',
  sjelden:       '⚠️',
  ikke_truet:    '✓',
};

export default function AnimalListScreen({ route, navigation }) {
  const categoryId = route?.params?.category ?? 'land';
  const cat        = CATEGORIES[categoryId] ?? CATEGORIES.land;
  const list       = getByCategory(categoryId);
  const { width }  = useWindowDimensions();
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DyrDetalj', { animalId: item.id })}
      activeOpacity={0.88}
    >
      {/* Bilde 326×326 */}
      <View style={styles.imageBox}>
        {item.image
          ? <Image source={item.image} style={styles.fillImage} resizeMode="cover" />
          : (
            <View style={[styles.imagePlaceholder, { backgroundColor: cat.color + '55' }]}>
              <Text style={styles.placeholderEmoji}>{item.emoji}</Text>
            </View>
          )
        }
        <View style={[styles.rarityBadge, { backgroundColor: rarityColor(item.rarity) }]}>
          <Text style={styles.rarityBadgeText}>{item.rarityText}</Text>
        </View>
      </View>

      {/* Tekstboks — navn+tags til venstre, hjerte midtstilt vertikalt til høyre */}
      <View style={styles.cardInfo}>
        <View style={styles.cardInfoInner}>
          {/* Venstre: navn + tags */}
          <View style={styles.nameAndTags}>
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.tags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.animalType}</Text>
              </View>
              {item.habitatTag ? (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.habitatTag}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Høyre: hjerte vertikalt midtstilt */}
          <TouchableOpacity
            onPress={() => toggleLike(item.id)}
            style={styles.heartWrapper}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require('../../assets/svg/like_hjerte.svg')}
              style={[styles.heartImg, liked[item.id] && styles.heartLiked]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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

        {/* Panel med rett kant øverst, marg mot gradienten */}
        <View style={[styles.panel, { backgroundColor: cat.panelColor, marginHorizontal: 6 }]}>

          {/* Overskrift inni panelet */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backCircle}
                onPress={() => navigation.getParent()?.navigate('HjemTab')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={require('../../assets/svg/pil.svg')}
                  style={styles.backArrow}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{cat.heading}</Text>
            </View>
            <Text style={[styles.headerSub, { color: cat.textColor, opacity: 0.75 }]}>
              {cat.subtitle}
            </Text>
          </View>

          <FlatList
            data={list}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<DiscoveryWidget cat={cat} total={list.length} found={list.filter(a => a.discovered).length} />}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: cat.textColor }]}>Ingen dyr her ennå</Text>
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function DiscoveryWidget({ cat, total, found }) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  return (
    <View style={styles.discoveryWidget}>
      <Text style={styles.discoveryTitle}>Din oppdagelsesbok</Text>
      <Text style={styles.discoveryCount}>Du har funnet {found}/{total} {cat.dyreord}!</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
      </View>
      <TouchableOpacity style={[styles.discoveryBtn, { backgroundColor: cat.color }]}>
        <Text style={styles.discoveryBtnText}>Se alle stempler</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },

  panel: {
    flex: 1,
    overflow: 'hidden',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  backCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    borderWidth: 2,
    borderColor: '#E5D8A4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    boxShadow: '0px 0px 8px rgba(0,0,0,0.7)',
  },
  backArrow: {
    width: scale(18),
    height: scale(18),
    tintColor: '#E5D8A4',
  },
  headerTitle: {
    fontFamily: 'RumRaisin_400Regular',
    fontSize: 40,
    lineHeight: 48,
    color: '#E5D8A4',
    textShadow: '0px 2px 8px rgba(0,0,0,0.6)',
    WebkitTextStrokeWidth: '1px',
    WebkitTextStrokeColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'stretch',
    flex: 1,
  },
  headerSub: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: rf(18),
    lineHeight: rf(26),
    opacity: 1,
  },

  list: { paddingHorizontal: 24, paddingTop: spacing.md, paddingBottom: spacing.xxl, gap: 24 },

  // Kort — 342×430 → aspectRatio 342/430 ≈ 0.795
  card: {
    backgroundColor: '#F4EFE6',
    borderRadius: 12,
    padding: 8,
    aspectRatio: 342 / 430,
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxShadow: '8px 8px 10px rgba(15,31,17,1)',
    elevation: 10,
  },
  // Bilde — 326×326, kvadratisk (card width - 2×8px padding)
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: '#1a2e1a',
    borderRadius: 8,
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
  placeholderEmoji: { fontSize: rf(64) },

  rarityBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  rarityBadgeText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(11),
    color: colors.cream,
  },
  numBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numBadgeText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: rf(12),
    color: colors.primary,
  },

  // Tekstboks — 16px under bildet, fyller resten av kortet
  cardInfo: {
    width: '100%',
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 8,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  cardInfoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameAndTags: {
    flex: 1,
    gap: spacing.xs,
    paddingRight: 8,
  },
  heartWrapper: {
    alignSelf: 'center',
    paddingRight: 4,
  },
  cardName: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 24,
    lineHeight: 30,
    color: '#29332A',
    flex: 1,
    paddingRight: 8,
  },
  heartImg: {
    width: 45,
    height: 39.38,
    opacity: 0.5,
  },
  heartLiked: { opacity: 1, tintColor: '#e05c7a' },

  // Tags — 28px høy, padding 8/4, radius 8, #82A096 25%
  tags: { flexDirection: 'row', gap: 6 },
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

  // Discovery widget
  discoveryWidget: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(229,216,164,0.2)',
  },
  discoveryTitle: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.h2,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  discoveryCount: {
    fontFamily: typography.fonts.bodyRegular,
    ...typography.body,
    color: colors.cream,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  discoveryBtn: {
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  discoveryBtnText: {
    fontFamily: typography.fonts.bodyBold,
    ...typography.body,
    color: colors.cream,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    fontFamily: typography.fonts.body,
    ...typography.h3,
    color: colors.cream,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
