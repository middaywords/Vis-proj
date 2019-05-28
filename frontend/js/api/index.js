let apiRoute = (pid, day = 0) => request({ url: '/api/route', data: { pid, day }, method: 'POST' })
