//
//  RCTCryptoUtilsTests.swift
//  RCTCryptoUtilsTests
//
//  Created by Leonardo on 06/10/21.
//

import XCTest
@testable import DesmosProfileManager

class RCTCryptoUtilsTests: XCTestCase {
  
  func testValidInputProduceCorrectKeyPair() {
    let testMnemonic = "battle call once stool three mammal hybrid list sign field athlete amateur cinnamon eagle shell erupt voyage hero assist maple matrix maximum able barrel"
    let coinType = 852
    let account = 0
    let index = 0
        
    let keyPair: Dictionary<String, String>? = try? NativeCryptoUtils.deriveKeyPairFromMnemonic(_: testMnemonic, coinType: coinType, account: account, change: 0, index: index)
    
    XCTAssertEqual(keyPair!["privkey"], "25a3661952b3552bf1fabff41aa7f3bfce368621f9c500438d5676dda54b240e")
    XCTAssertEqual(keyPair!["pubkey"], "04f5bf794ef934cb419bb9113f3a94c723ec6c2881a8d99eef851fd05b61ad698d06fd2f63cc0c2c1b764b45335f31c5e3a7c68dbe47c2fcd2c73b716e6f761402")
  }
}
