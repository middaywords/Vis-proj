import query from './db.js'
import * as staffList from '../localJson/staff/staff_count_all.json'

class PersonModel {
    isStaff(pid){
        if(typeof pid === Array){
            let res = Array.from(pid)
            res.map(ele=>Object.keys(staffList).includes(ele))
            return res
        }else{
            return Object.keys(staffList).includes(pid)
        }
    }

    async getFeature(pid,feature){
        let sids = sid.join(',')
        sids = `(${sids})`
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

export default new PersonModel()