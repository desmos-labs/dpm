package network.desmos.dpm

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class CryptoUtilsTest {

    private val TEST_MNEMONIC =
    "battle call once stool three mammal hybrid list sign field athlete amateur cinnamon eagle shell erupt voyage hero assist maple matrix maximum able barrel"

    private fun String.decodeHex(): ByteArray {
        return this.chunked(2)
                .map { it.toInt(16).toByte() }
                .toByteArray()
    }

    @Test
    fun whenInputIsValid() {
        val coinType = 852
        val account = 0
        val index = 0

        val keyPair = CryptoUtils.deriveKeyPairFromMnemonic(TEST_MNEMONIC, coinType, 0, account, index)

        assertThat(keyPair.first).isEqualTo("25a3661952b3552bf1fabff41aa7f3bfce368621f9c500438d5676dda54b240e")
        assertThat(keyPair.second).isEqualTo("04f5bf794ef934cb419bb9113f3a94c723ec6c2881a8d99eef851fd05b61ad698d06fd2f63cc0c2c1b764b45335f31c5e3a7c68dbe47c2fcd2c73b716e6f761402")
    }

    @Test
    fun privKeyGen() {
        val testMnemonic = "where company destroy crowd random rack rigid slim still dune blur hammer enable flat select cement key huge live brain expect virus glory arrange"
        val keyPair = CryptoUtils.deriveKeyPairFromMnemonic(testMnemonic, 852, 0, 0, 0)

        assertThat(keyPair.first.decodeHex()).hasLength(32)
    }
}