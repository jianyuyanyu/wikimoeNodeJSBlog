var express = require('express')
var router = express.Router()
const { checkJWT } = require('../utils/utils')

const userUtils = require('../mongodb/utils/users')

// jwt权限校验
const checkAuth = async (req, res, next) => {
  const jwtVersion = 1
  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({ errors: [{ message: '认证失败' }] })
  }
  const decoded = checkJWT(token.split(' ')[1] || '')
  // console.log(decoded)
  if (!decoded.isError) {
    req.adminData = decoded
    if (decoded.data.version !== jwtVersion) {
      res.status(401).json({ errors: [{ message: '认证失败' }] })
    } else {
      const admin = await userUtils.findOne({ _id: req.adminData.data.id })
      if (!admin) {
        return res.status(403).json({ errors: [{ message: '该管理员账户已停止使用' }] })
      }
      if (admin.disabled) {
        return res.status(403).json({ errors: [{ message: '该管理员账户已停止使用' }] })
      } else if (admin.pwversion !== decoded.data.pwversion) {
        return res.status(401).json({ errors: [{ message: '认证失败' }] })
      }
      req.admin = admin
      next()
    }
  } else {
    res.status(401).json({ errors: [{ message: '认证失败' }] })
  }
}


router.use((req, res, next) => {
  // api 中间件，用于一些统一处理
  next()
})

// roleType 大于小于等于
// role 管理员的等级，配合上面的roleType使用
const adminRouteSetting = [
  {
    path: '/login',
    method: 'post',
    middleware: [],
    controller: require('../api/admin/login'),
    roleType: null,
    role: null
  },
  // get,loginuserinfo
  {
    path: '/loginuserinfo',
    method: 'get',
    middleware: [checkAuth],
    controller: require('../api/admin/user/getLoginUserInfo'),
    roleType: null,
    role: null
  },
  // put,updateLoginUserInfo
  {
    path: '/loginuserinfo',
    method: 'put',
    middleware: [checkAuth],
    controller: require('../api/admin/user/updateLoginUserInfo'),
    roleType: null,
    role: null
  },
  // post /sort/create
  {
    path: '/sort/create',
    method: 'post',
    middleware: [checkAuth],
    controller: require('../api/admin/sort/createSort'),
    roleType: null,
    role: null
  },
  // get /sort/list
  {
    path: '/sort/list',
    method: 'get',
    middleware: [checkAuth],
    controller: require('../api/admin/sort/getSortList'),
    roleType: null,
    role: null
  },
  // get /sort/detail
  {
    path: '/sort/detail',
    method: 'get',
    middleware: [checkAuth],
    controller: require('../api/admin/sort/getSortDetail'),
    roleType: null,
    role: null
  },
  // put /sort/update
  {
    path: '/sort/update',
    method: 'put',
    middleware: [checkAuth],
    controller: require('../api/admin/sort/updateSort'),
    roleType: null,
    role: null
  },
  // delete /sort/delete
  {
    path: '/sort/delete',
    method: 'delete',
    middleware: [checkAuth],
    controller: require('../api/admin/sort/deleteSort'),
    roleType: null,
    role: null
  },
]

adminRouteSetting.forEach(item => {
  router[item.method](item.path, ...item.middleware, item.controller)
})

module.exports = router