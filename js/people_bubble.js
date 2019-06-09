function draw_personal_bubble(id) {
    var margin = 20
    var color = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([width8 - margin, width8 - margin])
        .padding(2);

    var tooltip = d3.select("#container_personalBubble").append("div").attr("class", "tooltip hidden");

    d3.json("data/bubble.json", function (error, root) {
        if (error) throw error;

        root = d3.hierarchy(root)
            .sum(function (d) { return d.size; })
            .sort(function (a, b) { return b.value - a.value; });



        var focus = root,
            nodes = pack(root).descendants(),
            view;

        var highlight;

        var circle = svg8.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function (d) { if (d.data.name == id) focus = d; return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .style("fill", function (d) { if (d == focus && d.children == undefined) { highlight = this; return "yellow"; } else return d.children ? color(d.depth) : null; })
            .style("display", function (d) {
                if (focus == root) {
                    if (d != root && d.parent == focus)
                        return "inline"
                    else if (d == root)
                        return 'inline';
                    else
                        return "none";
                }
                else if (focus.parent == root) {
                    if (d == root || (d != root && d.parent == root) || (d != root && d.parent != root && d.parent == focus))
                        return "inline";
                    else
                        return "none";
                }

                else if (focus.parent.parent == root) {
                    if (d == root || (d != root && d.parent == root) || (d != root && d.parent == focus.parent) || (d != root && d.parent == focus))
                        return "inline";
                    else
                        return 'none';
                }
            })
            .on("click", function (d) {
                if (focus !== d) zoom(d), d3.event.stopPropagation();
                if (d.children == undefined) {
                    tooltip.classed("hidden", true);
                    d3.select("#container_feature").selectAll('svg').remove();
                    d3.select("#container_personalMap").selectAll('svg').remove();
                    d3.select("#container_wordCloud").selectAll('svg').remove();
                    d3.select("#container_psnsdl").selectAll('svg').remove();
                    document.getElementById('personalMap').innerHTML = "当前查看人员: " + d.data.name;
                    width7 = document.getElementById('container_feature').offsetWidth;
                    height7 = width7 / 1.2;
                    width8 = document.getElementById('container_personalBubble').offsetWidth;
                    height8 = width8 / 1.7;
                    width9 = document.getElementById('container_personalMap').offsetWidth;
                    height9 = width9 / 3.1;
                    width10 = document.getElementById('container_wordCloud').offsetWidth;
                    height10 = width10 / 1.2;
                    width11 = document.getElementById('container_psnsdl').offsetWidth;
                    height11 = width11 / 2.57;
                    highlight.style.fill = "black";
                    this.style.fill = "yellow";
                    highlight = this;
                    windowSetup(false);
                    draw_feature(d.data.name);
                    draw_personal_map(d.data.name);
                    draw_wordcloud(d.data.name)
                    drawPersonalSchedule(parseInt(d.data.name));
                }
            })
            .on("mousemove", function (d) {
                if (d.children == undefined) {
                    text = d.data.name;
                    var mouse = d3.mouse(svg8.node()).map(function (d) { return parseInt(d); });
                    tooltip.classed("hidden", false)
                        .attr("style", function () {
                            return "left:" + (mouse[0] + width8 / 2) + "px;top:" + (mouse[1] + width8 / 2.2) + "px";
                        })
                        .html(function () {
                            return text;
                        });
                }
            })
            .on("mouseout", function (d) {
                tooltip.classed("hidden", true);
            });



        var text = svg8.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("font-size", "small")
            .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
            .style("font-family", "微软正黑体")
            .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
            .text(function (d) {
                if (d.children != undefined)
                    return d.data.name;
                else
                    return undefined;
            })
            .on("click", function (d) {
                if (focus !== d) zoom(d), d3.event.stopPropagation();
            })

        var node = svg8.selectAll("circle,text");

        svg8
            .style("background", color(-1))
            .on("click", function () { zoom(root); })


        zoomTo([focus.x, focus.y, focus.r * 4 + margin]);

        function zoom(d) {
            var focus0 = focus; focus = d;
            var transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", function (d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 4 + margin]);
                    return function (t) { zoomTo(i(t)); };
                });

            transition.select("#container_personalBubble").selectAll("circle")
                //.filter(function (d) { return d.parent === focus || this.style.display == "inline"; })
                //.on("start", function (d) { if (d.parent == focus || d.parent == focus.parent) this.style.display = "inline"; else this.style.display = "none";})
                .on("start", function (d) {
                    if (focus == root) {
                        if (d != root && d.parent == focus)
                            this.style.display = "inline"
                        else if (d == root)
                            this.style.display = 'inline';
                        else
                            this.style.display = "none";
                    }
                    else if (focus.parent == root) {
                        if (d == root || (d != root && d.parent == root) || (d != root && d.parent != root && d.parent == focus))
                            this.style.display = "inline";
                        else
                            this.style.display = "none";
                    }

                    else if (focus.parent.parent == root) {
                        if (d == root || (d != root && d.parent == root) || (d != root && d.parent == focus.parent) || (d != root && d.parent == focus))
                            this.style.display = "inline";
                        else
                            this.style.display = 'none';
                    }

                })
            //.on("end", function (d) { if (d.parent === focus) this.style.display = "none"; });
            transition.select("#container_personalBubble").selectAll("text")
                .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                .style("fill-opacity", function (d) { return d.parent === focus && d.children != undefined ? 1 : 0; })
                .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
        }

        function zoomTo(v) {
            var k = width8 / v[2]; view = v;
            node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
            circle.attr("r", function (d) { return d.r * k; });
        }
    });
}