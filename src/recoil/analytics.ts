import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { atom, useRecoilState } from 'recoil';
import { AnalyticsStatus } from 'types/analytics';

const DefaultAnalyticsStatus: AnalyticsStatus = {
  trackedOldCreatedAccount: false,
  userIdentified: false,
};

/**
 * Recoil atom for that keeps the analytics status.
 */
const analyticsStatusAppState = atom<AnalyticsStatus>({
  key: 'analyticsStatus',
  default: (() => {
    const savedAnalyticsStatus = getMMKV<AnalyticsStatus>(MMKVKEYS.ANALYTICS_STATUS);
    return savedAnalyticsStatus
      ? {
          // Extend the default settings object so that if we add a new key
          // this will take the value from the default settings.
          ...DefaultAnalyticsStatus,
          ...savedAnalyticsStatus,
        }
      : DefaultAnalyticsStatus;
  })(),
  effects: [
    ({ onSet }) => {
      onSet((newAnalyticsStatus) => {
        setMMKV(MMKVKEYS.ANALYTICS_STATUS, newAnalyticsStatus);
      });
    },
  ],
});

/**
 * Hook that provides the analytics status and a function to set the analytics status.
 */
export const useAnalyticsStatus = () => useRecoilState(analyticsStatusAppState);
