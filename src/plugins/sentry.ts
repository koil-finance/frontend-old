import { App } from 'vue';
import { captureException, init, setTag } from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { version } from '../../package.json';
import { networkId } from '@/composables/useNetwork';
import { Network } from '@koil-finance/sdk';

// Using Sentry's vanila JS package (@sentry/browser) here instead of
// the official vue package (@sentry/vue) because it doesn't support vue 3 yet.
// https://github.com/getsentry/sentry-javascript/issues/2925

const ENV = process.env.VUE_APP_ENV || 'development';
const networkMap = {
  [Network.FUSE]: 'fuse-mainnet'
};
const environment = `${ENV}-${networkMap[networkId.value]}`;
const release = `frontend@${version}`;

export default function initSentry(app: App) {
  if (['production', 'staging'].includes(ENV)) {
    app.config.errorHandler = (error, _, info) => {
      try {
        setTag('info', info);
        captureException(error, {
          extra: {
            error: error
          }
        });
      } catch (error) {
        console.error('Failed to send error to Sentry', error);
      }
    };

    init({
      dsn:
        'https://d292b6ec7b6e4aa2801d972e06cb232c@o574636.ingest.sentry.io/5725878',
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
      environment,
      release
    });
  }
}
