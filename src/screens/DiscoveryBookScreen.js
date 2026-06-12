import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, FlatList,
  TouchableOpacity, StyleSheet, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, radius, typography } from '../theme';
import { rf, scale } from '../utils/responsive';
import { animals as allAnimals, CATEGORIES, getByCategory, rarityColor } from '../data/animals';
import AppHeader from '../components/AppHeader';
import TabBar from '../components/TabBar';

const isDiscovered = (a) => a.image !== null;

const CAT_ORDER = ['land', 'vann', 'luft'];
const CAT_LABEL = { land: 'Land', vann: 'Vann', luft: 'Luft' };
const CAT_GRADIENT = {
  land: ['#6B8F5E', '#3F5A36'],
  vann: ['#2E7A88', '#1A5060'],
  luft: ['#4A7AA8', '#2A5278'],
};
const CAT_ACCENT   = { land: '#5AAA5A', vann: '#2A8AAA', luft: '#5A8AAA' };
const PROG_BLOCKS  = 10;
const CAT_NAV_ICON = {
  land: require('../../assets/ikoner/land_navbar.png'),
  vann: require('../../assets/ikoner/vann_navbar.png'),
  luft: require('../../assets/ikoner/luft_navbar.png'),
};

// ─── Hoved-skjerm ────────────────────────────────────────────────────────────

export default function DiscoveryBookScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [view, setView]               = useState('main');
  const [activeCat, setActiveCat]     = useState(null);
  const [activeAnimal, setActiveAnimal] = useState(null);
  const [likedIds, setLikedIds]       = useState(new Set());

  const toggleLike = (id) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCategory = (cat) => { setActiveCat(cat); setView('category'); };
  const openAnimal   = (a)   => { setActiveAnimal(a); setView('animal'); };
  const goBack       = ()    => {
    if (view === 'animal') setView(activeCat ? 'category' : 'main');
    else { setActiveCat(null); setView('main'); }
  };

  if (view === 'animal' && activeAnimal) {
    return <AnimalDetailView animal={activeAnimal} liked={likedIds.has(activeAnimal.id)} onToggleLike={() => toggleLike(activeAnimal.id)} onBack={goBack} navigation={navigation} />;
  }
  if (view === 'category' && activeCat) {
    return <CategoryView category={activeCat} likedIds={likedIds} onSelectAnimal={openAnimal} onBack={goBack} navigation={navigation} />;
  }

  // ── Forsiden ──
  const discovered = allAnimals.filter(isDiscovered).length;
  const total      = allAnimals.length;
  const filledMain = Math.round((discovered / total) * PROG_BLOCKS);
  const likedList  = allAnimals.filter(a => likedIds.has(a.id));

  const hPad   = 36;
  const catGap = spacing.sm;
  const catW   = width - hPad * 2;
  const favGap = spacing.sm;
  const favW   = (width - hPad * 2 - favGap * 3) / 4;
  // Beregn korthøyde så alle 3 passer på skjermen
  const catCardH = Math.min(130, Math.floor((height - insets.top - 58 - 130 - catGap * 2 - spacing.xl) / 3));

  return (
    <View style={{ flex: 1, height }}>
      <Image
        source={require("../../assets/oppdagelsebok/bg_oppdagelsesbok2.png")}
        style={[StyleSheet.absoluteFillObject, { width, height }]}
        resizeMode="cover"
        pointerEvents="none"
      />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <AppHeader navigation={navigation} />
        <TabBar navigation={navigation} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scroll, { paddingHorizontal: hPad }]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Tittel-seksjon + maskot ── */}
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookTitle}>Min oppdagelsesbok</Text>
              <Text style={styles.bookSub}>
                Du har oppdaget {discovered} av {total} rare dyr!
              </Text>

              {/* Progressbar */}
              <View style={styles.mainProgressRow}>
                <View style={styles.mainProgressTrack}>
                  <View style={[styles.mainProgressFill, { width: `${(discovered / total) * 100}%` }]} />
                </View>
                <Text style={styles.chunkyNum}>{discovered} / {total}</Text>
              </View>
            </View>

            {/* Maskot */}
            {/* <Image
              source={require("../../assets/silva/silva_land.png")}
              style={styles.mascot}
              resizeMode="contain"
            /> */}
          </View>

          {/* ── 3 kategori-kort ── */}
          <View style={[styles.catRow, { gap: catGap }]}>
            {CAT_ORDER.map((cat) => (
              <CategoryCard
                key={cat}
                category={cat}
                cardWidth={catW}
                cardHeight={catCardH}
                onPress={() => openCategory(cat)}
              />
            ))}
          </View>

          {/* ── Favoritter ── */}
          <View style={styles.favTitleWrap}>
            <Text style={styles.favTitle}>❤️ Mine favorittdyr</Text>
          </View>
          <View style={[styles.favGrid, { gap: favGap }]}>
            {likedList.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={[styles.favCard, { width: favW, height: favW }]}
                onPress={() => openAnimal(a)}
                activeOpacity={0.85}
              >
                {a.image ? (
                  <Image
                    source={a.image}
                    style={[
                      StyleSheet.absoluteFillObject,
                      { borderRadius: radius.lg },
                    ]}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      StyleSheet.absoluteFillObject,
                      styles.favPlaceholder,
                    ]}
                  >
                    <Text style={{ fontSize: rf(24) }}>{a.emoji}</Text>
                  </View>
                )}
                <View style={styles.heartBadge}>
                  <Text style={{ fontSize: rf(12) }}>❤️</Text>
                </View>
              </TouchableOpacity>
            ))}
            {/* "Legg til"-kort vises alltid til det er 4+ favoritter */}
            {likedList.length < 8 && (
              <View style={[styles.addFavCard, { width: favW, height: favW }]}>
                <Text style={styles.addFavPlus}>+</Text>
                <Text style={styles.addFavText}>Legg til{"\n"}favoritter</Text>
              </View>
            )}
          </View>

          <View style={{ height: spacing.xxl * 2 }} />
        </ScrollView>
      </View>
    </View>
  );
}

