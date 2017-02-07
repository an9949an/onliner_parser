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

    addToCsv(product.full_name, 'post_title', csv);
    addToCsv(product.id, 'ID', csv);
    //addToCsv(???, 'regular_price', csv);
    let images = product.gallery.map(function (image) {
        return image.large;
    }).join('|');
    addToCsv(images, 'images', csv);
    addToCsv(product.description, 'post_title', csv);
    //addToCsv(product.id, 'tax:product_cat', csv);
    addToCsv(getProductAttrValue('trunk', product), 'attribute:pa_bagazhnik', csv);
    addToCsv(getProductAttrValue('bike_forklock', product), 'attribute:pa_blokirovka', csv);
    //addToCsv(getProductAttrValue('', product), 'attribute:pa_cep', csv);
    addToCsv(getProductAttrValue('bike_color', product), 'attribute:pa_cvet', csv);
    addToCsv(getProductAttrValue('bwheel_diameter', product), 'attribute:pa_diametr-koles', csv);
    addToCsv(getProductAttrValue('common_date', product), 'attribute:pa_god-vypuska', csv);
    addToCsv(getProductAttrValue('caret_model', product), 'attribute:pa_karetka', csv);
    addToCsv(getProductAttrValue('absorberstroke', product), 'attribute:pa_khod-vilki', csv);
    addToCsv(getProductAttrValue('speednumber', product), 'attribute:pa_kolichestvo-skorostejj', csv);
    addToCsv(getProductAttrValue('back_speeds', product), 'attribute:pa_kolichestvo-zvezd-v-kassete', csv);
    addToCsv(getProductAttrValue('bike_basket', product), 'attribute:pa_korzina', csv);
    // addToCsv(getProductAttrValue('', product), 'attribute:pa_krylya', csv);
    addToCsv(getProductAttrValue('shifter_mod', product), 'attribute:pa_manetki', csv);
    addToCsv(getProductAttrValue('rim_material', product), 'attribute:pa_material-oboda', csv);
    addToCsv(getProductAttrValue('bike_material', product), 'attribute:pa_material-ramy', csv);
    addToCsv(getProductAttrValue('cassette_mod', product), 'attribute:pa_naimenovanii-kassety', csv);
    addToCsv(getProductAttrValue('system_model', product), 'attribute:pa_naimenovanii-sistemy', csv);
    addToCsv(getProductAttrValue('fork_model', product), 'attribute:pa_naimenovanii-vilki', csv);
    addToCsv(getProductAttrValue('pedals_model', product), 'attribute:pa_pedali', csv);
    addToCsv(getProductAttrValue('front_switch_mod', product), 'attribute:pa_perednijj-pereklyuchatel', csv);
    addToCsv(getProductAttrValue('fbrake_model', product), 'attribute:pa_perednijj-tormoz', csv);
    addToCsv(getProductAttrValue('bike_stand', product), 'attribute:pa_podnozhka', csv);
    //addToCsv(getProductAttrValue('', product), 'attribute:pa_podsedelnyjj-shtyr', csv);
    addToCsv(getProductAttrValue('tires_model', product), 'attribute:pa_pokryshka', csv);
    //addToCsv(getProductAttrValue('', product), 'attribute:pa_princip-dejjstviya-vilki', csv);
    //addToCsv(getProductAttrValue('', product), 'attribute:pa_pristavnye-kolesa', csv);
    //addToCsv(getProductAttrValue('нету', product), 'attribute:pa_razmer-ramy', csv);
    // addToCsv(getProductAttrValue('', product), 'attribute:pa_rost-rebenka', csv);
    // addToCsv(getProductAttrValue('разобраться', product), 'attribute:pa_rul', csv);
    // addToCsv(getProductAttrValue('разобраться', product), 'attribute:pa_rulevaya', csv);
    addToCsv(getProductAttrValue('saddle_model', product), 'attribute:pa_sedlo', csv);
    addToCsv(getProductAttrValue('bike_tyrewidth', product), 'attribute:pa_shirina', csv);
    addToCsv(getProductAttrValue('shifter_type', product), 'attribute:pa_tip-manetok', csv);
    //разобраться с двойными ободами
    // addToCsv(getProductAttrValue('double_rim', product), 'attribute:pa_tip-oboda', csv);
    addToCsv(getProductAttrValue('front_brake', product), 'attribute:pa_tip-perednego-tormoza', csv);
    addToCsv(getProductAttrValue('bike_class', product), 'attribute:pa_tip-velosipeda', csv);
    addToCsv(getProductAttrValue('fork_type', product), 'attribute:pa_tip-vilki', csv);
    addToCsv(getProductAttrValue('back_brake', product), 'attribute:pa_tip-zadnego-tormoza', csv);
    addToCsv(getProductAttrValue('bike_weight', product), 'attribute:pa_ves', csv);
    // addToCsv(getProductAttrValue('разобраться', product), 'attribute:pa_vozrast-rebenka', csv);
    addToCsv(getProductAttrValue('bike_hubs', product), 'attribute:pa_vtulka-perednyaya', csv);
    addToCsv(getProductAttrValue('bike_rearhub', product), 'attribute:pa_vtulka-zadnyaya', csv);
    addToCsv(getProductAttrValue('hardtail', product), 'attribute:pa_zadnijj-amortizator', csv);
    addToCsv(getProductAttrValue('back_switch_mod', product), 'attribute:pa_zadnijj-pereklyuchatel', csv);
    addToCsv(getProductAttrValue('bbrake_model', product), 'attribute:pa_zadnijj-tormoz', csv);
    addToCsv(getProductAttrValue('bike_crankcogs', product), 'attribute:pa_zubya-na-pervojj-zvezde', csv);
    addToCsv(getProductAttrValue('bike_bell', product), 'attribute:pa_zvonok', csv);


    let logInput = $('#log');
    logInput.val(product.extended_name + ' был добавлен\n' + logInput.val());
}

