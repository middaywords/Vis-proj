function draw_pie(day, gt, rooms){
        // -----------------------------
    // Parameters:
    //  1. rooms : list e.g. ['room1', 'room2']
    //  2. t:   : int 0 - 782
    //  3. day: : 1 - 3
    //  Usage:
    //     change(new_data(t, rooms, day);
    console.log(rooms);
    var svgPie = d3.select("#pie")
        .append("svg")
        .append("g");

    svgPie.append("g")
        .attr("class", "slices");

    var widthPie = width6,
        heightPie = height6,
        radiusPie = Math.min(widthPie, heightPie) / 2;

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var arc = d3.arc()
        .outerRadius(radiusPie * 0.8)
        .innerRadius(radiusPie * 0.6);

    var outerArc = d3.arc()
        .innerRadius(radiusPie * 0.9)
        .outerRadius(radiusPie * 0.9);

    svgPie.attr("transform", "translate(" + widthPie / 3 + "," + heightPie / 2 + ")");

    var key = function(d){ return d.data.label; };
    var room_minute_data;
    //var rooms = ['other'];
    //var day = 1;
    //var gt = 0;

    // -----------------------------------
    d3.json('data/room_minute_count.json', function (error, data) {
        room_minute_data = data;
        change_pie(new_data(day, gt, rooms));
    });

    // -----------------------------------
    var color = d3.scaleOrdinal(d3.schemeCategory20)
        .domain(["Staff", "Business Man", "Newsman", "Ordinary People", "Specialist"]);

    function new_data (day, t, rooms){
        gt = (gt + 100) % 780;
        var time_point = gt + 2;
        var data_tpoint = room_minute_data[day - 1][time_point];

        var name_list = ["Specialist", "Newsman", "Staff", "Business Man", "Ordinary People"];
        var rdata = name_list.map(function (label) {
            return {label: label, value: 0}
        });

        for (item in data_tpoint) {
            rooms.forEach(function (room) {
                if (room == item){
                    for (let i = 0; i < 5; i++) {
                        rdata[i].value += data_tpoint[item][i]
                    }
                }
            })
        }

        rdata.sort(function(a,b) {
            return d3.ascending(a.label, b.label);
        });

        return rdata;
    }


    d3.select(".randomize")
        .on("click", function(){
            change_pie(new_data(day, gt, rooms));
        });

    function mergeWithFirstEqualZero(first, second){
        var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label); });

        var onlyFirst = first
            .filter(function(d){ return !secondSet.has(d.label) })
            .map(function(d) { return {label: d.label, value: 0}; });
        return d3.merge([ second, onlyFirst ])
            .sort(function(a,b) {
                return d3.ascending(a.label, b.label);
            });
    }

    function change_pie(data) {
        var duration = +document.getElementById("duration").value;
        var data0 = svgPie.select(".slices").selectAll("path.slice")
            .data().map(function(d) { return d.data });
        if (data0.length == 0) data0 = data;
        var was = mergeWithFirstEqualZero(data, data0);
        var is = mergeWithFirstEqualZero(data0, data);

        /* ------- SLICE ARCS -------*/

        var slice = svgPie.select(".slices").selectAll("path.slice")
            .data(pie(was), key);

        slice.enter()
            .insert("path")
            .attr("class", "slice")
            .style("fill", function(d) { return color(d.data.label); })
            .each(function(d) {
                this._current = d;
            });

        slice = svgPie.select(".slices").selectAll("path.slice")
            .data(pie(is), key);

        slice
            .transition().duration(duration)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    _this._current = interpolate(t);
                    return arc(_this._current);
                };
            });


        slice
            .exit().transition().delay(duration).duration(0)
            .remove();

        // create a tooltip
        var tooltip_pie = d3.select("#fortip")
            .append("div")
            .attr("class", "tooltip_pie")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .text("I'm a circle!");
        var fill_color_rec, stroke_color_rec;

        d3.select(".slices").selectAll("path.slice")
            .on("mouseover", function(){
                fill_color_rec = this.style.fill;
                stroke_color_rec = this.style.stroke;
                this.style.fill = "white";
                this.style.stroke = "black";


                return tooltip_pie.style("visibility", "visible");
            })
            .on("mousemove", function(ele){
                return tooltip_pie.html(data[ele.index].label + ":" + data[ele.index].value)
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
            })
            .on("mouseout", function(){

                this.style.fill = fill_color_rec;
                this.style.stroke = stroke_color_rec;
                return tooltip_pie.style("visibility", "hidden");

            });
        d3.selectAll(".legend").remove();
        for (let i = 0; i < data.length; i++) {
            svgPie.append("circle").attr("class", "legend").attr("cx",70).attr("cy",-50 + 30*i).attr("r", 6).style("fill", color(data[i].label));
            svgPie.append("text").attr("class", "legend").attr("x", 80).attr("y", -50 + 30*i).text(data[i].label).style("font-size", "15px").attr("alignment-baseline","middle")
        }
    };

}