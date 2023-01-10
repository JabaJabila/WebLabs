const regex = new RegExp('^\\+79\\d{9}$');

function redirectToOrder() {
    let order = readOrder();
    if (!order.order.find(i => i[1] !== '0')) {
        toastr.error('Заказ пустой. Выбери, что будешь есть', 'Bruh...',
            {position: 'topRight', showMethod: 'fadeIn', hideMethod: 'fadeOut', preventDuplicates: true});
        return;
    }

    $.magnificPopup.open({
        items: {
            src: '<div id="details" class="order__detail-popup">\n' +
                '      <form onsubmit="return false">\n' +
                '        <p class="popup__main">На данный момент вы можете заказать только для самовывоза.</p>' +
                '        <p class="popup__main">Мы на карте: <span class="popup__address">г. Санкт-Петербург, Купчинская улица дом 25.</span></p>' +
                '        <p class="popup__main">В комментарии к заказу можете оставить желаемое время получения заказа.</p>' +
                '        <p class="popup__main">Оставить комментарий к заказу:</p>\n' +
                '        <label>\n' +
                '          <textarea class="order__detail-popup-com-input" id="order-comment" placeholder="любые пожелания.." />\n' +
                '        </label>\n' +
                '        <p class="popup__main">Введите телефон для связи и подтверждения заказа:</p>\n' +
                '        <label>\n' +
                '          <input maxlength="12" class="order__detail-popup-tel-input" type="tel" id="order-phone" required placeholder="+79219991122"/>\n' +
                '        </label><br>\n' +
                '            <dl class="order__container-items-final">' +
                '           </dl>' +
                '        <span class="order__total-final"></span>' +
                '        <br>' +
                '        <p class="popup__main">Нажимая на кнопку, вас перенаправят на страницу оплаты.</p>' +
                '        <button id="submit-order" onclick="submitOrder()">Заказать</button>\n' +
                '      </form>\n' +
                '    </div>',
            type: 'inline'
        },
        closeBtnInside: true
    });

    generateOrderList(order.order, 'order__container-items-final', 'order__total-final');
    if (order.order.find(i => i[0] === 'beer' && i[1] !== '0'))
        toastr.warning('При получении заказа на кассе, вам необходимо будет подтвердить возраст.', 'Внимание',
            {position: 'topRight', showMethod: 'slideDown', hideMethod: 'slideUp'});
}

function increaseValue(id) {
    let element = document.getElementById(id).previousElementSibling.children[1];
    let value = parseInt(element.value, 10);
    value = isNaN(value) || value < 0 ? 0 : value;
    value++;
    element.value = value;
    updateOrder();
}

function decreaseValue(id) {
    let element = document.getElementById(id).previousElementSibling.children[1];
    let value = parseInt(element.value, 10);
    value = isNaN(value) || value < 0 ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    element.value = value;
    updateOrder();
}

function updateOrder(toZero = false) {
    let positions = document.getElementsByClassName('meal-block__position');
    for (let position of positions) {
        let element = position.previousElementSibling.children[1];
        window.localStorage.setItem(position.id, toZero ? 0 : element.value);
        if (toZero) element.value = 0;
    }
    generateOrderList(readOrder().order, 'order__container-items', 'order__total');
}

function generateOrderList(order, listClassName, totalClassName) {
    let list = document.getElementsByClassName(listClassName)[0];
    console.log(list);
    list.innerHTML = '';
    let total = 0

    for (let position of order) {
        let info = getPositionInfo(position);

        if (info.amount > 0) {
            let elem = document.createElement('dt');
            let text = document.createTextNode(info.name + (info.amount === 1 ? '' : ' x' + info.amount));
            elem.appendChild(text);
            let inner = document.createElement('dd');
            let priceBlock = document.createTextNode(info.priceTotal + '₽');
            inner.appendChild(priceBlock);
            list.appendChild(elem);
            list.appendChild(inner);
            total += info.priceTotal;
        }
    }

    let totalBlock = document.getElementsByClassName(totalClassName)[0];
    totalBlock.innerHTML = total === 0 ? 'ТУТ ПОКА ПУСТО((' : 'ИТОГО: ' + total + '₽';
    document.getElementById('order__order_badge').innerHTML = total + '₽';
}

function getPositionInfo(position) {
    let info = {};
    info.id = position[0];
    let header = document.getElementById(info.id);
    let name = header.innerHTML.split(' - ')[0];
    let pricePerOne = parseInt(header.children[0].innerHTML.replace('₽', ''), 10);

    info.amount = parseInt(position[1], 10);
    info.pricePerOne = pricePerOne;
    info.name = name;
    info.priceTotal = info.amount * info.pricePerOne;

    return info;
}

function readOrder() {
    let order = { order: [] };
    let positions = document.getElementsByClassName('meal-block__position');
    for (let position of positions) {
        order.order.push([position.id, window.localStorage.getItem(position.id)]);
    }

    return order;
}

function submitOrder() {
    let validation = regex.exec(document.getElementById('order-phone').value);
    if (validation == null) {
        toastr.error('Неверный формат номера телефона', 'Ошибка',
            {position: 'topRight', showMethod: 'slideDown', hideMethod: 'slideUp', preventDuplicates: true});
        return;
    }

    toastr.success('Спасибо за ваш заказ', 'Успех',
        {position: 'topRight', showMethod: 'slideDown', hideMethod: 'slideUp', preventDuplicates: true});

    window.localStorage.clear();
    updateOrder(true);
    setTimeout(function () {
        location.reload();
    }, 3000);
}

function refillOrder() {
    let order = readOrder();
    generateOrderList(order.order, 'order__container-items', 'order__total');

    for (let item of order.order) {
        document.getElementById(item[0]).previousElementSibling.children[1].value = item[1];
    }
}

window.addEventListener("load", refillOrder);