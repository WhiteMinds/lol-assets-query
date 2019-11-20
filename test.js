const fs = require('fs')
const Inquirer = require('./')

const inquirer = new Inquirer('your qq', 'your qq skey')

// 仅获取祖安大区
// inquirer.getAssetsInfo(3)
//     .then(assetsInfo => {
//         console.log(assetsInfo)
//         fs.writeFileSync('./assetsInfo祖安.json', JSON.stringify(assetsInfo, 0, 2))
//     })
//     .catch(console.error)

// 获取所有大区
inquirer.getAllAreasAssetsInfo()
    .then(assetsInfoList => {
        console.log(assetsInfoList)
        fs.writeFileSync('./assetsInfoAll.json', JSON.stringify(assetsInfoList, 0, 2))
    })
    .catch(console.error)
  