package com.desmosprofilemanager

import com.facebook.react.bridge.*


class CryptoUtilsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    override fun getName(): String {
        return "CryptoUtils"
    }


    @ReactMethod
    fun deriveKeyPairFromMnemonic(mnemonic: String, coinType: Int, account: Int, change: Int, index: Int, promise: Promise) {
        try {
            val keyPair = CryptoUtils.deriveKeyPairFromMnemonic(mnemonic, coinType, change, account, index)

            val map = Arguments.createMap()
            map.putString("privkey", keyPair.first)
            map.putString("pubkey", keyPair.second)

            promise.resolve(map)
        } catch (ex: Throwable) {
            promise.reject("-1", ex)
        }
    }

}