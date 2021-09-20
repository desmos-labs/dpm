export function cropAddress(address: string, chars: number): string {
    const desmosIndex = address.indexOf("desmos");
    if (chars <= 0 || desmosIndex !== 0) {
        return "";
    }
    const rawAddress = address.slice(6);
    const firrstChars = rawAddress.slice(0, chars);
    const lastChars = rawAddress.slice(rawAddress.length - chars);

    return `desmos${firrstChars}...${lastChars}`;
}