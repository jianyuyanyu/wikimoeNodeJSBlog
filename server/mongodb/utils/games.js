const gamesModel = require('../models/games');

exports.save = async function (parmas) {
  // document作成
  const games = new gamesModel(parmas);
  // document保存
  return await games.save()
}


exports.findOne = async function (parmas, projection) {
  // document查询
  return await gamesModel.findOne(parmas, projection).populate('gamePlatform').populate('screenshotAlbum');
}

// 查找所有
exports.find = async function (parmas, sort, projection) {
  // document查询
  return await gamesModel.find(parmas, projection).populate('gamePlatform').populate('screenshotAlbum').sort(sort);
}

// 分页查询
exports.findPage = async function (parmas, sort, page, limit, projection) {
  // document查询
  const list = await gamesModel.find(parmas, projection).populate('gamePlatform').populate('screenshotAlbum').sort(sort).skip((page - 1) * limit).limit(limit);
  const total = await gamesModel.countDocuments(parmas);
  // 查询失败
  if (!list || total === undefined) {
    throw new Error('查询失败')
  }
  return {
    list,
    total
  }
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  parmas.$inc = { __v: 1, ...parmas.$inc }
  return await gamesModel.updateOne(filters, parmas);
}
// 删除
exports.deleteOne = async function (filters) {
  // document查询
  return await gamesModel.deleteOne(filters);
}