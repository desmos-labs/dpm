import LocalWallet, {randomMnemonic} from './LocalWallet';

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

    it('sign', async () => {
        const REF_SIGN =
            'ce0558eb2f0847d4e58b29ca45f0a2a8764395b52c829888fa017aaf5b8b2e695e47aac9fe1cf77a66a1ba872d8a7e5302d31874b686973c0a5c196cca707667';
        let wallet = LocalWallet.fromMnemonic(TEST_MNEMONIC);

        const signature = await wallet.sign(Buffer.from('some simple data'));
        expect(signature.toString('hex')).toBe(REF_SIGN);
    });
});