/**
 * createCsvArrayWithHeaders
 */
function createCsvArrayWithHeaders() {
    return [[
        'post_title',
        'ID',
        'regular_price',
        'images',
        'post_title',
        'tax:product_cat',
        'attribute:pa_bagazhnik',
        'attribute:pa_blokirovka',
        'attribute:pa_cep',
        'attribute:pa_cvet',
        'attribute:pa_diametr-koles',
        'attribute:pa_god-vypuska',
        'attribute:pa_karetka',
        'attribute:pa_khod-vilki',
        'attribute:pa_kolichestvo-skorostejj',
        'attribute:pa_kolichestvo-zvezd-v-kassete',
        'attribute:pa_korzina',
        'attribute:pa_krylya',
        'attribute:pa_manetki',
        'attribute:pa_material-oboda',
        'attribute:pa_material-ramy',
        'attribute:pa_naimenovanii-kassety',
        'attribute:pa_naimenovanii-sistemy',
        'attribute:pa_naimenovanii-vilki',
        'attribute:pa_pedali',
        'attribute:pa_perednijj-pereklyuchatel',
        'attribute:pa_perednijj-tormoz',
        'attribute:pa_podnozhka',
        'attribute:pa_podsedelnyjj-shtyr',
        'attribute:pa_pokryshka',
        'attribute:pa_princip-dejjstviya-vilki',
        'attribute:pa_pristavnye-kolesa',
        'attribute:pa_razmer-ramy',
        'attribute:pa_rost-rebenka',
        'attribute:pa_rul',
        'attribute:pa_rulevaya',
        'attribute:pa_sedlo',
        'attribute:pa_shirina',
        'attribute:pa_tip-manetok',
        'attribute:pa_tip-oboda',
        'attribute:pa_tip-perednego-tormoza',
        'attribute:pa_tip-velosipeda',
        'attribute:pa_tip-vilki',
        'attribute:pa_tip-zadnego-tormoza',
        'attribute:pa_ves',
        'attribute:pa_vozrast-rebenka',
        'attribute:pa_vtulka-perednyaya',
        'attribute:pa_vtulka-zadnyaya',
        'attribute:pa_zadnijj-amortizator',
        'attribute:pa_zadnijj-pereklyuchatel',
        'attribute:pa_zadnijj-tormoz',
        'attribute:pa_zubya-na-pervojj-zvezde',
        'attribute:pa_zubya-na-tretejj-zvezde',
        'attribute:pa_zubya-na-vtorojj-zvezde',
        'attribute:pa_zvonok',
        'attribute:Багажник',
        'attribute:Втулка задняя',
        'attribute:Звонок',
        'attribute:Крылья',
        'attribute:Пеги',
        'attribute:Подножка',
        'attribute:Размер в сложенном состоянии'
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
        throw 'Unknown attribute, fuck you, sucker!'
    }

    csv[csv.length - 1][index] = value;
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
            if(param.id == attrName){
                attrValue = param.value[0].value;

                return true;
            }
        })
    });

    if(!attrValueFound){
        console.log('Unknown product attribute ' + attrName + ', fuck you, sucker!');
    }

    return attrValue;
}