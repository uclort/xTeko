// 更新内容 软件简介
var updateContent = "", descriptionContent = ""
// 更新内容 软件简介 英文原文
var updateContentOriginal = "", descriptionContentOriginal = ""
// 更新内容翻译集合 软件简介翻译集合
var updateContentGroup = [], descriptionContentGroup = []

var introduction = ""

var title = ""

var currentDisplayContent = 1

// 翻译步骤标识 
// 1 正在翻译更新内容 
// 2 正在翻译软件简介
var translationStep = 1

var link = $context.link

// 记录震动反馈，如果已经震动则不重复震动，除非从非满足条件到满足条件
var VFBool = false

updateTitleFont = $font("BodoniSvtyTwoOSITCTT-Bold", 20)
updateContentFont = $font("AppleSDGothicNeo-Bold", 16)
introductionTitleFont = updateTitleFont
introductionContentFont = updateContentFont

updateTitleColor = $color("#ef475d")
updateContentColor = $color("#4c1f24")
introductionTitleColor = updateTitleColor
introductionContentColor = updateContentColor

if (($app.env == $env.action) && link) {
  $ui.loading("正在获取内容...")
  // if (link) {
  // 获取 app id
  var regex = /.+id(\d+).*/
  var match = regex.exec(link)
  var appid = match[1]
  // 获取 app 区域
  var regexNew = /.com\/([a-z][A-z])\/app/
  var matchNew = regexNew.exec(link)
  var region = matchNew[1]
  if (appid) {
    lookup(appid, region)
  }
} else {
  $ui.alert({
    title: "环境错误",
    message: "请在 App Store 应用详情页分享运行此脚本",
    actions: [
      {
        title: "我知道了",
        disabled: false, // Optional
        handler: function () {
        }
      }
    ]
  })
}

function lookup(appid, region) {
  let url = "https://itunes.apple.com/" + region + "/lookup?id=" + appid
  $console.info(url)
  $http.get({
    url: url,
    handler: function (resp) {
      $ui.loading(false)
      if (resp.data) {
        $delay(0.5, function () {
          var result = resp.data.results[0]
          updateContentOriginal = result.releaseNotes
          descriptionContentOriginal = result.description
          title = result.trackName
          introduction = "AppID：" + result.trackId + "\n当前版本：" + result.version + "\n最近更新日期：" + result.currentVersionReleaseDate.replace(/[a-z,A-Z]/g, " ") + "\n当前价格：" + result.currency + "->" + result.formattedPrice + "\nbundleId：" + result.bundleId
          googleTran(updateContentOriginal)
        })
      } else {
        $ui.alert({
          title: "获取应用详情失败",
          message: "请检查网络，并重新尝试运行脚本，若还是存在问题，请尝试打开科学上网。",
          actions: [
            {
              title: "我知道了",
              disabled: false, // Optional
              handler: function () {
              }
            }
          ]
        })
      }
    }
  })
}

