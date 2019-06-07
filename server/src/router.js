import routeController from "./controller/route.js"
import districtController from "./controller/district.js"
import personController from "./controller/person.js"

export default router => {
  router.prefix("/api")
  router
    .post("/route",routeController.getRoute)
    .post("/district/count",districtController.getCount)
    .post("/district/people",districtController.getPeople)
    .post("/person/is_staff",personController.isStaff)
    .post("/person/feature",personController.getFeature)
}

