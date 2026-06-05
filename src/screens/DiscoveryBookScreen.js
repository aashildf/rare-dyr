import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, typography } from '../theme';

export default function DiscoveryBookScreen() {
  return (
    <LinearGradient colors={gradients.land} style={styles.gradient}>
      <SafeAreaView style={styles.center}>
        <Text style={styles.text}>Oppdagelsesbok — kjem snart 📖</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontFamily: 'Quicksand_600SemiBold', ...typography.h2, color: colors.cream },
});
