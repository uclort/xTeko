$photo.prompt({
  handler: function (resp) {
    var image = resp.image
    var data = image.png
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