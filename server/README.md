### ChinaVis backend server
KOA based
Use `npm install` to install the dependencies 
Use `npm run server` to run the server



### api

`apiRoute()`   `/api/route` {pid, day} POST [route] (length:720+,当天内所有时间点)

`apiDistrict()`     `/api/district` ([sid], day) POST  [count] (length:720+,当天内所有时间点)