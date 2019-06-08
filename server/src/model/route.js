import query from '../utils/db.js'
import judgeRegion from '../utils/region.js'

const [M, A, B, C, D, R] = ['main', 'A', 'B', 'C', 'D', 'REST']

function checkRoom(pos, targetRoom) {
    pos = pos.POSTION
    if(pos!==undefined){
        let room = judgeRegion.getWhere(pos)
        //console.log(pos,room)
        if (targetRoom !== R) {
            return room.includes(targetRoom)
        } else { // 休息时只要在场馆里就算
            return room !== 'out'
        }
    }
    return false
}

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
            for (let d of [1, 2,]) {
                const sql = `SELECT * FROM route${d} 
                    WHERE PID = ${pid}`
                res[d] = await query(sql)
            }
            return res
        }
    }
    async getSchedule(pid) {
        let res = new Set()
        const sql1 = `SELECT TIME, POSITION FROM route1 WHERE PID=${pid}`
        let d1 = await query(sql1)
        if(d1.length!==0){
            d1 = d1.filter(ele => ele.TIME >= 90 && ele.TIME < 615)
            d1 = d1.map(ele => ({ TIME: ele.TIME - 90, POSTION: ele.POSITION }))
            // 人工遍历时间轴
            for (let t = 0; t < 120; t++) { // 主
                if (checkRoom(d1[t], M)) {
                    res.add(0)
                }
            }
            for (let t = 150; t < 225; t++) { // 主
                if (checkRoom(d1[t], M)) {
                    res.add(1)
                }
            }
            for (let t = 240; t < 315; t++) { // 休息
                if (checkRoom(d1[t], R)) {
                    res.add(2)
                }

            }
            for (let t = 330; t < 390; t++) { // A B C D 
                if (checkRoom(d1[t], A)) {
                    res.add(3)
                }
                if (checkRoom(d1[t], B)) {
                    res.add(4)
                }
                if (checkRoom(d1[t], C)) {
                    res.add(5)
                }
                if (checkRoom(d1[t], D)) {
                    res.add(6)
                }
            }
            for (let t = 390; t < 405; t++) { // B C D
                if (checkRoom(d1[t], B)) {
                    res.add(4)
                }
                if (checkRoom(d1[t], C)) {
                    res.add(5)
                }
                if (checkRoom(d1[t], D)) {
                    res.add(6)
                }
            }
            for (let t = 405; t < 420; t++) { // A B C D
                if (checkRoom(d1[t], A)) {
                    res.add(7)
                }
                if (checkRoom(d1[t], B)) {
                    res.add(4)
                }
                if (checkRoom(d1[t], C)) {
                    res.add(5)
                }
                if (checkRoom(d1[t], D)) {
                    res.add(6)
                }
            }
            for (let t = 420; t < 450; t++) { // A
                if (checkRoom(d1[t], A)) {
                    res.add(7)
                }
            }
            for (let t = 480; t < 525; t++) { // A B C D
                if (checkRoom(d1[t], A)) {
                    res.add(8)
                }
                if (checkRoom(d1[t], B)) {
                    res.add(9)
                }
                if (checkRoom(d1[t], C)) {
                    res.add(10)
                }
                if (checkRoom(d1[t], D)) {
                    res.add(11)
                }
            }
        }
        

        const sql2 = `SELECT TIME, POSITION FROM route2 WHERE PID=${pid}`
        let d2 = await query(sql2)
        if(d2.length!==0){
            d2 = d2.filter(ele => ele.TIME >= 90 && ele.TIME < 615)
            d2 = d2.map(ele => ({ TIME: ele.TIME - 90, POSTION: ele.POSTION }))
            for (let t = 30; t < 120; t++) { // 主
                if (checkRoom(d2[t], M)) {
                    res.add(12)
                }
            }
            for (let t = 150; t < 210; t++) { // 主
                if (checkRoom(d2[t], M)) {
                    res.add(13)
                }
            }
            for (let t = 240; t < 315; t++) { // 休
                if (checkRoom(d2[t], R)) {
                    res.add(14)
                }
            }
            for (let t = 330; t < 390; t++) { // A B C D 
                if (checkRoom(d2[t], A)) {
                    res.add(15)
                }
                if (checkRoom(d2[t], B)) {
                    res.add(16)
                }
                if (checkRoom(d2[t], C)) {
                    res.add(17)
                }
                if (checkRoom(d2[t], D)) {
                    res.add(18)
                }
            }
            for (let t = 390; t < 405; t++) { // B C D
                if (checkRoom(d2[t], B)) {
                    res.add(16)
                }
                if (checkRoom(d2[t], C)) {
                    res.add(17)
                }
                if (checkRoom(d2[t], D)) {
                    res.add(18)
                }
            }
            for (let t = 405; t < 420; t++) { // A B C D
                if (checkRoom(d2[t], A)) {
                    res.add(19)
                }
                if (checkRoom(d2[t], B)) {
                    res.add(16)
                }
                if (checkRoom(d2[t], C)) {
                    res.add(17)
                }
                if (checkRoom(d2[t], D)) {
                    res.add(18)
                }
            }
            for (let t = 420; t < 450; t++) { // A
                if (checkRoom(d2[t], A)) {
                    res.add(19)
                }
            }
            for (let t = 480; t < 525; t++) { // A B C D
                if (checkRoom(d2[t], A)) {
                    res.add(20)
                }
                if (checkRoom(d2[t], B)) {
                    res.add(21)
                }
                if (checkRoom(d2[t], C)) {
                    res.add(22)
                }
                if (checkRoom(d2[t], D)) {
                    res.add(23)
                }
            }
        }
        

        const sql3 = `SELECT TIME, POSITION FROM route3 WHERE PID=${pid}`
        let d3 = await query(sql3)
        if(d3.length!==0){
            d3 = d3.filter(ele => ele.TIME >= 90 && ele.TIME < 615)
            d3 = d3.map(ele => ({ TIME: ele.TIME - 90, POSTION: ele.POSTION }))
            for (let t = 30; t < 45; t++) { // 主
                if (checkRoom(d3[t], M)) {
                    res.add(24)
                }
            }
            for (let t = 45; t < 120; t++) { // 主 B C 
                if (checkRoom(d3[t], M)) {
                    res.add(24)
                }
                if (checkRoom(d3[t], B)) {
                    res.add(25)
                }
                if (checkRoom(d3[t], C)) {
                    res.add(26)
                }
            }
            for (let t = 120; t < 135; t++) { // A B C 
                if (checkRoom(d3[t], B)) {
                    res.add(25)
                }
                if (checkRoom(d3[t], C)) {
                    res.add(26)
                }
                if (checkRoom(d3[t], A)) {
                    res.add(28)
                }
            }
            for (let t = 135; t < 150; t++) { // A
                if (checkRoom(d3[t], A)) {
                    res.add(28)
                }
            }
            for (let t = 150; t < 165; t++) { // 主 A
                if (checkRoom(d3[t], M)) {
                    res.add(27)
                }
                if (checkRoom(d3[t], A)) {
                    res.add(28)
                }
            }
            for (let t = 165; t < 225; t++) { // 主
                if (checkRoom(d3[t], M)) {
                    res.add(27)
                }
            }
            for (let t = 240; t < 315; t++) { // 休
                if (checkRoom(d3[t], R)) {
                    res.add(29)
                }
            }
            for (let t = 330; t < 390; t++) { // A B C D 
                if (checkRoom(d3[t], A)) {
                    res.add(30)
                }
                if (checkRoom(d3[t], B)) {
                    res.add(31)
                }
                if (checkRoom(d3[t], C)) {
                    res.add(32)
                }
                if (checkRoom(d3[t], D)) {
                    res.add(33)
                }
            }
            for (let t = 390; t < 405; t++) { // B C D
                if (checkRoom(d3[t], B)) {
                    res.add(31)
                }
                if (checkRoom(d3[t], C)) {
                    res.add(32)
                }
                if (checkRoom(d3[t], D)) {
                    res.add(33)
                }
            }
            for (let t = 405; t < 420; t++) { // A B C D
                if (checkRoom(d3[t], A)) {
                    res.add(34)
                }
                if (checkRoom(d3[t], B)) {
                    res.add(31)
                }
                if (checkRoom(d3[t], C)) {
                    res.add(32)
                }
                if (checkRoom(d3[t], D)) {
                    res.add(33)
                }
            }
            for (let t = 420; t < 450; t++) { // A
                if (checkRoom(d3[t], A)) {
                    res.add(34)
                }
            }
            for (let t = 480; t < 525; t++) { // A B C D
                if (checkRoom(d3[t], A)) {
                    res.add(35)
                }
                if (checkRoom(d3[t], B)) {
                    res.add(36)
                }
                if (checkRoom(d3[t], C)) {
                    res.add(37)
                }
                if (checkRoom(d3[t], D)) {
                    res.add(38)
                }
            }
        }
        

        res = Array.from(res)
        return res
    }
}

export default new RouteModel()