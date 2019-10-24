module.exports = {
  renderOpen: renderOpen
}

/// 表情大小限制 单位 kb
var maximumFileSize = 100000000

if ($app.env == $env.keyboard) {
  maximumFileSize = 100
}

if ($app.env == $env.today) {
  maximumFileSize = 400
}

favorites = require('scripts/favorites')
tool = require('scripts/tool')
update = require('scripts/update')

apiUrl = 'https://srv-ios.shouji.sogou.com/app/doutu/doutu_keyboard_search.php?'

/*  长按图片和点击图片  
    0 保存到剪贴板 
    1 保存到相册
*/
// 长按图片
var longTag = 1

// 点击图片
var tapTag = 0

// 当前页码
var page = 1

// 是否还有下一页
var pageNext = true

function renderOpen() {
  $ui.render({
    props: {
      title: '斗图'
    },
    views: [
      {
        type: 'button',
        props: {
          id: 'button-Favorites',
          title: '收藏夹'
        },
        layout: function (make) {
          make.right.top.inset(10)
          make.size.equalTo($size(64, 32))
        },
        events: {
          tapped: function (sender) {
            favorites.showFavorites()
            favorites.setPicData()
          }
        }
      },
      {
        type: 'button',
        props: {
          id: 'button-search',
          title: '搜索'
        },
        layout: function (make) {
          make.top.inset(10)
          make.right.equalTo($('button-Favorites').left).inset(5)
          make.size.equalTo($size(64, 32))
        },
        events: {
          tapped: function (sender) {

            $ui.toast(maximumFileSize);
            mime = 0
            search()
          }
        }
      },
      {
        type: 'input',
        props: {
          placeholder: '输入关键字'
        },
        layout: function (make) {
          make.top.left.inset(10)
          make.right.equalTo($('button-search').left).offset(-10)
          make.height.equalTo($('button-search'))
        },
        events: {
          ready: function (sender) {
            // if ($clipboard.text) {
            //     sender.text = $clipboard.text
            //     $delay(0.5, function() {
            //         search()
            //     })
            // }
          },
          returned: function (sender) {
            mime = 0
            page = 1
            search()
          }
        }
      },
      {
        type: 'button',
        props: {
          id: 'button-delete',
          title: '删除'
        },
        layout: function (make, view) {
          make.top.equalTo($('input').bottom).offset(10)
          make.left.inset(10)
          make.height.equalTo(32)
          make.width
            .equalTo(view.super.width)
            .multipliedBy(0.25)
            .offset(-(35 / 4))
        },
        events: {
          tapped: function (sender) {
            $photo.delete({
              count: 1,
              handler: function (success) { }
            })
          }
        }
      },
      {
        type: 'button',
        props: {
          id: 'button-paste',
          title: '粘贴'
        },
        layout: function (make, view) {
          make.top.equalTo($('input').bottom).offset(10)
          make.left.equalTo($('button-delete').right).offset(5)
          make.height.equalTo(32)
          make.width.equalTo($('button-delete').width)
        },
        events: {
          tapped: function (sender) {
            if ($clipboard.text) {
              $('input').text = $clipboard.text
            }
          }
        }
      },
      {
        type: 'button',
        props: {
          id: 'button-before',
          title: '上一页'
        },
        layout: function (make, view) {
          make.top.equalTo($('input').bottom).offset(10)
          make.left.equalTo($('button-paste').right).offset(5)
          make.height.equalTo(32)
          make.width.equalTo($('button-paste').width)
        },
        events: {
          tapped: function (sender) {
            if (page == 1) {
              $ui.toast('已经是第一页了')
              return
            }
            page--
            search()
          }
        }
      },
      {
        type: 'button',
        props: {
          id: 'button-after',
          title: '下一页'
        },
        layout: function (make, view) {
          make.top.equalTo($('input').bottom).offset(10)
          make.left.equalTo($('button-before').right).offset(5)
          make.height.equalTo(32)
          make.width.equalTo($('button-before').width)
        },
        events: {
          tapped: function (sender) {
            if (pageNext == false) {
              $ui.toast('已经是最后一页')
              return
            }
            page++
            search()
          }
        }
      },
      {
        type: 'matrix',
        props: {
          columns: 4,
          itemHeight: 88,
          spacing: 10,
          template: [
            {
              type: 'image',
              props: {
                id: 'image',
                align: $align.center
              },
              layout: $layout.fill
            },
            {
              type: 'label',
              props: {
                id: 'label',
                textColor: $color('clear'),
                align: $align.center
              },
              layout: $layout.fill,
              events: {
                longPressed: function (sender) {
                  $http.download({
                    url: sender.sender.text,
                    handler: function (resp) {
                      save(resp.data, longTag, sender.sender.text)
                    }
                  })
                }
              }
            }
          ]
        },
        layout: function (make) {
          make.left.bottom.right.equalTo(0)
          make.top.equalTo($('button-before').bottom).offset(10)
        },
        events: {
          didSelect: function (sender, indexPath, object) {
            $http.download({
              url: object.image.src,
              handler: function (resp) {
                save(resp.data, tapTag, object.image.src)
              }
            })
          }
        }
      },
      {
        type: 'label',
        props: {
          id: 'label-loading',
          lines: 0,
          text: '请粘贴剪贴板内容 or 输入关键字\n点击搜索',
          bgcolor: $color('#FFFFFF'),
          align: $align.center
        },
        layout: function (make, view) {
          make.top.equalTo(92)
          make.left.right.equalTo(0)
          make.bottom.equalTo(view.super.bottom)
        }
      }
    ]
  })
}

