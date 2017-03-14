/**
 * Created by qwer on 25.01.17.
 */
let stopParsing = false;

/**
 * parseGenerator
 * @returns {boolean}
 */
function* parseGenerator() {
    if (!preStartParsing()) {
        return false;
    }

    let csv = createCsvArrayWithHeaders(), catalogPage;
    do {
        catalogPage = yield getCatalogPage(catalogPage ? ++catalogPage.page.current : 1);
        yield new Promise(resolve => setTimeout(resolve, _.random(1500, 2000)));
        yield new Promise(resolve => execute(parseProductsGenerator(catalogPage, csv), null, resolve));
    } while (catalogPage.page.current != catalogPage.page.last && !stopParsing);

    finishParsing(csv);

    return true;
}

/**
 * parseProductsGenerator
 * @param catalogPage
 * @param csv
 * @returns {boolean}
 */
function* parseProductsGenerator(catalogPage, csv) {
    for (let productFormCatalog of catalogPage.products) {
        try {
            processProduct(yield getProductPage(productFormCatalog), csv);
        } catch (err) {
            console.log('Ошибка при обработке товара:');
            console.log(productFormCatalog);
        }

        let productIndex = _.indexOf(catalogPage.products, productFormCatalog) + 1 + (catalogPage.page.current - 1) * catalogPage.page.limit;
        setProgressBarPosition(productIndex, catalogPage.total);

        if (stopParsing) break;
        yield new Promise(resolve => setTimeout(resolve, _.random(1500, 2000)));
    }

    return true;
}


/**
 * startParsing
 */
function getCatalogPage(page) {
    let siteCatalogLink = $('#onlinerLink').val();

    let apiCatalogLink = (siteCatalogLink + '&page=' + page + '&group=1')
        .replace('https://catalog.onliner.by', 'https://catalog.api.onliner.by:443/search');

    return sendRequest(apiCatalogLink);
}


/**
 * getProductPage
 * @param productFromCatalog
 */
function getProductPage(productFromCatalog) {
    return sendRequest('https://catalog.api.onliner.by:443/products/' + productFromCatalog.key
        + '?include=schema,configurations,gallery,parameters')
}

/**
 * sendRequest
 * @param url
 */
function sendRequest(url) {
    return fetch(url, {
        method: 'GET'
    }).then(function (response) {
        if (response.status !== 200) {
            return;
        }

        return response.json();
    })
}

/**
 * setProgressBarPosition
 * @param current
 * @param total
 */
function setProgressBarPosition(current, total) {
    let progressBar = $("#parsingProgressBar");
    if (!total) {
        progressBar.css("width", 0);
        return;
    }
    progressBar.css("width", function () {
        return 100 * current / total + '%';
    });
}

/**
 * execute
 * @param generator
 * @param yieldValue
 * @param resolveFn
 */
function execute(generator, yieldValue, resolveFn) {
    let next = generator.next(yieldValue);

    if (!next.done) {
        next.value.then(
            result => execute(generator, result, resolveFn),
            err => generator.throw(err)
        );
    } else {
        if (resolveFn) resolveFn(yieldValue);
    }
}

/**
 * finishParsing
 */
function finishParsing(csv) {
    $('#onlinerLink').prop('disabled', false);
    $('#parseButton').prop('disabled', false);
    setProgressBarPosition(0, 0);

    let csvContent = "data:text/csv;charset=utf-8,";
    csv.forEach(function (infoArray, index) {

        let dataString = infoArray.join("~");
        csvContent += index < csv.length ? dataString + "\n" : dataString;

    });
    let encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
    console.log('File downloaded');
    window.lastEncodedCsv = encodedUri;
    window.lastCsvContent = csvContent;
    window.lastCsv = csv;
}

/**
 * preStartParsing
 * @returns {boolean}
 */
function preStartParsing() {
    stopParsing = false;
    let onlinerLinkInput = $('#onlinerLink');

    if (onlinerLinkInput.val() == '') {
        alert('Введите ссылку с Онлайнера');
        return false;
    }

    onlinerLinkInput.prop('disabled', true);
    $('#parseButton').prop('disabled', true);

    return true;
}