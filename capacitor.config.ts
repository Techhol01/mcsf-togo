import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.mcsf.togo',
  appName: 'MCSF',
  webDir: 'www',
  server: {
    // App loads the published PWA. Change to your custom domain later if needed.
    url: 'https://mcsf-togo.lovable.app',
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0b2540',
  },
};

export default config;
