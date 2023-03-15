// program to generate random strings

// declare all characters
const characters = process.env.SECRET || 'randomGenerated';

export function generateString(length: number): string {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
