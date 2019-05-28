const mysql      = require('mysql')

const IP = '127.0.0.1'

const db = mysql.createPool({   //本地
  host     : IP,  
  user     : 'root',    
  password : 'yangpeihao2016' ,  // 数据库密码 改成自己的密码
  database : 'chinavis'  // 选中数据库
})

let query = function(sql, params) {
  return new Promise((resolve, reject) => {
    db.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, params, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

export default query