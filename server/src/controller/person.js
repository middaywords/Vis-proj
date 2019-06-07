import PersonModel from '../model/person.js'

class PersonController {
    isStaff(ctx){
        const params = ctx.request.body
        const { pid } = params
        const res = PersonModel.isStaff(pid)
        ctx.body = res
    }

    async getFeature(ctx){
        const params = ctx.request.body
        const { pid } = params
        const res = await PersonModel.isStaff(pid)
        ctx.body = res
    }
}

export default new PersonController()