
module.exports = {
  addItem: addItem,
  deleteItem: deleteItem,
  clearList: clearList,
  getListData: getListData,
  diffTime: diffTime,
  changeItem: changeItem
}

dbStr = "CREATE TABLE TimeList(id text, time text, name text, description text, type integer, customImage integer, image BLOB, nameColor text, descriptionColor text, bgColor text, dateColor text, dateUnitColor text)"

pathHeder = "shared://Time-mmmmmmm"
path = `${pathHeder}/timeList.db`
if (!$file.exists(pathHeder)) {
  $file.mkdir(pathHeder)
}

function addItem(item) {
  var db = $sqlite.open(path)
  db.update(dbStr)
  db.update({
    sql: "INSERT INTO TimeList values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [item.id, item.time, item.name, item.description, item.type, item.customImage, item.image, item.nameColor, item.descriptionColor, item.bgColor, item.dateColor, item.dateUnitColor]
  });
  $sqlite.close(db);
}

function changeItem(item) {
  var db = $sqlite.open(path)
  db.update(dbStr)
  db.update({
    sql: "UPDATE TimeList SET time = ?, name = ?, description = ?, type = ?, customImage = ?, image = ?, nameColor = ?, descriptionColor = ?, bgColor = ?, dateColor = ?, dateUnitColor = ? WHERE id = ?",
    args: [item.time, item.name, item.description, item.type, item.customImage, item.image, item.nameColor, item.descriptionColor, item.bgColor, item.dateColor, item.dateUnitColor, item.id]
  });
  $sqlite.close(db);
}

function deleteItem(id) {
  var db = $sqlite.open(path);
  db.update({
    sql: "DELETE FROM TimeList where id = ?",
    args: [id]
  });
  $sqlite.close(db);
}

function clearList() {
  var db = $sqlite.open(path);
  db.update("DELETE FROM TimeList");
  $sqlite.close(db);
}

function getListData() {
  var db = $sqlite.open(path);
  db.update(dbStr)
  var object = db.query("SELECT * FROM TimeList");
  var result = object.result;
  var error = object.error;
  var dataTuple = []

  while (result.next()) {
    var values = result.values;
    let diff = diffTime(values.time, new Date().getTime())
    let hidden = false
    if (values.customImage == 0) {
      hidden = true
    }
    let imageData = values.image.image.resized($size(200, 200 * (values.image.image.size.height / values.image.image.size.width))).png
    let data = {
      listImage: { data: imageData },
      listName: { text: values.name, textColor: $color(values.nameColor) },
      listDescription: { text: values.description, textColor: $color(values.descriptionColor) },
      listTime: { text: diff[0], textColor: $color(values.dateColor) },
      listUnit: { text: diff[1], textColor: $color(values.dateUnitColor) },
      noListName: { text: values.name, textColor: $color(values.nameColor) },
      noListDescription: { text: values.description, textColor: $color(values.descriptionColor) },
      noListTime: { text: diff[0], textColor: $color(values.dateColor) },
      noListUnit: { text: diff[1], textColor: $color(values.dateUnitColor) },
      listType: values.type,
      listID: values.id,
      time: values.time,
      customImage: values.customImage,
      bigImage: values.image,
      imageView: { hidden: hidden, bgcolor: $color(values.bgColor) },
      noImageView: { hidden: !hidden, bgcolor: $color(values.bgColor) },
      type: { text: diff[2], textColor: $color(values.dateUnitColor) },
      noType: { text: diff[2], textColor: $color(values.dateUnitColor) }
    }
    dataTuple.unshift(data)
  }

  result.close();
  return dataTuple
}

function diffTime(startDate, endDate) {
  var diff = endDate - startDate

  //计算出相差天数
  var days = Math.floor(diff / (24 * 3600 * 1000));

  //计算出小时数
  var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数
  var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);

  var unit = "秒"
  var date = Math.abs(seconds)
  var dateType = "已过"
  if (seconds < 0) {
    dateType = "还有"
  }
  if (Math.abs(minutes) > 0) {
    unit = "分钟"
    date = Math.abs(minutes)
    if (minutes < 0) {
      dateType = "还有"
    }
  }
  if (Math.abs(hours) > 0) {
    unit = "小时"
    date = Math.abs(hours)
    if (hours < 0) {
      dateType = "还有"
    }
  }
  if (Math.abs(days) > 0) {
    unit = "天"
    date = Math.abs(days)
    if (days < 0) {
      dateType = "还有"
    }
  }
  return [date, unit, dateType];
}