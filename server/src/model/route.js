import query from './db.js'

const ALL_DAYS = 0

class RouteModel {
    async getRoute(pid, day) {
        // param: pid int 
        // param: day int 0,1,2,3
        if (day !== ALL_DAYS) { 
            // 查询当天的路径
            const sql = `SELECT * FROM route${day} 
                WHERE PID = ${pid}`
            let res = await query(sql)
            return res
        } else {
            // 返回三天的所有路径
            let res = {}
            for(let d of [1,2,]){  
                const sql = `SELECT * FROM route${d} 
                    WHERE PID = ${pid}`
                res[d] = await query(sql)
            }
            return res  
        }
    }
    async getSchedule(pid) {
        
    }
}

export default new RouteModel()