function draw_line() {
    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

        // When reading the csv, I must format variables:
        function (d) {
            return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
        },

        // Now I can use this dataset:
        function (data) {

            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return d.date; }))
                .range([0, width3]);
            xAxis = svg3.append("g")
                .attr("transform", "translate(0," + height3 + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.value; })])
                .range([height3, 0]);
            yAxis = svg3.append("g")
                .call(d3.axisLeft(y));

            // Add a clipPath: everything out of this area won't be drawn.
            var clip = svg3.append("defs").append("svg3:clipPath")
                .attr("id", "clip")
                .append("svg3:rect")
                .attr("width", width3)
                .attr("height", height3)
                .attr("x", 0)
                .attr("y", 0);

            // Add brushing
            var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
                .extent([[0, 0], [width3, height3]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

            // Create the line variable: where both the line and the brush take place
            var line = svg3.append('g')
                .attr("clip-path", "url(#clip)")

            // Add the line
            line.append("path")
                .datum(data)
                .attr("class", "line")  // I add the class line to be able to modify this line later on.
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.value) })
                )

            // Add the brushing
            line
                .append("g")
                .attr("class", "brush")
                .call(brush);

            // A function that set idleTimeOut to null
            var idleTimeout
            function idled() { idleTimeout = null; }

            // A function that update the chart for given boundaries
            function updateChart() {

                // What are the selected boundaries?
                extent = d3.event.selection

                // If no selection, back to initial coordinate. Otherwise, update X axis domain
                if (!extent) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                    x.domain(d3.extent(data, function (d) { return d.date; }))
                } else {
                    x.domain([x.invert(extent[0]), x.invert(extent[1])])
                    line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                }

                // Update axis and line position
                xAxis.transition().duration(1000).call(d3.axisBottom(x))
                line
                    .selectAll('.line')
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.date) })
                        .y(function (d) { return y(d.value) })
                    )
            }
        })
}
