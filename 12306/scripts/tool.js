module.exports = {
    currentDate: currentDate(),
    excessTicket: excessTicket
}

function currentDate() {
    // 获取当前日期
    var date = new Date();

    // 获取当前月份
    var nowMonth = date.getMonth() + 1;

    // 获取当前是几号
    var strDate = date.getDate();

    // 添加分隔符“-”
    var seperator = "-";

    // 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }

    // 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
    return nowDate
}

function excessTicket(resultTuple) {
    var normalSeat = (resultTuple[32] == "") ? "" : "商务座:"
    var firstClassSeat = (resultTuple[31] == "") ? "" : "       一等座:"
    var secondClass = (resultTuple[30] == "") ? "" : "      二等座:"
    var advancedSoftSleeper = (resultTuple[21] == "") ? "" : "      高级软卧:"
    var softSleeper = (resultTuple[23] == "") ? "" : "      软卧:"
    var moving = (resultTuple[33] == "") ? "" : "       动卧:"
    var hardSleeper = (resultTuple[28] == "") ? "" : "      硬卧:"
    var softSeat = (resultTuple[24] == "") ? "" : "     软座:"
    var hardSeat = (resultTuple[29] == "") ? "" : "     硬座:"
    var noSeat = (resultTuple[26] == "") ? "" : "       无座:"
    var excessTicketString = normalSeat + resultTuple[32] + firstClassSeat + resultTuple[31] + secondClass + resultTuple[30] + advancedSoftSleeper + resultTuple[21] + softSleeper + resultTuple[23] + moving + resultTuple[33] + hardSleeper + resultTuple[28] + softSeat + resultTuple[24] + hardSeat + resultTuple[29] + noSeat + resultTuple[26]
    $console.info(excessTicketString)
    return excessTicketString.replace(/^\s+|\s+$/g, "");
}