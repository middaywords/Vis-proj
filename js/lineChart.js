function draw_line(read_file, thisarea) {
    //Read the data
    data = [];
    d3.json("data/sid_peoplecount" + read_file + ".json", function (error, sid_peoplecount) {
        dm = d3.keys(sid_peoplecount[0]).filter(function (d) { return d != "time" })
        if (thisarea == undefined)
            thisarea = dm;
        sid_peoplecount.forEach(function (ele) {
            var row1 = {};
            var num = 0;
            for (i in thisarea) {
                name = thisarea[i];
                if (ele[name] != undefined)
                    num += ele[name];
            }
            row1.date = d3.timeParse("%H:%M:%S")(second2hour(ele.time));
            row1.value = num;
            data.push(row1);
        });
        //console.log(data);
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
    });
}

function second2hour(second) {
    var hh, mm, ss;
    second = typeof second === 'string' ? parseInt(second) : second;
    if (!second || second < 0) {
        return;
    }
    hh = second / 3600 | 0;

    second = Math.round(second) - hh * 3600;

    mm = second / 60 | 0;

    ss = Math.round(second) - mm * 60;

    if (Math.round(hh) < 10) {
        hh = '0' + hh;
    }
    if (Math.round(mm) < 10) {
        mm = '0' + mm;
    }
    if (Math.round(ss) < 10) {
        ss = '0' + ss;
    }
    return hh + ':' + mm + ':' + ss;
}