import useShowModal from 'hooks/useShowModal';
import { useReturnToCurrentScreen } from 'hooks/useReturnToCurrentScreen';

/**
 * Hook that provide a functions to display and hide a modal.
 */
export const useModal = () => {
  const showModal = useShowModal();
  const { returnToCurrentScreen } = useReturnToCurrentScreen();

  return {
    showModal,
    hideModal: returnToCurrentScreen,
  };
};
