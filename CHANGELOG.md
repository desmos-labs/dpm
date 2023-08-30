# Version 2.4.0
## Features
- Compatibility with the new Desmos v6;
- Ability to search for a token send recipient using their DTag or nickname;
- Option to send a DSM amount based on its USD value;
- QR code generation for sharing your profile or receiving tokens.

# Version 2.3.2
## Features
- Now handles corrupted keychain data on iOS effectively.

## Bug Fixes
- Resolved a bug that caused the application to reset to the landing page while performing an account import process.

# Version 2.3.0
## Features
- Voting and Depositing on Governance Proposals: Users can now actively participate in governance by voting and depositing on proposals;
- Redesigned Bottom Bar: The home screen's bottom bar has been updated with a new design, enhancing the user experience;
- Hide User Balance Option: Users now have the flexibility to hide their balance from the home screen, providing more privacy;
- Profile Refresh Gesture: A pull-to-refresh gesture has been added to the Profile screen, allowing users to refresh their profile easily.

## Bug Fixes
- Crash on Deleting Last Account: The issue causing the application to crash when deleting the last account has been resolved;
- Improved Visualization of Delegations: Delegations with an amount equal to 0 are now hide;
- Profile Refresh Issue: Fixed the problem where the profile refresh upon returning to the Profile screen;
- Corrected `MsgExec` Description: The description for `MsgExec` has been fixed for better clarity;
- iOS Components Shadows: Shadows for components on iOS have been fixed to display correctly.

# Version 2.2.0
## Features
- New transaction list UI
- New transaction details UI

## Bug fixes
- Fixed a bug that caused the home to reload the transaction list after showing the detail of a transaction
- Fixed a bug that prevented the user to write their mnemonic

# Version 2.1.1
## Features
- Add support to Desmos `v5.x.x`

## Bug Fixes
- Fixed a bug that cause the application to not broadcast a transaction if the fee estimation times out;
- Fixed a bug on iOS that prevent the keyboard close on some screens.

# Version 2.1.0
## Features
- New Home screen design;
- Add possibility to stake, unstake, redelegate and claim your staking rewards;
- Add support to Desmos `v5.x.x`

## Bug Fixes

# Version 2.0.0
## Features
- Add support to import an account with the `m/44/118/0/0` using a Ledger device;
- Add support to import an account using Web3Auth;
- Add support to all the Desmos messages;
- Improve Ledger connection logic, now the application requests to the user to open the expected Ledger app;
- Removed Terra from the linkable chains;
- Add a splash screen to hide the user's info when the application is not on focus;
- Update Likecoin chain link to use the `like` address prefix;
- Add support to visualize user's linked applications in the profile screen.

## Bug Fixes

