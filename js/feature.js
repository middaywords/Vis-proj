function draw_feature(params) {
    var margin = width7 / 8 // 控制堆栈图的间隙
    var trueFeatrue = 2;
    var data = [
        { offsetx: 2, under: 0.4, over: 0.0 },
        { offsetx: 4, under: 0.1, over: 0 },
        { offsetx: 6, under: 0.9, over: 0.0 },
        { offsetx: 8, under: 0.8, over: 0.2 }
    ]
    // 数据转换器
    var stack = d3.stack()
        .keys(['under', 'over'])
        .order(d3.stackOrderNone)// 使用原始数据的顺序不进行顺序调整
        .offset(d3.stackOffsetNone)
    var stackData = stack(data)
    var colorZ = d3.scaleOrdinal(d3.schemeCategory10) // 这里color其实是第三维度，他代表水果种类
    // x比例尺
    var xScale = d3.scaleBand()
        .range([0, width7])
    // x值域，其实就是月份
    xScale.domain([1, 2, 3, 4, 5, 6, 7, 8])
    var yScale = d3.scaleLinear()
        .range([height7, 0])

    yScale.domain([0, 1])

    // x轴和y轴
    var xAxis = d3.axisBottom().scale(xScale)
    var yAxis = d3.axisLeft(yScale)
    // 绘图
    /*
        // 添加x轴
        svg7.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' +  ',' + (height7) + ')')
            .call(xAxis)
        // 添加y轴
        svg7.append('g')
            .attr('class', 'axis')
            .call(yAxis)
    */
    // 将二维数组的第一维剥离，打散成n列
    var Color = ["#EE3B3B", "#228B22", "#00688B", "#CD950C", "#104E8B", "#969696", "#53868B"]

    var rectContainer = svg7.selectAll('rectContainer')
        .data(stackData)
        .enter()
        .append('g')
        .attr('id', (d, i) => { return 'rectContainer_' + i })



    // 渲染每一列
    var rectContainer_0 = svg7.select('#rectContainer_0').selectAll('rect')
        .data((d) => d)
        .enter()

    rectContainer_0.append('rect')
        .attr('x', (d) => { return xScale(d.data.offsetx) + margin / 2 })
        .attr('y', (d) => { return height7 })
        .attr('fill', function (d, i) {
            return Color[i];
        })
        .attr('width', (d) => { return margin })
        .attr('height', (d) => { return 0 })
        .attr('stroke', '#ccc')
        .transition().duration(function (d, index) {
            return Math.sqrt(index + 1) * 600;
        })
        .attr('width', (d) => { return margin })
        .attr('height', (d) => { return height7 - yScale(d[1] - d[0]) })
        .attr('y', (d) => { return yScale(d[1]) })

    rectContainer_0.append("text")
        .attr('x', (d) => { return -height7 + margin * 0.9 })
        .attr("transform", "rotate(-90, 0, 0)")
        .attr('y', (d) => { return xScale(d.data.offsetx) + margin * 1.5 })
        .style("fill", "white")
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "middle")
        .text("hello")
        .attr('opacity', 0)
        .transition().duration(function (d, index) {
            return 600;
        })
        .delay(function (d, index) {
            return Math.sqrt(index + 1) * 600;
        })
        .attr('y', (d) => { return xScale(d.data.offsetx) + margin * 1.2 })
        .attr('opacity', function (d) {
            if (d.data.under >= 0.400)
                return 1;
            else
                return 0;
        })

    var rectContainer_1 = svg7.select('#rectContainer_1').selectAll('rect')
        .data((d) => d)
        .enter()

    rectContainer_1.append('rect')
        .attr('x', (d) => { return xScale(d.data.offsetx) + margin / 2 })
        .attr('y', (d) => { return 0.2 * height7 })
        .attr('fill', function (d, i) {
            return Color[i];
        })
        .attr('opacity', 0.2)
        .attr('width', (d) => { return margin })
        .attr('height', (d) => { return 0 })
        .attr('stroke', '#ccc')
        .transition().duration(function (d, index) {
            return 600;
        })
        .delay(function (d, index) {
            return Math.sqrt(index + 1) * 600;
        })
        .attr('width', (d) => { return margin })
        .attr('height', (d) => { return height7 - yScale(d[1] - d[0]) })
        .attr('y', (d) => { return yScale(d[1]) })

    rectContainer_1.append('rect')
        .attr('x', (d) => { return xScale(d.data.offsetx) + margin / 2 })
        .attr('y', (d) => { return 0.2 * height7 })
        .attr('fill', function (d, i) {
            return Color[i];
        })
        .attr('opacity', function (d, i) {
            if (i == trueFeatrue)
                return 1;
            else
                return 0;
        })
        .attr('width', (d) => { return margin })
        .attr('height', (d) => { return 0 })
        .attr('stroke', '#ccc')
        .transition().duration(function (d, index) {
            return 600;
        })
        .delay(function (d, index) {
            return Math.sqrt(index + 1) * 600;
        })
        .attr('width', (d) => { return margin })
        .attr('height', (d) => { return height7 - yScale(d[1] - d[0]) })
        .attr('y', (d) => { return 0 })

    var data2 = [
        { offsetx: 1, offset: 0.5 * margin },
        { offsetx: 2, offset: 1.5 * margin },
        { offsetx: 3, offset: 1.5 * margin },
        { offsetx: 4, offset: 1.5 * margin },
        { offsetx: 5, offset: 1.5 * margin },
        { offsetx: 6, offset: 1.5 * margin },
        { offsetx: 7, offset: 1.5 * margin },
        { offsetx: 8, offset: 1.5 * margin }
    ]

    data2.forEach(function (element, index) {
        if (index <= trueFeatrue * 2)
            element.offset = 0.5 * margin;
        else
            element.offset = 1.5 * margin;
    });

    var stackData2 = stack(data2)
    var whiterect = svg7.selectAll('whiterect')
        .data(stackData2)
        .enter()
        .append('g')
        .attr('class', 'whiterect')
        .attr('fill', "white")

    whiterect.selectAll('rect')
        .data((d) => d)
        .enter()
        .append('rect')
        .attr('x', (d) => { return xScale(d.data.offsetx) + margin })
        .attr('y', (d) => { return 0.2 * height7 })
        .attr('width', (d) => { return margin })
        .attr('height', (d) => { return 5 })
        .transition().duration(function (d, index) {
            return Math.sqrt(Math.abs(index - trueFeatrue * 2) + trueFeatrue + 1) * 400;
        })
        .attr('x', (d) => { return xScale(d.data.offsetx) + d.data.offset })

    var tag = svg7
        .append('g')
        .attr('class', 'tag')

    tag.append('rect')
        .attr('fill', "white")
        .attr('opacity', 1)
        .attr('x', (d) => { return margin + width7 * 0.05 })
        .attr('y', (d) => { return -40 })
        .attr('width', (d) => { return width7 * 0.9 })
        .attr('height', (d) => { return 60 })
        .attr('stroke', '#ccc')
        .transition()
        .duration(600)
        .delay(Math.sqrt(Math.abs(trueFeatrue)) * 400)
        .attr('fill', Color[trueFeatrue])
        .attr('opacity', 1)
        .attr('x', (d) => { return 0 })
        .attr('width', (d) => { return width7 + margin * 2 })
        .attr('height', (d) => { return 30 })

    svg7.append("text")
        .attr('x', (d) => { return 0.5 * (width7 + margin * 2) })
        .attr('y', (d) => { return -22 })
        .style("fill", "white")
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "large")
        .text("hello")
}

