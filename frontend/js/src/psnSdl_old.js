// 热力图，将72小时划分成144个半小时处理16*3*3
function drawPersonalSchedule(pid){
    // para: pid(integer)  selected person
    
    let psnSdlSvg = d3.select("#container_psnsdl").select("svg")
    const WIDTH = psnSdlSvg.attr("width")
    const HEIGHT = psnSdlSvg.attr("height")
    const ORIGINAL_OPACITY = 1

    //Read the data
    d3.csv("../../static/psnSdl.csv", data => {
        let myTime = d3.map(data, function (d) { return d.time }).keys()
        let myGrids  = d3.map(data, function (d) { return d.grid }).keys()
        
        // Build X scales and axis:
        let x = d3.scaleBand()
            .range([0, WIDTH])
            .domain(myTime)
            .padding(0)
        psnSdlSvg.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + HEIGHT + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        let y = d3.scaleBand()
            .range([0,HEIGHT])
            .domain(myGrids)
            .padding(0) // 避免缝隙出现
            
        psnSdlSvg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        let myColor = d3.scaleOrdinal(d3.schemePastel1)

        // create a tooltip
        let tooltip = d3.select("#container_psnsdl")
            .append("div")
            .classed("tooltip",true)

        let mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }

        let mousemove = function (d) {
            if (d3.mouse(this)[0] + 70 < 0.85 * WIDTH) {
                tooltip
                    .html("The exact value of<br>this "+d.grid+"cell is: " + d.value)
                    .style("left", (d3.mouse(this)[0] + 70) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
            }
            else {
                tooltip
                    .html("The exact value of<br>this "+d.grid+"cell is: " + d.value)
                    .style("left", (d3.mouse(this)[0] - 100) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
            }
        }

        let mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", ORIGINAL_OPACITY)
        }

        // add the squares
        psnSdlSvg.selectAll()
            .data(data, function (d) { return d.time + ':' + d.grid })
            .enter()
            .append("rect")
            .attr("x", (d)=>{ 
                // 手工制造缝隙?
                return x(d.time) 
            })
            .attr("y", (d)=>{ 
                // 让同一天的重合，掩盖缝隙；不同天之间创造出缝隙
                return y(d.grid)  - parseInt((parseInt(d.grid))%4)
            })
            .attr("rx", 0)
            .attr("ry", 0)
            .attr("width", x.bandwidth()+1) // 让水平方向重合
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(d.value) })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", ORIGINAL_OPACITY)
            .classed("rectangle",true)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })


}
