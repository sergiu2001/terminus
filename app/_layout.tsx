import { AuthProvider, useAuth } from '@/context/AuthContext';
import { hydrate } from '@/session/game/gameSessionSlice';
import { persistor, RootState, store } from '@/session/persistReduxStore';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const session = useSelector((state: RootState) => state.session.data);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();

      // Only proceed with game logic if authenticated
      if (isAuthenticated && session) {
        console.log('Session data:', session);

        if (!hasHydrated) {
          store.dispatch(hydrate(session));
          setHasHydrated(true);
        }

        if (session.status === 'active') {
          router.replace('/game');
        } else {
          router.replace('/');
        }
      } else if (isAuthenticated) {
        // Authenticated but no game session
        router.replace('/');
      } else {
        // Not authenticated, show auth screen
        router.replace('/auth');
      }
    }
  }, [loaded, isAuthenticated, isLoading, session?.status, session?.id, hasHydrated]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          navigationBarHidden: true,
          statusBarHidden: true,
          keyboardHandlingEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="auth" />
      </Stack>
    </KeyboardProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}