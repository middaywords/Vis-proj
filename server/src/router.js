import routeController from "./controller/route.js"
import districtController from "./controller/district.js"

export default router => {
  router.prefix("/api")
  router
    .post("/route",routeController.getRoute)
    .post("/district",districtController.getCount)
}

