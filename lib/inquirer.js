const rp = require('request-promise')
const qs = require('query-string')
const { BattleTypeCN, TierCN, RomanNum, AreaMap } = require('./const')
const { getChampInfo, getSkinInfo } = require('./utils')

class Inquirer {
    constructor (account, skey, season = 's9') {
        this.requester = rp.defaults({
            headers: {
                Cookie: `uin=o${account}; skey=${skey};`
            },
            json: true
        })

        this.season = season
    }

    requestOfficialApi (fields, area, params) {
        const url = `https://lol.ams.game.qq.com/lol/autocms/v1/transit/LOL/LOLWeb/Official/${fields.join(',')}?use=acc&area=${area}&${qs.stringify(params)}`
        return this.requester.get(url)
    }

    async getAssetsInfo (area) {
        const result = await this.requestOfficialApi(['PlayerInfo', 'PlayerProperty', 'PlayerRankInfo', 'PlayerChampSkin'], area, { season: this.season })
        // 在这个区没有创建帐号
        if (result.PlayerInfo.status === -601) return

        const { name, level, icon_id } = result.PlayerInfo.msg
        // 这2个amount在一些迷之帐号下可能会为null
        const { ip_amount, rp_amount } = result.PlayerProperty.msg
        const info = {
            name,
            level,
            area: AreaMap[area],
            avatar: `https://game.gtimg.cn/images/lol/act/img/profileicon/${icon_id}.png`,
            // 精粹
            pointIP: ip_amount || 0,
            // 点卷
            pointRP: rp_amount || 0
        }

        if (!result.PlayerRankInfo.msg.retCode) {
            info.ranks = result.PlayerRankInfo.msg.data.item_list.map(item => {
                return {
                    battleType: BattleTypeCN[item.battle_type],
                    win: item.win_num,
                    lost: item.lose_num,
                    queue: item.queue,
                    tier: item.tier,
                    point: item.win_point,
                    rank: TierCN[item.tier] + RomanNum[item.queue + 1]
                }
            })
        }

        // list实际上是个object, 所以得用entries
        info.champ = Object.entries(result.PlayerChampSkin.msg.data.list).map(([key, item]) => {
            const champ = getChampInfo(key)
            const { id, name, title, image } = champ

            const skins = Object.keys(item.skins).map(skinId => getSkinInfo(id, skinId))

            return {
                id,
                key,
                name,
                title,
                image: `https://ossweb-img.qq.com/images/lol/img/champion/${image.full}`,
                skins
            }
        })

        return info
    }

    async getAllAreasAssetsInfo () {
        let assetsInfoList = []

        for (let area in AreaMap) {
            const result = await this.getAssetsInfo(area)
            if (result) assetsInfoList.push(result)
        }

        return assetsInfoList
    }
}

module.exports = Inquirer