// ─── Kategori-kort (forsiden) ────────────────────────────────────────────────

function CategoryCard({ category, cardWidth, cardHeight, onPress }) {
  const list       = getByCategory(category);
  const discovered = list.filter(isDiscovered).length;
  const total      = list.length;
  const filled     = Math.round((discovered / total) * PROG_BLOCKS);
  const withImages = list.filter(isDiscovered);
  const thumbSize  = Math.min(
    Math.floor((cardWidth - spacing.sm * 2 - 3 * 2) / 3),
    Math.floor(cardHeight * 0.52),
  );

  return (
    <TouchableOpacity style={[styles.catCard, { width: cardWidth, height: cardHeight }]} onPress={onPress} activeOpacity={0.88}>
      <LinearGradient colors={CAT_GRADIENT[category]} style={styles.catCardInner}>
        {/* Topp: ikon + navn + antall */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Image source={CAT_NAV_ICON[category]} style={styles.catBadgeImg} resizeMode="contain" />
          <Text style={styles.catName}>{CAT_LABEL[category]}</Text>
          <Text style={[styles.catCount, { marginLeft: 'auto' }]}>{discovered}/{total}</Text>
        </View>

        {/* Progressbar */}
        <View style={styles.catProgressTrack}>
          <View style={[styles.catProgressFill, { width: `${(discovered / total) * 100}%`, backgroundColor: CAT_ACCENT[category] }]} />
        </View>

        {/* Bunn: tre kvadratiske bilder i rad */}
        <View style={styles.catThumbs}>
          {[0, 1, 2].map((i) => {
            const a = withImages[i];
            const isBlurred = i === 2;
            return (
              <View key={i} style={[styles.catThumb, { width: thumbSize, height: thumbSize }]}>
                {a?.image
                  ? <Image
                      source={a.image}
                      style={[StyleSheet.absoluteFillObject, { borderRadius: radius.sm }]}
                      resizeMode="cover"
                      blurRadius={isBlurred ? 5 : 0}
                    />
                  : <View style={styles.catThumbUnknown} />
                }
                {isBlurred && (
                  <View style={styles.catThumbBlurOverlay}>
                    <Text style={styles.catThumbQ}>?</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Kategori-samling ────────────────────────────────────────────────────────

function CategoryView({ category, likedIds, onSelectAnimal, onBack, navigation }) {
  const { width } = useWindowDimensions();
  const list  = getByCategory(category);
  const gap   = spacing.md;
  const pad   = spacing.lg;
  const cardW = (width - pad * 2 - gap) / 2;

  return (
    <LinearGradient colors={CAT_GRADIENT[category]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader navigation={navigation} />
        <View style={styles.catViewNav}>
          <TouchableOpacity onPress={onBack} style={styles.backCircle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.catViewTitle}>{CAT_ICON[category]} {CAT_LABEL[category]}</Text>
          <View style={{ width: scale(40) }} />
        </View>
        <FlatList
          data={list}
          keyExtractor={a => String(a.id)}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: spacing.xxl * 2, gap }}
          columnWrapperStyle={{ gap }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: a }) => (
            <TouchableOpacity style={[styles.gridCard, { width: cardW }]} onPress={() => onSelectAnimal(a)} activeOpacity={0.85}>
              {isDiscovered(a) ? (
                <>
                  <Image source={a.image} style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]} resizeMode="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={styles.gridOverlay}>
                    <Text style={styles.gridName}>{a.name}</Text>
                    {likedIds.has(a.id) && <Text style={{ fontSize: rf(14) }}>❤️</Text>}
                  </LinearGradient>
                </>
              ) : (
                <View style={styles.gridUnknown}>
                  <Text style={styles.gridQ}>?</Text>
                  <Text style={styles.gridUnknownTxt}>Utforsk videre{'\n'}for å finne dette dyret!</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Dyrets samlekort ────────────────────────────────────────────────────────

function AnimalDetailView({ animal, liked, onToggleLike, onBack, navigation }) {
  const { width } = useWindowDimensions();
  const cat = CATEGORIES[animal.category] ?? CATEGORIES.land;
  const facts = [
    { label: 'Lever', value: animal.location },
    { label: 'Spiser', value: animal.diet },
    { label: 'Aktiv', value: animal.activeTime },
    { label: 'Størrelse', value: animal.size },
    { label: 'Vekt', value: animal.weight },
  ].filter(f => f.value);

  return (
    <LinearGradient colors={cat.gradient} locations={cat.gradientLocations ?? undefined} start={cat.gradientStart} end={cat.gradientEnd} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader navigation={navigation} />
        <View style={[styles.detailPanel, { backgroundColor: cat.panelColor }]}>
          <View style={styles.detailNav}>
            <TouchableOpacity onPress={onBack} style={styles.backCircle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.detailNavTitle, { color: cat.textColor }]} numberOfLines={1}>{animal.name}</Text>
            <View style={{ width: scale(40) }} />
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.detailImg, { height: width * 0.6 }]}>
              {animal.image
                ? <Image source={animal.image} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                : <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a2e1a' }]}>
                    <Text style={{ fontSize: rf(80) }}>{animal.emoji}</Text>
                  </View>
              }
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.detailImgOverlay}>
                <Text style={styles.detailAnimalName}>{animal.name}</Text>
                <View style={styles.detailTags}>
                  <View style={[styles.detailTag, { backgroundColor: rarityColor(animal.rarity) }]}>
                    <Text style={styles.detailTagTxt}>{animal.rarityText}</Text>
                  </View>
                  <View style={[styles.detailTag, { backgroundColor: 'rgba(244,239,230,0.2)' }]}>
                    <Text style={styles.detailTagTxt}>{animal.animalType}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.statusRow}>
              <TouchableOpacity style={styles.statusBtn} onPress={onToggleLike}>
                <Text style={[styles.statusIcon, liked && styles.statusLiked]}>❤️</Text>
                <Text style={styles.statusLabel}>{liked ? 'Likt' : 'Lik'}</Text>
              </TouchableOpacity>
              {animal.video && (
                <View style={styles.statusBtn}>
                  <Text style={styles.statusIcon}>🎥</Text>
                  <Text style={styles.statusLabel}>Video</Text>
                </View>
              )}
            </View>

            <View style={styles.detailFacts}>
              {facts.map(f => (
                <View key={f.label} style={styles.detailFactCard}>
                  <Text style={styles.detailFactLabel}>{f.label}</Text>
                  <Text style={styles.detailFactValue}>{f.value}</Text>
                </View>
              ))}
            </View>

            {animal.funFact && (
              <View style={styles.detailFunFact}>
                <Text style={styles.detailFunFactTitle}>Visste du?</Text>
                <Text style={styles.detailFunFactTxt}>{animal.funFact}</Text>
              </View>
            )}
            <View style={{ height: spacing.xxl * 2 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Stiler ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { paddingTop: spacing.sm },

  // Tittel
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  bookTitle: {
    fontFamily: 'RumRaisin_400Regular',
    fontSize: rf(30),
    color: '#3A2800',
    textAlign: 'center',
    marginBottom: 2,
  },
  bookSub: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: rf(13),
    color: '#5A4010',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  mainProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mainProgressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  mainProgressFill: {
    height: '100%',
    backgroundColor: '#6DAA3A',
    borderRadius: 5,
  },
  chunkyNum: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: rf(12),
    color: '#3A2800',
  },
  mascot: {
    width: scale(80),
    height: scale(80),
    flexShrink: 0,
    marginTop: -spacing.sm,
  },

  // Kategori-rad
  catRow: { flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl },
  catCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.35)',
    elevation: 6,
  },
  catCardInner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  catBadgeImg: {
    width: scale(28),
    height: scale(28),
    opacity: 0.9,
  },
  catName: {
    fontFamily: 'RumRaisin_400Regular',
    fontSize: rf(18),
    color: '#F4EFE6',
  },
  catCount: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: rf(10),
    color: 'rgba(244,239,230,0.95)',
    lineHeight: rf(14),
  },
  catThumbs: {
    flexDirection: 'row',
    gap: 3,
  },
  catThumb: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  catThumbUnknown: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  catThumbBlurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catThumbQ: { fontSize: rf(18), color: 'rgba(255,255,255,0.9)', fontFamily: 'Quicksand_700Bold' },
  catProgressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Favoritter
  favTitleWrap: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  favTitle: {
    fontFamily: 'RumRaisin_400Regular',
    fontSize: rf(22),
    color: '#3A2800',
    textAlign: 'center',
  },
  favGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  favCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#C8A860',
    boxShadow: '0px 3px 8px rgba(0,0,0,0.25)',
    elevation: 4,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
  },
  favPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#C8A860' },
  heartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.full,
    width: scale(22),
    height: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFavCard: {
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'rgba(90,64,16,0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: spacing.sm,
  },
  addFavPlus: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: rf(24),
    color: 'rgba(90,64,16,0.5)',
    lineHeight: rf(28),
  },
  addFavText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: rf(9),
    color: 'rgba(90,64,16,0.5)',
    textAlign: 'center',
    lineHeight: rf(14),
  },

  // Kategori-view nav
  catViewNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 64,
  },
  catViewTitle: {
    fontFamily: 'RumRaisin_400Regular',
    fontSize: rf(26),
    color: '#E5D8A4',
    flex: 1,
    textAlign: 'center',
  },
  backCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#E5D8A4',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '3px 3px 6px rgba(0,0,0,0.6)',
  },
  backArrow: { fontSize: rf(22), color: '#004D56', lineHeight: rf(26) },

  // Rutenett
  gridCard: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  gridName:       { fontFamily: 'Quicksand_700Bold', fontSize: rf(13), color: '#F4EFE6', flex: 1 },
  gridUnknown:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  gridQ:          { fontSize: rf(36), color: 'rgba(255,255,255,0.2)' },
  gridUnknownTxt: { fontFamily: 'Quicksand_600SemiBold', fontSize: rf(11), color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontStyle: 'italic' },

  // Dyre-detail
  detailPanel: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  detailNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 64,
  },
  detailNavTitle: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: rf(18),
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  detailScroll: { paddingBottom: spacing.xxl },
  detailImg: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: '#1a2e1a',
  },
  detailImgOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  detailAnimalName: { fontFamily: 'Quicksand_700Bold', fontSize: rf(26), color: '#F4EFE6', marginBottom: spacing.xs },
  detailTags:       { flexDirection: 'row', gap: spacing.sm },
  detailTag:        { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full },
  detailTagTxt:     { fontFamily: 'Quicksand_700Bold', fontSize: rf(11), color: '#F4EFE6' },

  statusRow:   { flexDirection: 'row', gap: spacing.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  statusBtn:   { alignItems: 'center', gap: 4 },
  statusIcon:  { fontSize: rf(28), opacity: 0.4 },
  statusLiked: { opacity: 1 },
  statusLabel: { fontFamily: 'Quicksand_600SemiBold', fontSize: rf(11), color: 'rgba(41,51,42,0.7)' },

  detailFacts: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  detailFactCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: '45%',
    flex: 1,
  },
  detailFactLabel: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: rf(10),
    color: 'rgba(41,51,42,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailFactValue: { fontFamily: 'Quicksand_600SemiBold', fontSize: rf(13), color: '#29332A' },

  detailFunFact: {
    marginHorizontal: spacing.lg,
    backgroundColor: '#1A8A8E',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: '#E5D8A4',
  },
  detailFunFactTitle: { fontFamily: 'Quicksand_700Bold', fontSize: rf(14), color: '#F4EFE6', marginBottom: spacing.xs },
  detailFunFactTxt:   { fontFamily: 'Quicksand_400Regular', fontSize: rf(13), color: '#F4EFE6', lineHeight: rf(20) },
});
