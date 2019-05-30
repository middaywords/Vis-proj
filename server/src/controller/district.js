import DistrictModel from '../model/district.js'

const DEFAULT_SID = []
const ALL_DAYS = 0

class DistrictController{
    async getCount(ctx){
        const params = ctx.request.body
        const { sid = DEFAULT_SID, day = ALL_DAYS } = params
        const res = await DistrictModel.getCount(sid, day)
        ctx.body = res
    }
}

export default new DistrictController()