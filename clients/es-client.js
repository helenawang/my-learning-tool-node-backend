const {Client} = require('@elastic/elasticsearch'); // TODO 为什么这里必须有大括号
const assert = require('assert');
const config = require('../config/url');

let _elasticsearch;

module.exports = {
  init_es,
  get_es_connection
};

function init_es(callback) {
  if (_elasticsearch) {
    console.warn('trying to init elasticsearch again');
    return callback(null, _elasticsearch);
  }
  _elasticsearch = new Client({node: config.ES_CLIENT_URL});
  return callback(null, _elasticsearch); // 我发现这里一定要调用这个callback，无论正确与否
}

function get_es_connection() {
  assert.ok(_elasticsearch, 'elasticsearch has not been initilalized. Please call init first.');
  return _elasticsearch;
}

// 单元测试
// init_es((err) => {
//   if (err) throw err;
//   console.info('es connected');
//   const es_connection = get_es_connection();
//   es_connection.search({
//     index: 'knowledge',
//     body: {
//       query: { match_all: {}}
//     }
//   }, (err2, result) => {
//     if (err2) console.error(err2);
//     console.log('查到的数据', result.body.hits.hits.map(h => h._source))
//   })
// });