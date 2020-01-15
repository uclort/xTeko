module.exports = {
  addItem: addItem,
  changeItem: changeItem,
  getListData: getListData,
  getCycle: getCycle,
  deleteItem: deleteItem
}



dbStr = "CREATE TABLE TimeList(id text)"

pathHeder = "shared://TimeToCalculate"
path = `${pathHeder}/timeList.db`
if (!$file.exists(pathHeder)) {
  $file.mkdir(path)
}

let newWordGroup = [
  "startDate integer"
]

function initializationUpdate() {
  var db = $sqlite.open(path);
  db.update(dbStr)
  var object = db.query("SELECT * FROM TimeList");
  var result = object.result;
  newWordGroup.forEach(function (item) {
    var columnIndex = result.indexForName(item.split(" ")[0]);
    if (columnIndex == -1) {
      db.update(`ALTER TABLE TimeList ADD COLUMN ${item}`);
    }
  })
  $sqlite.close(db);
}
initializationUpdate()



function addItem(startDate) {
  var db = $sqlite.open(path)
  db.update({
    sql: "INSERT INTO TimeList values(?, ?)",
    args: [
      new Date().getTime(),
      startDate
    ]
  });
  $sqlite.close(db);
}

function changeItem(id, startDate) {
  var db = $sqlite.open(path)
  db.update(dbStr)
  db.update({
    sql: "UPDATE TimeList SET startDate = ? WHERE id = ?",
    args: [
      startDate,
      id
    ]
  });
  $sqlite.close(db);
}

function getCycle(index) {
  if (index == 0) {
    return "-"
  }
  let item = getData()[index - 1]
  return item.startDate
}

function getData() {
  var db = $sqlite.open(path);
  db.update(dbStr)
  var object = db.query("SELECT * FROM TimeList");
  var result = object.result;
  var dataTuple = []

  while (result.next()) {
    var values = result.values;
    dataTuple.push(values)
  }
  result.close();

  return dataTuple
}

function getListData() {
  var db = $sqlite.open(path);
  db.update(dbStr)
  var object = db.query("SELECT * FROM TimeList");
  var result = object.result;
  var dataTuple = []
  var index = 0
  while (result.next()) {
    var value = result.values;
    let startDate = value.startDate
    var end = new Date(startDate)
    end.setDate(end.getDate() + 7)
    let endDate = end.getTime()
    let cycle = "-"
    if (index > 0) {
      let previousItem = dataTuple[index - 1]
      var diff = startDate - previousItem.startDate.time
      //计算出相差天数
      var days = Math.floor(diff / (24 * 3600 * 1000));
      cycle = `${days} 天`
    }
    let id = value.id
    index += 1

    let startDateObject = new Date(startDate)
    let month = startDateObject.getMonth() + 1
    if (month > 11) month == 1
    let startDateText = `${startDateObject.getFullYear()} 年 ${month} 月 ${startDateObject.getDate()} 日`

    let endDateObject = new Date(endDate)
    let endMonth = endDateObject.getMonth() + 1
    if (endMonth > 11) endMonth == 1
    let endDateText = `${endDateObject.getFullYear()} 年 ${endMonth} 月 ${endDateObject.getDate()} 日`

    let itemInfo = {
      cycle: { text: cycle },
      startDate: { text: startDateText, time: startDate },
      endDate: { text: endDateText, time: endDate },
      index: index,
      id: id
    }
    dataTuple.push(itemInfo)
  }
  result.close();
  return dataTuple
}

function deleteItem(id) {
  var db = $sqlite.open(path);
  db.update({
    sql: "DELETE FROM TimeList where id = ?",
    args: [id]
  });
  $sqlite.close(db);
}