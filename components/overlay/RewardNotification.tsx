import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface RewardNotificationProps {
  money?: number;
  tokens?: number;
  xp?: number;
  show: boolean;
  onHide?: () => void;
}

/**
 * RewardNotification
 * Displays animated reward popup when player earns money/tokens/xp
 */
export const RewardNotification: React.FC<RewardNotificationProps> = ({
  money = 0,
  tokens = 0,
  xp = 0,
  show,
  onHide
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    if (show) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [show, fadeAnim, slideAnim, onHide]);

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>REWARD EARNED</Text>
        {money > 0 && (
          <Text style={styles.rewardText}>💰 +${money}</Text>
        )}
        {tokens > 0 && (
          <Text style={styles.rewardText}>🪙 +{tokens} tokens</Text>
        )}
        {xp > 0 && (
          <Text style={styles.rewardText}>⭐ +{xp} XP</Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#000000dd',
    borderColor: '#FFB000',
    borderWidth: 2,
    borderRadius: 8,
    padding: 15,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    color: '#FFB000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: '#FFFFFF',
    textShadowRadius: 4,
    letterSpacing: 1.5,
  },
  rewardText: {
    color: '#00FF00',
    fontSize: 16,
    marginVertical: 3,
    textShadowColor: '#FFFFFF',
    textShadowRadius: 4,
    letterSpacing: 1.1,
  },
});

export default RewardNotification;
