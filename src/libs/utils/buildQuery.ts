// Exclude keys from inputData
export function buildQuery<Data extends { [key: string]: any }, Key extends keyof Data>(
    baseUrl: string,
    data: Data,
): string {
    let queryString = baseUrl + '?'
    const keys = Object.keys(data)
    for (let key of keys) {
        const value = data[key]
        if (Array.isArray(value)) {
            value.forEach(i => queryString += `${key.toString()}=${i}&`)
        } else if (value) { queryString += `${key.toString()}=${value}&` }
    }
    return queryString
}
