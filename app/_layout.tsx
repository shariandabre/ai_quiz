import { useFonts } from 'expo-font';
import { SplashScreen, Stack, Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../tamagui.config';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};


export default function Layout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      router.navigate("/(tabs)/")
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </Theme>
    </TamaguiProvider>
  );
}
