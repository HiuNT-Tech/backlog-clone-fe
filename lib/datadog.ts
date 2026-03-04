import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

let isInitialized = false;

export const initDatadog = () => {
  if (typeof window === 'undefined' || isInitialized) return;

  datadogRum.init({
    applicationId: 'fa8e60d9-0d66-43f5-9c1b-8119e41e5899',
    clientToken: 'pubcd564e08cb84d6f55f32158f998cd26e',
    site: 'us5.datadoghq.com',
    service: 'trello-fe',
    env: 'production',
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackResources: true,
    trackUserInteractions: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    plugins: [reactPlugin({ router: false })],
  });

  isInitialized = true;
};
