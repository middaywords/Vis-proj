import routeController from "./controller/route.js"

export default router => {
  router.prefix("/api")
  router
    .post("/route",routeController.getRoute)
}

