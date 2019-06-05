
module.exports = {
    setFavorites: setFavorites,
    removeFavorites: removeFavorites,
    favoritesItems: favoritesItems,
    getFavoritesData: getFavoritesData
}
initialization()

function initialization() {
    $console.info("初始化缓存");
    let items = $cache.get("favorites")
    if (Array.isArray(items) == false) {
        $cache.set("favorites", [])
    }
}

function setFavorites(url, data) {
    if (repeatedJudgment(url) == true) {
        $ui.toast("已经在收藏夹中");
    } else {
        var item = { key: url, value: data }
        var items = $cache.get("favorites")
        items.unshift(item)
        $cache.set("favorites", items);
    }
}

function getFavoritesData(url) {
    var items = $cache.get("favorites")
    var i = items.length
    while (i--) {
        let item = items[i]
        let key = item.key
        if (key == url) {
            return item.value
        }
    }
}

function removeFavorites(url) {
    var items = $cache.get("favorites")
    var i = items.length
    while (i--) {
        let item = items[i]
        let key = item.key
        if (key == url) {
            items.splice(i, 1)
        }
    }
    $cache.set("favorites", items);
}

function favoritesItems(sortType) {
    // $console.info(sortType);
    var items = $cache.get("favorites")
    if (sortType == 1) {
        var newItems = []
        items.forEach(element => {
            newItems.unshift(element)
        });
        return newItems
    }
    return items
}

function repeatedJudgment(url) {
    var items = $cache.get("favorites")
    var i = items.length
    while (i--) {
        let item = items[i]
        let key = item.key
        if (key == url) {
            return true
        }
    }
    return false
}