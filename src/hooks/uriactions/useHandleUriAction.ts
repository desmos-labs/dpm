import React from 'react';
import { UriActionType } from 'types/uri';
import useShowModal from 'hooks/useShowModal';
import GenericUriActionModal from 'modals/GenericUriActionModal';
import { getCachedUriAction } from 'lib/UriActions';

/**
 * Hook that provides a function that will handle the uri action
 * if present.
 */
const useHandleUriAction = () => {
  const showModal = useShowModal();

  return React.useCallback(() => {
    const action = getCachedUriAction();
    if (action !== undefined) {
      switch (action.type) {
        case UriActionType.UserAddress:
        case UriActionType.Generic:
          showModal(GenericUriActionModal, {
            action,
          });
          break;

        default:
          // @ts-ignore
          console.error(`Unsupported uri type: ${action.type}`);
          break;
      }
    }
  }, [showModal]);
};

export default useHandleUriAction;
