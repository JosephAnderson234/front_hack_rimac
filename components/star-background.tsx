import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const NUM_STARS = 50;

interface StarComponentProps {
  delay: number;
  x: number;
  y: number;
  size: number;
}

const StarComponent = ({ delay, x, y, size }: StarComponentProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.2, { duration: 1000, easing: Easing.linear }),
          withTiming(1, { duration: 1000, easing: Easing.linear })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const starOpacity = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'white',
        },
        starOpacity,
      ]}
    />
  );
};

export const StarBackground = () => {
  const stars = Array.from({ length: NUM_STARS }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3000,
  }));

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <StarComponent
          key={star.id}
          delay={star.delay}
          x={star.x}
          y={star.y}
          size={star.size}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

