function draw_sankey(read_file){
    // Color scale used
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    
    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(20)
        .size([width4, height4]);

    // load the data
    d3.json("data/" + read_file + ".json", function(error, graph) {

        // Constructs a new Sankey generator with the default settings.
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(1);

        // add in the links
        var link = svg4.append("g")
            .selectAll(".link")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", sankey.link() )
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

        // add in the nodes
        var node = svg4.append("g")
            .selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag()
                .subject(function(d) { return d; })
                .on("start", function() { this.parentNode.appendChild(this); })
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node
            .append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
            // Add hover text
            .append("title")
            .text(function(d) { return d.name + "\n" + "There is " + d.value + " stuff in this node"; });

        // add in the title for the nodes
        node
            .append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x < width4 / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + d.x + ","
                    + (d.y = Math.max(
                        0, Math.min(height - d.dy, d3.event.y))
                    ) + ")");
            sankey.relayout();
            link.attr("d", sankey.link() );
        }

    });
}