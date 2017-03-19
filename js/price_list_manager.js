/**
 * Created by qwer on 19.03.17.
 */

let pricesFromOnliner = [], pricesFromSite = [];

/**
 * loadCsvFromOnliner
 */
function loadCsvFromOnliner() {
    $('.input-csv-from-onliner').parse({
        config: {
            delimiter: ";",
            header: false,
            newline: "\n",
            quotes: true,
            encoding: "Windows-1251",
            quoteChar: '"',
            complete: function (e, fileData) {
                try {
                    pricesFromOnliner = e.data.map((x) => [x[2], x[4]]);
                    $('.csv-from-onliner-name').text('Файл ' + fileData.name + ' успешно обработан.')
                        .removeClass('bg-danger').addClass('bg-success');
                } catch (error) {
                    $('.csv-from-onliner-name').text('Ошибка, что-то пошло не так.').addClass('bg-danger').removeClass('bg-success');
                    alert('Ошибка.')
                }
            }
        }
    });
}

/**
 * loadCsvFromSite
 */
function loadCsvFromSite() {
    $('.input-csv-from-site').parse({
        config: {
            delimiter: ",",
            header: true,
            newline: "\n",
            quotes: true,
            quoteChar: '"',
            complete: function (e, fileData) {
                try {
                    pricesFromSite = e.data.filter((x) => x['meta:name_from_onliner']).map(function (item) {
                        return {
                            'ID': item['ID'],
                            'meta:name_from_onliner': item['meta:name_from_onliner'],
                            'regular_price': item['regular_price'],
                        }
                    });
                    $('.csv-from-site-name').text('Файл ' + fileData.name + ' успешно обработан.')
                        .removeClass('bg-danger').addClass('bg-success');
                } catch (error) {
                    $('.csv-from-site-name').text('Ошибка, что-то пошло не так.').addClass('bg-danger').removeClass('bg-success');
                    alert('Ошибка.')
                }
            }
        }
    });
}

/**
 * calculateFileWithPrices
 */
function calculateFileWithPrices() {
    let pricesForMerging = pricesFromSite.map(function (siteItem) {
        siteItem['regular_price'] = pricesFromOnliner
            .find((x) => x[0] == siteItem['meta:name_from_onliner'].replace('&quot;', '"'))[1];

        return siteItem;
    }).map(function (item) {
        delete item['meta:name_from_onliner'];
        return item;
    });

    let csv = Papa.unparse(pricesForMerging, {
        delimiter: "~",
        header: true,
        newline: "\n",
        quotes: true,
        quoteChar: '"'
    });

    let encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    window.open(encodedUri);
}