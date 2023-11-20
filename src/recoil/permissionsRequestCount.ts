import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { PermissionsRequestsCount } from 'types/permissions';

const defaultValue: PermissionsRequestsCount = {
  camera: 0,
  bluetooth: 0,
  notifications: 0,
};

/**
 * An atom that holds how many times a permissions has been asked to the user.
 */
const permissionsRequestsCountAppState = atom<PermissionsRequestsCount>({
  key: 'permissionsRequestsCount',
  default: (() => {
    const storedValue = getMMKV(MMKVKEYS.PERMISSIONS_REQUEST_COUNT) ?? {};
    return {
      ...defaultValue,
      ...storedValue,
    };
  })(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        setMMKV(MMKVKEYS.PERMISSIONS_REQUEST_COUNT, newValue);
      });
    },
  ],
});

/**
 * Recoil that allows to get a single permission request count.
 */
const permissionRequestsCountAppState = selectorFamily({
  key: 'permissionRequestsCountAppState',
  get:
    (key: keyof PermissionsRequestsCount) =>
    ({ get }) => {
      const permissionsRequestsCount = get(permissionsRequestsCountAppState);
      return permissionsRequestsCount[key] ?? 0;
    },
});

/**
 * Hook that provides the permissions requests count.
 */
export const usePermissionsRequestCount = () => useRecoilValue(permissionsRequestsCountAppState);

/**
 * Hook that provides a function to update the permissions requests count.
 */
export const useSetPermissionsRequestCount = () =>
  useSetRecoilState(permissionsRequestsCountAppState);
