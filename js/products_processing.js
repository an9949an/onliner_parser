/**
 * Created by qwer on 27.01.17.
 */

/**
 * processProduct
 * @param product
 * @param csv
 */
function processProduct(product, csv) {
    csv.push([]);

    addToCsv(product.id, 'ID', csv);

    let postTitle = product.name_prefix + ' ' + product.full_name + ' | ' + translit(product.full_name, -5);
    addToCsv(postTitle, 'post_title', csv);
    addToCsv(product.key, 'post_name', csv);
    addToCsv(product.description, 'post_content', csv);
    let images = product.gallery.map(function (image) {
        return image.large;
    }).join('|');
    addToCsv(images, 'images', csv);
    addToCsv(getCategories(product), 'tax:product_cat', csv);
    addToCsv('Купить ' + product.full_name + ' в Минске', 'meta:_aioseop_title', csv);

    if (product.prices) {
        addToCsv(product.prices.price_min.amount, 'regular_price', csv);
        addToCsv(product.prices.price_max.amount, 'price_max', csv);
    } else {
        addToCsv('0', 'regular_price', csv);
    }

    addAttributes(product, csv);

    let logInput = $('#log');
    logInput.val(product.extended_name + ' был добавлен\n' + logInput.val());
}

/**
 * addAttributes
 * @param product
 * @param csv
 */
function addAttributes(product, csv) {
    addToCsv(product.manufacturer.name, 'attribute:pa_brand', csv);

    product.parameters.forEach(function (parametersGroup) {
        parametersGroup.parameters.forEach(function (parameter) {
            if (parameter.value[0].type == "bool") {
                addToCsv(parameter.value[0].value ? 'Да' : 'Нет', 'attribute:pa_' + parameter.id, csv);
            } else {
                addToCsv(parameter.value[0].value, 'attribute:pa_' + parameter.id, csv);
            }
        })
    });

    addToCsv(product.manufacturer.legal_name + '. ' + product.manufacturer.legal_address, 'attribute:pa_manufacturer', csv);
}

/**
 * createCsvArrayWithHeaders
 */
function createCsvArrayWithHeaders() {
    return [[
        'post_title',
        'post_name',
        'ID',
        'regular_price',
        'price_max',
        'images',
        'tax:product_cat'
    ]]
}

/**
 * addToProductArray
 * @param value
 * @param attrName
 * @param csv
 */
function addToCsv(value, attrName, csv) {
    let index = _.indexOf(csv[0], attrName);
    if (index == -1) {
        csv[0].push(attrName);
        addToCsv(value, attrName, csv);
        return;
    }

    csv[csv.length - 1][index] = value;
}

/**
 * getCategories
 * @param product
 * @returns {string}
 */
function getCategories(product) {
    switch (product.name_prefix) {
        case 'Велосипед':
            return getBikeCategories(product);
            break;
        case 'Детский велосипед':
            return getKidBikeCategories(product);
            break;
    }
}

/**
 * getKidBikeCategories
 * @param product
 */
function getKidBikeCategories(product) {
    let categories = 'Детские велосипеды';
    categories += '|Детские велосипеды > Детские велосипеды ' + product.manufacturer.name;
    return categories;
}

/**
 * getBikeCategories
 * @param product
 * @returns {string}
 */
function getBikeCategories(product) {
    let categories = 'Велосипеды';
    let brandCategory = 'Велосипеды > Велосипеды ' + product.manufacturer.name;
    categories += '|' + brandCategory;

    let bikeClassCategories = getBikeClassCategories(product);
    bikeClassCategories.forEach(function (category) {
        categories += '|Велосипеды > ' + category;
        categories += '|' + brandCategory + ' > ' + category + ' ' + product.manufacturer.name;
    });

    // let commonDate = getProductAttrValue('common_date', product);
    // if (commonDate) {
    //     let brandYearCategory = 'Велосипеды > Велосипеды ' + product.manufacturer.name
    //         + ' ' + commonDate;
    //     categories += '|' + brandYearCategory;
    //
    //     bikeClassCategories.forEach(function (category) {
    //         categories += '|' + brandYearCategory + ' > ' + category + ' ' + product.manufacturer.name;
    //     });
    // }

    return categories;
}

/**
 * getBikeClassCategories
 * @param product
 */
function getBikeClassCategories(product) {
    let bikeClass = getProductAttrValue('bike_class', product);
    let bikeClassCategories = [];
    switch (bikeClass) {
        case 'горный':
            bikeClassCategories.push('Горные велосипеды');
            break;
        case 'городской':
            bikeClassCategories.push('Городские велосипеды');
            break;
        case 'гибридный':
            bikeClassCategories.push('Гибридные велосипеды');
            break;
        case 'шоссейный':
            bikeClassCategories.push('Шоссейные велосипеды');
            break;
        case 'комфортный':
            bikeClassCategories.push('Комфортные велосипеды');
            break;
        case 'круизер':
            bikeClassCategories.push('Велосипеды круизеры');
            break;
        case 'BMX':
            bikeClassCategories.push('Велосипеды BMX');
            break;
        case 'туристический':
            bikeClassCategories.push('Туристические велосипеды');
            break;
        case 'циклокроссовый':
            bikeClassCategories.push('Циклокроссовые велосипеды');
            break;
        case 'трековый':
            bikeClassCategories.push('Трековые велосипеды');
            break;
        case 'тандем':
            bikeClassCategories.push('Тандем велосипеды');
            break;
        case 'электровелосипед':
            bikeClassCategories.push('Электровелосипеды');
            break;
        case 'фэт-байк':
            bikeClassCategories.push('Фэт-байк велосипеды');
            break;
    }
    if (getProductAttrValue('female', product)) {
        bikeClassCategories.push('Женские велосипеды');
    }
    if (getProductAttrValue('bike_kid_teen', product)) {
        bikeClassCategories.push('Подростковые велосипеды');
    }
    if (getProductAttrValue('hardtail', product)) {
        bikeClassCategories.push('Двухподвесные велосипеды');
    }
    if (getProductAttrValue('folding_frame', product)) {
        bikeClassCategories.push('Складные велосипеды');
    }

    return bikeClassCategories;
}

/**
 * getProductAttrValue
 * @param attrName
 * @param product
 * @returns {*}
 */
function getProductAttrValue(attrName, product) {
    let attrValue, attrValueFound = product.parameters.some(function (item) {
        return item.parameters.some(function (param) {
            if (param.id == attrName) {
                attrValue = param.value[0].value;

                return true;
            }
        })
    });

    if (!attrValueFound) {
        console.log('Unknown product attribute ' + attrName + ', fuck you, sucker!');
    }

    return attrValue;
}