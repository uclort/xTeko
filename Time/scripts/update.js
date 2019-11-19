

module.exports = {
  checkupVersion: checkupVersion
}

fileName = "version_nlnlnull.txt"

function readLocalVersion() {
  let versionFile = $file.read(fileName)
  if (versionFile == undefined) {
    updateLocalVersion("1.0.0")
    return "1.0.0"
  } else {
    return versionFile.string
  }
}

function updateLocalVersion(version) {
  $file.write({
    data: $data({ string: version }),
    path: fileName
  })
}

currentVersion = readLocalVersion()

//检查版本
function checkupVersion(url) {
  $http.get({
    url: url,
    handler: function (resp) {
      let version = resp.data.version
      let message = resp.data.message
      let updateFileUrl = resp.data.updateFileUrl
      $cache.set("updateInfo", resp.data);

      $console.info("最新版本 -> " + version);
      $console.info("当前版本 -> " + currentVersion);

      if (versionCmp(version, currentVersion) == 1) {
        $ui.alert({
          title: "发现新版本，请手动备份 timeList.db 文件，更新完成后再放回原位置，否则更新完成可能会丢失已添加记录❗️❗️❗️",
          message: message,
          actions: [
            {
              title: "更新",
              handler: function () {
                $http.download({
                  url: updateFileUrl,
                  progress: function (bytesWritten, totalBytes) {
                    var percentage = bytesWritten * 1.0 / totalBytes
                    $ui.progress(percentage)
                  },
                  handler: function (resp) {
                    var file = resp.data;
                    $addin.save({
                      name: $addin.current.name,
                      icon: $addin.current.icon,
                      data: file,
                      handler: function (success) {
                        if (success) {
                          updateLocalVersion(version)
                          $addin.restart()
                        }
                      }
                    })
                  }
                });
              }
            },
            {
              title: "取消",
              handler: function () {
              }
            }
          ]
        });
      }
    }
  })
}

function versionCmp(s1, s2) {
  var a = s1.split('.').map(function (s) {
    return s2i(s);
  });
  var b = s2.split('.').map(function (s) {
    return s2i(s);
  });
  var n = a.length < b.length ? a.length : b.length;
  for (var i = 0; i < n; i++) {
    if (a[i] < b[i]) {
      return -1;
    } else if (a[i] > b[i]) {
      return 1;
    }
  }
  if (a.length < b.length) return -1;
  if (a.length > b.length) return 1;
  var last1 = s1.charCodeAt(s1.length - 1) | 0x20,
    last2 = s2.charCodeAt(s2.length - 1) | 0x20;
  return last1 > last2 ? 1 : last1 < last2 ? -1 : 0;
}

// 不考虑字母
function s2i(s) {
  return s.split('').reduce(function (a, c) {
    var code = c.charCodeAt(0);
    if (48 <= code && code < 58) {
      a.push(code - 48);
    }
    return a;
  }, []).reduce(function (a, c) {
    return 10 * a + c;
  }, 0);
}

