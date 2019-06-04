// 获取当前发布时间ctime
// Date.now方法返回当前时间距离时间零点（1970年1月1日 00:00:00 UTC）的毫秒数，相当于 Unix 时间戳乘以1000。
// Date.now() // 1364026285194
function getNow() {
    return parseInt(Date.now() / 1000);
}
module.exports.getNow = getNow;