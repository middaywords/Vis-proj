function draw_feature(choose_sid) {
    d3.csv("data/feature.csv", function (read_data) {
        var data = [];
        var Tag = ["记者", "专家", "工作人员", "普通观众"];
        var trueFeatrue = -1;
        dm = d3.keys(read_data[0]).filter(function (d) { return d != "" })
        console.log(dm);
        read_data.forEach(element => {
            if (element.id == choose_sid) {
                var y1 = {}
                if (parseFloat(element[dm[7]]) < 0.8) {
                    y1.offsetx = 2;
                    y1.under = parseFloat(element[dm[7]]);
                    y1.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 0;
                        y1.offsetx = 2;
                        y1.under = Math.min(1, parseFloat(element[dm[7]]));
                        y1.over = 0;
                    }
                    else {
                        y1.offsetx = 2;
                        y1.under = 0.8;
                        y1.over = Math.min(0.2, parseFloat(element[dm[7]]) - 0.8);
                    }
                }
                data.push(y1);

                var y2 = {}
                if (parseFloat(element[dm[6]]) < 0.8) {
                    y2.offsetx = 4;
                    y2.under = parseFloat(element[dm[6]]);
                    y2.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 1;
                        y2.offsetx = 4;
                        y2.under = Math.min(1, parseFloat(element[dm[6]]));
                        y2.over = 0;
                    }
                    else {
                        y2.offsetx = 4;
                        y2.under = 0.8;
                        y2.over = Math.min(0.2, parseFloat(element[dm[6]]) - 0.8);
                    }
                }
                data.push(y2);

                var y3 = {}
                if (parseFloat(element[dm[3]]) < 0.8) {
                    y3.offsetx = 6;
                    y3.under = parseFloat(element[dm[3]]);
                    y3.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 2;
                        y3.offsetx = 6;
                        y3.under = Math.min(1, parseFloat(element[dm[3]]));
                        y3.over = 0;
                    }
                    else {
                        y3.offsetx = 6;
                        y3.under = 0.8;
                        y3.over = Math.min(0.2, parseFloat(element[dm[3]]) - 0.8);
                    }
                }
                data.push(y3);

                var y4 = {}
                if (parseFloat(element[dm[4]]) < 0.8) {
                    y4.offsetx = 8;
                    y4.under = parseFloat(element[dm[4]]);
                    y4.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 3;
                        y4.offsetx = 8;
                        y4.under = Math.min(1, parseFloat(element[dm[4]]));
                        y4.over = 0;
                    }
                    else {
                        y4.offsetx = 8;
                        y4.under = 0.8;
                        y4.over = Math.min(0.2, parseFloat(element[dm[4]]) - 0.8);
                    }
                }
                data.push(y4);

                var y5 = {}
                if (parseFloat(element[dm[2]]) < 0.8) {
                    y5.offsetx = 10;
                    y5.under = parseFloat(element[dm[2]]);
                    y5.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 4;
                        y5.offsetx = 10;
                        y5.under = Math.min(1, parseFloat(element[dm[2]]));
                        y5.over = 0;
                    }
                    else {
                        y5.offsetx = 10;
                        y5.under = 0.8;
                        y5.over = Math.min(0.2, parseFloat(element[dm[2]]) - 0.8);
                    }
                }
                data.push(y5);
            }
        });
        console.log(data);
        var margin = width7 / 10 // 控制堆栈图的间隙

        /*var data = [
            { offsetx: 2, under: 0.4, over: 0.0 },
            { offsetx: 4, under: 0.1, over: 0 },
            { offsetx: 6, under: 0.9, over: 0.0 },
            { offsetx: 8, under: 0.8, over: 0.2 },
            { offsetx: 10, under: 0.8, over: 0.2 }
        ]*/
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
        xScale.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
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
        var Color = ["#EE3B3B", "#228B22", "#00688B", "#00688B", "#00688B", "#53868B"]

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
            .text(function (d, index) {
                switch (index) {
                    case 0:
                        return dm[7];
                        break;
                    case 1:
                        return dm[6];
                        break;
                    case 2:
                        return dm[3];
                        break;
                    case 3:
                        return dm[4];
                        break;
                    case 4:
                        return dm[2];
                        break;
                    default:
                        break;
                }

            })
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
            { offsetx: 8, offset: 1.5 * margin },
            { offsetx: 9, offset: 1.5 * margin },
            { offsetx: 10, offset: 1.5 * margin }
        ]

        data2.forEach(function (element, index) {
            if(trueFeatrue == -1)
                element.offset = margin;
            else if (index <= trueFeatrue * 2)
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
            .text(function (d, index) {
                if (trueFeatrue == -1)
                    return Tag[3];
                else if (trueFeatrue < 2)
                    return Tag[trueFeatrue];
                else
                    return Tag[2];
            })
    });
}