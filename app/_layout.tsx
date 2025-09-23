import { AuthProvider, useAuth } from '@/context/AuthContext';
import useSessionStore from '@/session/stores/useSessionStore';
import { initSyncForUser } from '@/session/sync';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const session = useSessionStore((s: any) => s.data);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    let unsubSync: (() => void) | null = null;
  const uid = user?.uid ?? null;
  const sessionStatus = session?.status ?? null;

    if (loaded && !isLoading) {
      SplashScreen.hideAsync();

      if (isAuthenticated && uid) {
        initSyncForUser(uid).then((unsub) => { unsubSync = unsub; }).catch(console.error);
      }

      // Only proceed with game logic if authenticated
      if (isAuthenticated && session) {
        if (!hasHydrated) {
          useSessionStore.getState().hydrate(session);
          setHasHydrated(true);
        }

        if (sessionStatus === 'active') {
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

    return () => {
      try { if (typeof unsubSync === 'function') unsubSync(); } catch {}
    };
  }, [loaded, isAuthenticated, isLoading, hasHydrated, router, user?.uid, session]);

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
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}