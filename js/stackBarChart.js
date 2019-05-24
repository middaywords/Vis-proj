function draw_stack(thisarea) {
    var sid_peopleout;
    d3.json("data/sid_people_out3.json", function (error, sid_people_out) {
        sid_peopleout = sid_people_out;
    });

    d3.json("data/sid_people_in3.json", function (error, sid_peoplein) {
        //////////
        // GENERAL //
        //////////
        // List of groups = header of the csv files

        if (thisarea == undefined)
            thisarea = d3.keys(sid_peoplein[0]).filter(function (d) { return d != 'time' && d != "other" });
        //var keys = dm = d3.keys(sid_peoplein[0]).filter(function (d) { thisarea.indexOf(d) != -1 })

        var keys = thisarea
        // color palette
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeCategory10);

        //stack the data?
        var stackedData = d3.stack()
            .keys(keys)
            (sid_peoplein)

        var stackedData2 = d3.stack()
            .keys(keys)
            (sid_peopleout)



        //////////
        // AXIS //
        //////////

        // Add X axis
        var x = d3.scaleTime()
            .domain(d3.extent(sid_peoplein, function (d) { return d3.timeParse("%H:%M:%S")(second2hour(d.time)); }))
            .range([0, width2]);

        var xAxis = svg2.append("g")
            .attr("transform", "translate(0," + height2 + ")")
            .attr("fill", "white")
            .call(d3.axisBottom(x).ticks(10))

        // Add X axis label:
        svg2.append("text")
            .attr("text-anchor", "end")
            .attr("x", width2)
            .attr("y", height2 + 40)
            .text("Time")
            .attr("fill", "white");

        // Add Y axis label:
        svg2.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -20)
            .text("in / out")
            .attr("text-anchor", "start")
            .attr("fill", "white");

        // Add Y axis
        var max = 0, min = 0;
        sid_peopleout.forEach(function (ele) {
            var tmp = 0;
            for (i in thisarea) {
                name = thisarea[i];
                tmp += ele[name];
            }
            if (tmp > max)
                max = tmp;
        });

        sid_peoplein.forEach(function (ele) {
            var tmp = 0;
            for (i in thisarea) {
                name = thisarea[i];
                tmp += ele[name];
            }
            if (tmp > min)
                min = tmp;
        });
        console.log(max)
        var y = d3.scaleLinear()
            .domain([-max, min])
            .range([height2, 0]);

        /*var y = d3.scaleLinear()
            .domain([-d3.max(sid_peopleout, function (d) { return +d.hallA; }), d3.max(sid_peoplein, function (d) { return +d.hallA; })])
            .range([height2, 0]);*/

        svg2.append("g")
            .call(d3.axisLeft(y).ticks(5))



        //////////
        // BRUSHING AND CHART //
        //////////

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg2.append("defs").append("svg:clipPath")
            .attr("id", "clipPath")
            .append("svg:rect")
            .attr("id", "clip-rect")
            .attr("width", width2)
            .attr("height", height2)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width2, height2]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the scatter variable: where both the circles and the brush take place
        var areaChart = svg2.append('g')
            .attr("clip-path", "url(#clipPath)")

        // Area generator
        var area = d3.area()
            .x(function (d) { return x(d3.timeParse("%H:%M:%S")(second2hour(d.data.time))); })
            .y0(function (d) { return y(d[0]); })
            .y1(function (d) { return y(d[1]); })

        var area2 = d3.area()
            .x(function (d) { return x(d3.timeParse("%H:%M:%S")(second2hour(d.data.time))); })
            .y0(function (d) { return y(-d[0]); })
            .y1(function (d) { return y(-d[1]); })

        // Show the areas
        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", function (d) { return "myArea1 " + d.key })
            .style("fill", function (d) { return color(d.key); })
            .attr("d", area)

        areaChart
            .selectAll("mylayers2")
            .data(stackedData2)
            .enter()
            .append("path")
            .attr("class", function (d) { return "myArea2 " + d.key })
            .style("fill", function (d) { return color(d.key); })
            .attr("d", area2)

        // Add the brushing
        areaChart
            .append("g")
            .attr("class", "brush")
            .call(brush);

        var idleTimeout
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart() {

            extent = d3.event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain(d3.extent(sid_peoplein, function (d) { return d3.timeParse("%H:%M:%S")(second2hour(d.time)); }))
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(10))

            areaChart.selectAll(".myArea1")
                .transition().duration(1000)
                .attr("d", area)

            areaChart.selectAll(".myArea2")
                .transition().duration(1000)
                .attr("d", area2)
        }



        //////////
        // HIGHLIGHT GROUP //
        //////////

        // What to do when one group is hovered
        var highlight = function (d) {
            d3.selectAll(".myArea1").style("opacity", .1)
            d3.selectAll(".myArea2").style("opacity", .1)
            d3.selectAll("." + d).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = function (d) {
            d3.selectAll(".myArea1").style("opacity", 1)
            d3.selectAll(".myArea2").style("opacity", 1)
        }



        //////////
        // LEGEND //
        //////////

        // Add one dot in the legend for each name.
        var size = 5.5
        svg2.selectAll("myrect")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", 480)
            .attr("y", function (d, i) { return -35 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) { return color(d) })
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add one dot in the legend for each name.
        svg2.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 480 + size * 1.2)
            .attr("y", function (d, i) { return -35 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return color(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "small")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
    })
    /*
    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv", function (data) {


        //////////
        // GENERAL //
        //////////

        // List of groups = header of the csv files
        var keys = data.columns.slice(1)
        console.log(keys);
        // color palette
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeCategory20);

        //stack the data?
        var stackedData = d3.stack()
            .keys(keys)
            (data)

        var stackedData2 = d3.stack()
            .keys(keys)
            (data)



        //////////
        // AXIS //
        //////////

        // Add X axis
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d.year; }))
            .range([0, width2]);
        var xAxis = svg2.append("g")
            .attr("transform", "translate(0," + height2 + ")")
            .attr("fill", "white")
            .call(d3.axisBottom(x).ticks(5))

        // Add X axis label:
        svg2.append("text")
            .attr("text-anchor", "end")
            .attr("x", width2)
            .attr("y", height2 + 40)
            .text("Time (year)")
            .attr("fill", "white");

        // Add Y axis label:
        svg2.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -20)
            .text("# of baby born")
            .attr("text-anchor", "start")
            .attr("fill", "white");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-200000, 200000])
            .range([height2, 0]);
        svg2.append("g")
            .call(d3.axisLeft(y).ticks(5))



        //////////
        // BRUSHING AND CHART //
        //////////

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg2.append("defs").append("svg:clipPath")
            .attr("id", "clipPath")
            .append("svg:rect")
            .attr("id", "clip-rect")
            .attr("width", width2)
            .attr("height", height2)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width2, height2]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the scatter variable: where both the circles and the brush take place
        var areaChart = svg2.append('g')
            .attr("clip-path", "url(#clipPath)")

        // Area generator
        var area = d3.area()
            .x(function (d) { return x(d.data.year); })
            .y0(function (d) { return y(d[0]); })
            .y1(function (d) { return y(d[1]); })

        var area2 = d3.area()
            .x(function (d) { return x(d.data.year); })
            .y0(function (d) { return y(-d[0]); })
            .y1(function (d) { return y(-d[1]); })

        // Show the areas
        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", function (d) { return "myArea1 " + d.key })
            .style("fill", function (d) { return color(d.key); })
            .attr("d", area)

        areaChart
            .selectAll("mylayers2")
            .data(stackedData2)
            .enter()
            .append("path")
            .attr("class", function (d) { return "myArea2 " + d.key })
            .style("fill", function (d) { return color(d.key); })
            .attr("d", area2)

        // Add the brushing
        areaChart
            .append("g")
            .attr("class", "brush")
            .call(brush);

        var idleTimeout
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart() {

            extent = d3.event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain(d3.extent(data, function (d) { return d.year; }))
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))

            areaChart.selectAll(".myArea1")
                .transition().duration(1000)
                .attr("d", area)

            areaChart.selectAll(".myArea2")
                .transition().duration(1000)
                .attr("d", area2)
        }



        //////////
        // HIGHLIGHT GROUP //
        //////////

        // What to do when one group is hovered
        var highlight = function (d) {
            d3.selectAll(".myArea1").style("opacity", .1)
            d3.selectAll(".myArea2").style("opacity", .1)
            d3.selectAll("." + d).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = function (d) {
            d3.selectAll(".myArea1").style("opacity", 1)
            d3.selectAll(".myArea2").style("opacity", 1)
        }



        //////////
        // LEGEND //
        //////////

        // Add one dot in the legend for each name.
        var size = 20
        svg2.selectAll("myrect")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", 480)
            .attr("y", function (d, i) { return -30 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) { return color(d) })
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add one dot in the legend for each name.
        svg2.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 480 + size * 1.2)
            .attr("y", function (d, i) { return -30 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return color(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

    })*/
}
