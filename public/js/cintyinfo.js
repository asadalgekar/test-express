// Find distance start


const startCityInput = document.querySelector('#startCity');
const endCityInput = document.querySelector('#endCity');

const startCityOptionsDiv = document.querySelector('.start-options');
const endCityOptionsDiv = document.querySelector('.end-options');

const startCityAutoComplete = document.querySelectorAll('.auto-complete-start li');
const endCityAutoComplete = document.querySelectorAll('.auto-complete-end li');

const searchCityBar = document.querySelector("#startCity");
const endCityBar = document.querySelector("#endCity");

const startUl = document.querySelector('.auto-complete-start');
const endUl = document.querySelector('.auto-complete-end');
totalCityList = [];

searchCityBar.addEventListener('click', () => {
    startCityOptionsDiv.classList.toggle('active');
})
endCityBar.addEventListener('click', () => {
    endCityOptionsDiv.classList.toggle('active');
})

startCityAutoComplete.forEach(city => {
    city.addEventListener('click', () => {
        startCityInput.value = city.textContent.trim();
        startCityOptionsDiv.classList.remove('active');


    })
});
endCityAutoComplete.forEach(city => {
    city.addEventListener('click', () => {
        endCityInput.value = city.textContent.trim();
        endCityOptionsDiv.classList.remove('active');


    })
});

startCityAutoComplete.forEach(city => {
    totalCityList.push(city.textContent.trim());
})

startCityInput.addEventListener('keyup', () => {

    let filteredResult = [];
    let input = startCityInput.value.toLowerCase();
    if (input.length) {
        filteredResult = totalCityList.filter((keyword) => {
            return keyword.toLowerCase().includes(input);
        });
    } else {

        filteredResult = totalCityList;
    }

    displayFilteredResult(filteredResult, startUl)
});
endCityInput.addEventListener('keyup', () => {

    let filteredResult = [];
    let input = endCityInput.value;
    if (input.length) {
        filteredResult = totalCityList.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
    } else {

        filteredResult = totalCityList;
    }
    console.log(filteredResult)
    displayFilteredResult(filteredResult, endUl)
});


function displayFilteredResult(result, block) {
    // Select the <ul> element

    // Clear the previous results
    block.innerHTML = "";

    result.forEach(city => {
        const liTag = document.createElement('li');
        liTag.textContent = city;
        block.appendChild(liTag);
    });
}

// Find distance end