import { safeParseFloat } from 'lib/FormatUtils';

describe('safeParseFloat', () => {
  it('parse with , as thousands separator', () => {
    const parsed = safeParseFloat('1,000.57', 'en-US');
    expect(parsed).toBe(1000.57);
  });

  it('parse with . as thousands separator', () => {
    const parsed = safeParseFloat('1.000,57', 'it-IT');
    expect(parsed).toBe(1000.57);
  });

  it('parse number with correct multiple thousands separators', () => {
    const parsed = safeParseFloat('1,000,550', 'en-US');
    expect(parsed).toBe(1000550);
  });

  it('parse number with wrong multiple thousands separators', () => {
    const parsed = safeParseFloat('1,000,55', 'en-US');
    expect(parsed).toBe(100055);
  });

  it('parse number with multiple decimal separators', () => {
    const parsed = safeParseFloat('1.000.57', 'en-US');
    expect(parsed).toBe(1);
  });
});
