import query from './db.js'

const ALL_DAYS = 0

class DistrictModel {
    async getCount(sid, day) {
        // param: sid array 
        // param: day int 0,1,2,3
        if (day !== ALL_DAYS) { 
            // 查询当天各个时间的人数求和
            const sql = `SELECT * FROM raw${day} 
                WHERE PID = ${pid}`
            let res = await query(sql)
            return res
        } else {
            // 返回三天各个时间的所有求和
            let res = {}
            for(let d of [1,2,]){  
                const sql = `SELECT * FROM route${d} 
                    WHERE PID = ${pid}`
                res[d] = await query(sql)
            }
            return res  
        }
    }
}

export default new DistrictModel()