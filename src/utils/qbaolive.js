const api = 'https://api.qbaolive.com'
// const api = 'http://localhost:8000'
const fetch = require('./fetch')

/**
 * 特定类型的API
 * @param  {String} api 参数  接口域名
 * @param  {String} path 参数 
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi (path,method,params) {
  return fetch(api,path,method,params)
}
/**
 * 公用接口获取
 * @param  {String} path   类型，例如：'/v1/delete'
 * @param  {Object} query  参数 
 * @return {Promise}       包含抓取任务的Promise
 */
function getApi (path, method, query) {
	const params = query
  return fetchApi(path, method, params)
    .then(res => res.data)
} 
/**
 * 获取视频直播列表
 * @param  {String} path   类型，例如：'/v1/delete'
 * @param  {Object} query  参数 
 * @return {Promise}       包含抓取任务的Promise
 */
function getVideo (path, method, query) {
	const params = query
  return fetchApi(path, method, params)
    .then(res => res.data)
} 

/**
 * 获取用户token
 * @param  {String} path   类型，例如：'/v1/delete'
 * @param  {Object} query  参数 
 * @return {Promise}       包含抓取任务的Promise
 */
function getToken (path, method, query) {
	const params = query
  return fetchApi(path, method, params)
    .then(res => res.data)
} 

module.exports = { getVideo , getToken , getApi }
