import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, RootState, store } from '@/game/session/store';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const session = useSelector((state: RootState) => state.session.data);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      if (session && session.status === 'active') {
        setInitialRoute('game');
      } else {
        setInitialRoute('index');
      }
      SplashScreen.hideAsync();
    }
  }, [loaded, session]);

  if (!loaded || !initialRoute) {
    return null;
  }

  return (
    <KeyboardProvider>
      <Stack
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          navigationBarHidden: true,
          statusBarHidden: true,
          keyboardHandlingEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
      </Stack>
    </KeyboardProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
