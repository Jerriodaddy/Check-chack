const CONF = {
  port: '5757',
  rootPathname: '',

  // 微信小程序 App ID
  appId: '',

  // 微信小程序 App Secret
  appSecret: '',

  cos: {
    /**
     * 地区简称
     * @查看 https://cloud.tencent.com/document/product/436/6224
     */
    region: 'ap-guangzhou',
    // Bucket 名称
    fileBucket: 'qcloudtest',
    // 文件夹
    uploadFolder: ''
  },

  // 微信登录态有效期
  wxLoginExpires: 7200,
  wxMessageToken: 'abcdefgh'
}

module.exports = CONF
