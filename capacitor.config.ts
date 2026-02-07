import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.paulo.doecerto',   
  appName: 'DoeCerto',           
  webDir: 'out',
  
  server: {
    hostname: 'localhost',
    androidScheme: 'http'
  }
};

export default config;
