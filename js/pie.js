
var room_minute_data;
var pie;
var key_pie;
var color_pie, arc_pie, outerArc_pie, svgPie;
//var rooms = ['other'];
//var day = 1;
function draw_pie(day, gt, rooms){
        // -----------------------------
    // Parameters:
    //  1. rooms : list e.g. ['room1', 'room2']
    //  2. t:   : int 0 - 782
    //  3. day: : 1 - 3
    //  Usage:
    //     change_pie(new_data(t, rooms, day);
    console.log(rooms);
    svgPie = d3.select("#pie")
        .append("svg")
        .append("g");

    svgPie.append("g")
        .attr("class", "slices");

    widthPie = 250,
        heightPie = 150,
        radiusPie = Math.min(widthPie, heightPie) / 2;

    pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    arc_pie = d3.arc()
        .outerRadius(radiusPie * 0.8)
        .innerRadius(radiusPie * 0.6);

    outerArc_pie = d3.arc()
        .innerRadius(radiusPie * 0.9)
        .outerRadius(radiusPie * 0.9);

    svgPie.attr("transform", "translate(" + widthPie / 3 + "," + heightPie / 2 + ")");

    key_pie = function(d){ return d.data.label; };

    
    change_pie(day, gt, rooms);

    // -----------------------------------
    color_pie = d3.scaleOrdinal(d3.schemeCategory20)
        .domain(["Staff", "Business Man", "Newsman", "Ordinary People", "Specialist"]);
}

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


    

    function change_pie (day, t, rooms){

        // -----------------------------------
        d3.json('data/room_minute_count.json', function (error, data) {
            room_minute_data = data;
            console.log('pie!!');
            console.log(day, t, rooms);
            var time_point = parseInt(t) + 2;
            var data_tpoint = room_minute_data[day - 1][time_point];
            console.log(rooms);
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

                    var duration = 500;
        var data0 = svgPie.select(".slices").selectAll("path.slice")
            .data().map(function(d) { return d.data });
        if (data0.length == 0) data0 = rdata;
        var was = mergeWithFirstEqualZero(rdata, data0);
        var is = mergeWithFirstEqualZero(data0, rdata);

        /* ------- SLICE ARCS -------*/

        var slice = svgPie.select(".slices").selectAll("path.slice")
            .data(pie(was), key_pie);

        slice.enter()
            .insert("path")
            .attr("class", "slice")
            .style("fill", function(d) { return color_pie(d.data.label); })
            .each(function(d) {
                this._current = d;
            });

        slice = svgPie.select(".slices").selectAll("path.slice")
            .data(pie(is), key_pie);

        slice
            .transition().duration(duration)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    _this._current = interpolate(t);
                    return arc_pie(_this._current);
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
                return tooltip_pie.html(rdata[ele.index].label + ":" + rdata[ele.index].value)
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
            })
            .on("mouseout", function(){

                this.style.fill = fill_color_rec;
                this.style.stroke = stroke_color_rec;
                return tooltip_pie.style("visibility", "hidden");

            });
        d3.selectAll(".legend").remove();
        for (let i = 0; i < rdata.length; i++) {
            svgPie.append("circle").attr("class", "legend").attr("cx",70).attr("cy",-50 + 30*i).attr("r", 6).style("fill", color_pie(rdata[i].label));
            svgPie.append("text").attr("class", "legend").attr("x", 80).attr("y", -50 + 30*i).text(rdata[i].label).style("font-size", "15px").attr("alignment-baseline","middle")
        }

        });
};