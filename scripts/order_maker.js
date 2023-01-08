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

function updateOrder() {
    let positions = document.getElementsByClassName('meal-block__position');
    for (let position of positions) {
        let element = position.previousElementSibling.children[1];
        window.localStorage.setItem(position.id, element.value);
    }
    generateOrderList(readOrder());
}

function generateOrderList(order) {
    let list = document.getElementsByClassName('order__container-items')[0];
    list.innerHTML = '';
    let total = 0

    for (let position of order.order) {
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

    let totalBlock = document.getElementsByClassName('order__total')[0];
    totalBlock.innerHTML = total === 0 ? 'ТУТ ПОКА ПУСТО((' : 'ИТОГО: ' + total + '₽';
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
    window.localStorage.clear();
    alert("Спасибо за ваш заказ!");
}

function refillOrder() {
    let order = readOrder();
    generateOrderList(order);

    for (let item of order.order) {
        document.getElementById(item[0]).previousElementSibling.children[1].value = item[1];
    }
}

window.addEventListener("load", refillOrder);