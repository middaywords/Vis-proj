import RouteModel from '../model/route.js'

const DEFAULT_PID = 10001
const ALL_DAYS = 0

class RouteController{
    async getRoute(ctx){
        const params = ctx.request.body
        const { pid = DEFAULT_PID, day = ALL_DAYS } = params
        const res = await RouteModel.getRoute(pid, day)
        ctx.body = res
    }

    async getSchedule(ctx){
        const params = ctx.request.body
        const { pid = DEFAULT_PID } = params
        const res = await RouteModel.getSchedule(pid)
        ctx.body = res
    }
}

export default new RouteController()