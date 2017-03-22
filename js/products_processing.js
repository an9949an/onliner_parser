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

    let postTitle = product.name_prefix + ' ' + product.full_name + ' | ' + transliterate(product.full_name, true);
    addToCsv(postTitle, 'post_title', csv);
    addToCsv(product.name, 'meta:name_from_onliner', csv);
    addToCsv(product.key, 'post_name', csv);
    addToCsv(_.shuffle(product.description.split(', ')).join(', '), 'post_content', csv);
    let images = product.gallery.map(function (image) {
        return image.large.replace('large', 'main');
    }).join('|');
    addToCsv(images, 'images', csv);
    addToCsv(getCategories(product), 'tax:product_cat', csv);
    addToCsv('Купить ' + product.full_name + ' в Минске', 'meta:_aioseop_title', csv);
    addToCsv('Купить ' + getProductAttrValue('bike_class', product) + ' велосипед ' + product.full_name + '. '
        + _.capitalize(_.shuffle(product.description.split(', ')).join(', ')) + '.',
        'meta:_aioseop_description', csv);

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
    let brandCategory = 'Велосипеды > ' + product.manufacturer.name;
    categories += '|' + brandCategory;

    let bikeClassCategories = getBikeClassCategories(product);
    bikeClassCategories.forEach(function (category) {
        categories += '|Велосипеды > ' + category;
        categories += '|' + brandCategory + ' > ' + category + ' ' + product.manufacturer.name;
    });

    let bwheelDiameter = getProductAttrValue('bwheel_diameter', product);
    if (bwheelDiameter) {
        let intDiameter = parseFloat(bwheelDiameter);
        let measurementUnit = intDiameter == 24 ? 'дюйма' : 'дюймов';
        categories += '|Велосипеды > ' + intDiameter + ' ' + measurementUnit;
    }

    let commonDate = getProductAttrValue('common_date', product);
    if (commonDate) {
        categories += '|Велосипеды > ' + commonDate;
    }

    if (product.prices) {
        if (product.prices.max > 10000000) {
            categories += '|Велосипеды > Дорогие';
        } else if (product.prices.max < 4000000) {
            categories += '|Велосипеды > Дешевые';
        }
    }

    let countryCategory = getCountryCategory(product);
    if (countryCategory) {
        categories += '|Велосипеды > ' + countryCategory;
    }

    let bikeColors = getProductAttrValue('bike_color', product);
    if (bikeColors) {
        bikeColors.split(', ').forEach(function (color) {
            categories += '|Велосипеды > ' + _.capitalize(color);
        });
    }

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
 * getCountryCategory
 * @param product
 */
function getCountryCategory(product) {
    switch (product.manufacturer.key) {
        case 'stels':
        case 'stinger':
        case 'shulz':
        case 'novatrack':
        case 'stark':
            return 'Российские';
            break;

        case 'fuji':
            return 'Японские';
            break;

        case 'aist':
            return 'Белорусские';
            break;

        case 'trek':
        case 'schwinn':
        case 'specialized':
            return 'Американские';
            break;

        case 'greenway':
        case 'nakxus':
            return 'Китайские';
            break;
    }
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
            bikeClassCategories.push('Горные');
            break;
        case 'городской':
            bikeClassCategories.push('Городские');
            break;
        case 'гибридный':
            bikeClassCategories.push('Гибридные');
            break;
        case 'шоссейный':
            bikeClassCategories.push('Шоссейные');
            break;
        case 'комфортный':
            bikeClassCategories.push('Комфортные');
            break;
        case 'круизер':
            bikeClassCategories.push('Круизеры');
            break;
        case 'BMX':
            bikeClassCategories.push('BMX');
            break;
        case 'туристический':
            bikeClassCategories.push('Туристические');
            break;
        case 'циклокроссовый':
            bikeClassCategories.push('Циклокроссовые');
            break;
        case 'трековый':
            bikeClassCategories.push('Трековые');
            break;
        case 'тандем':
            bikeClassCategories.push('Тандем');
            break;
        case 'электровелосипед':
            bikeClassCategories.push('Электровелосипеды');
            break;
        case 'фэт-байк':
            bikeClassCategories.push('Фэт-байк');
            break;
    }
    if (getProductAttrValue('female', product)) {
        bikeClassCategories.push('Женские');
    }
    if (getProductAttrValue('bike_kid_teen', product)) {
        bikeClassCategories.push('Подростковые');
    }
    if (getProductAttrValue('hardtail', product)) {
        bikeClassCategories.push('Двухподвесные');
    }
    if (getProductAttrValue('folding_frame', product)) {
        bikeClassCategories.push('Складные');
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