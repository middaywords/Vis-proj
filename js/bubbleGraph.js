function draw_bubble() {

    /*var svg5 = d3.select("svg5"),
        
        width5 = +svg5.attr("width"),
        g = svg5.append("g").attr("transform", "translate(" + width5 / 2 + "," + width5 / 2 + ")");*/
    var margin = 20
    var color = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([width5 - margin, width5 - margin])
        .padding(2);

    var tooltip = d3.select("#container_bubble").append("div").attr("class", "tooltip hidden");

    d3.json("data/bubble.json", function (error, root) {
        if (error) throw error;

        root = d3.hierarchy(root)
            .sum(function (d) { return d.size; })
            .sort(function (a, b) { return b.value - a.value; });

        var focus = root,
            nodes = pack(root).descendants(),
            view;

        var circle = svg5.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .style("fill", function (d) { return d.children ? color(d.depth) : null; })
            .style("display", function (d) { return d.parent === root || d === root ? "inline" : "none"; })
            
     ////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////       
            .on("click", function (d) {
                if (focus !== d) zoom(d), d3.event.stopPropagation();
                if (d.children == undefined) {
                    tooltip.classed("hidden", true);
                    $("#choiceWindow").slideDown(500);
                    $("#backGround").show();
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
                    windowSetup(true);
                    draw_feature(d.data.name);
                    draw_personal_bubble(d.data.name);
                    draw_personal_map(d.data.name);
                    draw_wordcloud(d.data.name);           
                    drawPersonalSchedule(parseInt(d.data.name));
                    console.log("d.data.name " + d.data.name);
                }
            })
            .on("mousemove", function (d) {
                if (d.children == undefined) {
                    text = d.data.name;
                    var mouse = d3.mouse(svg5.node()).map(function (d) { return parseInt(d); });
                    tooltip.classed("hidden", false)
                        .attr("style", function () {
                            return "left:" + (mouse[0] + width5 / 2) + "px;top:" + (mouse[1] + width5 / 2.2) + "px";
                        })
                        .html(function () {
                            return text;
                        });
                }
            })
            .on("mouseout", function (d) {
                tooltip.classed("hidden", true);
            });

        

        var text = svg5.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("font-size", "small")
            .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
            .style("font-family","微软正黑体")
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

        var node = svg5.selectAll("circle,text");

        svg5
            .style("background", color(-1))
            .on("click", function () { zoom(root); });

        zoomTo([root.x, root.y, root.r * 2 + margin]);

        function zoom(d) {
            var focus0 = focus; focus = d;

            var transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", function (d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function (t) { zoomTo(i(t)); };
                });

            transition.select("#container_bubble").selectAll("circle")
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
            transition.select("#container_bubble").selectAll("text")
                .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                .style("fill-opacity", function (d) { return d.parent === focus && d.children != undefined ? 1 : 0; })
                .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
        }

        function zoomTo(v) {
            var k = width5 / v[2]; view = v;
            node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
            circle.attr("r", function (d) { return d.r * k; });
        }
    });
}




function data_prepare() {
    /*
    var id = [];
    d3.csv("data/day1.csv", function (data) {
        data.forEach(element => {
            if (id.indexOf(element.id) == -1)
                id.push(element.id);
        });
        d3.csv("data/day2.csv", function (data2) {
            data2.forEach(element => {
                if (id.indexOf(element.id) == -1)
                    id.push(element.id);
            });
            d3.csv("data/day3.csv", function (data3) {
                data3.forEach(element => {
                    if (id.indexOf(element.id) == -1)
                        id.push(element.id);
                });
                d3.json("分类/cluster.json", function (data4) {
                    data4.specialist.forEach(element => {
                        index = id.indexOf(element);
                        if (index != -1)
                            id.splice(index, 1);
                    });
                    data4.newsman.forEach(element => {
                        index = id.indexOf(element);
                        if (index != -1)
                            id.splice(index, 1);
                    });
                    data4.staff.forEach(element => {
                        index = id.indexOf(element);
                        if (index != -1)
                            id.splice(index, 1);
                    });
                    var output = [];
                    id.forEach(element => {
                        var a = {};
                        a.name = element;
                        a.size = 1;
                        output.push(a);
                    })
                    //console.log(output)
                    document.write(JSON.stringify(output));
                });      
            });
        });
    });*/
    /*
    d3.json("分类/cluster.json", function (data) {
        id = data.staff;
        d3.json("分类/staff_count_exhibition.json", function (data2) {
            dm = d3.keys(data2).filter(function (d) { return d != '' });
            dm.forEach(element => {
                index = id.indexOf(element);
                if (index != -1)
                    id.splice(index, 1);
            });
            d3.json("分类/staff_count_register.json", function (data3) {
                dm = d3.keys(data3).filter(function (d) { return d != '' });
                dm.forEach(element => {
                    index = id.indexOf(element);
                    if (index != -1)
                        id.splice(index, 1);
                    else
                        console.log(element);
                });
                d3.json("分类/staff_count_room5.json", function (data4) {
                    dm = d3.keys(data4).filter(function (d) { return d != '' });
                    dm.forEach(element => {
                        index = id.indexOf(element);
                        if (index != -1)
                            id.splice(index, 1);
                        else
                            console.log(element);
                    });
                    d3.json("分类/staff_count_room6.json", function (data5) {
                        dm = d3.keys(data5).filter(function (d) { return d != '' });
                        dm.forEach(element => {
                            index = id.indexOf(element);
                            if (index != -1)
                                id.splice(index, 1);
                            else
                                console.log(element);
                        });
                        d3.json("分类/staff_count_service.json", function (data6) {
                            dm = d3.keys(data6).filter(function (d) { return d != '' });
                            dm.forEach(element => {
                                index = id.indexOf(element);
                                if (index != -1)
                                    id.splice(index, 1);
                                else
                                    console.log(element);
                            });
                            d3.json("分类/staff_countHallABCD.json", function (data7) {
                                dm = d3.keys(data7).filter(function (d) { return d != '' });
                                dm.forEach(element => {
                                    index = id.indexOf(element);
                                    if (index != -1)
                                        id.splice(index, 1);
                                    else
                                        console.log(element);
                                });

                                console.log(id);
                            });
                        });
                    });
                });
            });
        });
    });*/
}
