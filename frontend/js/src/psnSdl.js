// 热力图，将72小时划分成144个半小时处理16*3*3
function drawPersonalSchedule(pid){
    // para: pid(integer)  selected person
    
    let psnSdlSvg = d3.select("#container_psnsdl").select("svg")
    const WIDTH = psnSdlSvg.attr("width")
    const HEIGHT = psnSdlSvg.attr("height")
    const ORIGINAL_OPACITY = 0.1
    const [A,B,C,D,M,R] = [0,1,2,3,4,5]
    const TEXTS = ["分会场A","分会场B","分会场C","分会场D","主会场","休息时间"]
    // Build color scale
    let myColor =  d3.scaleOrdinal(d3.schemePastel1) 

    // Build X scales and axis:
    let x = d3.scaleBand()
        .range([0, WIDTH])
        .domain(Array.from({length:35}).map((_,idx)=>idx))
        .padding(0)
    const dx = x.bandwidth()
    psnSdlSvg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()

    // Build Y scales and axis:
    let y = d3.scaleBand()
        .range([0,HEIGHT])
        .domain(Array.from({length:12}).map((_,idx)=>idx))
        .padding(0) // 避免缝隙出现
    const dy = y.bandwidth()
    psnSdlSvg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

    let mouseover = function (d) {
        console.log(d)
        d3.select(this)
            .style("opacity", 1)
        texts[d.order].style("fill","black")
    }

    let mousemove = function (d) {}

    let mouseleave = function (d) {
        console.log(d)
        d3.select(this)
            .style("opacity", ORIGINAL_OPACITY)
        texts[d.order].style("fill","white")   
    }

    let counter = 0
    let rects = []
    let texts = []
    let addRect = (x,y,w,h,p) => {
        let data = [{order:counter++}]
        rects.push(psnSdlSvg
            .append("rect")
            .attr("x", x)
            .attr("y", y+Math.floor(y/dy/4)*5)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("width", w*dx) // 让水平方向重合
            .attr("height", h*dy)
            .style("fill", myColor(p))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", ORIGINAL_OPACITY)
            .data(data)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        )
        texts.push(psnSdlSvg.append("text")
            .text(TEXTS[p])
            .style("fill","white")
            .style("font-size",12)
            .style("text-anchor","middle")
            .attr("x",x+w*dx/2)
            .attr("y",y+h*dy/2+10))
    }

    // add the specific squares
    // 第一天
    addRect(0,0,7,4,M)
    addRect(x(10),0,5,4,M)
    addRect(x(16),0,5,4,R)
    addRect(x(22),0,4,1,A)
    addRect(x(22),y(1),6,1,B)
    addRect(x(22),y(2),6,1,C)
    addRect(x(22),y(3),6,1,D)
    addRect(x(27),0,3,1,A)
    addRect(x(32),0,3,1,A)
    addRect(x(32),y(1),3,1,B)
    addRect(x(32),y(2),3,1,C)
    addRect(x(32),y(3),3,1,D)

    // 第二天
    addRect(x(2),y(4),7,4,M)
    addRect(x(10),y(4),4,4,M)
    addRect(x(16),y(4),5,4,R)
    addRect(x(22),y(4),4,1,A)
    addRect(x(22),y(5),6,1,B)
    addRect(x(22),y(6),6,1,C)
    addRect(x(22),y(7),6,1,D)
    addRect(x(27),y(4),3,1,A)
    addRect(x(32),y(4),3,1,A)
    addRect(x(32),y(5),3,1,B)
    addRect(x(32),y(6),3,1,C)
    addRect(x(32),y(7),3,1,D)

    // 第三天
    addRect(x(2),y(8),5,1,M)
    addRect(x(3),y(9),6,1,B)
    addRect(x(3),y(10),6,1,C)
    addRect(x(10),y(8),4,3,M)
    addRect(x(8),y(11),3,1,A)
    addRect(x(16),y(8),5,4,R)
    addRect(x(22),y(8),4,1,A)
    addRect(x(22),y(9),6,1,B)
    addRect(x(22),y(10),6,1,C)
    addRect(x(22),y(11),6,1,D)
    addRect(x(27),y(8),3,1,A)
    addRect(x(32),y(8),3,1,A)
    addRect(x(32),y(9),3,1,B)
    addRect(x(32),y(10),3,1,C)
    addRect(x(32),y(11),3,1,D)

}