function save(resp, tag, url) {
  if (tag == 0) {
    $clipboard.image = resp.image
    $ui.toast('已经复制到剪贴板')
  } else {
    $ui.menu({
      items: ['分享', '保存到相册', '收藏'],
      handler: function (title, idx) {
        switch (idx) {
          case 0: // 分享
            {
              $share.sheet(resp.image)
            }
            break
          case 1: // 保存到相册
            {
              $photo.save({
                data: resp,
                handler: function (success) {
                  $ui.toast('已经保存到相册')
                }
              })
            }
            break
          case 2: // 收藏
            {
              tool.setFavorites(url, resp)
            }
            break
        }
      }
    })
  }
}

function search() {
  var loadingView = $('label-loading')
  loadingView.text = '加载中...'
  loadingView.hidden = false
  var keyword = $('input').text
  $('input').blur()
  var url = apiUrl + 'word=' + encodeURI(keyword) + '&page=' + page
  $console.info(url)
  $ui.loading(true)

  $http.request({
    method: "POST",
    url: url,
    timeout: 10,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "IPLOC=CN1100; SUV=002A2C8EDE8012235D76130CCBD08113"
    },
    body: {
      "S-COOKIE": "0XN6TEpCcd+02B9ozViWHJ/JU0FlR49mQppBHtSGE7HYd0y5g6cTTvZplQ8oSnUE/r2UINpvpvnWNDU8lyhCw3AavjTTiW/avrcrewikPPJig7VckhAwZkn+AXweElThTtpYEsQQlw9AfYLvnKxY6qLU7eL7agLZqXpTO7U2HDh904EYX8KGT11r8yI0p2Uq7eAcs1rAdJ8m/E6xIj22uO6oOEQeBOwLAMeSEIHXBGRrwiNssn/Fso9uc3XGn0wO5bRDeShk7+QhFIHaRH6a1jMrFlFKpnHYq9LWhkAreifUX3GlRS26WknNiyLDN4rdfI1TjUafdcu82IqI5V1Wt1CZOgzey15+FPU13U9lskCUjUnvY2Kt1lJRH/X/GR0+fJvzCNXLg8hsEY1jMRjQbR3ydNLUGu/jkuJK3mcgeJkxiKF4dGjaHwSxHG9PmrnKxNU1N3hsnLj+pxtlymMZPA=="
    },
    showsProgress: false,
    handler: function (resp) {
      $console.info(resp);
      if (resp.error) {
        loadingView.text = '网络错误'
        return
      }
      $ui.loading(false)
      loadingView.hidden = true
      var data = resp.data.data.list
      pageNext = resp.data.data.is_ending == 0
      setPicData(data)
    }
  })

}

function setPicData(data) {
  if (data.length == 0) {
    $('label-loading').text = '没有相关表情'
    $('label-loading').hidden = false
    return
  }
  let dataTuple = data.filter(function (item) {
    let fileSize = item.fileSize
    return (fileSize / 1000) < maximumFileSize
  })
  $console.info(dataTuple);
  let dataTupleUrl = dataTuple.map(function (item) {
    var imageUrl = item.imageUrl
    return imageUrl
  })

  var sdfs = dataTupleUrl.map(function (item) {
    return { image: { src: item }, label: { text: item } }
  })

  $('matrix').data = sdfs

  $('matrix').scrollTo({
    indexPath: $indexPath(0, 0),
    animated: false
  })
}

update.checkupVersion("https://raw.githubusercontent.com/nlnlnull/xTeko/master/doutu/UpdateInfo")