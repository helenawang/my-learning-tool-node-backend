const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 8080;

// 导入db
const init_db = require('./clients/mysql-client').init_db;
const get_db_connection = require('./clients/mysql-client').get_db_connection;

// 导入elasticsearc
const init_es = require('./clients/es-client').init_es;
const get_es_connection = require('./clients/es-client').get_es_connection;

//设置跨域访问  
app.use(cors());

// 居然不设置这个就把req.body置为undefined，这合理么
app.use(express.json());

// 配置路由
app.use('/questions/all', fetchAllQuestions);
app.use('/knowledge/list', fetchAllKnowledges);
app.use('/knowledge/update', updateKnowledge);
app.use('/knowledge/add', addNewKnowledge);

let STATIC_DATA = 0;

// 初始化db连接
init_db((err) => {
    if (err) {
        console.error('db connecting failed, using static data');
        STATIC_DATA = 1;
    }
    init_es((err) => {
        if (err) console.error('elasticsearc connecting error');
        app.listen(port, (err) => {
            if (err) throw err;
            console.log('db and elasticsearch connected, start listening on port ' + port);
        });
    })
})

// 获取所有questions
function fetchAllQuestions(req, res) {
    if (STATIC_DATA) {// 采用备用的从静态文件里读取的数据
        fs.readFile('./data/data_backup.json', (err, backData) => {
            if (err) console.error(err);
            const result = JSON.parse(backData)['questions'];
            res.send(result);
            return ;
        })
    } else {
        const sql = 'select * from question';
        get_db_connection((err, db_connection) => {
            if (err) { 
                console.error('get db connection error');
            } else {
                db_connection.query(sql, (err, results, fields) => {
                    const objects = []
                    results.forEach(r => {
                    objects.push({
                            type: r.type,
                            name: r.name,
                            required: !!r.required,
                            description: r.description
                        });
                    })
                    res.send(objects);
                })
            }
        });
    }
}
/**
 * 查询category(index)下的所有doc
 * @param {1} req {category: string}
 * @param {*} res 
 */
function fetchAllKnowledges(req, res) {
    const es_connection = get_es_connection();
    es_connection.search({
        index: req.query.category,
        body: {
            query: {match: { _index: req.query.category}}
        }
    }, (err, results) => {
        if (err) console.error(err);
        const data = results.body.hits.hits;
        data.forEach(h => h._source.docId = h._id);
        const result = data.map(h => h._source);
        res.send(result);
    })
}
/**
 * 更新已有文档
 * @param {*} req
 * @param {*} res 
 */
function updateKnowledge(req, res) {
    const es_connection = get_es_connection();
    es_connection.update({
        index: req.query.category,
        id: req.query.docId,
        body: {doc: req.body}
    }, (err, results) => {
        if (err) console.error(err);
        res.send(results);
    })
}

/**
 * 添加新文档
 * @param {} req 
 * @param {*} res 
 */
function addNewKnowledge(req, res) {
    const es_connection = get_es_connection();
    console.log(req.query);
    // TODO 应该先查下有没有同名的
    // docId是自动生成的，并且只有更新一次后才会同步到_source里的docId字段。暂时没什么危害
    es_connection.index({
        index: req.query.category,
        body: req.body
    }, (err, results) => {
        if (err) console.error('create时错误', err);
        res.send(results);
    })
}