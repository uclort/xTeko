var stationSection_section = $file.read('assets/station_names_section.json')
var stationSectionObject_anti = JSON.parse(stationSection_section.string)
var idString = ""

module.exports = {
    showStationList: showStationList,
    // giveData: giveData
}

function showStationList(id) {
    idString = id
    $ui.push({
        props: {
            id: "superView_Custom",
            title: "车站列表"
        },
        views: [{
            type: "input",
            props: {
                placeholder: "车站",
                id:"station_list",
                align: $align.center
            },
            layout: function(make) {
                make.top.equalTo(10)
                make.left.inset(10)
                make.height.equalTo(32)
            }
          },{
            type: "button",
            props: {
                title: "确定",
                id: "button_list",
                align: $align.center,
            },
            layout: function(make) {
                make.top.equalTo(10)
                make.right.inset(10)
                make.height.equalTo(32)
                make.left.equalTo($("station_list").right).offset(5)
                make.width.equalTo(80)
            },
            events: {
                tapped: function(sender) {
                    $(idString).text = $("station_list").text
                    $ui.pop()
                }
            }
          },{
            type: "list",
            props: {
              data: stationSectionObject_anti.data,
              stickyHeader: true
            },
            layout: function(make, view) {
                make.top.equalTo($("button_list").bottom).offset(10)
                make.left.right.bottom.equalTo(view.super)
            },
            events: {
                didSelect: function(sender, indexPath, data) {
                    $(idString).text = data
                    $ui.pop()
                },
                didScroll: function(sender) {
                    $("station_list").blur()
                }
            }
          },{
            type: "view",
            props: {
              id: "search_view"
            },
            layout: function(make, view) {
                make.right.bottom.equalTo(view.super)
                make.top.equalTo($("list"))
                make.right.equalTo(0)
                make.width.equalTo(50)
              }
          }]
    })
    var lastViewBottom = 50
    for(var value of stationSectionObject_anti.index){
        var searchButton = 
            {
              type: "button",
              props: {
                  title: value,
                bgcolor: $color("#FF0000"),
                font: $font(12)
              },
              layout: function(make, view) {
                make.top.equalTo(lastViewBottom)
                make.right.equalTo(-15)
                make.size.equalTo($size(15, 15))
              },
              events: {
                tapped: function(sender) {
                    let section = contains(stationSectionObject_anti.index,sender.title)
                    var indexPath = $objc("NSIndexPath").invoke("indexPathForRow:inSection:", 0, section)
                    $("list").runtimeValue().invoke("scrollToRowAtIndexPath:atScrollPosition:animated:", indexPath, 1, 0)
                }
              }
            }
            $("search_view").add(searchButton)
            lastViewBottom = lastViewBottom + 20
    }
}


function contains(arrays, obj) {
    var i = arrays.length;
    while (i--) {
        if (arrays[i] === obj) {
            return i;
        }
    }
    return false;
}