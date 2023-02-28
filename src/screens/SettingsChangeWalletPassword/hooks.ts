import React, { useState } from 'react';
import { changeWalletsPassword } from 'lib/SecureStorage';

/**
 * Hook to change the user password.
 */
export const useChangeUserPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const changePassword = React.useCallback(async (oldPassword, newPassword) => {
    setLoading(true);
    const result = await changeWalletsPassword(oldPassword, newPassword);
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    changePassword,
  };
};
