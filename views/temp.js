else {
    // res.json({ message: 'Error with API server, please go back to the home page and try again after few seconds.' });
    const headers = {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    };

    const requestOne = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${endCityInfo.countryCode}`, { headers });
    const responseOne = await requestOne;
    const dataOne = responseOne.data.data;

    await new Promise(resolve => setTimeout(resolve, 1500));

    const requestTwo = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${endCityInfo.countryCode}`, { headers });
    const responseTwo = await requestTwo;
    const dataTwo = responseTwo.data.data;

    await new Promise(resolve => setTimeout(resolve, 1500));
    const cityIdMap = {};
    dataTwo.forEach(element => { cityIdMap[element.city] = element.id; });
    try {
        const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/places/${cityIdMap[startCityInfo.cityName]}/distance?toPlaceId=${cityIdMap[endCityInfo.cityName]}`, {
            headers: {
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        distance = response.data.data;
    } catch (error) {
        console.error('Error with API server, please go back to the home page and try again after few seconds:', error);
        return res.status(500).json({ error: 'An error occurred on the server while calculating distances, please go back to the main page and try again after few seconds.' });
    }

    res.render('country', { distance, dataOne, dataTwo });
}


// 
function extractCityAndCountry(inputString) {
    // Define a regular expression pattern to match city name and country code
    let pattern = /(.+)\s*\(\s*([A-Z]+)\s*\)/;

    // Use the regular expression to match and capture the city name and country code
    let matches = inputString.match(pattern);

    if (matches && matches.length === 3) {
        let cityName = matches[1].trim();
        let countryCode = matches[2];
        return { cityName, countryCode };
    } else {
        return null; // Return null if no match is found
    }
}