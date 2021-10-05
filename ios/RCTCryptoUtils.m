//
//  RCTCryptoUtils.m
//  DesmosProfileManager
//
//  Created by Leonardo on 05/10/21.

//  #import <Foundation/Foundation.h>

// RCTCryptoUtils.m
#import <React/RCTBridgeModule.h>

// To export a module named RCTCalendarModule
@interface RCT_EXTERN_MODULE(CryptoUtils, NSObject)

RCT_EXTERN_METHOD(deriveKeyPairFromMnemonic: (NSString*)mnemonic
                 withCoinType: (NSInteger*)coinType
                 withAccount: (NSInteger*)account
                 withChange: (NSInteger*)change
                 withIndex: (NSInteger*)index
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
@end
