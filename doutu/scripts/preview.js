module.exports = {
  beginPreview: beginPreview
}

function beginPreview(imageData) {
  $ui.push({
    props: {
      title: '预览'
    },
    views: [
      {
        type: "image",
        props: {
          data: imageData,
          contentMode: $contentMode.scaleAspectFit
        },
        layout: function (make) {
          make.edges.inset(20)
        }
      }
    ]
  })
}
