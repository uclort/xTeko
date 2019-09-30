$photo.prompt({
  handler: function (resp) {
    let image = resp.image
    let data = compressPictures(image.jpg(1))
    if (data.info.size > 5242880) {
      $ui.toast("图片太大，请选择小于 5m 的图片");
      return
    }
    if (data) {
      $ui.loading("图片上传中...");
      $http.upload({
        url: "https://sm.ms/api/upload",
        showsProgress: false,
        timeout: 10,
        files: [
          {
            "data": data,
            "name": "smfile",
            "filename": "smfile.png"
          }
        ],
        handler: function (resp) {
          $ui.loading(false);
          if (resp.error) {
            $ui.alert({
              title: "错误",
              message: resp.error.localizedDescription,
            });
          } else {
            let data = resp.data
            let success = data.success
            if (success == false) {
              $ui.alert({
                title: "错误",
                message: data.message,
              });
            } else {
              let url = "https://images.google.com/searchbyimage?image_url=" + data.data.url
              $safari.open({
                url: url
              })
            }
          }
        }
      })
    }
  }
})

oldData = null
function compressPictures(data) {
  let imageData = data
  oldData = imageData.info.size
  if (imageData.info.size > 5242880) {
    imageData = imageData.image.jpg(0.5)
    if ((oldData - imageData.info.size) < (oldData * 0.5)) {
      return imageData
    }
    imageData = compressPictures(imageData.image.jpg(0.5))
  }
  return imageData
}
