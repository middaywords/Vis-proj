// 热力图，将72小时划分成144个半小时处理16*3*3
function drawPersonalSchedule(pid) {
    // para: pid(integer)  selected person
    console.log("in psnsdl1")
    let psnSdlSvg = svg11
    const WIDTH = width11
    const HEIGHT = height11
    const ORIGINAL_OPACITY = 0.1
    const [A, B, C, D, M, R] = [0, 1, 2, 3, 4, 5]
    const TEXTS = ["分会场A", "分会场B", "分会场C", "分会场D", "主会场", "休息时间"]
    // Build color scale
    let myColor = d3.scaleOrdinal(d3.schemePastel1)

    console.log("in psnsdl2")
    // Build X scales and axis:
    let xs = d3.scaleBand()
        .range([0, WIDTH])
        .domain(Array.from({ length: 35 }).map((_, idx) => idx))
        .padding(0)
    const dx = xs.bandwidth()

    // Build Y scales and axis:
    let ys = d3.scaleBand()
        .range([0, HEIGHT])
        .domain(Array.from({ length: 12 }).map((_, idx) => idx))
        .padding(0) // 避免缝隙出现
    const dy = ys.bandwidth()

    let lastOpacity = 0 // 记录之前的透明度
    let lastColor = "black"
    let mouseover = function (d) {
        // console.log(d)
        lastOpacity = d3.select(this)
            .style("opacity")
        d3.select(this)
            .style("opacity", 1)
        lastColor = texts[d.order].style("fill")
        texts[d.order].style("fill", "black")
    }

    let mousemove = function (d) { }

    let mouseleave = function (d) {
        // console.log(d)
        d3.select(this)
            .style("opacity", lastOpacity)
        texts[d.order].style("fill", lastColor)
    }

    let counter = 0
    let rects = []
    let texts = []
    let addRect = (x, y, w, h, p) => {
        x = xs(x)
        y = ys(y)
        let data = [{ order: counter++ }]
        rects.push(psnSdlSvg
            .append("rect")
            .attr("x", x)
            .attr("y", y + Math.floor(y / dy / 4) * 5)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("width", w * dx) // 让水平方向重合
            .attr("height", h * dy)
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
            .style("fill", "white")
            .style("font-size", 12)
            .style("text-anchor", "middle")
            .attr("x", x + w * dx / 2)
            .attr("y", y + h * dy / 2 + 10))
    }

    // 左上角坐标xy，宽高wh，会场
    const COORDINATES = [
        [0, 0, 7, 4, M] // day1
        , [10, 0, 5, 4, M]
        , [16, 0, 5, 4, R]
        , [22, 0, 4, 1, A]
        , [22, 1, 6, 1, B]
        , [22, 2, 6, 1, C]
        , [22, 3, 6, 1, D]
        , [27, 0, 3, 1, A]
        , [32, 0, 3, 1, A]
        , [32, 1, 3, 1, B]
        , [32, 2, 3, 1, C]
        , [32, 3, 3, 1, D]
        , [2, 4, 7, 4, M] // day2
        , [10, 4, 4, 4, M]
        , [16, 4, 5, 4, R]
        , [22, 4, 4, 1, A]
        , [22, 5, 6, 1, B]
        , [22, 6, 6, 1, C]
        , [22, 7, 6, 1, D]
        , [27, 4, 3, 1, A]
        , [32, 4, 3, 1, A]
        , [32, 5, 3, 1, B]
        , [32, 6, 3, 1, C]
        , [32, 7, 3, 1, D]
        , [2, 8, 5, 1, M] // day3
        , [3, 9, 6, 1, B]
        , [3, 10, 6, 1, C]
        , [10, 8, 4, 3, M]
        , [8, 11, 3, 1, A]]

    // add the specific squares
    COORDINATES.forEach(crd => addRect(...crd))
    apiSchedule(pid).then(res=>{
        for(let idx of res){
            rects[idx].style("opacity",1)
            texts[idx].style("fill","black")
        }
    })

}