import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Quicksand_400Regular,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import { RumRaisin_400Regular } from '@expo-google-fonts/rum-raisin';
import { BalooBhaijaan2_400Regular } from '@expo-google-fonts/baloo-bhaijaan-2';

import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    RumRaisin_400Regular,
    BalooBhaijaan2_400Regular,
  });

  // Sett mørk bakgrunn på hele HTML-dokumentet (web-only)
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.body.style.backgroundColor = '#1E3828';
    document.documentElement.style.backgroundColor = '#1E3828';
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = '#1E3828';
    // Fjern hvit bakgrunn fra React Navigation sin tab-bar-container
    if (!document.getElementById('rn-tab-bg-fix')) {
      const style = document.createElement('style');
      style.id = 'rn-tab-bg-fix';
      style.innerHTML = `
        [data-testid="bottom-tab-bar"] { background: transparent !important; }
        div[style*="background-color: rgb(255, 255, 255)"] { background-color: transparent !important; }
      `;
      document.head.appendChild(style);
    }
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator color={colors.secondary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
