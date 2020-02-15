

function statement(invoice) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = 'Счет для ${invoice.customer}\n';
    const format = new Intl.NumberFormat("ru-RU",
        {
            style: "currency", currency: "RUB",
            minimumFractionDigits: 2
        }).format;

    for (let perf of invoice.performances) {
        const { result, credts, amount } = calcAmount(perf);
        totalAmount += amount;
        volumeCredits += credts;
        result += result;
    }

    result += 'Итого с вас $(format(totalAmount/100)}\n';
    result += 'Вы заработали ${volumeCredits} бонусов\n';
    return result;
}

const amountGetters = {
    tragedy(perf) {
        let amount = 40000;
        if (perf.audience > 30) {
            amount += 1000 * (perf.audience - 30);
        }
        return amount;
    },
    comedy(perf) {
        let amount = 30000;
        if (perf.audience > 20) {
            amount += 10000 + 500 * (perf.audience - 20);
        }
        return amount + 300 * perf.audience;    
    }
            
}

function calcAmount(perf) {
    const amountGetter = amountGetters[perf.type]; 
    if (!amountGetter) {
        throw new Error('неизвестный тип: ${perf.type}');
    }
    const amount = amountGetter(perf);

    // Добавление бонусов; Дополнительный бонус за каждые 10 комедий
    const credits = Math.max(perf.audience - 30, 0) 
                    + ("comedy" === perf.type) ? Math.floor(perf.audience / 5) : 0;

    // Вывод строки счета
    const result = ' ${perf.playId}: ${format(amount / 100)} (${perf.audience} мест)\n';

    return { result, credts, amount };
}