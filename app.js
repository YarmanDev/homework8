'use strict';
const appRoot = document.getElementById('app-root');

let mainTitle = createNewElement('h1', 'app-root__title'),
    choiceBlockType = createNewElement('div', 'app-root__choice-type'),
    choiceBlockQuery = createNewElement('div', 'app-root__choice-query'),
    typeSpan = createNewElement('span', 'choice-app__title-type'),
    querySpan = createNewElement('span', 'choice-app__title-query'),
    typeOptionsBlock = createNewElement('div', 'choice-app__options'),
    typeOptionBlock = createNewElement('div', 'choice-app__option'),
    typeOptionBlock2 = createNewElement('div', 'choice-app__option'),
    regionInput = createNewElement('input', 'choice-app__option-input',
        ["type", "radio"], ['name', 'searchingType'], ['id', 'region']),
    regionLabel = createNewElement('label', 'choice-app__option-label',
        ["for", "region"]),
    languageInput = createNewElement('input', 'choice-app__option-input',
        ["type", "radio"], ['name', 'searchingType'], ['id', 'language']),
    languageLabel = createNewElement('label', 'choice-app__option-label',
        ["for", "language"]),
    languageSelect = createNewElement('select', 'choice-app__select',
        ['name', 'query'], ['id', 'query'], ['disabled', 'true']),
    message = document.createElement("p"),
    table = createNewElement("table", 'app-root__table');


mainTitle.innerText = 'Countries Search';
typeSpan.innerText = 'Please choose type of search:';
regionLabel.innerText = 'By Region';
languageLabel.innerText = 'By Language';
querySpan.innerText = 'Please choose search query:';
message.innerText = 'No items, please choose search query';

const tableHead = `
<thead>
        <tr>
          <th id ='countryName'>Country name <div class="arrow not-sorted"><span></span></div></th>
          <th>Capital</th>
          <th>World Region</th>
          <th>Languages</th>
          <th id ='area'>Area <div class="arrow not-sorted"><span></span></div></th>
          <th>Flag</th>
        </tr>
</thead>
`;

function createNewElement(type, identifier, ...options) {
    let element = document.createElement(type);
    element.classList.add(identifier);

    if (options) {
        for (let i = 0; i < options.length; i++) {
            element.setAttribute(options[i][0], options[i][1]);
        }
    }
    return element;
}

let elementsForInsertation = [
    [appRoot, mainTitle, choiceBlockType, choiceBlockQuery],
    [choiceBlockType, typeSpan, typeOptionsBlock],
    [typeOptionsBlock, typeOptionBlock, typeOptionBlock2],
    [typeOptionBlock, regionInput, regionLabel],
    [typeOptionBlock2, languageInput, languageLabel],
    [choiceBlockQuery, querySpan, languageSelect]
];

const insertElements = ([place, ...elements]) => elements.forEach(element => place.appendChild(element));
const insertAllElements = (func, elements) => elements.forEach(el => func(el));
insertAllElements(insertElements, elementsForInsertation);

regionInput.addEventListener('click', function () {
    valueNotChosen();
    insertOptions(externalService.getRegionsList());
});
languageInput.addEventListener('click', function () {
    valueNotChosen();
    insertOptions(externalService.getLanguagesList());
});

function insertOptions(data) {
    let array = data;
    for (let i = 0; i < array.length; i++) {
        const option = document.createElement('option');
        option.value = array[i];
        option.innerText = array[i];
        languageSelect.appendChild(option);
    }
}

function valueNotChosen() {
    languageSelect.disabled = false;
    languageSelect.innerHTML = '<option selected disabled hidden>Select value</option>';
    message.hidden = false;
    table.hidden = true;
    insertElements([appRoot, message]);
}


languageSelect.addEventListener('change', function () {
    let data;
    if (languageInput.checked && languageInput.id === 'language') {
        data = externalService.getCountryListByLanguage(languageSelect.value);
    }
    if (regionInput.checked && regionInput.id === 'region') {
        data = externalService.getCountryListByRegion(languageSelect.value);
    }
    table.hidden = false;
    message.hidden = true;
    table.innerHTML = tableHead;
    createTable(data);
});

function createTable(data) {
    data.forEach(el => {
        let langs = [], allLanguages = '';
        for (let language in el.languages) {
            langs.push(el.languages[language]);
        }

        if (langs && langs.length > 1) {
            allLanguages = langs.join(', ');
        } else {
            allLanguages = langs + '';
        }
        let row = `
        <tr>
          <td>${el.name}</td>
          <td>${el.capital}</td>
          <td>${el.region}</td>
          <td>${allLanguages}</td>
          <td>${el.area}</td>
          <td> <img src="${el.flagURL}" alt=""></td>
        </tr>
        `;
        table.innerHTML += row;
    });
    insertElements([appRoot, table]);
    let countryName = document.querySelector('#countryName'),
        area = document.querySelector('#area');
    countryName.addEventListener('click', function () {
        arrowChanging(countryName, 'string');
    });

    area.addEventListener('click', function () {
        arrowChanging(area, 'number');
    });
    function arrowChanging(el, type) {
        table.innerHTML = tableHead;
        let arrow = table.querySelector('#' + el.id).children[0];
        arrow.className = togleTwoClasses(el);
        data = sortTable(data, type, arrow.className.split(' ')[0]);
        createTable(data);
    }
}

function sortTable(data, type, order) {
    let sortableData = data;
    switch (type) {
        case 'string':
            if (order === 'asc') {
                sortableData.sort((a, b) => a.name > b.name ? 1 : -1);
            }
            if (order === 'desc') {
                sortableData.sort((a, b) => a.name < b.name ? 1 : -1);
            }
            break;

        case 'number':
            if (order === 'asc') {
                sortableData.sort((a, b) => a.area > b.area ? 1 : -1);
            }
            if (order === 'desc') {
                sortableData.sort((a, b) => a.area < b.area ? 1 : -1);
            }
            break;
    }
    return sortableData;

}

function togleTwoClasses(el) {
    if (el.children[0].className === 'asc arrow') {
        el.children[0].className = 'desc arrow';
        return el.children[0].className;
    }
    if (el.children[0].className === 'desc arrow') {
        el.children[0].className = 'asc arrow';
        return el.children[0].className;
    }
    if (el.children[0].className === 'arrow not-sorted') {
        el.children[0].className = 'asc arrow';
        return el.children[0].className;
    }
}