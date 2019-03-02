const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  // getSeats: getSeats
}

//return array of free seats info
//异步处理问题，等待setArray赋值
// function getSeats(search_target = 'default') {
//   var setArray;
//   var that = this;
//   wx.request({
//       url: 'http://127.0.0.1/CheckChackServer/searchSeats.php',
//       data: {
//         target: search_target
//       },
//       header: { 'content-type': 'application/x-www-form-urlencoded' },
//       method: 'POST',
//       success: function (res) {
//         // that.setData({
//         //   setArray: res.data
//         // })
//         setArray = res.data;
//       },
//       fail: function (res) {
//         console.log("Can not connect to the sever.");
//       }
//     })
//  return setArray
// }
