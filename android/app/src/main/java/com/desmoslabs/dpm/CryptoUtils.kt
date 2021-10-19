package com.desmoslabs.dpm

import org.bouncycastle.math.ec.ECPoint
import org.web3j.crypto.Bip32ECKeyPair
import org.web3j.crypto.MnemonicUtils

object CryptoUtils {

    private fun toHex(array: ByteArray): String {
        return array.joinToString(separator = "") { byte -> "%02x".format(byte) }
    }

    private fun pubKeyPointToArray(pubPoint: ECPoint): ByteArray {
        val normalizedPoint = if(pubPoint.isNormalized) pubPoint else pubPoint.normalize()

        val pubKeyX = normalizedPoint.affineXCoord.encoded
        val pubKeyY = normalizedPoint.affineYCoord.encoded
        val pubKey = ByteArray(65)
        pubKey[0] = 4;
        pubKeyX.copyInto(pubKey, 1)
        pubKeyY.copyInto(pubKey, 33)

        return pubKey
    }

    /**
     * Derive a Secp256k1 key pair from the provided mnemonic.
     * @param mnemonic - Mnemonic from which will be derived the key
     * @param coinType - HDPath coinType value.
     * @param account - HDPath account value.
     * @param change - HDPath change value.
     * @param index - HDPath index value.
     * @return Returns a pair of string where the first item is the hex encoded private key
     * and the second element is the hex encoded uncompressed public key.
     */
    fun deriveKeyPairFromMnemonic(mnemonic: String, coinType: Int, change: Int, account: Int, index: Int): Pair<String, String> {
        val seed = MnemonicUtils.generateSeed(mnemonic, null)
        val masterKey = Bip32ECKeyPair.generateKeyPair(seed)
        val path = intArrayOf((44 or -0x80000000), (coinType or -0x80000000), (account or -0x80000000), change, index)
        val derivedKeyPair = Bip32ECKeyPair.deriveKeyPair(masterKey, path)
        val privateKey = derivedKeyPair.privateKey.toByteArray()
        val pubKey = pubKeyPointToArray(derivedKeyPair.publicKeyPoint)

        return Pair(toHex(privateKey), toHex(pubKey))
    }

}