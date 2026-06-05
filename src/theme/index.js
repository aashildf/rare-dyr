import { scale, rf } from '../utils/responsive';

export const colors = {
  primary:        '#3F4A39',
  secondary:      '#E5D8A4',
  cream:          '#F4EFE6',
  teal:           '#004D56',
  white:          '#FFFFFF',
  black:          '#000000',
  textPrimary:    '#3F4A39',
  textSecondary:  '#766E66',
  textLight:      '#F4EFE6',
  textMuted:      '#97A496',
  surface:        '#F4EFE6',
  surfaceDark:    'rgba(63, 74, 57, 0.15)',

  land: { dark: '#3F4A39', main: '#798447', light: '#C1D47F', gradient: ['#3F4A39','#798447','#C1D47F'] },
  vann: { dark: '#004D56', main: '#0A6772', light: '#99E3EF', gradient: ['#004D56','#0A6772','#99E3EF'] },
  luft: { dark: '#3A657A', main: '#7D8898', light: '#DEE0E4', gradient: ['#3A657A','#7D8898','#DEE0E4'] },
};

export const gradients = {
  background: ['#2E4A38', '#29676A'],
  land: ['#3F4A39', '#798447'],
  vann: ['#004D56', '#0A6772'],
  luft: ['#3A657A', '#7D8898'],
};

export const spacing = {
  xs:  scale(4),
  sm:  scale(8),
  md:  scale(12),
  lg:  scale(16),
  xl:  scale(24),
  xxl: scale(32),
};

export const radius = {
  sm:   scale(8),
  md:   scale(12),
  lg:   scale(16),
  xl:   scale(24),
  full: 999,
};

export const typography = {
  fonts: {
    logo:        'RumRaisin_400Regular',
    body:        'Quicksand_600SemiBold',
    bodyRegular: 'Quicksand_400Regular',
    bodyBold:    'Quicksand_700Bold',
    bubble:      'BalooBhaijaan2_400Regular',
  },
  display: { fontSize: rf(40), lineHeight: rf(48) },
  h1:      { fontSize: rf(28), lineHeight: rf(36) },
  h2:      { fontSize: rf(20), lineHeight: rf(28) },
  h3:      { fontSize: rf(16), lineHeight: rf(24) },
  body:    { fontSize: rf(14), lineHeight: rf(22) },
  caption: { fontSize: rf(12), lineHeight: rf(18) },
};

const theme = { colors, gradients, spacing, radius, typography };
export default theme;
