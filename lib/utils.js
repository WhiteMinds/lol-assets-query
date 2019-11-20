const ChampSkin = require('./ChampSkin')

module.exports = {
    getChampInfo (key) {
        const id = ChampSkin.champion.keys[key]
        return ChampSkin.champion.data[id]
    },
    getSkinInfo (id, skinId) {
        const skinInfo = ChampSkin.skins.data[id].find(skinInfo => skinInfo.id === skinId)
        if (!skinInfo) return

        const { name } = skinInfo
        return {
            id: skinId,
            name,
            image: `https://ossweb-img.qq.com/images/lol/appskin/${skinId}.jpg`
        }
    }
}
