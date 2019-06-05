let apiRoute = (pid, day = 0) => request({ url: '/api/route', data: { pid, day }, method: 'POST' })
let apiDistrictCount = (sid = [], day = 0) => request({ url: '/api/district/count', data: { sid, day }, method: 'POST' })
let apiDistrictPeople = (sid = [], day, time) => request({ url: '/api/district/people', data: { sid, day, time }, method: 'POST' })
let apiIsStaff = (pid) => requestSync({ url: '/api/person/is_staff',data: {pid}, method:'POST'})