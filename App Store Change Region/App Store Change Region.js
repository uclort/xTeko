
regionAll = [
  ["🇨🇳 中国", "cn"],
  ["🇺🇸 美国", "us"],
  ["🇯🇵 日本", "jp"],
  ["🇭🇰 香港", "hk"],
  ["🇨🇳 台湾", "tw"],
  ["🇲🇴 澳门", "mo"],
  ["🇰🇷 韩国", "kr"],
  ["🇮🇳 印度", "in"],
  ["🇸🇬 新加坡", "sg"],
  ["🇬🇧 英国", "uk"],
  ["🇫🇷 法国", "fr"],
  ["🇦🇺 澳大利亚", "au"],
  ["🇩🇪 德国", "de"],
  ["🇳🇱 荷兰", "nl"],
  ["🇨🇦 加拿大", "ca"],
  ["🇨🇴 哥伦比亚", "co"],
  ["🇰🇪 肯尼亚", "ke"],
  ["🇲🇾 马来西亚", "my"],
  ["🇲🇽 墨西哥", "mx"],
  ["🇵🇹 葡萄牙", "pt"],
  ["🇸🇦 沙特阿拉伯", "sa"],
  ["🇪🇸 西班牙", "es"],
  ["🇳🇿 新西兰", "nz"],
  ["🇮🇹 意大利", "it"],
  ["🇮🇱 以色列", "il"],
  ["🇪🇬 埃及", "eg"],
  ["🇨🇱 智利", "cl"],
  ["🇻🇳 越南", "vn"],
  ["🇵🇭 菲律宾", "ph"]
]

countries = regionAll.map(function (value) {
  return value[0]
})

version = $device.info.version

$ui.menu({
  items: countries,
  handler: function (title, idx) {
    let region = regionAll[idx][1]
    var url = ""
    if (versionCmp(version, '13') == 0) {
      url = "https://itunes.apple.com/" + region + "/movie";
    } else {
      url = "itms-apps://apps.apple.com/" + region + "/app"
    }
    $app.openURL(url)
  }
});


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