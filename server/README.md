### ChinaVis backend server
KOA based
Use `npm install` to install the dependencies 
Use `npm run server` to run the server



### api（使用示例见api.html）

- 返回某个人的路径。输入人员id和当天序号。

`apiRoute(pid, day)`   `/api/route` {pid, day} POST [route] (length:782,当天内所有时间点)

- 返回某个区域的当天的人数。输入区域内sid的列表和当天序号。

`apiDistrictCount([sid], day)`     `/api/district/count` ([sid], day) POST  [count] (length:782,当天内所有时间点)

- 返回某个区域在某个时刻的人员pid。输入区域内sid的列表，当天序号，时间。

`apiDistrictPeople([sid], day,time)`    `api/district/people` ([sid], day,time) POST  [pid]  

* 返回某个pid/某些pid是否为工作人员

`apiIsStaff(pid/[pid])`  `api/person/is_staff` (pid/[pid]) POST bool/[boolean]

- 返回某个pid的feature

`apiPersonFeature`