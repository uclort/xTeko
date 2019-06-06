var tool = require('scripts/tool')

module.exports = {
    showFavorites: showFavorites,
    setPicData: setPicData
}

sortType = $cache.get("sortType")

function showFavorites() {

    // 0 倒序 1 正序
    if (sortType != 0 && sortType != 1) {
        sortType = 0
        $cache.set("sortType", sortType)
    }

    $ui.push({
        props: {
            id: "superView",
            title: "收藏夹",
            navButtons: [{
                title: "排序",
                handler: function (sender) {
                    
                    var topTitle = ""
                    var bottomTitle = ""
                    if (sortType == 0) {
                        topTitle = "倒序 √"
                        bottomTitle = "正序"
                    } else if (sortType ==1 ) {
                        topTitle = "倒序"
                        bottomTitle = "正序 √"
                    }
                    $ui.menu({
                        items: [topTitle, bottomTitle],
                        handler: function (title, idx) {
                            if (idx == 0 && sortType != 0) {
                                sortType = 0
                                $cache.set("sortType", sortType)
                                setPicData()
                            } else if (idx == 1 && sortType != 1) {
                                sortType = 1
                                $cache.set("sortType", sortType)
                                setPicData()
                            }
                        }
                    });
                }
            },
                {
                    title: "导出&导入",
                    handler: function (sender) {
                        $ui.menu({
                            items: ["导入", "导出"],
                            handler: function (title, idx) {

                                var db = $file.exists("favorites.db")
                                if (db == true) {
                                    $file.delete("favorites.db")
                                }

                                if (idx == 0) { // 导入
                                    $drive.open({
                                        handler: function (data) {

                                            var dataTuple = tool.favoritesItems(sortType)
                                            if (dataTuple.length > 0) {
                                                $ui.alert({
                                                    title: "提示",
                                                    message: "您当前收藏夹中有已收藏的表情，请选择替换已收藏还是添加到已收藏？",
                                                    actions: [
                                                        {
                                                            title: "替换",
                                                            disabled: false, // Optional
                                                            handler: function () {
                                                                importPic(data, 1)
                                                            }
                                                        },
                                                        {
                                                            title: "添加",
                                                            handler: function () {
                                                                importPic(data, 0)
                                                            }
                                                        }
                                                    ]
                                                });
                                            }
                                        }
                                    })
                                } else { // 导出

                                    var db = $sqlite.open("favorites.db")
                                    db.update("CREATE TABLE Favorites(url text, image BLOB)")

                                    var dataTuple = tool.favoritesItems(sortType)
                                    dataTuple.forEach(element => {
                                        db.update({
                                            sql: "INSERT INTO Favorites values(?, ?)",
                                            args: [element.key, element.value]
                                        });
                                    });
                                    $sqlite.close(db);
                                    var data = $file.read("favorites.db")
                                    $share.sheet(["favorites.db", data])
                                }
                            }
                        });

                    }
                }
            ]
        },
        views: [{
            type: "matrix",
            props: {
                id: "matrix-favorites",
                columns: 4,
                itemHeight: 88,
                spacing: 10,
                template: [{
                    type: "image",
                    props: {
                        id: "image",
                        align: $align.center,
                    },
                    layout: $layout.fill
                }, {
                    type: "label",
                    props: {
                        id: "label",
                        textColor: $color("clear"),
                        align: $align.center,
                    },
                    layout: $layout.fill,
                    events: {
                        longPressed: function (sender) {
                            $ui.menu({
                                items: ["分享", "保存到相册", "取消收藏"],
                                handler: function (title, idx) {
                                    switch (idx) {
                                        case 0: // 分享
                                            {
                                                $share.sheet(tool.getFavoritesData(sender.sender.text).image)
                                            }
                                            break;
                                        case 1: // 保存到相册
                                            {
                                                $photo.save({
                                                    data: tool.getFavoritesData(sender.sender.text),
                                                    handler: function (success) {
                                                        $ui.toast("已经保存到相册")
                                                    }
                                                })
                                            }
                                            break;
                                        case 2: // 取消收藏
                                            {
                                                tool.removeFavorites(sender.sender.text)
                                                setPicData()
                                            }
                                            break;
                                    }
                                }
                            })
                        }
                    }
                }]
            },
            layout: function (make) {
                make.top.left.bottom.right.equalTo(0)
            },
            events: {
                didSelect: function (sender, indexPath, object) {
                    $clipboard.image = object.image.data.image
                    $ui.toast("已经复制到剪贴板")
                }
            }
        }, {
            type: "label",
            props: {
                id: "label-loading2",
                lines: 0,
                text: "没有收藏表情",
                bgcolor: $color("#FFFFFF"),
                align: $align.center
            },
            layout: function (make, view) {
                make.top.bottom.left.right.equalTo(0)
            }
        }
        ]
    })
}


function setPicData() {
    var dataTuple = tool.favoritesItems(sortType)
    var dataGroup = dataTuple.map(function (item) {
        return { image: { data: item.value }, label: { text: item.key } }
    })

    if (dataGroup.length == 0) {
        $("label-loading2").hidden = false
        return
    } else {
        $("label-loading2").hidden = true
    }

    $("matrix-favorites").data = dataGroup

}

function importPic(data, type) {
    if (type == 1) { // 替换
        tool.clearFavorites()
    }
    $file.write({
        data: data,
        path: "favorites.db"
    })

    var db = $sqlite.open("favorites.db")
    db.update("CREATE TABLE Favorites(url text, image BLOB)")
    var rs = db.query("SELECT * FROM Favorites");
    var result = rs.result;
    while (result.next()) {
        var url = result.get("url");
        var image = result.get("image");
        tool.setFavorites(url, image)
    }
    setPicData()
}