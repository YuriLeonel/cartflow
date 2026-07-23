import { colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing } from '@/constants/layout';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = React.memo(function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
