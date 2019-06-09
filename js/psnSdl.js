function min2hour(min) {
    let hour = Math.floor(min / 60)
    min = min - 60 * hour
    if (min === 0) {
        min = "00"
    }
    return `${hour}:${min}`
}

function drawPersonalSchedule(pid) {
    // para: pid(integer)  selected person
    let psnSdlSvg = svg11
    const WIDTH = width11 - 40
    const HEIGHT = height11
    const LEFT = 65
    const ORIGINAL_OPACITY = 0.1
    const [A, B, C, D, M, R] = [0, 1, 2, 3, 4, 5]
    const TEXTS = ["分会场A", "分会场B", "分会场C", "分会场D", "主会场", "休息时间"]
        // Build color scale
    let myColor = d3.scaleOrdinal(d3.schemePastel1)

    // Build X scales and axis:
    let xs = d3.scaleBand()
        .range([0, WIDTH])
        .domain(Array.from({ length: 35 }).map((_, idx) => idx))
        .padding(0)
    let xsTick = d3.scaleLinear()
        .range([0, WIDTH])
        .domain([0, 35])

    const dx = xs.bandwidth()

    // Build Y scales and axis:
    let ys = d3.scaleBand()
        .range([0, HEIGHT])
        .domain(Array.from({ length: 12 }).map((_, idx) => idx))
        .padding(0)
    const dy = ys.bandwidth()

    // 添加x和y的坐标轴
    psnSdlSvg
        .append("g")
        .classed("axis-x", true)
        .attr(
            "transform",
            `translate(${LEFT},${HEIGHT})`
        )
        .call(d3.axisBottom(xsTick).tickFormat(d => min2hour(d * 15 + 510)))
        // transform 为相对左边界和上边界的位置

    psnSdlSvg.append("text")
        .text("Day #1")
        .style("fill", "white")
        .style("font-size", 20)
        .style("text-anchor", "middle")
        .attr("x", 30)
        .attr("y", HEIGHT / 5)

    psnSdlSvg.append("text")
        .text("Day #2")
        .style("fill", "white")
        .style("font-size", 20)
        .style("text-anchor", "middle")
        .attr("x", 30)
        .attr("y", HEIGHT / 2)

    psnSdlSvg.append("text")
        .text("Day #3")
        .style("fill", "white")
        .style("font-size", 20)
        .style("text-anchor", "middle")
        .attr("x", 30)
        .attr("y", HEIGHT / 5 * 4)


    let lastOpacity = 0 // 记录之前的透明度
    let lastColor = "black"
    let mouseover = function(d) {
        // console.log(d)
        lastOpacity = d3.select(this)
            .style("opacity")
        d3.select(this)
            .style("opacity", 1)
        lastColor = texts[d.order].style("fill")
        texts[d.order].style("fill", "black")
    }

    let mousemove = function(d) {}

    let mouseleave = function(d) {
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
            .attr("x", x + LEFT)
            .attr("y", y)
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
            .attr("x", x + w * dx / 2 + LEFT)
            .attr("y", y + h * dy / 2))
    }

    // 左上角坐标xy，宽高wh，会场
    const COORDINATES = [
        [0, 0, 7, 4, M] // day1
        ,
        [10, 0, 5, 4, M],
        [16, 0, 5, 4, R],
        [22, 0, 4, 1, A],
        [22, 1, 6, 1, B],
        [22, 2, 6, 1, C],
        [22, 3, 6, 1, D],
        [27, 0, 3, 1, A],
        [32, 0, 3, 1, A],
        [32, 1, 3, 1, B],
        [32, 2, 3, 1, C],
        [32, 3, 3, 1, D],
        [2, 4, 7, 4, M] // day2
        ,
        [10, 4, 4, 4, M],
        [16, 4, 5, 4, R],
        [22, 4, 4, 1, A],
        [22, 5, 6, 1, B],
        [22, 6, 6, 1, C],
        [22, 7, 6, 1, D],
        [27, 4, 3, 1, A],
        [32, 4, 3, 1, A],
        [32, 5, 3, 1, B],
        [32, 6, 3, 1, C],
        [32, 7, 3, 1, D],
        [2, 8, 5, 1, M] // day3
        ,
        [3, 9, 6, 1, B],
        [3, 10, 6, 1, C],
        [10, 8, 4, 3, M],
        [8, 11, 3, 1, A]
    ]


    const background = []
    for (let i = 0; i < 7; ++i) {
        for (let j = 0; j < 3; ++j) {
            background.push({ x: 5 * i, y: 4 * j })
        }
    }
    psnSdlSvg.selectAll()
        .data(background)
        .enter()
        .append("rect")
        .attr("x", (d) => {
            return xs(d.x) + LEFT
        })
        .attr("y", (d) => {
            return ys(d.y)
        })
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("width", 5 * dx)
        .attr("height", 4 * dy)
        .style("fill", "white")
        .style("fill-opacity", 0.1)
        .style("stroke", "white")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.2)
        .style("opacity", 1)


    // add the specific squares
    COORDINATES.forEach(crd => addRect(...crd))
    apiSchedule(pid).then(res => {
        for (let idx of res) {
            rects[idx].style("opacity", 1)
            texts[idx].style("fill", "black")
        }
    })

}