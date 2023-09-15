enum ROUTES {
  /**
   * Dev screen that allow to navigate freely between each app screen.
   */
  DEV_SCREEN = 'DEV_SCREEN',
  /**
   * Dev screen to showcase the components styles.
   */
  COMPONENTS_DEMO = 'COMPONENTS_DEMO',
  /**
   * Show the application splash screen.
   */
  SPLASH_SCREEN = 'SPLASH_SCREEN',
  /**
   * Screen used to display legal disclaimers to the user.
   */
  LEGAL = 'LEGAL',
  /**
   * Screen that is show to the user when don't have an account or want's
   * to create a new account.
   */
  LANDING = 'LANDING',
  /**
   * Screen that allow the user to select the length of the mnemonic that the
   * app will generate.
   */
  SELECT_NEW_MNEMONIC_LENGTH = 'SELECT_NEW_MNEMONIC_LENGTH',
  /**
   * Screen that allow the user to create a new wallet.
   */
  CREATE_NEW_MNEMONIC = 'CREATE_NEW_MNEMONIC',
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
  /**
   * Screen that allow the user to check that have written the
   * correct password before encrypting the wallet.
   */
  CHECK_WALLET_PASSWORD = 'CHECK_WALLET_PASSWORD',
  /**
   * Screen that saves in the new generated account in the device storage.
   */
  SAVE_GENERATED_ACCOUNT = 'SAVE_GENERATED_ACCOUNT',
  /**
   * Screen that allow the user to select from which chain an account should be
   * imported, this screen the navigates to IMPORT_ACCOUNT_SELECT_TYPE.
   */
  IMPORT_ACCOUNT_SELECT_CHAIN = 'IMPORT_ACCOUNT_SELECT_CHAIN',
  /**
   * Screen that allow the user how the account should be imported.
   * This screen then navigates to one of the following screen
   * based on what the user have selected:
   * * IMPORT_ACCOUNT_FROM_MNEMONIC if the type is WalletType.Mnemonic
   * * IMPORT_ACCOUNT_SELECT_LEDGER_APP if the type is WalletType.Ledger
   */
  IMPORT_ACCOUNT_SELECT_TYPE = 'IMPORT_ACCOUNT_SELECT_TYPE',
  /**
   * Screen that allow the user to import a wallet through a 12/24 words
   * mnemonic.
   */
  IMPORT_ACCOUNT_FROM_MNEMONIC = 'IMPORT_ACCOUNT_FROM_MNEMONIC',
  /**
   * Screen that allow the user to select which Ledger application to
   * use during the import procedure.
   */
  IMPORT_ACCOUNT_SELECT_LEDGER_APP = 'IMPORT_ACCOUNT_SELECT_LEDGER_APP',
  /**
   * Navigate to the stack that allow the user to connect to a ledger device.
   */
  CONNECT_TO_LEDGER_STACK = 'CONNECT_TO_LEDGER_STACK',
  /**
   * Screen that performs a bluetooth scan in order to find a Ledger device.
   */
  PERFORM_LEDGER_SCAN = 'PERFORM_LEDGER_SCAN',
  /**
   * Screen that performs a bluetooth scan in order to find a Ledger device.
   */
  CONNECT_TO_LEDGER = 'CONNECT_TO_LEDGER',
  /**
   * Route to the home drawer screen.
   */
  HOME_TABS = 'HOME_TABS',
  /**
   * Home screen.
   */
  HOME = 'HOME',
  /**
   * Screen that shows the currently active Wallet Connect sessions of the user.
   */
  WALLET_CONNECT_SESSIONS = 'WALLET_CONNECT_SESSIONS',
  /**
   * Screen that allow the user to approve or reject a WalletConnect
   * session proposal.
   */
  WALLET_CONNECT_SESSION_PROPOSAL = 'WALLET_CONNECT_SESSION_PROPOSAL',
  /**
   * Screen that allow the user to approve or reject a wallet connect request.
   */
  WALLET_CONNECT_REQUEST = 'WALLET_CONNECT_REQUEST',
  /**
   * Home screen.
   * Screen that allow the user to scan a WalletConnect qr code
   * to initialize a session.
   */
  SCAN_QR_CODE = 'SCAN_QR_CODE',
  /**
   * This is just a fake root so that we can add the
   * scan qr code button. The reeal scan qr code screen
   * is in the root stack navigation.
   */
  SCAN_QR_CODE_BOTTOM_BAR_BUTTON = 'SCAN_QR_CODE_BOTTOM_BAR_BUTTON',
  /**
   * Screen that shows the user the data of the Desmos Profile associated to the current profile wallet.
   */
  PROFILE = 'PROFILE',
  /**
   * Screen that allows the user to edit their profile's data.
   */
  EDIT_PROFILE = 'EDIT_PROFILE',
  /**
   * Screen that allows sending tokens to another user.
   */
  SEND_TOKENS = 'SEND_TOKENS',
  /**
   * Screen that shows the details of a single chain link.
   */
  CHAIN_LINK_DETAILS = 'CHAIN_LINK_DETAILS',
  /**
   * Screen that allow the user to unlock the wallet.
   */
  UNLOCK_WALLET = 'UNLOCK_WALLET',
  /**
   * Screen that show a preview of a transaction and allow the user
   * to broadcast it.
   */
  BROADCAST_TX = 'BROADCAST_TX',
  /**
   * Screen that displays the details of a transaction.
   */
  TRANSACTION_DETAILS = 'TRANSACTION_DETAILS',
  /**
   * Screen that displays a modal to the user.
   */
  MODAL = 'MODAL',
  /**
   * Screen that allows editing the application's settings.
   */
  SETTINGS = 'SETTING',

  // Following a list of settings screens.
  SETTINGS_DISPLAY_MODE = 'SETTINGS_DISPLAY_MODE',
  SETTINGS_SWITCH_CHAIN = 'SETTINGS_SWITCH_CHAIN',
  SETTINGS_ENABLE_BIOMETRICS_AUTHORIZATION = 'SETTINGS_ENABLE_BIOMETRICS_AUTHORIZATION',
  SETTINGS_CHANGE_APPLICATION_PASSWORD = 'SETTINGS_CHANGE_APPLICATION_PASSWORD',
  SETTINGS_JOIN_COMMUNITY = 'SETTINGS_JOIN_COMMUNITY',

  /**
   * Screen that allows rendering a Markdown text.
   */
  MARKDOWN_TEXT = 'MARKDOWN_TEXT',

  /**
   * Screen that allow the user to unlock the application and navigate to the home
   * screen.
   */
  UNLOCK_APPLICATION = 'UNLOCK_APPLICATION',

  // -------- STAKING RELATED ROUTES ------------------------
  /**
   * Screen that allow the user to select a validator.
   */
  SELECT_VALIDATOR = 'SELECT_VALIDATOR',
  /**
   * Screen that shows the details of a validator allowing the user
   * to delegate some tokens to them.
   */
  VALIDATOR_DETAILS = 'VALIDATOR_DETAILS',
  /**
   * Screen that allows the user to delegate an amount of tokens
   * to a previously selected validator.
   */
  STAKE = 'STAKE',
  /**
   * Screen that allows the user to see its delegations, redelegations
   * and unbonding delegations.
   */
  MANAGE_STAKING = 'MANAGE_STAKING',
  /**
   * Screen that shows the staking info of a validator like:
   * - Amount of coins that the user delegated to the validator;
   * - Current redelegation from the validator torward other ones;
   * - Unbonding delegations;
   * - Pending rewards.
   * and lets the user perform the following actions:
   * - Claim pending rewards;
   * - Stake more tokens toward the validator;
   * - Redelegate some tokens to another validator;
   * - Unbond some tokens from the validator.
   */
  VALIDATOR_STAKING_INFO = 'VALIDATOR_STAKING_INFO',
  /**
   * Screen that let the user redelegate an amount of tokens from a validator
   * to another one.
   */
  REDELEGATE = 'REDELEGATE',
  /**
   * Screen that let the user unbond an amount of tokens from a validator.
   */
  UNBOND_TOKENS = 'UNBOND_TOKENS',
  /**
   * Screen that shows the governance proposals and allow
   * the user to interact with them.
   */
  GOVERNANCE_PROPOSALS = 'GOVERNANCE_PROPOSALS',
  /**
   * Screen that shows the details of a governance proposal.
   */
  GOVERNANCE_PROPOSAL_DETAILS = 'GOVERNANCE_PROPOSAL_DETAILS',
}

export default ROUTES;
