* feature_all 是3 天的数据的整合，多了一项'day'，比如一个人3天都在开会，它会有三行
* 其余是每天的不同人的feature
* in 阈值
  * day1: < 55
  * day2: < 85
  * day3: < 85
* out  阈值
  * day 1: > 635
  * day 2: > 720
  * day 3: > 310
* Stay Time 阈值
  * day 1: > 200
  * day 2: > 200
  * day 3: > 150
  * 除了mainhall 和 other的其余房间呆的时间超过了阈值，则认为是工作人员
* Been Room 都是0 和 1
* T 和 room count 没有用过
* Been Room4 作为VIP的依据
* 没去过Register 作为记者的依据
* 优先级:
  * been room 4 > been room5 = been room 6 > in > out > stay time > no register