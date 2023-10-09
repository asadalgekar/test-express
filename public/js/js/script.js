let searchBar = document.querySelector(".display-country");
let displayData = document.querySelector(".search-country");
let inputBox = document.querySelector(".search-input");
const allCountries = document.querySelectorAll('.country');
const displayDataDiv = document.querySelector(".display-data");
const searchTitle = document.querySelector(".search-title");
const searchLogo = document.querySelector(".search-logo");
const logoHref = document.querySelector("#urbanDiscoverifyLogo");


// search bar div
const countryNames = [];
searchBar.addEventListener('click', () => {
    displayData.classList.toggle("show-countries");
});

allCountries.forEach(element => {
    const aTag = element.querySelector('a');

    if (aTag) {
        countryNames.push(aTag.innerText.trim());
    }

});

const aTag = document.querySelector('.country-link');
aTag.addEventListener('click', () => {
    searchTitle.innerHTML = aTag.textContent.toUpperCase();
    searchLogo.style.display = "none";
    displayData.classList.toggle("show-countries");
});



inputBox.addEventListener('keyup', () => {
    let filteredResult = [];
    let input = inputBox.value;
    if (input.length) {
        filteredResult = countryNames.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
    } else {
        // If the input is empty, show the original results (countryNames)
        filteredResult = countryNames;
    }

    displayFilteredResult(filteredResult)
});


function displayFilteredResult(result) {
    displayDataDiv.innerHTML = ""; // Clear the previous results

    // Append the filtered results or original results to displayDataDiv
    result.forEach(name => {
        const anchorDiv = document.createElement('div');
        const anchor = document.createElement('a');
        anchor.textContent = name;
        anchorDiv.classList.add("country");
        anchorDiv.appendChild(anchor);
        displayDataDiv.appendChild(anchorDiv);
    });
}