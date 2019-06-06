function draw_heatmap() {
    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function (data) {

        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var myGroups = d3.map(data, function (d) { return d.group; }).keys()
        var myVars = d3.map(data, function (d) { return d.variable; }).keys()

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width5])
            .domain(myGroups)
            .padding(0.05);
        svg5.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + height5 + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height5, 0])
            .domain(myVars)
            .padding(0.05);
        svg5.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1, 100])

        // create a tooltip
        var tooltip = d3.select("#container_heatmap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            if (d3.mouse(this)[0] + 70 < 0.85 * width5) {
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
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg5.selectAll()
            .data(data, function (d) { return d.group + ':' + d.variable; })
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
    })

    // Add title to graph
    svg5.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("A d3.js heatmap");

    // Add subtitle to graph
    svg5.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("A short description of the take-away message of this chart.");
}
