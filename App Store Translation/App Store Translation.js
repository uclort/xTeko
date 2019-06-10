/*
version-1.4-version
updateContent-去除脚本自动检查更新，以后的更新依赖于 Erots 脚本商店，本次更新之后打开脚本会提示安装 Erots 脚本商店。-updateContent
installUrl-jsbox://import?name=App Store Translation&url=https://raw.githubusercontent.com/nlnlnull/xTeko/master/App%20Store%20Translation/App%20Store%20Translation.js&icon=icon_162.png-installUrl
*/
/**erots
id: 5cea8d75d5de2b0070730938
build: 4
*/

// var tkkNumber = ""
// 更新内容 软件简介
var updateContent = "", descriptionContent = ""
// 更新内容翻译集合 软件简介翻译集合
var updateContentGroup = [], descriptionContentGroup = []

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
} else if ($app.env == $env.app) {
  // checkupVerAsion()
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
  $http.get({
    url: "https://itunes.apple.com/" + region + "/lookup?id=" + appid,
    handler: function (resp) {
      $ui.loading(false)
      if (resp.data) {
        $delay(0.5, function () {
          var result = resp.data.results[0]
          var description = result.description
          var releaseNotes = result.releaseNotes
          googleTran(releaseNotes, description)
        })
      } else {
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

//谷歌翻译
function googleTran(text, descriptionC) {
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
          googleTran(descriptionC, "")
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
  checkupVersion()
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
          text: "更新内容：",
          lines: 0,
          font: updateTitleFont,
          textColor: updateTitleColor,
          id: "update-title"
        },
        layout: function (make, view) {
          make.top.left.inset(10)
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
          make.top.equalTo($("update-content").bottom).offset(50)
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

//检查版本
function checkupVersion() {
  $ui.loading("正在检查更新...");
  $http.download({
    url: "https://raw.githubusercontent.com/nlnlnull/xTeko/master/App%20Store%20Translation/App%20Store%20Translation.js",
    showsProgress: false,
    timeout: 5,
    handler: function (resp) {
      $ui.loading(false);
      let newData = resp.data.string
      $console.info(newData);
      let versionRegex = /version-([\s\S]*?)-version/
      let updateContentRegex = /updateContent-([\s\S]*?)-updateContent/
      let installUrlRegex = /installUrl-([\s\S]*?)-installUrl/
      let newVersion = versionRegex.exec(newData)[1]
      let newUpdateContent = updateContentRegex.exec(newData)[1]
      let newInstallUrl = installUrlRegex.exec(newData)[1]
      $console.info(newVersion)
      $console.info(newUpdateContent)
      $console.info(newInstallUrl)
      let oldData = $addin.current.data.string
      let oldVersion = versionRegex.exec(oldData)[1]
      if (newVersion > oldVersion && $app.env == $env.app) { // 有新版本 并且是在主程序运行
        $ui.alert({
          title: "发现新版本",
          message: newUpdateContent,
          actions: [
            {
              title: "取消",
              disabled: false, // Optional
              handler: function () {

              }
            },
            {
              title: "更新",
              disabled: false, // Optional
              handler: function () {
                updateAddin(resp.data)
                // $app.openURL(encodeURI(newInstallUrl))
                // $app.close()
              }
            }
          ]
        })
      } else if (newVersion > oldVersion && $app.env != $env.app) {  // 有新版本 但是在非主程序运行
        $ui.alert({
          title: "发现新版本",
          message: "请在主程序运行本脚本更新",
          actions: [
            {
              title: "我知道了",
              disabled: false, // Optional
              handler: function () {
              }
            }
          ]
        })
      } else if (newVersion <= oldVersion && $app.env == $env.app) {  // 没有新版本 但是在主程序运行
        $ui.alert({
          title: "没有发现新版本",
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
    }
  })
}
//当前插件名
function currentName() {
  let name = $addin.current.name
  let end = name.length - 3
  return name.substring(0, end)
}

//升级插件
function updateAddin(app) {
  $addin.save({
    name: currentName(),
    data: app,
    icon: $addin.current.icon,
    handler: function (success) {
      if (success) {
        $device.taptic(2)
        $delay(0.15, function () {
          $device.taptic(2)
        })
        $ui.alert({
          title: "升级完成",
          actions: [{
            title: "OK",
            handler: function () {
              $app.openExtension($addin.current.name)
            }
          }
          ]
        })
      }
    }
  })
}

if (erotsInstall() == false && erotsInstall2() == false) {
  $ui.alert({
    title: "提示",
    message: "您尚未安装 Erots 脚本商店，此脚本已取消自动更新机制，以后的更新都在 Erots 脚本商店中发布，是否安装 Erots 脚本商店？（点击忽略则以后不再提示）",
    actions: [{
      title: "忽略",
      handler: function () {
        let data = $addin.current.data.string
        let newData = "//install" + "Erots\n" + data
        var newDatata = $data({
          string: newData
        })
        $addin.save({
          name: "App Store Translation",
          data: newDatata
        });
      }
    },
    {
      title: "安装",
      handler: function () {
        $ui.loading(true);
        $http.download({
          url: "https://github.com/LiuGuoGY/JSBox-addins/raw/master/Erots/.output/Erots.box?raw=true",
          showsProgress: false,
          timeout: 5,
          progress: function (bytesWritten, totalBytes) {
            var percentage = bytesWritten * 1.0 / totalBytes
            $ui.progress(percentage, "下载中...")
          },
          handler: function (resp) {
            var file = resp.data;
            $addin.save({
              name: "Erots",
              data: file,
              handler: function (success) {
                $ui.loading(false);
                $ui.alert({
                  title: "安装完成",
                  actions: [{
                    title: "确定",
                    handler: function () {
                      if ($app.env = $env.app) {
                        $addin.run("Erots")
                      }
                    }
                  }],
                });
              }
            });
          }
        });
      }
    }
    ]
  });
}

function erotsInstall() {
  var addins = $addin.list
  let i = addins.length
  while (i--) {
    let item = addins[i]
    let name = item.name
    if (name == "Erots") {
      return true
    }
  }
  return false
}
function erotsInstall2() {
  var dataString = $addin.current.data.string
  if (dataString.indexOf("install" + "Erots") != -1) {
    return true
  } else {
    return false
  }
}