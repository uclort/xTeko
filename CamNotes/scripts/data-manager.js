exports.loadNotes = () => {
  var db = $sqlite.open("camnots.db");
  db.update("CREATE TABLE Camnots(description text, fileName text)")
  var object = db.query("SELECT * FROM Camnots");
  var result = object.result;
  var error = object.error;

  var dataTuple = [];

  while (result.next()) {
    var values = result.values;
    dataTuple.push(values)
  }

  result.close();

  return dataTuple
}

exports.saveNotes = notes => {
  $file.delete("camnots.db")
  var db = $sqlite.open("camnots.db");
  db.update("CREATE TABLE Camnots(text text, image text)")
  notes.forEach(function (item) {
    let description = item.text
    let fileName = item.image
    db.update({
      sql: "INSERT INTO Camnots values(?, ?)",
      args: [description, fileName]
    });
  })
  $sqlite.close(db)
}