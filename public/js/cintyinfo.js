// Find distance start
const startCityDiv = document.querySelector('.select-city-start');
const endCityDiv = document.querySelector('.select-city-end');

// Add a click event listener to the selected div

const startCityInput = document.querySelector('#startCity');
const endCityInput = document.querySelector('#endCity');

const startCityOptionsDiv = document.querySelector('.start-options');
const endCityOptionsDiv = document.querySelector('.end-options');

const startCityAutoComplete = document.querySelectorAll('.auto-complete-start li');
const endCityAutoComplete = document.querySelectorAll('.auto-complete-end li');

const startUl = document.querySelector('.auto-complete-start');
const endUl = document.querySelector('.auto-complete-end');
totalCityList = [];




startCityDiv.addEventListener('click', () => {
    startCityOptionsDiv.classList.toggle('active');
});

endCityDiv.addEventListener('click', function() {
    endCityOptionsDiv.classList.toggle('active');
});


startCityAutoComplete.forEach(city => {
    city.addEventListener('click', () => {
        let value = city.textContent;
        startCityInput.value = value.replace(/\s+/g, ' ').trim();
        startCityOptionsDiv.classList.remove('active');
    })
});
endCityAutoComplete.forEach(city => {
    city.addEventListener('click', () => {
        let value = city.textContent;
        endCityInput.value = value.replace(/\s+/g, ' ').trim();
        endCityOptionsDiv.classList.remove('active');


    })
});

startCityAutoComplete.forEach(city => {
    totalCityList.push(city.textContent.trim());
})