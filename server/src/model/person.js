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
        let sql
        console.log(feature)
        if(feature.length===0){
            sql = `SELECT * FROM feature 
                WHERE PID = ${pid}`
        }else{
            sql = `SELECT ${feature.join(',')} FROM feature 
            WHERE PID = ${pid}`
        }      
        let row = await query(sql)
        if(row.length!==0){
            row = row[0]
        }else{
            throw ReferenceError("Wrong getFeature! Can't find the person with pid!")
        }
        return row
    }
}

export default new PersonModel()