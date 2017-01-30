/**
 * Created by qwer on 27.01.17.
 */

/**
 * processProduct
 * @param product
 */
function processProduct(product) {
    let logInput = $('#log');
    logInput.val(product.extended_name + ' был добавлен\n' + logInput.val());
}