class JudgeRegion {
    getPara(num) {
        if(typeof num !== "number"){
            num = parseInt(num)
        }
        let y = num % 100
        let floor = Math.floor(num / 10000)
        let x = Math.floor((num - floor * 10000) / 100)
        return [x, y, floor]
    }

    getWhere(num) {
        if (num == 0) {
            return 'out'
        }

        let [x, y, floor] = this.getPara(num)
        console.log(x, y, floor)
        if (floor == 1) {
            if (x == 15 && (y == 5 || y == 15 || y == 17) || x == 0 && y == 19) {
                return 'out'
            }

            if (2 <= x && x< 4 && 1 <= y && y< 6) {
                return 'hallA'
            }

            if (4 <= x && x< 6 && 1 <= y && y< 6) {
                return 'hallB'
            }

            if (6 <= x && x< 8 && 1 <= y && y< 6) {
                return 'hallC'
            }

            if (8 <= x && x< 10 && 1 <= y && y< 6) {
                return 'hallD'
            }

            if (3 <= x && x< 10 && 7 <= y && y< 9) {
                // return 'other'
                return 'poster'
            }

            if (4 <= x && x< 6 && 10 <= y && y< 12) {
                return 'toilet1'
                // return 'other'
            }

            if (6 <= x && x< 10 && 10 <= y && y< 12) {
                return 'room1'
                // return 'other'
            }
            if (10 <= x && x< 12 && 10 <= y && y< 12) {
                return 'room2'
                // return 'other'
            }
            if (2 <= x && x< 12 && 15 <= y && y< 19) {
                return 'exhibition'
            }
            if (2 <= x && x< 12 && 19 <= y && y< 29) {
                return 'mainHall'
            }
            if (12 <= x && x< 14 && 2 <= y && y< 6) {
                return 'register'
                // return 'other'
            }
            if (14 <= x && x< 16 && 19 <= y && y< 21) {
                return 'service'
                // return 'other'
            }
            if (14 <= x && x< 16 && 21 <= y && y< 25) {
                // return 'other'
                return 'room3'
            }
            if (14 <= x && x< 16 && 25 <= y && y< 27) {
                // return 'other'
                return 'room4'
            }
            if (14 <= x && x< 16 && 27 <= y && y< 29) {
                // return 'other'
                return 'toilet2'
            }
            if (x == 1 && 10 <= y && y< 12) {
                // return 'Up'
                return 'elevatorUp'
                // return 'other'
            }
            if (x == 14 && 10 <= y && y< 12) {
                // return 'Down'
                return 'elevator'
                // return 'other'
            }
            return 'other'
        }
        else {
            if (2 <= x && x< 10 && 1 <= y && y< 6) {
                // return 'other'
                return 'diningHall'
            }

            if (10 <= x && x< 12 && 1 <= y && y< 6) {
                // return 'other'
                return 'room5'
            }

            if (13 <= x && 0 <= y && y< 6) {
                // return 'other'
                return 'recreationArea'
            }

            if (4 <= x && x< 6 && 10 <= y && y< 12) {
                // return 'other'
                return 'toilet3'
            }

            if (6 <= x && x< 8 && 10 <= y && y< 12) {
                // return 'other'
                return 'room6'
            }

            if (x == 1 && 10 <= y && y< 12) {
                // return 'other'
                return 'elevatorUp'
            }

            if (x == 14 && 10 <= y && y< 12) {
                // return 'other'
                return 'elevator'
            }

            return 'other'
        }

    }
}

export default new JudgeRegion()