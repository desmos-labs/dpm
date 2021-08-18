import LocalWallet, {randomMnemonic} from './LocalWallet';
import {fromHex, toHex} from "@cosmjs/encoding";

describe('LocalWallet', () => {
    const TEST_MNEMONIC =
        'battle call once stool three mammal hybrid list sign field athlete amateur cinnamon eagle shell erupt voyage hero assist maple matrix maximum able barrel';

    it('mnemonic generation', async () => {
        let mnemonic = randomMnemonic();
        expect(mnemonic.split(' ')).toHaveLength(24);

        mnemonic = randomMnemonic(24);
        expect(mnemonic.split(' ')).toHaveLength(24);

        mnemonic = randomMnemonic(12);
        expect(mnemonic.split(' ')).toHaveLength(12);
    });

    it('bech32 address generation', () => {
        let wallet = LocalWallet.fromMnemonic(TEST_MNEMONIC);

        expect(wallet.bech32Address).toBe(
            'desmos1k8u92hx3k33a5vgppkyzq6m4frxx7ewnlkyjrh',
        );
    });

    it('test tx sign', async () => {
        const expectedSignHex = "78bd0740bc4b0667929f16e22d9acfa13cb98ce965539165de7747c353c5f0887db617d253ceb6fd45fa70aad4f92e3fdb66e6b0040b7dc985141ab0943f9302";
        const docHex = "0a90010a8a010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e64126a0a2d6465736d6f73316e6d366b68366a77716d73657a77746e6d676464347734747a796b3966386776717535656e30122d6465736d6f7331763039796c79786134667a71386579773478346a68326a326671786b7874326d3464346463611a0a0a057374616b6512013118c53c12670a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21023dd11c188b908abc3a25a14e726a6c4da71a4fd4bb2ece442e4d1df6490704cc12040a020801180712130a0d0a057374616b6512043230303010e0a7121a0974657374636861696e2001";
        const serializedWallet = "{\"version\":1,\"privateKey\":\"W6lu5I7xnk4pZjs5eiwq/AeONGeejlWJ/JOOc3qAD0I=\",\"derivationPath\":\"m/44'/852'/0'/0/0\"}";

        let wallet = LocalWallet.deserialize(serializedWallet);
        const docBuffer = fromHex(docHex)
        const signature = await wallet.sign(docBuffer);
        expect(toHex(signature)).toEqual(expectedSignHex);
    })
});
