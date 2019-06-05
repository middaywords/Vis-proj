import PersonModel from '../model/person.js'

class PersonController {
    isStaff(ctx){
        const params = ctx.request.body
        const { pid } = params
        const res = PersonController.isStaff(pid)
        ctx.body = res
    }

    async getFeature(pid){
        const params = ctx.request.body
        const { pid } = params
        const res = await PersonController.isStaff(pid)
        ctx.body = res
    }
}