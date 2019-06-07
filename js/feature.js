function draw_feature(choose_sid) {
    d3.csv("data/feature.csv", function (read_data) {
        var data = [];
        var Tag = ["专家大咖", "记者", "VIP", "工作人员", "普通观众"];
        var trueFeatrue = -1;
        var stay_area = "";
        dm = d3.keys(read_data[0]).filter(function (d) { return d != "" })
        console.log(dm);
        read_data.forEach(element => {
            if (element.id == choose_sid) {
                var y0 = {}
                if (parseFloat(element[dm[8]]) < 0.8) {
                    y0.offsetx = 2;
                    y0.under = parseFloat(element[dm[8]]);
                    y0.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 0;
                        y0.offsetx = 2;
                        y0.under = Math.min(1, parseFloat(element[dm[8]]));
                        y0.over = 0;
                    }
                    else {
                        y0.offsetx = 2;
                        y0.under = 0.8;
                        y0.over = Math.min(0.2, parseFloat(element[dm[8]]) - 0.8);
                    }
                }
                data.push(y0);

                var y1 = {}
                if (parseFloat(element[dm[7]]) < 0.8) {
                    y1.offsetx = 4;
                    y1.under = parseFloat(element[dm[7]]);
                    y1.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 1;
                        y1.offsetx = 4;
                        y1.under = Math.min(1, parseFloat(element[dm[7]]));
                        y1.over = 0;
                    }
                    else {
                        y1.offsetx = 4;
                        y1.under = 0.8;
                        y1.over = Math.min(0.2, parseFloat(element[dm[7]]) - 0.8);
                    }
                }
                data.push(y1);

                var y2 = {}
                if (parseFloat(element[dm[6]]) < 0.8) {
                    y2.offsetx = 6;
                    y2.under = parseFloat(element[dm[6]]);
                    y2.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 2;
                        y2.offsetx = 6;
                        y2.under = Math.min(1, parseFloat(element[dm[6]]));
                        y2.over = 0;
                    }
                    else {
                        y2.offsetx = 6;
                        y2.under = 0.8;
                        y2.over = Math.min(0.2, parseFloat(element[dm[6]]) - 0.8);
                    }
                }
                data.push(y2);

                var y3 = {}
                if (parseFloat(element[dm[3]]) < 0.8) {
                    y3.offsetx = 8;
                    y3.under = parseFloat(element[dm[3]]);
                    y3.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 3;
                        y3.offsetx = 8;
                        y3.under = Math.min(1, parseFloat(element[dm[3]]));
                        y3.over = 0;
                    }
                    else {
                        y3.offsetx = 8;
                        y3.under = 0.8;
                        y3.over = Math.min(0.2, parseFloat(element[dm[3]]) - 0.8);
                    }
                }
                data.push(y3);

                var y4 = {}
                if (parseFloat(element[dm[4]]) < 0.8) {
                    y4.offsetx = 10;
                    y4.under = parseFloat(element[dm[4]]);
                    y4.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 4;
                        y4.offsetx = 10;
                        y4.under = Math.min(1, parseFloat(element[dm[4]]));
                        y4.over = 0;
                    }
                    else {
                        y4.offsetx = 10;
                        y4.under = 0.8;
                        y4.over = Math.min(0.2, parseFloat(element[dm[4]]) - 0.8);
                    }
                }
                data.push(y4);

                var y5 = {}
                stay_area = element[dm[1]];
                D = parseFloat(element[dm[2]]);
                if (stay_area == "mainHall")
                    D = 0.8;
                if (D <= 0.8) {
                    y5.offsetx = 12;
                    y5.under = D;
                    y5.over = 0.0;
                }
                else {
                    if (trueFeatrue == -1) {
                        trueFeatrue = 5;
                        y5.offsetx = 12;
                        y5.under = Math.min(1, D);
                        y5.over = 0;
                    }
                    else {
                        y5.offsetx = 12;
                        y5.under = 0.8;
                        y5.over = Math.min(0.2, D - 0.8);
                    }
                }
                data.push(y5);
            }
        });
        console.log(data);
        var margin = width7 / 12 // 控制堆栈图的间隙

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
        xScale.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
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
        var Color = ["#53868B", "#EE3B3B", "#228B22", "#00688B", "#00688B", "#00688B"]

        var rectContainer = svg7.selectAll('rectContainer')
            .data(stackData)
            .enter()
            .append('g')
            .attr('id', (d, i) => { return 'rectContainer_' + i })

        var tooltip = d3.select("#container_feature").append("div").attr("class", "tooltip hidden");

        // 渲染每一列
        var rectContainer_0 = svg7.select('#rectContainer_0').selectAll('rect')
            .data((d) => d)
            .enter()

        rectContainer_0.append('rect')
            .on("mousemove", function (d, index) {
                var text;
                switch (index) {
                    case 0:
                        text = dm[8];
                        break;
                    case 1:
                        text = dm[7];
                        break;
                    case 2:
                        text = dm[6];
                        break;
                    case 3:
                        text = dm[3];
                        break;
                    case 4:
                        text = dm[4];
                        break;
                    case 5:
                        text = dm[2] + " " + stay_area;
                        break;
                    default:
                        break;
                }

                var mouse = d3.mouse(svg7.node()).map(function (d) { return parseInt(d); });
                var offsetL = document.getElementById('container_feature').offsetLeft + 20;            
                var offsetT = document.getElementById('container_feature').offsetTop + 10;
                tooltip.classed("hidden", false)
                    .attr("style", function () {
                        return "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px";
                    })
                    .html(text)
            })

            .on("mouseout", function (d) {
                tooltip.classed("hidden", true);
            })
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
            .attr("text-anchor", "small")
            .style("alignment-baseline", "small")
            .style("font-size", "small")
            .text(function (d, index) {
                switch (index) {
                    case 0:
                        return "上讲台";
                        break;
                    case 1:
                        return "没有签到";
                        break;
                    case 2:
                        return "进入R4";
                        break;
                    case 3:
                        return "进入R5";
                        break;
                    case 4:
                        return "进入R6";
                        break;
                    case 5:
                        return "待在" + " " + stay_area;
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
            { offsetx: 10, offset: 1.5 * margin },
            { offsetx: 11, offset: 1.5 * margin },
            { offsetx: 12, offset: 1.5 * margin }
        ]

        data2.forEach(function (element, index) {
            if (trueFeatrue == -1)
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
                    return Tag[4];
                else if (trueFeatrue < 3)
                    return Tag[trueFeatrue];
                else
                    return Tag[3];
            })
    });
}