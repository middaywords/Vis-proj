import query from './db.js'

const ALL_DAYS = 0
const DAY_LENGTH = 782 // 一天被分成了782段

class DistrictModel {
    async getCount(sid, day) {
        // param: sid array 
        // param: day int 0,1,2,3
        let sids = sid.join(',')
        sids = `(${sids})`
        if (day !== ALL_DAYS) { 
            // 查询当天各个时间的人数求和
            const sql = `SELECT * FROM route${day} 
                WHERE POSITION in ${sids}`
            let rows = await query(sql)
            let res = Array.from({length:DAY_LENGTH}).map(ele=>0)
            rows.forEach(row => {
                res[row['TIME']-1]+=1
            })
            return res
        } else {
            // 返回三天各个时间的所有求和
            let res = Array.from({length:DAY_LENGTH}).map(ele=>0)
            for(let d of [1,2,3]){  
                const sql = `SELECT * FROM route${d} 
                WHERE POSITION in ${sids}`
                let rows = await query(sql)
                rows.forEach(row => {
                    res[row['TIME']-1]+=1
                })
            }
            return res  
        }
    }

    async getPeople(sid, day, time){
        // param: sid array 
        // param: day int 0,1,2,3
        // param: time int 1-782
        let sids = sid.join(',')
        sids = `(${sids})`
        // 查询当天各个时间的人数求和
        const sql = `SELECT * FROM route${day} 
            WHERE POSITION in ${sids} and TIME = ${time}`
        let rows = await query(sql)
        let res = new Array()
        rows.forEach(row => {
            res.push(row['PID'])
        })
        return res
    }
}

export default new DistrictModel()