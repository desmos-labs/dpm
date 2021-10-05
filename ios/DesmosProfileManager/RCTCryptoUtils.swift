import Foundation
import CommonCrypto
import TrezorCrypto

class KeyPair {
  private var node: HDNode
  
  init(node: HDNode) {
    self.node = node
  }
  
  private static func ecdsa64(data:Data, curve:UnsafePointer<ecdsa_curve>) -> Data {
    var hashed = Data(repeating: 0, count: 65)
    data.withUnsafeBytes { (ptr: UnsafeRawBufferPointer)-> Void in
      hashed.withUnsafeMutableBytes { (keyPtr: UnsafeMutableRawBufferPointer) -> Void in
        ecdsa_get_public_key65(curve, ptr.baseAddress?.assumingMemoryBound(to: UInt8.self), keyPtr.baseAddress?.assumingMemoryBound(to: UInt8.self))
      }
    }
    
    return hashed
  }
  
  public var privateKey: Data {
    return Data(withUnsafeBytes(of: &node.private_key) { ptr in
      return ptr.map({ $0 })
    })
  }
  
  public var publicKey64: Data {
    //prefix(1byte) + data(64bytes)
    guard let curve = node.curve.pointee.params else {
      return Data()
    }
    return KeyPair.ecdsa64(data: privateKey, curve:curve)
  }
  
}

@objc(CryptoUtils)
class CryptoUtils: NSObject {
  
  @objc(deriveKeyPairFromMnemonic:withCoinType:withAccount:withChange:withIndex:withResolver:withRejecter:)
  func deriveKeyPairFromMnemonic(_ mnemonic:String, coinType: Int, account: Int, change: Int, index: Int,
                       resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
    if mnemonic_check(mnemonic) != 0 {
      let index = 0
      
      var seed = Data(repeating: 0, count: 64)
      seed.withUnsafeMutableBytes { (seedPtr: UnsafeMutableRawBufferPointer) -> Void in
        mnemonic_to_seed(mnemonic, "", seedPtr.baseAddress?.assumingMemoryBound(to: UInt8.self), nil)
      }
      
      var node = HDNode()
      let returnCode = seed.withUnsafeBytes { (dataPtr: UnsafeRawBufferPointer) -> Int32 in
        return hdnode_from_seed(dataPtr.baseAddress?.assumingMemoryBound(to: UInt8.self), Int32(seed.count), "secp256k1", &node)
      }
      
      if returnCode == 1 {
        let highestBit:UInt32 = 0x80000000
        let indexes: [UInt32] = [UInt32(44)|highestBit, UInt32(coinType)|highestBit, UInt32(account)|highestBit, UInt32(change), UInt32(index)]
        for index in indexes {
          hdnode_private_ckd(&node, index)
        }
        
        hdnode_private_ckd(&node, UInt32(0))
        let keyPair: KeyPair = KeyPair(node: node)
        
        let keyPairJSON = ["privkey": keyPair.privateKey.hex, "pubkey": keyPair.publicKey64.hex]
        
        resolve(keyPairJSON)
        
      } else {
        reject("event_mnemonic_generation", "invalid hd_node from seed", nil)
      }
    }
    else {
      reject("event_mnemonic_generation", "invalid mnemonic", nil);
    }
  }
}

extension Data {
    var hex: String {
        return self.map { b in String(format: "%02x", b) }.joined()
    }
}
