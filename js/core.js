/**
 * Created by qwer on 25.01.17.
 */
var stopParsing = false;

/**
 * startParsing
 */
function startParsing(page) {
    stopParsing = false;

    var onlinerLinkInput = $('#onlinerLink');
    var siteCatalogLink = onlinerLinkInput.val();

    if (siteCatalogLink == '') {
        alert('Введите ссылку с Онлайнера')
        return;
    }

    onlinerLinkInput.prop('disabled', true);
    $('#parseButton').prop('disabled', true);

    var apiCatalogLink = (siteCatalogLink + '&page=' + page + '&group=1')
        .replace('https://catalog.onliner.by', 'https://catalog.api.onliner.by:443/search');
    sendRequest(apiCatalogLink, function process(data) {
        processCatalogPage(data);
    });
}

/**
 * processCatalogPage
 * @param data
 */
function processCatalogPage(data) {
    setTimeout(function () {

        getProductPage(data, function () {
            if (data.page.current < data.page.last && !stopParsing) {

                setTimeout(function () {
                    startParsing(++data.page.current);
                }, _.random(1500, 2000))

            } else {
                $('#onlinerLink').prop('disabled', false);
                $('#parseButton').prop('disabled', false);
                setProgressBarPosition(0, 0);
            }
        });

    }, _.random(1500, 2000));
}


/**
 * getProductPage
 * @param data
 * @param endCallback
 * @param startPosition
 */
function getProductPage(data, endCallback, startPosition) {
    startPosition = startPosition || 0;

    setProgressBarPosition(startPosition + (data.page.current - 1) * data.page.items, data.total);

    if (startPosition < data.page.items && !stopParsing) {
        sendRequest('https://catalog.api.onliner.by:443/products/' + data.products[startPosition].key
            + '?include=schema,configurations,gallery,parameters', function (product) {
            processProduct(product);

            setTimeout(function () {
                getProductPage(data, endCallback, ++startPosition)
            }, _.random(1500, 2000))
        })
    } else {
        endCallback();
    }
}

/**
 * sendRequest
 * @param url
 * @param callback
 */
function sendRequest(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;


        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            callback(JSON.parse(xhr.response));
        }
    }
}

/**
 * setProgressBarPosition
 * @param current
 * @param total
 */
function setProgressBarPosition(current, total) {
    var progressBar = $("#parsingProgressBar");
    if (!total) {
        progressBar.css("width", 0);
        return;
    }
    progressBar.css("width", function (index) {
        return 100 * current / total + '%';
    });
}