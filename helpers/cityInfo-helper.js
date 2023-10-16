function parseCityNameAndCode(inputString) {
    const inputStringSplit = inputString.split("-").map(part => part.trim());
    const cityName = inputStringSplit[0];
    const cityCode = inputStringSplit[1];
    return { name: cityName, code: cityCode };

}

export { parseCityNameAndCode };