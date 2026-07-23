import { colors } from '@/constants/colors';
import { fontSize, spacing } from '@/constants/layout';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyListStateProps {
  message: string;
  showArrow?: boolean;
}

export function EmptyListState({ message, showArrow }: EmptyListStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {showArrow && (
        <Ionicons name='arrow-forward' size={32} color={colors.primary} style={styles.arrow} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  arrow: {
    marginTop: spacing.md,
  },
});
