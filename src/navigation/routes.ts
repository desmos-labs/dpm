enum ROUTES {
  /**
   * Dev screen that allow to navigate freely between each app screen.
   */
  DEV_SCREEN = 'DEV_SCREEN',
  /**
   * Screen that is show to the user when don't have an account or want's
   * to create a new account.
   */
  LANDING = 'LANDING',
  /**
   * Screen that allow the user to create a new wallet.
   */
  CREATE_WALLET = 'CREATE_WALLET',
  /**
   * Screen that allow the user to import a wallet through a 12/24 words
   * mnemonic.
   */
  IMPORT_RECOVERY_PASSPHRASE = 'IMPORT_RECOVERY_PASSPHRASE',
  /**
   * Screen that allow the user to check if the inserted
   * mnemonic is what he wrote down.
   */
  CHECK_MNEMONIC = 'CHECK_MNEMONIC',
  /**
   * Screen that allows the user to select which account to import.
   */
  SELECT_ACCOUNT = 'SELECT_ACCOUNT',
  /**
   * Screen that allow the user to create a password that will be
   * used to encrypt the user's wallets.
   */
  CREATE_WALLET_PASSWORD = 'CREATE_WALLET_PASSWORD',
}

export default ROUTES;