//谷歌翻译
function googleTran(text) {
  if (translationStep == 1) {
    $ui.loading("翻译中...")
  }
  $http.request({
    method: "POST",
    url: "http://translate.google.cn/translate_a/single",
    timeout: 5,
    header: {
      "User-Agent": "iOSTranslate",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: {
      "dt": "t",
      "q": text,
      "tl": "zh-CN",
      "ie": "UTF-8",
      "sl": "auto",
      "client": "ia",
      "dj": "1"
    },
    showsProgress: false,
    handler: function (resp) {
      if (resp.data) {
        if (translationStep == 1) {
          // 更新内容翻译完毕
          updateContentGroup = resp.data.sentences
          translationStep = 2
          googleTran(descriptionContentOriginal, "")
        } else if (translationStep == 2) {
          $ui.loading(false)
          // 软件简介翻译完毕
          descriptionContentGroup = resp.data.sentences
          show(updateContentGroup, descriptionContentGroup)
          $delay(1, function () {

          })
        } else {

        }
      } else {
        // 翻译出错
        $ui.alert({
          title: "网络错误",
          message: "请检查网络，并重新尝试翻译，若还存在问题，请尝试打开科学上网，脚本依赖于 Google 翻译。",
          actions: [
            {
              title: "我知道了",
              disabled: false, // Optional
              handler: function () {
              }
            }
          ]
        })
      }
    }
  })
}



function show(updateSentences, descriptionSentences) {
  var updateText = "", descriptionText = ""
  var updateLength = updateSentences.length
  var descriptionLength = descriptionSentences.length
  for (var i = 0; i < updateLength; i++) {
    var trans = updateSentences[i].trans
    updateText += trans
  }
  for (var i = 0; i < descriptionLength; i++) {
    var trans = descriptionSentences[i].trans
    descriptionText += trans
  }
  $console.info(updateText)
  $console.info(descriptionText)

  $ui.render({
    props: {
      title: title,
      navButtons: [
        {
          title: "Title",
          icon: "162", // Or you can use icon name
          handler: function () {
            if (currentDisplayContent == 1) {
              $("update-content").text = updateContentOriginal
              $("introduction-content").text = descriptionContentOriginal
              currentDisplayContent = 2
            } else {
              $("update-content").text = updateText
              $("introduction-content").text = descriptionText
              currentDisplayContent = 1
            }
          }
        }
      ]
    },
    views: [{
      type: "scroll",
      layout: $layout.fill,
      events: {
        didScroll: function (sender) {
          var pointOffsetY = sender.contentOffset.y * -1
          if (pointOffsetY >= 100 && VFBool == false) {
            VFBool = true
            $device.taptic(2)
          } else if (pointOffsetY < 100) {
            VFBool = false
          }
        },
        didEndDragging: function (sender) {
          var pointOffsetY = sender.contentOffset.y * -1
          if (pointOffsetY > 100) {
            $context.close()
          }
        }
      },
      views: [{
        type: "label",
        props: {
          text: "当前版本：",
          lines: 0,
          font: updateTitleFont,
          textColor: updateTitleColor,
          id: "update-version-title"
        },
        layout: function (make, view) {
          make.top.left.inset(10)
          make.width.equalTo(view.super).offset(-20)
        }
      }, {
        type: "label",
        props: {
          text: introduction,
          lines: 0,
          font: introductionContentFont,
          textColor: introductionContentColor,
          id: "update-version"
        },
        layout: function (make, view) {
          make.top.equalTo($("update-version-title").bottom).offset(5)
          make.left.inset(10)
          make.width.equalTo(view.super).offset(-20)
        }
      }, {
        type: "label",
        props: {
          text: "更新内容：",
          lines: 0,
          font: updateTitleFont,
          textColor: updateTitleColor,
          id: "update-title"
        },
        layout: function (make, view) {
          make.top.equalTo($("update-version").bottom).offset(30)
          make.left.inset(10)
          make.width.equalTo(view.super).offset(-20)
        }
      },
      {
        type: "label",
        props: {
          text: updateText,
          lines: 0,
          font: updateContentFont,
          textColor: updateContentColor,
          id: "update-content"
        },
        layout: function (make, view) {
          make.top.equalTo($("update-title").bottom).offset(5)
          make.left.equalTo($("update-title"))
          make.width.equalTo($("update-title"))
        }
      },
      {
        type: "label",
        props: {
          text: "应用介绍：",
          lines: 0,
          font: introductionTitleFont,
          textColor: introductionTitleColor,
          id: "introduction-title"
        },
        layout: function (make, view) {
          make.top.equalTo($("update-content").bottom).offset(30)
          make.left.equalTo($("update-content"))
          make.width.equalTo($("update-content"))
        }
      },
      {
        type: "label",
        props: {
          text: descriptionText,
          lines: 0,
          font: introductionContentFont,
          textColor: introductionContentColor,
          id: "introduction-content"
        },
        layout: function (make, view) {
          make.top.equalTo($("introduction-title").bottom).offset(5)
          make.left.equalTo($("introduction-title"))
          make.width.equalTo($("introduction-title"))
          make.bottom.equalTo(view.super).offset(-10)
        }
      }]
    }]
  })
}