// Exclude keys from inputData
export function excludeField<Data, Key extends keyof Data>(
    data: Data,
    keys: Key[]
): Omit<Data, Key> {
    let deleteField = { ...data }
    for (let key of keys) {
        delete deleteField[key]
    }
    return deleteField
}
