function getPersonSchedule(pid){
    // para: pid(integer)  selected person
        
}

// 热力图，将72小时划分成144个半小时处理16*3*3
function drawPersonalSchedule(pid){
    // para: pid(integer)  selected person
    
    let data = getPersonSchedule(pid)
    let psnSdlSvg = d3.select("#container_psnsdl").select("svg")
    const WIDTH = psnSdlSvg.attr("width")
    const HEIGHT = psnSdlSvg.attr("height")

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function (data) {
        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        let myGroups = d3.map(data, function (d) { return d.group }).keys()
        let myVars  = d3.map(data, function (d) { return d.variable }).keys()

        // Build X scales and axis:
        let x = d3.scaleBand()
            .range([0, WIDTH])
            .domain(myGroups)
            .padding(0.05)
        psnSdlSvg.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + HEIGHT + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        let y = d3.scaleBand()
            .range([HEIGHT, 0])
            .domain(myVars)
            .padding(0.05)
        psnSdlSvg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        let myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1, 100])

        // create a tooltip
        let tooltip = d3.select("#container_psnsdl")
            .append("div")
            .classed("tooltip",true)

        // Three function that change the tooltip when user hover / move / leave a cell
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
                    .html("The exact value of<br>this cell is: " + d.value)
                    .style("left", (d3.mouse(this)[0] + 70) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
            }
            else {
                tooltip
                    .html("The exact value of<br>this cell is: " + d.value)
                    .style("left", (d3.mouse(this)[0] - 100) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
            }
        }

        let mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        psnSdlSvg.selectAll()
            .data(data, function (d) { return d.group + ':' + d.variable })
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.group) })
            .attr("y", function (d) { return y(d.variable) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(d.value) })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        
        // Add title to graph
        psnSdlSvg.append("text")
            .attr("x", 0)
            .attr("y", -50)
            .attr("text-anchor", "left")
            .style("font-size", "22px")
            .text('Day #1.')
    })


}
