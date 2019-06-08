import mysql from 'mysql'

let IP = '127.0.0.1'

//IP = '10.162.149.227'

const db = mysql.createPool({   //本地
  host     : IP,  
  user     : 'sjtu',    
  password : 'sjtu' ,  // 数据库密码 改成自己的密码
  database : 'chinavis'  // 选中数据库
})

let query = function(sql, params) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
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