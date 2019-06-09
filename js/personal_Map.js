function draw_personal_map(read_file, choose_id){
	var color_arr = [];

	for (var i = 0; i < 60; i++)
	{
		for (var j = 0; j <= 16; j++)
		{
			color_arr.push({"x_axis": i, "y_axis": j, "value": 0})
		}
	}

	d3.csv("data/sid.csv", function(sid) {
		d3.json("data/sid_peoplecount" + read_file + ".json", function(count){
			d3.csv("data/day1.csv", function(list){
				//initial
				  	var num = 0;

				  	var time = 0;

				  	var line_length = 17;

				  	for (var key in count[time])
				  	{
				  		if (key != "time")
				  		{
				  			color_arr[parseInt(sid[num].x_axis) * line_length + parseInt(sid[num].y_axis)].value = count[time][key];
				  		}
				  		num++;
				  	}

				  	//map_size
				  	var width = 500,
					    height = 300,
					    radius = 9;

					//color
					//var myColor = d3.scaleLinear().domain([1,10]).range(d3.schemeReds[7]);

					var index_domain = [];

					for (var i = 1; i <= 5; i++)
					{
						index_domain.push(i);
					}

					var color_range = [];

					for (var i = 0; i <= 10; i++)
					{
						if (i == 0)
							color_range.push("#424242");
						else
						{
							color_range.push(d3.schemeReds[7][i]);
							//schemePaired[i]
						}
					}

					var myColor = d3.scaleThreshold()
							  .domain(index_domain)
							  .range(color_range);

					//map
					var topology = hexTopology(radius, width, height);

					var projection = hexProjection(radius);

					var path = d3.geoPath()
					    .projection(projection);

					var svg = d3.select("#map_1").append("svg")
					    .attr("id","heatmap")
					    .attr("width", width)
					    .attr("height", height);

					svg.append("g")
					    .attr("class", "hexagon")
					  .selectAll("path")
					    .data(topology.objects.hexagons.geometries)
					  .enter().append("path")
					    .attr("id", function(d){
					    	if (d.x_axis < 10 && d.y_axis < 10)
					    	{
					    		return "Square0" + d.x_axis + "0" + d.y_axis;
					    	}
					    	else if (d.x_axis < 10 && d.y_axis >= 10)
					    	{
					    		return "Square0" + d.x_axis + d.y_axis;
					    	}
					    	else if (d.x_axis >= 10 && d.y_axis < 10)
					    	{
					    		return "Square" + d.x_axis + "0" + d.y_axis;
					    	}
					    	else if (d.x_axis >= 10 && d.y_axis >= 10)
					    	{
					    		return "Square" + d.x_axis + d.y_axis;
					    	}
					    })
					    .attr("d", function(d) { return path(topojson.feature(topology, d)); })
					    .style("fill", function(d) { return myColor(d.value)} )
					    //.attr("class", function(d) { return d.fill ? "fill" : null; })
					   	.style("stroke", "grey")
					    .on("mousedown", mousedown)
					    .on("mousemove", mousemove)
					    .on("mouseup", mouseup);

					svg.append("path")
					    .datum(topojson.mesh(topology, topology.objects.hexagons))
					    .attr("class", "mesh")
					    .attr("d", path);

					var border = svg.append("path")
					    .attr("class", "border")
					    .call(redraw);

					//map1
					var topology1 = hexTopology1(radius, width, height);

					var projection1 = hexProjection1(radius);

					var path1 = d3.geoPath()
					    .projection(projection1);

					//The second svg
					var svg1 = d3.select("#map1_1").append("svg")
					    .attr("id","heatmap1")
					    .attr("width", width)
					    .attr("height", height);

					svg1.append("g")
					    .attr("class", "hexagon1")
					  .selectAll("path")
					    .data(topology1.objects.hexagons.geometries)
					  .enter().append("path")
					    .attr("id", function(d){
					    	if (d.x_axis < 10 && d.y_axis < 10)
					    	{
					    		return "Square10" + d.x_axis + "0" + d.y_axis;
					    	}
					    	else if (d.x_axis < 10 && d.y_axis >= 10)
					    	{
					    		return "Square10" + d.x_axis + d.y_axis;
					    	}
					    	else if (d.x_axis >= 10 && d.y_axis < 10)
					    	{
					    		return "Square1" + d.x_axis + "0" + d.y_axis;
					    	}
					    	else if (d.x_axis >= 10 && d.y_axis >= 10)
					    	{
					    		return "Square1" + d.x_axis + d.y_axis;
					    	}
					    })
					    .attr("d", function(d) { return path(topojson.feature(topology1, d)); })
					    .style("fill", function(d) { return myColor(d.value)} )
					    //.attr("class", function(d) { return d.fill ? "fill" : null; })
					    .style("stroke", "grey")
					    .on("mousedown", mousedown1)
					    .on("mousemove", mousemove1)
					    .on("mouseup", mouseup1);

					svg1.append("path")
					    .datum(topojson.mesh(topology1, topology1.objects.hexagons))
					    .attr("class", "mesh1")
					    .attr("d", path1);

				    var border1 = svg1.append("path")
								 .attr("class","border1")
								 .call(redraw1);

					// create a tooltip
					var tooltip = d3.select("#text-div_1")
									.append("div")
								    .attr("id","tool")
								    .style("opacity", 1)
								    .attr("class", "tooltip")
								    .style("background-color", "white")
								    .style("border", "solid")
								    .style("border-width", "2px")
								    .style("border-radius", "5px")
								    .style("padding", "5px");

					tooltip.html("The exact time is: " + "7 : 0");

				//Draw room
					var path_length = radius * 1.5;

					var path_color = "white";

					var room_point_arr = [];

					lineGenerator_room = d3.line()
			                      //    获取每个节点的x坐标
			                      .x(function(d) {
			                            return d[0];
			                        })
			                       //   获取每个节点的y坐标
			                       .y(function(d) {
			                            return d[1];
			                       });

			        //first floor
			        //hallA
			        room_point_arr = [];
			        room_point_arr.push([1 * path_length, 2 * path_length]);
			        room_point_arr.push([6 * path_length, 2 * path_length]);
			        room_point_arr.push([6 * path_length, 4 * path_length]);
			        room_point_arr.push([1 * path_length, 4 * path_length]);
			        room_point_arr.push([1 * path_length, 2 * path_length]);

		        	svg.append('path')
		        		.attr("class", "hallA")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //hallB
				    room_point_arr = [];
			        room_point_arr.push([1 * path_length, 4 * path_length]);
			        room_point_arr.push([6 * path_length, 4 * path_length]);
			        room_point_arr.push([6 * path_length, 6 * path_length]);
			        room_point_arr.push([1 * path_length, 6 * path_length]);
			        room_point_arr.push([1 * path_length, 4 * path_length]);

			        svg.append('path')
		        		.attr("class", "hallB")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //hallC
				    room_point_arr = [];
			        room_point_arr.push([1 * path_length, 6 * path_length]);
			        room_point_arr.push([6 * path_length, 6 * path_length]);
			        room_point_arr.push([6 * path_length, 8 * path_length]);
			        room_point_arr.push([1 * path_length, 8 * path_length]);
			        room_point_arr.push([1 * path_length, 6 * path_length]);

			        svg.append('path')
		        		.attr("class", "hallC")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //hallD
				    room_point_arr = [];
			        room_point_arr.push([1 * path_length, 8 * path_length]);
			        room_point_arr.push([6 * path_length, 8 * path_length]);
			        room_point_arr.push([6 * path_length, 10 * path_length]);
			        room_point_arr.push([1 * path_length, 10 * path_length]);
			        room_point_arr.push([1 * path_length, 8 * path_length]);

			        svg.append('path')
		        		.attr("class", "hallD")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //poster
				    room_point_arr = [];
			        room_point_arr.push([7 * path_length, 3 * path_length]);
			        room_point_arr.push([9 * path_length, 3 * path_length]);
			        room_point_arr.push([9 * path_length, 10 * path_length]);
			        room_point_arr.push([7 * path_length, 10 * path_length]);
			        room_point_arr.push([7 * path_length, 3 * path_length]);

			        svg.append('path')
		        		.attr("class", "poster")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //toilet1
				    room_point_arr = [];
			        room_point_arr.push([10 * path_length, 4 * path_length]);
			        room_point_arr.push([12 * path_length, 4 * path_length]);
			        room_point_arr.push([12 * path_length, 6 * path_length]);
			        room_point_arr.push([10 * path_length, 6 * path_length]);
			        room_point_arr.push([10 * path_length, 4 * path_length]);

			        svg.append('path')
		        		.attr("class", "toilet1")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //room1
				    room_point_arr = [];
			        room_point_arr.push([10 * path_length, 6 * path_length]);
			        room_point_arr.push([12 * path_length, 6 * path_length]);
			        room_point_arr.push([12 * path_length, 10 * path_length]);
			        room_point_arr.push([10 * path_length, 10 * path_length]);
			        room_point_arr.push([10 * path_length, 6 * path_length]);

			        svg.append('path')
		        		.attr("class", "room1")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				   	//room2
				   	room_point_arr = [];
			        room_point_arr.push([10 * path_length, 10 * path_length]);
			        room_point_arr.push([12 * path_length, 10 * path_length]);
			        room_point_arr.push([12 * path_length, 12 * path_length]);
			        room_point_arr.push([10 * path_length, 12 * path_length]);
			        room_point_arr.push([10 * path_length, 10 * path_length]);

			        svg.append('path')
		        		.attr("class", "room2")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //exhibition
				   	room_point_arr = [];
			        room_point_arr.push([15 * path_length, 2 * path_length]);
			        room_point_arr.push([19 * path_length, 2 * path_length]);
			        room_point_arr.push([19 * path_length, 12 * path_length]);
			        room_point_arr.push([15 * path_length, 12 * path_length]);
			        room_point_arr.push([15 * path_length, 2 * path_length]);

			        svg.append('path')
		        		.attr("class", "exhibition")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //mainHall
				    room_point_arr = [];
			        room_point_arr.push([19 * path_length, 2 * path_length]);
			        room_point_arr.push([29 * path_length, 2 * path_length]);
			        room_point_arr.push([29 * path_length, 12 * path_length]);
			        room_point_arr.push([19 * path_length, 12 * path_length]);
			        room_point_arr.push([19 * path_length, 2 * path_length]);

			        svg.append('path')
		        		.attr("class", "mainHall")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //register
				    room_point_arr = [];
			        room_point_arr.push([2 * path_length, 12 * path_length]);
			        room_point_arr.push([6 * path_length, 12 * path_length]);
			        room_point_arr.push([6 * path_length, 14 * path_length]);
			        room_point_arr.push([2 * path_length, 14 * path_length]);
			        room_point_arr.push([2 * path_length, 12 * path_length]);

				    svg.append('path')
		        		.attr("class", "register")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //service
				    room_point_arr = [];
			        room_point_arr.push([19 * path_length, 14 * path_length]);
			        room_point_arr.push([21 * path_length, 14 * path_length]);
			        room_point_arr.push([21 * path_length, 16 * path_length]);
			        room_point_arr.push([19 * path_length, 16 * path_length]);
			        room_point_arr.push([19 * path_length, 14 * path_length]);

				    svg.append('path')
		        		.attr("class", "service")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //room3
				    room_point_arr = [];
			        room_point_arr.push([21 * path_length, 14 * path_length]);
			        room_point_arr.push([25 * path_length, 14 * path_length]);
			        room_point_arr.push([25 * path_length, 16 * path_length]);
			        room_point_arr.push([21 * path_length, 16 * path_length]);
			        room_point_arr.push([21 * path_length, 14 * path_length]);

				    svg.append('path')
		        		.attr("class", "room3")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //room4
				    room_point_arr = [];
			        room_point_arr.push([25 * path_length, 14 * path_length]);
			        room_point_arr.push([27 * path_length, 14 * path_length]);
			        room_point_arr.push([27 * path_length, 16 * path_length]);
			        room_point_arr.push([25 * path_length, 16 * path_length]);
			        room_point_arr.push([25 * path_length, 14 * path_length]);

				    svg.append('path')
		        		.attr("class", "room4")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //toilet2
				    room_point_arr = [];
			        room_point_arr.push([27 * path_length, 14 * path_length]);
			        room_point_arr.push([29 * path_length, 14 * path_length]);
			        room_point_arr.push([29 * path_length, 16 * path_length]);
			        room_point_arr.push([27 * path_length, 16 * path_length]);
			        room_point_arr.push([27 * path_length, 14 * path_length]);

				    svg.append('path')
		        		.attr("class", "toilet2")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //elevator_up
				    room_point_arr = [];
			        room_point_arr.push([10 * path_length, 1 * path_length]);
			        room_point_arr.push([12 * path_length, 1 * path_length]);
			        room_point_arr.push([12 * path_length, 2 * path_length]);
			        room_point_arr.push([10 * path_length, 2 * path_length]);
			        room_point_arr.push([10 * path_length, 1 * path_length]);

				    svg.append('path')
		        		.attr("class", "elevator_up")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //elevator_down
				    room_point_arr = [];
			        room_point_arr.push([10 * path_length, 14 * path_length]);
			        room_point_arr.push([12 * path_length, 14 * path_length]);
			        room_point_arr.push([12 * path_length, 15 * path_length]);
			        room_point_arr.push([10 * path_length, 15 * path_length]);
			        room_point_arr.push([10 * path_length, 14 * path_length]);

				    svg.append('path')
		        		.attr("class", "elevator_down")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");


				    //second floor
				    //diningHall
					room_point_arr = [];
			        room_point_arr.push([1 * path_length, 2 * path_length]);
			        room_point_arr.push([6 * path_length, 2 * path_length]);
			        room_point_arr.push([6 * path_length, 10 * path_length]);
			        room_point_arr.push([1 * path_length, 10 * path_length]);
			        room_point_arr.push([1 * path_length, 2 * path_length]);

				    svg1.append('path')
		        		.attr("class", "diningHall")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //room5
				    room_point_arr = [];
			        room_point_arr.push([1 * path_length, 10 * path_length]);
			        room_point_arr.push([6 * path_length, 10 * path_length]);
			        room_point_arr.push([6 * path_length, 12 * path_length]);
			        room_point_arr.push([1 * path_length, 12 * path_length]);
			        room_point_arr.push([1 * path_length, 10 * path_length]);

				    svg1.append('path')
		        		.attr("class", "room5")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //recreationArea
				    room_point_arr = [];
			        room_point_arr.push([0 * path_length, 13 * path_length]);
			        room_point_arr.push([6 * path_length, 13 * path_length]);
			        room_point_arr.push([6 * path_length, 16 * path_length]);
			        room_point_arr.push([0 * path_length, 16 * path_length]);
			        room_point_arr.push([0 * path_length, 13 * path_length]);

				    svg1.append('path')
		        		.attr("class", "recreationArea")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				   	//toilet3
				   	room_point_arr = [];
			        room_point_arr.push([10 * path_length, 4 * path_length]);
			        room_point_arr.push([12 * path_length, 4 * path_length]);
			        room_point_arr.push([12 * path_length, 6 * path_length]);
			        room_point_arr.push([10 * path_length, 6 * path_length]);
			        room_point_arr.push([10 * path_length, 4 * path_length]);

				    svg1.append('path')
		        		.attr("class", "toilet3")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //room6
				    room_point_arr = [];
			        room_point_arr.push([10 * path_length, 6 * path_length]);
			        room_point_arr.push([12 * path_length, 6 * path_length]);
			        room_point_arr.push([12 * path_length, 8 * path_length]);
			        room_point_arr.push([10 * path_length, 8 * path_length]);
			        room_point_arr.push([10 * path_length, 6 * path_length]);

				    svg1.append('path')
		        		.attr("class", "toilet3")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //elevator_up
				   	room_point_arr = [];
			        room_point_arr.push([10 * path_length, 1 * path_length]);
			        room_point_arr.push([12 * path_length, 1 * path_length]);
			        room_point_arr.push([12 * path_length, 2 * path_length]);
			        room_point_arr.push([10 * path_length, 2 * path_length]);
			        room_point_arr.push([10 * path_length, 1 * path_length]);

				    svg1.append('path')
		        		.attr("class", "elevator_up")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");

				    //elevator_down
				    room_point_arr = [];
			        room_point_arr.push([10 * path_length, 14 * path_length]);
			        room_point_arr.push([12 * path_length, 14 * path_length]);
			        room_point_arr.push([12 * path_length, 15 * path_length]);
			        room_point_arr.push([10 * path_length, 15 * path_length]);
			        room_point_arr.push([10 * path_length, 14 * path_length]);

				    svg1.append('path')
		        		.attr("class", "elevator_down")
				        .attr('stroke', path_color)
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')
				        //    设置路径信息
				        .attr('d', lineGenerator_room(room_point_arr))
				        .attr('opacity', "1");
					
				//Add text
					var text_color = "white";
					//first floor
					//hallA
					svg.append('text')
						    .text('hallA')
						    .attr("x",2.25*path_length)
						    .attr('y',3.5*path_length)
						    .style("fill", text_color)

					//hallB
					svg.append('text')
						    .text('hallB')
						    .attr("x",2.25*path_length)
						    .attr('y',5.5*path_length)
						    .style("fill", text_color)

					//hallC
					svg.append('text')
						    .text('hallC')
						    .attr("x",2.25*path_length)
						    .attr('y',7.5*path_length)
						    .style("fill", text_color)

					//hallD
					svg.append('text')
						    .text('hallD')
						    .attr("x",2.25*path_length)
						    .attr('y',9.5*path_length)
						    .style("fill", text_color)

					//register
					svg.append('text')
						    .text('register')
						    .attr("x",2.1*path_length)
						    .attr('y',13.3*path_length)
						    .style("fill", text_color)

					//poster
					svg.append('text')
						    .text('poster')
						    .attr("x",-8.25*path_length)
						    .attr('y',8.25*path_length)
						    .attr("transform", "rotate(-90,0,0)")
						    .style("fill", text_color)

					//toilet1
					svg.append('text')
						    .text('toilet1')
						    .attr("x",10.1*path_length)
						    .attr('y',5.25*path_length)
						    .attr("font-size",9)
						    .style("fill", text_color)

					//room1
					svg.append('text')
						    .text('room1')
						    .attr("x",10.1*path_length)
						    .attr('y',8.25*path_length)
						    .attr("font-size",9)
						    .style("fill", text_color)

					//room2
					svg.append('text')
						    .text('room2')
						    .attr("x",10.1*path_length)
						    .attr('y',11.25*path_length)
						    .attr("font-size",9)
						    .style("fill", text_color)

					//elevator_up_floor1
					svg.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',1.65*path_length)
						    .attr("font-size",7)
						    .style("fill", text_color)

					//elevator_down_floor1
					svg.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',14.65*path_length)
						    .attr("font-size",7)
						    .style("fill", text_color)

					//exhibition
					svg.append('text')
						    .text('exhibition')
						    .attr("x",15.5*path_length)
						    .attr('y',7.25*path_length)
						    .attr("font-size",10)
						    .style("fill", text_color)

					//mainHall
					svg.append('text')
						    .text('mainHall')
						    .attr("x",21.75*path_length)
						    .attr('y',7.3*path_length)
						    .style("fill", text_color)

					//service
					svg.append('text')
						    .text('service')
						    .attr("x",19.1*path_length)
						    .attr('y',15.125*path_length)
						    .attr("font-size",8)
						    .style("fill", text_color)

					//room3
					svg.append('text')
					    .text('room3')
					    .attr("x",21.3*path_length)
					    .attr('y',15.3*path_length)
					    .style("fill", text_color)

					//room4
					svg.append('text')
						    .text('room4')
						    .attr("x",25.2*path_length)
						    .attr('y',15.125*path_length)
						    .attr("font-size",8)
						    .style("fill", text_color)

					//toilet2
					svg.append('text')
						    .text('toilet2')
						    .attr("x",27.2*path_length)
						    .attr('y',15.125*path_length)
						    .attr("font-size",8)
						    .style("fill", text_color)


					//second floor
					//diningHall
					svg1.append('text')
						    .text('diningHall')
						    .attr("x",1.05*path_length)
						    .attr('y',6.5*path_length)
						    .attr("font-size",15)
						    .style("fill", text_color)

					//room5
					svg1.append('text')
						    .text('room5')
						    .attr("x",1.75*path_length)
						    .attr('y',11.25*path_length)
						    .style("fill", text_color)

					//recreationArea
					svg1.append('text')
						    .text('recreationArea')
						    .attr("x",0.2*path_length)
						    .attr('y',14.75*path_length)
						    .attr("font-size",12)
						    .style("fill", text_color)

					//toilet3
					svg1.append('text')
						    .text('toilet3')
						    .attr("x",10.1*path_length)
						    .attr('y',5.25*path_length)
						    .attr("font-size",9)
						    .style("fill", text_color)

					//room6
					svg1.append('text')
						    .text('room6')
						    .attr("x",10.1*path_length)
						    .attr('y',7.25*path_length)
						    .attr("font-size",9)
						    .style("fill", text_color)

					//elevator_up_floor2
					svg1.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',1.65*path_length)
						    .attr("font-size",7)
						    .style("fill", text_color)

					//elevator_down_floor2
					svg1.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',14.65*path_length)
						    .attr("font-size",7)
						    .style("fill", text_color)

				//route
					Draw_route(choose_id);

					function Draw_route(id){
						var sid_data = [];
						var time_data = [];
						var line_data = [];
						var line_data1 = [];
						var time_data_arr = [];
						var time_data_arr1 = [];

						//choose those whose id = required id
						//list = day1/2/3
						for (var i = 0; i < list.length; i++)
						{
							if (list[i].id == id)
							{
								sid_data.push(list[i].sid);
								time_data.push(Math.floor(parseInt(list[i].time)/60) - 420);
							}	
						}

						for (var i = 0; i < sid_data.length; i++)
						{
							for (var j = 0; j < sid.length; j++)
							{
								if (sid_data[i] == sid[j].sid)
								{
									if (sid[j].x_axis <= 29)
									{
										line_data.push([sid[j].x_axis * path_length + path_length / 2, sid[j].y_axis * path_length - path_length / 2]);
										time_data_arr.push(time_data[i]);
									}
									else
									{
										line_data1.push([(sid[j].x_axis - 30) * path_length + path_length / 2, sid[j].y_axis * path_length - path_length / 2]);
										time_data_arr1.push(time_data[i]);
									}
									break;
								}
							}
						}

						var line_data_arr = [];
						var line_data_arr1 = [];

						var temp = [];

						for (var i = 0; i < line_data.length-1; i++)
						{
							temp = [];
							temp.push(line_data[i]);
							temp.push(line_data[i+1]);
							line_data_arr.push(temp);
						}
						for (var i = 0; i < line_data1.length-1; i++)
						{
							temp = [];
							temp.push(line_data1[i]);
							temp.push(line_data1[i+1]);
							line_data_arr1.push(temp);
						}

						lineGenerator = d3.line()
				                      //    获取每个节点的x坐标
				                      .x(function(d) {
				                            return d[0]
				                        })
				                       //   获取每个节点的y坐标
				                       .y(function(d) {
				                            return d[1];
				                       });

				        var route_color = "red";

				        for (var i = 0; i < line_data_arr.length; i++)
				        {
				        	if (i % line_data_arr.length == 0) var opac = '1';
				        	else opac = '0.2';

				        	svg.append('path')
				        		.attr("id", "indiv_line" + i.toString())
						        .attr('stroke', route_color)
						        .attr('stroke-width', '4')
						        .attr('fill', 'none')
						        //    设置路径信息
						        .attr('d', lineGenerator(line_data_arr[i]))
						        .attr('opacity', opac)
						}

						for (var i = 0; i < line_data_arr1.length; i++)
				        {
							opac = '0.2';

				        	svg1.append('path')
				        		.attr("id", "indiv_line1" + i.toString())
						        .attr('stroke', route_color)
						        .attr('stroke-width', '4')
						        .attr('fill', 'none')
						        //    设置路径信息
						        .attr('d', lineGenerator(line_data_arr1[i]))
						        .attr('opacity', opac)
						}
					}

					/*function Refresh_route(id, temp_time){
						var sid_data = [];
						var time_data = [];
						var line_data = [];
						var line_data1 = [];
						var time_data_arr = [];
						var time_data_arr1 = [];

						//choose those whose id = required id
						//list = day1/2/3
						for (var i = 0; i < list.length; i++)
						{
							if (list[i].id == id)
							{
								sid_data.push(list[i].sid);
								time_data.push(Math.floor(parseInt(list[i].time)/60) - 420);
							}	
						}

						for (var i = 0; i < sid_data.length; i++)
						{
							for (var j = 0; j < sid.length; j++)
							{
								if (sid_data[i] == sid[j].sid)
								{
									if (sid[j].x_axis <= 29)
									{
										line_data.push([sid[j].x_axis * path_length + path_length / 2, sid[j].y_axis * path_length - path_length / 2]);
										time_data_arr.push(time_data[i]);
									}
									else
									{
										line_data1.push([(sid[j].x_axis - 30) * path_length + path_length / 2, sid[j].y_axis * path_length - path_length / 2]);
										time_data_arr1.push(time_data[i]);
									}
									break;
								}
							}
						}

						var line_data_arr = [];
						var line_data_arr1 = [];

						var temp = [];

						for (var i = 0; i < line_data.length-1; i++)
						{
							temp = [];
							temp.push(line_data[i]);
							temp.push(line_data[i+1]);
							line_data_arr.push(temp);
						}
						for (var i = 0; i < line_data1.length-1; i++)
						{
							temp = [];
							temp.push(line_data1[i]);
							temp.push(line_data1[i+1]);
							line_data_arr1.push(temp);
						}

						lineGenerator = d3.line()
				                      //    获取每个节点的x坐标
				                      .x(function(d) {
				                            return d[0]
				                        })
				                       //   获取每个节点的y坐标
				                       .y(function(d) {
				                            return d[1];
				                       });

				        var route_color = "red";

				        var time_flag = 1;

				        while(time_flag)
				        {
				        	console.log(temp_time);

				        	//route refresh
					        for (var i = 0; i < line_data_arr.length; i++)
					        {
					        	if (time_data_arr[i] == temp_time) {
					        		var opac = '1'; 
					        		time_flag = 0;
					        		console.log("right");
					        	}
					        	else opac = '0.2';

					        	d3.select("#indiv_line" + i.toString())
							        .attr('stroke', route_color)
							        .attr('stroke-width', '4')
							        .attr('fill', 'none')
							        //    设置路径信息
							        .attr('d', lineGenerator(line_data_arr[i]))
							        .attr('opacity', opac)
							}

							for (var i = 0; i < line_data_arr1.length; i++)
					        {
					        	if (time_data_arr1[i] == temp_time) {
					        		var opac = '1'; 
					        		time_flag = 0;
					        		console.log("right");
					        	}
					        	else opac = '0.2';

					        	d3.select("#indiv_line1" + i.toString())
							        .attr('stroke', route_color)
							        .attr('stroke-width', '4')
							        .attr('fill', 'none')
							        //    设置路径信息
							        .attr('d', lineGenerator(line_data_arr1[i]))
							        .attr('opacity', opac)
							}

							document.getElementById("personal_map_time").innerHTML = "The exact time is: " + (7 + Math.floor(temp_time / 60)) + " : " + temp_time % 60;

							if (time_flag == 1)
							{
								temp_time++;
							}
				        }
					}*/

				//Refresh map and route
			    	change();

			    	//var refresh_map = setInterval(function(){timecount()},100);
			    	var refresh_map = setInterval(function(){timecount()},1000);
			    	clearInterval(refresh_map);

			        var temp_time = 0; //temperature time

			        /*function timecount(){
			        	temp_time = (temp_time + 1) % 660; //whole time == 660

			        	//heatmap(temp_time); //map

			        	//document.getElementById("beans").value = temp_time; //range control

			        	tooltip.html("The exact time is: " + (Math.floor(temp_time / 60) + 7) + " : " + Math.floor(temp_time % 60));

			        	//route refresh
			        	Refresh_route(choose_id, temp_time);
			        }*/
			        function timecount(){
			        	temp_time = (temp_time + 1) % 660; //whole time == 660

			        	//heatmap(temp_time); //map

			        	//document.getElementById("beans").value = temp_time; //range control

			        	//tooltip.html("The exact time is: " + (Math.floor(temp_time / 60) + 7) + " : " + Math.floor(temp_time % 60));

			        	//route refresh
			        	//Refresh_route(choose_id, temp_time);
			        	var sid_data = [];
						var time_data = [];
						var line_data = [];
						var line_data1 = [];
						var time_data_arr = [];
						var time_data_arr1 = [];

						//choose those whose id = required id
						//list = day1/2/3
						for (var i = 0; i < list.length; i++)
						{
							if (list[i].id == choose_id)
							{
								sid_data.push(list[i].sid);
								time_data.push(Math.floor(parseInt(list[i].time)/60) - 420);
							}	
						}

						for (var i = 0; i < sid_data.length; i++)
						{
							for (var j = 0; j < sid.length; j++)
							{
								if (sid_data[i] == sid[j].sid)
								{
									if (sid[j].x_axis <= 29)
									{
										line_data.push([sid[j].x_axis * path_length + path_length / 2, sid[j].y_axis * path_length - path_length / 2]);
										time_data_arr.push(time_data[i]);
									}
									else
									{
										line_data1.push([(sid[j].x_axis - 30) * path_length + path_length / 2, sid[j].y_axis * path_length - path_length / 2]);
										time_data_arr1.push(time_data[i]);
									}
									break;
								}
							}
						}

						var line_data_arr = [];
						var line_data_arr1 = [];

						var temp = [];

						for (var i = 0; i < line_data.length-1; i++)
						{
							temp = [];
							temp.push(line_data[i]);
							temp.push(line_data[i+1]);
							line_data_arr.push(temp);
						}
						for (var i = 0; i < line_data1.length-1; i++)
						{
							temp = [];
							temp.push(line_data1[i]);
							temp.push(line_data1[i+1]);
							line_data_arr1.push(temp);
						}

						lineGenerator = d3.line()
				                      //    获取每个节点的x坐标
				                      .x(function(d) {
				                            return d[0]
				                        })
				                       //   获取每个节点的y坐标
				                       .y(function(d) {
				                            return d[1];
				                       });

				        var route_color = "red";

				        var time_flag = 1;

				        while(time_flag)
				        {
				        	//console.log(temp_time);

				        	//route refresh
					        for (var i = 0; i < line_data_arr.length; i++)
					        {
					        	if (time_data_arr[i] == temp_time) {
					        		var opac = '1'; 
					        		time_flag = 0;
					        		//console.log("right");
					        	}
					        	else opac = '0.2';

					        	d3.select("#indiv_line" + i.toString())
							        .attr('stroke', route_color)
							        .attr('stroke-width', '4')
							        .attr('fill', 'none')
							        //    设置路径信息
							        .attr('d', lineGenerator(line_data_arr[i]))
							        .attr('opacity', opac)
							}

							for (var i = 0; i < line_data_arr1.length; i++)
					        {
					        	if (time_data_arr1[i] == temp_time) {
					        		var opac = '1'; 
					        		time_flag = 0;
					        		//console.log("right");
					        	}
					        	else opac = '0.2';

					        	d3.select("#indiv_line1" + i.toString())
							        .attr('stroke', route_color)
							        .attr('stroke-width', '4')
							        .attr('fill', 'none')
							        //    设置路径信息
							        .attr('d', lineGenerator(line_data_arr1[i]))
							        .attr('opacity', opac)
							}

							document.getElementById("personal_map_time").innerHTML = "The exact time is: " + (7 + Math.floor(temp_time / 60)) + " : " + temp_time % 60;

							if (time_flag == 1)
							{
								if (temp_time >= 660)
								{
									temp_time = 0;
								}
								else
								{
									temp_time++;
								}
							}
				        }
			        }

			    	var map_flag = 0;
					map_refresh(map_flag, refresh_map);

			        function map_refresh(route_flag, refresh_map){
						var but_map_refresh = document.getElementById("but_animation_1");
						but_map_refresh.onclick = function(){
							if (map_flag == 1)
							{
								clearInterval(refresh_map);
								//console.log("Stop");
								map_flag = 0;
							}
							else if (map_flag == 0)
							{
								refresh_map = setInterval(function(){timecount()},100);
								//console.log("Start");
								map_flag = 1;
							}
						}
					}

			    //Draw frame
				    var mousing = 0;

					var select_square = [];

					var start_value, end_value;

					//输出数组
					function mousedown(d) {
					  mousing = d.fill ? 0 : +1;
					  //mousemove.apply(this, arguments);
					  start_value = $(this).attr("id");
					  end_value = $(this).attr("id");
					  var min_i = Math.min(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
					  var max_i = Math.max(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
					  var min_j = Math.min(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
					  var max_j = Math.max(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
					  select_square = [];
					  for (var i = min_i; i <= max_i; i++)
					  {
					  	for (var j = min_j; j <= max_j; j++)
					  	{
					  		if (i < 10 && j < 10)
					    	{
					    		document.getElementById("Square0"+ i + "0" + j).__data__.fill = mousing;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		document.getElementById("Square0"+ i + j).__data__.fill = mousing;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		document.getElementById("Square"+ i + "0" + j).__data__.fill = mousing;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		document.getElementById("Square"+ i + j).__data__.fill = mousing;
					    	}
					  		select_square.push([i ,j]);
					  	}
					  }
					  border.call(redraw);
					}

					function mousemove(d) {
					  if (mousing) {
					    end_value = $(this).attr("id");
					    var min_i = Math.min(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
					    var max_i = Math.max(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
					    var min_j = Math.min(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
					    var max_j = Math.max(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
					    select_square = [];
					    for (var i = min_i; i <= max_i; i++)
					    {
					  	  for (var j = min_j; j <= max_j; j++)
					  	  {
					  		if (i < 10 && j < 10)
					    	{
					    		document.getElementById("Square0"+ i + "0" + j).__data__.fill = mousing;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		document.getElementById("Square0"+ i + j).__data__.fill = mousing;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		document.getElementById("Square"+ i + "0" + j).__data__.fill = mousing;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		document.getElementById("Square"+ i + j).__data__.fill = mousing;
					    	}
					  		select_square.push([i ,j]);
					  	  }
					    }
					    border.call(redraw);
					  }
					}

					function mouseup(d) {
					  //mousemove.apply(this, arguments);
					  end_value = $(this).attr("id");
					  var min_i = Math.min(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
					  var max_i = Math.max(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
					  var min_j = Math.min(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
					  var max_j = Math.max(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
					  select_square = [];
					  for (var i = min_i; i <= max_i; i++)
					  {
					  	for (var j = min_j; j <= max_j; j++)
					  	{
					  		if (i < 10 && j < 10)
					    	{
					    		document.getElementById("Square0"+ i + "0" + j).__data__.fill = mousing;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		document.getElementById("Square0"+ i + j).__data__.fill = mousing;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		document.getElementById("Square"+ i + "0" + j).__data__.fill = mousing;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		document.getElementById("Square"+ i + j).__data__.fill = mousing;
					    	}
					  		select_square.push([i ,j]);
					  	}
					  }
					  border.call(redraw);
					  console.log(select_square);
					  mousing = 0;
					}

					function redraw(border) {
					  border.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
					}

					var mousing1 = 0;

					var select_square1 = [];

					var start_value1, end_value1;

					function mousedown1(d) {
					  mousing1 = d.fill ? 0 : +1;
					  //mousemove.apply(this, arguments);
					  start_value1 = $(this).attr("id");
					  end_value1 = $(this).attr("id");
					  var min_i = Math.min(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
					  var max_i = Math.max(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
					  var min_j = Math.min(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
					  var max_j = Math.max(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
					  select_square1 = [];
					  for (var i = min_i; i <= max_i; i++)
					  {
					  	for (var j = min_j; j <= max_j; j++)
					  	{
					  		if (i < 10 && j < 10)
					    	{
					    		document.getElementById("Square10"+ i + "0" + j).__data__.fill = mousing1;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		document.getElementById("Square10"+ i + j).__data__.fill = mousing1;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		document.getElementById("Square1"+ i + "0" + j).__data__.fill = mousing1;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		document.getElementById("Square1"+ i + j).__data__.fill = mousing1;
					    	}
					  		select_square1.push([i ,j]);
					  	}
					  }
					  border1.call(redraw1);
					}

					function mousemove1(d) {
					  if (mousing1) {
					    end_value1 = $(this).attr("id");
					    var min_i = Math.min(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
					    var max_i = Math.max(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
					    var min_j = Math.min(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
					    var max_j = Math.max(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
					    select_square1 = [];
					    for (var i = min_i; i <= max_i; i++)
					    {
					  	  for (var j = min_j; j <= max_j; j++)
					  	  {
					  		if (i < 10 && j < 10)
					    	{
					    		document.getElementById("Square10"+ i + "0" + j).__data__.fill = mousing1;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		document.getElementById("Square10"+ i + j).__data__.fill = mousing1;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		document.getElementById("Square1"+ i + "0" + j).__data__.fill = mousing1;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		document.getElementById("Square1"+ i + j).__data__.fill = mousing1;
					    	}
					  		select_square1.push([i ,j]);
					  	  }
					    }
					    border1.call(redraw1);
					  }
					}

					function mouseup1(d) {
					  //mousemove.apply(this, arguments);
					  end_value1 = $(this).attr("id");
					  var min_i = Math.min(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
					  var max_i = Math.max(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
					  var min_j = Math.min(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
					  var max_j = Math.max(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
					  select_square1 = [];
					  for (var i = min_i; i <= max_i; i++)
					  {
					  	for (var j = min_j; j <= max_j; j++)
					  	{
					  		if (i < 10 && j < 10)
					    	{
					    		document.getElementById("Square10"+ i + "0" + j).__data__.fill = mousing1;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		document.getElementById("Square10"+ i + j).__data__.fill = mousing1;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		document.getElementById("Square1"+ i + "0" + j).__data__.fill = mousing1;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		document.getElementById("Square1"+ i + j).__data__.fill = mousing1;
					    	}
					  		select_square1.push([i ,j]);
					  	}
					  }
					  border1.call(redraw1);
					  console.log(select_square1);
					  mousing1 = 0;
					}

					function redraw1(border1) {
					  border1.attr("d", path(topojson.mesh(topology1, topology1.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
					}

					/*function redraw1(border1) {
					  border1.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill1 ^ b.fill1; })));
					}*/

				//topo function
					function hexTopology(radius, width, height) {
						var dx = radius * 1.5,// * Math.sin(Math.PI / 3),
							dy = radius * 1.5,
							m = line_length,
							n = 30,
							geometries = [],
							arcs = [];

						for (var j = -1; j <= m; ++j) {
							for (var i = -1; i <= n; ++i) {
								var y = j + 1.35, x = i;
								arcs.push([[x, y - 1], [1, 0]], [[x + 1, y - 1], [0, 1]], [[x + 1, y], [-1, 0]]);
							}
						}

						for (var j = 0, q = 3; j < m; ++j, q += 6) {
							for (var i = 0; i < n; ++i, q += 3) {
								geometries.push({
									type: "Polygon",
									arcs: [[q, q + 1, q + 2, ~(q + (n + 2) * 3), ~(q - 2), ~(q - (n + 2) * 3 + 2)]],
									fill: 0,
									fill1: 0,
									value: color_arr[i*line_length+j].value,
									x_axis: i,
									y_axis: j
								});
							}
						}

						return {
							transform: {translate: [0, 0], scale: [2, 2]},
							objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
							arcs: arcs
						};
					}

					function hexProjection(radius) {
					  var dx = radius * 1.5,
					      dy = radius * 1.5;
					  return {
					    stream: function(stream) {
					      return {
					        point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
					        lineStart: function() { stream.lineStart(); },
					        lineEnd: function() { stream.lineEnd(); },
					        polygonStart: function() { stream.polygonStart(); },
					        polygonEnd: function() { stream.polygonEnd(); }
					      };
					    }
					  };
					}

					function hexTopology1(radius, width, height) {
						var dx = radius * 1.5,// * Math.sin(Math.PI / 3),
							dy = radius * 1.5,
							m = line_length,
							n = 30,
							geometries = [],
							arcs = [];

						for (var j = -1; j <= m; ++j) {
							for (var i = -1; i <= n; ++i) {
								var y = j + 1.35, x = i;
								arcs.push([[x, y - 1], [1, 0]], [[x + 1, y - 1], [0, 1]], [[x + 1, y], [-1, 0]]);
							}
						}

						for (var j = 0, q = 3; j < m; ++j, q += 6) {
							for (var i = 0; i < n; ++i, q += 3) {
								geometries.push({
									type: "Polygon",
									arcs: [[q, q + 1, q + 2, ~(q + (n + 2) * 3), ~(q - 2), ~(q - (n + 2) * 3 + 2)]],
									fill: 0,
									fill1: 0,
									value: color_arr[(i+30)*line_length+j].value,
									x_axis: i,
									y_axis: j
								});
							}
						}

						return {
							transform: {translate: [0, 0], scale: [2, 2]},
							objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
							arcs: arcs
						};
					}

					function hexProjection1(radius) {
					  var dx = radius * 1.5,
					      dy = radius * 1.5;
					  return {
					    stream: function(stream) {
					      return {
					        point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
					        lineStart: function() { stream.lineStart(); },
					        lineEnd: function() { stream.lineEnd(); },
					        polygonStart: function() { stream.polygonStart(); },
					        polygonEnd: function() { stream.polygonEnd(); }
					      };
					    }
					  };
					}

				//map function
					function change(){
						var bean = document.getElementById("beans_1");
						bean.onmousemove = function(){
							var value = bean.value;
							heatmap(value);
						}
					}

					function heatmap(value){
						var fill_arr = [];

						for (var i = 0; i < 60; i++)
						{
							for (var j = 0; j <= 16; j++)
							{
								fill_arr.push(0);
							}
						}

						//read fill feature
						for (var i = 0; i < 30; i++)
						{
							for (var j = 1; j <= 16; j++)
							{
								if (i < 10 && j < 10)
							    {
							    	if(document.getElementById("Square0"+ i + "0" + j).__data__.fill == 1)
							    		fill_arr[i * line_length + j] = 1;
							    }
						    	else if (i < 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square0" + i + j).__data__.fill == 1)
							    		fill_arr[i * line_length + j] = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if(document.getElementById("Square" + i + "0" + j).__data__.fill == 1)
							    		fill_arr[i * line_length + j] = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square" + i + j).__data__.fill == 1)
							    		fill_arr[i * line_length + j] = 1;
						    	}
							}
						}

						for (var i = 0; i < 30; i++)
						{
							for (var j = 1; j <= 16; j++)
							{
								if (i < 10 && j < 10)
							    {
							    	if(document.getElementById("Square10"+ i + "0" + j).__data__.fill == 1)
							    		fill_arr[(i+30) * line_length + j] = 1;
							    }
						    	else if (i < 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square10" + i + j).__data__.fill == 1)
							    		fill_arr[(i+30) * line_length + j] = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if(document.getElementById("Square1" + i + "0" + j).__data__.fill == 1)
							    		fill_arr[(i+30) * line_length + j] = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square1" + i + j).__data__.fill == 1)
							    		fill_arr[(i+30) * line_length + j] = 1;
						    	}
							}
						}

						var num = 0;

					  	var time = 0;

					  	for (var key in count[value])
					  	{
					  		if (key != "time")
					  		{
					  			color_arr[parseInt(sid[num].x_axis) * line_length + parseInt(sid[num].y_axis)].value = count[value][key];
					  		}
					  		num++;
					  	}

					  	var topology = hexTopology(radius, width, height);

					  	var projection = hexProjection(radius);

						var path = d3.geoPath()
					    			.projection(projection);

						d3.select(".hexagon")//#heatmap")
							  .selectAll("path")
							  .data(topology.objects.hexagons.geometries)
							  .attr("id", function(d){
							    if (d.x_axis < 10 && d.y_axis < 10)
							    {
							    	return "Square0" + d.x_axis + "0" + d.y_axis;
							    }
						    	else if (d.x_axis < 10 && d.y_axis >= 10)
						    	{
						    		return "Square0" + d.x_axis + d.y_axis;
						    	}
						    	else if (d.x_axis >= 10 && d.y_axis < 10)
						    	{
						    		return "Square" + d.x_axis + "0" + d.y_axis;
						    	}
						    	else if (d.x_axis >= 10 && d.y_axis >= 10)
						    	{
						    		return "Square" + d.x_axis + d.y_axis;
						    	}
							  })
							  .attr("d", function(d) { return path(topojson.feature(topology, d)); })
							  .style("fill", function(d) { return myColor(d.value)} )
							    //.attr("class", function(d) { return d.fill ? "fill" : null; })
							  .style("stroke", "grey")
							  .on("mousedown", mousedown)
							  .on("mousemove", mousemove)
							  .on("mouseup", mouseup);

						var mousing = 0;

						var select_square = [];

						var start_value, end_value;

						//输出数组
						function mousedown(d) {
						  mousing = d.fill ? 0 : +1;
						  //mousemove.apply(this, arguments);
						  start_value = $(this).attr("id");
						  end_value = $(this).attr("id");
						  var min_i = Math.min(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
						  var max_i = Math.max(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
						  var min_j = Math.min(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
						  var max_j = Math.max(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
						  select_square = [];
						  for (var i = min_i; i <= max_i; i++)
						  {
						  	for (var j = min_j; j <= max_j; j++)
						  	{
						  		if (i < 10 && j < 10)
						    	{
						    		document.getElementById("Square0"+ i + "0" + j).__data__.fill = mousing;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		document.getElementById("Square0"+ i + j).__data__.fill = mousing;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		document.getElementById("Square"+ i + "0" + j).__data__.fill = mousing;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		document.getElementById("Square"+ i + j).__data__.fill = mousing;
						    	}
						  		select_square.push([i ,j]);
						  	}
						  }
						  border.call(redraw);
						}

						function mousemove(d) {
						  if (mousing) {
						    end_value = $(this).attr("id");
						    var min_i = Math.min(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
						    var max_i = Math.max(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
						    var min_j = Math.min(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
						    var max_j = Math.max(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
						    select_square = [];
						    for (var i = min_i; i <= max_i; i++)
						    {
						  	  for (var j = min_j; j <= max_j; j++)
						  	  {
						  		if (i < 10 && j < 10)
						    	{
						    		document.getElementById("Square0"+ i + "0" + j).__data__.fill = mousing;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		document.getElementById("Square0"+ i + j).__data__.fill = mousing;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		document.getElementById("Square"+ i + "0" + j).__data__.fill = mousing;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		document.getElementById("Square"+ i + j).__data__.fill = mousing;
						    	}
						  		select_square.push([i ,j]);
						  	  }
						    }
						    border.call(redraw);
						  }
						}

						function mouseup(d) {
						  //mousemove.apply(this, arguments);
						  end_value = $(this).attr("id");
						  var min_i = Math.min(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
						  var max_i = Math.max(parseInt(start_value.substring(6,8)), parseInt(end_value.substring(6,8)));
						  var min_j = Math.min(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
						  var max_j = Math.max(parseInt(start_value.substring(8,10)), parseInt(end_value.substring(8,10)));
						  select_square = [];
						  for (var i = min_i; i <= max_i; i++)
						  {
						  	for (var j = min_j; j <= max_j; j++)
						  	{
						  		if (i < 10 && j < 10)
						    	{
						    		document.getElementById("Square0"+ i + "0" + j).__data__.fill = mousing;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		document.getElementById("Square0"+ i + j).__data__.fill = mousing;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		document.getElementById("Square"+ i + "0" + j).__data__.fill = mousing;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		document.getElementById("Square"+ i + j).__data__.fill = mousing;
						    	}
						  		select_square.push([i ,j]);
						  	}
						  }
						  border.call(redraw);
						  console.log(select_square);
						  mousing = 0;
						}

						function redraw(border) {
						  border.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
						}

						//write fill feature
						for (var i = 0; i < 30; i++)
						{
							for (var j = 1; j <= 16; j++)
							{
								if (i < 10 && j < 10)
							    {
							    	if (fill_arr[i * line_length + j] == 1)
										document.getElementById("Square0"+ i + "0" + j).__data__.fill = 1;
							    }
						    	else if (i < 10 && j >= 10)
						    	{
						    		if (fill_arr[i * line_length + j] == 1)
										document.getElementById("Square0" + i + j).__data__.fill = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if (fill_arr[i * line_length + j] == 1)
										document.getElementById("Square" + i + "0" + j).__data__.fill = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if (fill_arr[i * line_length + j] == 1)
										document.getElementById("Square" + i + j).__data__.fill = 1;
						    	}
							}
						}

						border.call(redraw);

						/*d3.select(".mesh")
							.selectAll("path")
					    .datum(topojson.mesh(topology, topology.objects.hexagons))
					    .attr("d", path);*/

						var topology1 = hexTopology1(radius, width, height);

						var projection1 = hexProjection(radius);

						var path1 = d3.geoPath()
					    			.projection(projection1);

						d3.select(".hexagon1")//#heatmap")
							  .selectAll("path")
							  .data(topology1.objects.hexagons.geometries)
							  .attr("id", function(d){
							    if (d.x_axis < 10 && d.y_axis < 10)
							    {
							    	return "Square10" + d.x_axis + "0" + d.y_axis;
							    }
						    	else if (d.x_axis < 10 && d.y_axis >= 10)
						    	{
						    		return "Square10" + d.x_axis + d.y_axis;
						    	}
						    	else if (d.x_axis >= 10 && d.y_axis < 10)
						    	{
						    		return "Square1" + d.x_axis + "0" + d.y_axis;
						    	}
						    	else if (d.x_axis >= 10 && d.y_axis >= 10)
						    	{
						    		return "Square1" + d.x_axis + d.y_axis;
						    	}
							  })
							  .attr("d", function(d) { return path(topojson.feature(topology1, d)); })
							  .style("fill", function(d) { return myColor(d.value)} )
							    //.attr("class", function(d) { return d.fill ? "fill" : null; })
							  .style("stroke", "grey")
							  .on("mousedown", mousedown1)
							  .on("mousemove", mousemove1)
							  .on("mouseup", mouseup1);

						var mousing1 = 0;

						var select_square1 = [];

						var start_value1, end_value1;

						function mousedown1(d) {
						  mousing1 = d.fill ? 0 : +1;
						  //mousemove.apply(this, arguments);
						  start_value1 = $(this).attr("id");
						  end_value1 = $(this).attr("id");
						  var min_i = Math.min(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
						  var max_i = Math.max(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
						  var min_j = Math.min(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
						  var max_j = Math.max(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
						  select_square1 = [];
						  for (var i = min_i; i <= max_i; i++)
						  {
						  	for (var j = min_j; j <= max_j; j++)
						  	{
						  		if (i < 10 && j < 10)
						    	{
						    		document.getElementById("Square10"+ i + "0" + j).__data__.fill = mousing1;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		document.getElementById("Square10"+ i + j).__data__.fill = mousing1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		document.getElementById("Square1"+ i + "0" + j).__data__.fill = mousing1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		document.getElementById("Square1"+ i + j).__data__.fill = mousing1;
						    	}
						  		select_square1.push([i ,j]);
						  	}
						  }
						  border1.call(redraw1);
						}

						function mousemove1(d) {
						  if (mousing1) {
						    end_value1 = $(this).attr("id");
						    var min_i = Math.min(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
						    var max_i = Math.max(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
						    var min_j = Math.min(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
						    var max_j = Math.max(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
						    select_square1 = [];
						    for (var i = min_i; i <= max_i; i++)
						    {
						  	  for (var j = min_j; j <= max_j; j++)
						  	  {
						  		if (i < 10 && j < 10)
						    	{
						    		document.getElementById("Square10"+ i + "0" + j).__data__.fill = mousing1;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		document.getElementById("Square10"+ i + j).__data__.fill = mousing1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		document.getElementById("Square1"+ i + "0" + j).__data__.fill = mousing1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		document.getElementById("Square1"+ i + j).__data__.fill = mousing1;
						    	}
						  		select_square1.push([i ,j]);
						  	  }
						    }
						    border1.call(redraw1);
						  }
						}

						function mouseup1(d) {
						  //mousemove.apply(this, arguments);
						  end_value1 = $(this).attr("id");
						  var min_i = Math.min(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
						  var max_i = Math.max(parseInt(start_value1.substring(7,9)), parseInt(end_value1.substring(7,9)));
						  var min_j = Math.min(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
						  var max_j = Math.max(parseInt(start_value1.substring(9,11)), parseInt(end_value1.substring(9,11)));
						  select_square1 = [];
						  for (var i = min_i; i <= max_i; i++)
						  {
						  	for (var j = min_j; j <= max_j; j++)
						  	{
						  		if (i < 10 && j < 10)
						    	{
						    		document.getElementById("Square10"+ i + "0" + j).__data__.fill = mousing1;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		document.getElementById("Square10"+ i + j).__data__.fill = mousing1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		document.getElementById("Square1"+ i + "0" + j).__data__.fill = mousing1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		document.getElementById("Square1"+ i + j).__data__.fill = mousing1;
						    	}
						  		select_square1.push([i ,j]);
						  	}
						  }
						  border1.call(redraw1);
						  console.log(select_square1);
						  mousing1 = 0;
						}

						function redraw1(border1) {
						  border1.attr("d", path(topojson.mesh(topology1, topology1.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
						}

						//write fill feature
						for (var i = 0; i < 30; i++)
						{
							for (var j = 1; j <= 16; j++)
							{
								if (i < 10 && j < 10)
							    {
							    	if (fill_arr[(i+30) * line_length + j] == 1)
										document.getElementById("Square10"+ i + "0" + j).__data__.fill = 1;
							    }
						    	else if (i < 10 && j >= 10)
						    	{
						    		if (fill_arr[(i+30) * line_length + j] == 1)
										document.getElementById("Square10" + i + j).__data__.fill = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if (fill_arr[(i+30) * line_length + j] == 1)
										document.getElementById("Square1" + i + "0" + j).__data__.fill = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if (fill_arr[(i+30) * line_length + j] == 1)
										document.getElementById("Square1" + i + j).__data__.fill = 1;
						    	}
							}
						}

						border1.call(redraw1);

						tooltip.html("The exact time is: " + (Math.floor(value / 60) + 7) + " : " + Math.floor(value % 60));
					}

					function heatmap_noframe(value){
						var num = 0;

					  	var time = 0;

					  	for (var key in count[value])
					  	{
					  		if (key != "time")
					  		{
					  			color_arr[parseInt(sid[num].x_axis) * line_length + parseInt(sid[num].y_axis)].value = count[value][key];
					  		}
					  		num++;
					  	}

					  	var topology = hexTopology(radius, width, height);

						d3.select(".hexagon")//#heatmap")
							  .selectAll("path")
							  .data(topology.objects.hexagons.geometries)
							  .attr("d", function(d) { return path(topojson.feature(topology, d)); })
							  .style("fill", function(d) { return myColor(d.value)} )
							    //.attr("class", function(d) { return d.fill ? "fill" : null; })
							  .style("stroke", "grey")
							  .on("mousedown", select_room)
							  .on("mousemove", null_function)
							  .on("mouseup", null_function);

						var topology1 = hexTopology1(radius, width, height);

						d3.select(".hexagon1")//#heatmap")
							  .selectAll("path")
							  .data(topology1.objects.hexagons.geometries)
							  .attr("d", function(d) { return path(topojson.feature(topology1, d)); })
							  .style("fill", function(d) { return myColor(d.value)} )
							    //.attr("class", function(d) { return d.fill ? "fill" : null; })
							  .style("stroke", "grey")
							  .on("mousedown", select_room)
							  .on("mousemove", null_function)
							  .on("mouseup", null_function);

						tooltip.html("The exact time is: " + (Math.floor(value / 60) + 7) + " : " + Math.floor(value % 60));
					}
			
				//Choice
					var choice_flag = "frame";
					choice();

					function choice(){
						var but_choice = document.getElementById("but_choice_1");
						but_choice.onclick = function(){
							if (choice_flag == "frame")
							{
								heatmap_noframe(0);
								choice_flag = "noframe";
							}
							else if (choice_flag == "noframe")
							{
								heatmap(0);
								choice_flag = "frame";
							}
							
						}
					}

					function select_room(){
						if ($(this).attr("id").length == 10)
						{
							var room_id = $(this).attr("id");
							var room_column = parseInt(room_id.substring(6,8));
							var room_row = parseInt(room_id.substring(8,10));
							if (room_column >= 1 && room_column <= 5 && room_row >= 3 && room_row <= 4)
							{
								console.log("hallA");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 5 && room_row <= 6)
							{
								console.log("hallB");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 7 && room_row <= 8)
							{
								console.log("hallC");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 8 && room_row <= 10)
							{
								console.log("hallD");
							}
							else if (room_column >= 7 && room_column <= 8 && room_row >= 4 && room_row <= 10)
							{
								console.log("poster");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 5 && room_row <= 6)
							{
								console.log("toilet1");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 7 && room_row <= 10)
							{
								console.log("room1");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 11 && room_row <= 12)
							{
								console.log("room2");
							}
							else if (room_column >= 15 && room_column <= 18 && room_row >= 3 && room_row <= 12)
							{
								console.log("exhibition");
							}
							else if (room_column >= 19 && room_column <= 28 && room_row >= 3 && room_row <= 12)
							{
								console.log("mainHall");
							}
							else if (room_column >= 2 && room_column <= 5 && room_row >= 13 && room_row <= 14)
							{
								console.log("register");
							}
							else if (room_column >= 19 && room_column <= 20 && room_row >= 15 && room_row <= 16)
							{
								console.log("service");
							}
							else if (room_column >= 21 && room_column <= 24 && room_row >= 15 && room_row <= 16)
							{
								console.log("room3");
							}
							else if (room_column >= 25 && room_column <= 26 && room_row >= 15 && room_row <= 16)
							{
								console.log("room4");
							}
							else if (room_column >= 27 && room_column <= 28 && room_row >= 15 && room_row <= 16)
							{
								console.log("toilet2");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 2)
							{
								console.log("elevator_up_floor1");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 15)
							{
								console.log("elevator_down_floor1");
							}
						}
						else if ($(this).attr("id").length == 11)
						{
							var room_id = $(this).attr("id");
							var room_column = parseInt(room_id.substring(7,9));
							var room_row = parseInt(room_id.substring(9,11));
							if (room_column >= 1 && room_column <= 5 && room_row >= 3 && room_row <= 10)
							{
								console.log("diningHall");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 11 && room_row <= 12)
							{
								console.log("room5");
							}
							else if (room_column >= 0 && room_column <= 5 && room_row >= 14 && room_row <= 16)
							{
								console.log("recreationArea");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 5 && room_row <= 6)
							{
								console.log("toilet3");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 7 && room_row <= 8)
							{
								console.log("room6");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 2)
							{
								console.log("elevator_up_floor2");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 15)
							{
								console.log("elevator_down_floor2");
							}
						}
						
					}

					function null_function(){

					}
			})
		})
	})
}