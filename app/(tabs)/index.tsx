import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const [isManualMode, setIsManualMode] = useState(false);
  const [pressedDirection, setPressedDirection] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const directionInterval = useRef<NodeJS.Timeout | null | any>(null); // To store interval for continuous movement

  const handleDirection = (dir: string) => {
    console.log('Move:', dir);
    setPressedDirection(dir);

    // Animating scale when button is pressed
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startContinuousMovement = (dir: string) => {
    // Clear any existing intervals
    if (directionInterval.current) {
      clearInterval(directionInterval.current);
    }

    directionInterval.current = setInterval(() => {
      handleDirection(dir);
    }, 300); // Move every 300ms
  };

  const stopContinuousMovement = () => {
    if (directionInterval.current) {
      clearInterval(directionInterval.current);
      directionInterval.current = null;
    }
    setPressedDirection(null); // Stop the movement when released
  };

  const getIconName = (dir: string) => {
    switch (dir) {
      case 'up':
        return 'arrow-up';
      case 'down':
        return 'arrow-down';
      case 'left':
        return 'arrow-back';
      case 'right':
        return 'arrow-forward';
      default:
        return '';
    }
  };

  const renderButton = (dir: string, style: any) => (
    <Pressable
      onPressIn={() => startContinuousMovement(dir)} // Start continuous movement on press
      onPressOut={stopContinuousMovement} // Stop continuous movement on release
      onPress={() => handleDirection(dir)} // Trigger once on tap
      style={style}
    >
      <Animated.View
        style={[styles.btn, pressedDirection === dir && { transform: [{ scale: scaleAnim }] }]} >
        <Ionicons name={getIconName(dir)} size={24} color="#fff" />
      </Animated.View>
    </Pressable>
  );

  // Force light theme styles regardless of system theme
  const scheme = 'light';  // Use light theme styles always

  return (
    <SafeAreaView style={styles.safeArea}>
      <ParallaxScrollView
        headerBackgroundColor={{
          light: '#A1CEDC',  // Light mode color
        }}
        headerImage={
          <View style={styles.headerImage}>
            <Text style={[styles.headerText, styles.lightText]}>Sadaf</Text>
          </View>
        }>
        <ThemedView style={styles.container}>
          <Text style={[styles.title, styles.lightText]}>Welcome!</Text>
          <View style={styles.toggleRow}>
            <Text style={[styles.modeLabel, styles.lightText]}>Husky Mode</Text>
            <Switch
              value={isManualMode}
              thumbColor={"rgb(0, 122, 255)"}
              onValueChange={() => setIsManualMode(!isManualMode)}
            />
            <Text style={[styles.modeLabel, styles.lightText]}>Manual Mode</Text>
          </View>
        </ThemedView>
      </ParallaxScrollView>

      {isManualMode && (
        <View style={styles.joystickContainer}>
          <View style={styles.dpad}>
            {renderButton('up', styles.up)}
            <View style={styles.middleRow}>
              {renderButton('left', styles.left)}
              <View style={styles.centerDot} />
              {renderButton('right', styles.right)}
            </View>
            {renderButton('down', styles.down)}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Ensure white background for the entire screen
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white', // Set background color to white
  },
  headerImage: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Poppins',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  lightText: {
    color: '#000', // Use light theme text color for all text
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  modeLabel: {
    fontSize: 16,
  },
  joystickContainer: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpad: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: 50,
    height: 50,
    backgroundColor: '#222',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  up: {
    position: 'absolute',
    top: 0,
  },
  down: {
    position: 'absolute',
    bottom: 0,
  },
  left: {
    marginRight: 20,
  },
  right: {
    marginLeft: 20,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  centerDot: {
    width: 14,
    height: 14,
    backgroundColor: '#555',
    borderRadius: 7,
  },
});
