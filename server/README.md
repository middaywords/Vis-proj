### ChinaVis backend server
KOA based
Use `npm install` to install the dependencies 
Use `npm run server` to run the server



### api（使用示例见api.html）

- 返回某个人的路径。输入人员id和当天序号。

`apiRoute(pid, day)`  (pid, day) day为1，2，3，默认为0三天全选  返回[route] (length:782,当天内所有时间点)   `/api/route` POST 

- 返回某个区域的当天的人数。输入区域内sid的列表和当天序号。

`apiDistrictCount([sid], day)` ([sid], day) day为1，2，3，默认为0三天全选   返回[count] (length:782,当天内所有时间点)  `/api/district/count` POST 

- 返回某个区域在某个时刻的人员pid。输入区域内sid的列表，当天序号，时间。

`apiDistrictPeople([sid], day,time)` ([sid], day,time) day为1，2，3，默认为0三天全选 返回[pid] `api/district/people` POST  

- 返回某个pid/某些pid是否为工作人员

`apiIsStaff(pid/[pid])` (pid或[pid]) 返回bool/[boolean] `api/person/is_staff` POST 

- 返回某个pid的feature

 `apiFeature(pid,[feature])` (feature默认为空代表全选[]，可填 PID, ROOM, STAY_TIME, ROOM4, ROOM5, ROOM6, ROMES_COUNT, NO_REGISTER中的任意)  返回{feature:value}的Object    `api/person/feature` POST 