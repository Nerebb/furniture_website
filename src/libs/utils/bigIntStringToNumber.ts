export default function bigIntStringToNumber(bigIntString: string): number {
    const bigInt = BigInt(bigIntString);
    const maxSafeInt = Number.MAX_SAFE_INTEGER;

    // Check if the BigInt is outside of the safe integer range
    if (bigInt > BigInt(maxSafeInt) || bigInt < BigInt(-maxSafeInt)) {
        throw new Error(`BigInt ${bigInt} is outside the range of safe integers.`);
    }

    return Number(bigInt);
}