function draw_map(read_file){
	var color_arr = [];

	for (var i = 0; i < 60; i++)
	{
		for (var j = 0; j <= 16; j++)
		{
			color_arr.push({"x_axis": i, "y_axis": j, "value": 0})
		}
	}

	var but_day_choice;

	d3.csv("data/sid.csv", function(sid) {
		d3.json("data/sid_peoplecount" + read_file + ".json", function(count){
			d3.csv("data/day" + read_file + ".csv", function(list){
				//initial
				  	var num = 0;

				  	var time = parseInt(document.getElementById("beans").value);

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
					    radius = 7;

					//color
					//var myColor = d3.scaleLinear().domain([1,2]).range(d3.schemeReds[7]);

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

					var svg = d3.select("#map").append("svg")
					    .attr("id","heatmap")
					    .attr("width", width)
					    .attr("height", height)
					    .attr("transform", "translate(55,0)")

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
					    .style("stroke", "grey")
					    //.attr("class", function(d) { return d.fill ? "fill" : null; })
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
					var svg1 = d3.select("#map1").append("svg")
					    .attr("id","heatmap1")
					    .attr("width", width)
					    .attr("height", height)
					    .attr("transform", "translate(55,0)")

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
					/*var tooltip = d3.select("#text-div")
									.append("div")
									.attr("transform", "translate(55,0)")
								    .attr("id","tool")
								    .style("opacity", 1)
								    .attr("class", "tooltip")
								    .style("background-color", "white")
								    .style("border", "solid")
								    .style("border-width", "2px")
								    .style("border-radius", "5px")
								    .style("padding", "5px")

					tooltip.html("The exact time is: " + "7 : 0");*/

				//route
					//Draw line
					/*var line_data = [];
					var sid_data = [];
					var time_data = [];

					var id = "11396";

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
								line_data.push([sid[j].x_axis * radius * 1.5 + radius * 1.5 / 2, sid[j].y_axis * radius * 1.5 - radius * 1.5 / 2]);
								break;
							}
						}
					}

					var line_data_arr = [];

					var temp = [];

					for (var i = 0; i < line_data.length-1; i++)
					{
						temp = [];
						temp.push(line_data[i]);
						temp.push(line_data[i+1]);
						line_data_arr.push(temp);
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

			        for (var i = 0; i < line_data_arr.length; i++)
			        {
			        	if (i % line_data_arr.length == 0) var opac = '1';
			        	else opac = '0.1';

			        	svg.append('path')
			        		.attr("id", "indiv_line" + i.toString())
					        .attr('stroke', 'red')
					        .attr('stroke-width', '4')
					        .attr('fill', 'none')
					        //    设置路径信息
					        .attr('d', lineGenerator(line_data_arr[i]))
					        .attr('opacity', opac)
					}*/

			    //refresh map
			    	var choice_flag = "frame";

			    	change();

			    	var refresh_map = setInterval(function(){timecount()},100);
			    	clearInterval(refresh_map);

			        var temp_time = 0; //temperature time

			        function timecount(){
			        	temp_time = (temp_time + 1) % 660; //whole time == 660

			        	if (choice_flag == "frame")
			        	{
			        		heatmap(temp_time); //map
			        	}
			        	else if (choice_flag == "noframe")
			        	{
			        		heatmap_noframe(temp_time);
			        	}
			        	

			        	document.getElementById("beans").value = temp_time; //range control

			        	if (temp_time % 15 == 0){
			        		but_day_choice = document.getElementById("but_day").value.substring(3,4);
							change_pie(parseInt(but_day_choice), Math.floor(temp_time / 15) * 15, select_room_sid);
						}

						document.getElementById("circular_arr").innerHTML = "";
					    for (var i = 0; i < select_room_sid.length; i++)
					    {
					    	document.getElementById("circular_arr").innerHTML += select_room_sid[i] + " ";
					    }
			        }

			    	var map_flag = 0;
					map_refresh(map_flag, refresh_map);

			        function map_refresh(route_flag, refresh_map){
						var but_map_refresh = document.getElementById("but_animation");
						but_map_refresh.onclick = function(){
							if (map_flag == 1)
							{
								clearInterval(refresh_map);
								map_flag = 0;
							}
							else if (map_flag == 0)
							{
								refresh_map = setInterval(function(){timecount()},100);
								map_flag = 1;
							}
						}
					}

				//draw room
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
					/*//first floor
					//hallA
					svg.append('text')
						    .text('hallA')
						    .attr("x",2.25*path_length)
						    .attr('y',3.5*path_length)

					//hallB
					svg.append('text')
						    .text('hallB')
						    .attr("x",2.25*path_length)
						    .attr('y',5.5*path_length)

					//hallC
					svg.append('text')
						    .text('hallC')
						    .attr("x",2.25*path_length)
						    .attr('y',7.5*path_length)

					//hallD
					svg.append('text')
						    .text('hallD')
						    .attr("x",2.25*path_length)
						    .attr('y',9.5*path_length)

					//register
					svg.append('text')
						    .text('register')
						    .attr("x",2.1*path_length)
						    .attr('y',13.3*path_length)

					//poster
					svg.append('text')
						    .text('poster')
						    .attr("x",-8.25*path_length)
						    .attr('y',8.25*path_length)
						    .attr("transform", "rotate(-90,0,0)")

					//toilet1
					svg.append('text')
						    .text('toilet1')
						    .attr("x",10.1*path_length)
						    .attr('y',5.25*path_length)
						    .attr("font-size",9)

					//room1
					svg.append('text')
						    .text('room1')
						    .attr("x",10.1*path_length)
						    .attr('y',8.25*path_length)
						    .attr("font-size",9)

					//room2
					svg.append('text')
						    .text('room2')
						    .attr("x",10.1*path_length)
						    .attr('y',11.25*path_length)
						    .attr("font-size",9)

					//elevator_up_floor1
					svg.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',1.65*path_length)
						    .attr("font-size",7)

					//elevator_down_floor1
					svg.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',14.65*path_length)
						    .attr("font-size",7)

					//exhibition
					svg.append('text')
						    .text('exhibition')
						    .attr("x",15.5*path_length)
						    .attr('y',7.25*path_length)
						    .attr("font-size",10)

					//mainHall
					svg.append('text')
						    .text('mainHall')
						    .attr("x",21.75*path_length)
						    .attr('y',7.3*path_length)

					//service
					svg.append('text')
						    .text('service')
						    .attr("x",19.1*path_length)
						    .attr('y',15.125*path_length)
						    .attr("font-size",8)

					//room3
					svg.append('text')
					    .text('room3')
					    .attr("x",21.3*path_length)
					    .attr('y',15.3*path_length)

					//room4
					svg.append('text')
						    .text('room4')
						    .attr("x",25.2*path_length)
						    .attr('y',15.125*path_length)
						    .attr("font-size",8)

					//toilet2
					svg.append('text')
						    .text('toilet2')
						    .attr("x",27.2*path_length)
						    .attr('y',15.125*path_length)
						    .attr("font-size",8)


					//second floor
					//diningHall
					svg1.append('text')
						    .text('diningHall')
						    .attr("x",1.05*path_length)
						    .attr('y',6.5*path_length)
						    .attr("font-size",15)

					//room5
					svg1.append('text')
						    .text('room5')
						    .attr("x",1.75*path_length)
						    .attr('y',11.25*path_length)

					//recreationArea
					svg1.append('text')
						    .text('recreationArea')
						    .attr("x",0.2*path_length)
						    .attr('y',14.75*path_length)
						    .attr("font-size",12)

					//toilet3
					svg1.append('text')
						    .text('toilet3')
						    .attr("x",10.1*path_length)
						    .attr('y',5.25*path_length)
						    .attr("font-size",9)

					//room6
					svg1.append('text')
						    .text('room6')
						    .attr("x",10.1*path_length)
						    .attr('y',7.25*path_length)
						    .attr("font-size",9)

					//elevator_up_floor2
					svg1.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',1.65*path_length)
						    .attr("font-size",7)

					//elevator_down_floor2
					svg1.append('text')
						    .text('elevator')
						    .attr("x",10.1*path_length)
						    .attr('y',14.65*path_length)
						    .attr("font-size",7)*/

			    //Draw frame
			    	var select_sid = [];

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
					  select_sid = [];
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
					  select_sid = [];
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

					  for (var i = 0; i < 30; i++)
					  {
					  	for (var j = 1; j <= 16; j++)
					  	{
					  		var push_flag = 0;
					  		if (i < 10 && j < 10)
					    	{
					    		if(document.getElementById("Square0"+ i + "0" + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square0"+ i + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		if (document.getElementById("Square"+ i + "0" + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square"+ i + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}

					    	if (push_flag == 1)
					    	{
					    		if (j - 1 < 10)
					                a_string = '10' + (j-1).toString();
					            else
					                a_string = '1' + (j-1).toString();
					            if (i < 10)
					                b_string = '0' + i.toString();
					            else
					                b_string = i.toString();
					            select_sid.push(a_string + b_string);
					    	}
					  	}
					  }
					  for (var i = 0; i < 30; i++)
					  {
					  	for (var j = 1; j <= 16; j++)
					  	{
					  		var push_flag1 = 0;
					  		if (i < 10 && j < 10)
					    	{
					    		if(document.getElementById("Square10"+ i + "0" + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square10"+ i + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		if (document.getElementById("Square1"+ i + "0" + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square1"+ i + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}

					    	if (push_flag1 == 1)
					    	{
					    		if (j - 1 < 10)
					                a_string = '20' + (j-1).toString();
					            else
					                a_string = '2' + (j-1).toString();
					            if (i < 10)
					                b_string = '0' + i.toString();
					            else
					                b_string = i.toString();
					            select_sid.push(a_string + b_string);
					    	}
					  	}
					  }
					  console.log(select_sid);
					  d3.select("#container_line").selectAll('svg').remove();
					  width3 = document.getElementById('container_line').offsetWidth;
				      height3 = width3 / 2.7;
					  margin3 = { top: 10, right: 30, bottom: 30, left: 50 },
				        width3 = width3 - margin3.left - margin3.right,
				        height3 = height3 - margin3.top - margin3.bottom;

				      svg3 = d3.select("#container_line").append("svg")
				            .attr("width", width3 + margin3.left + margin3.right)
				            .attr("height", height3 + margin3.top + margin3.bottom)
				            .append("g")
				            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
				      but_day_choice = document.getElementById("but_day").value.substring(3,4);
					  draw_line(but_day_choice, select_sid);
					  document.getElementById("line_sid_number").innerHTML = "The size is: " + select_sid.length;
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
					  select_sid = [];
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

					  for (var i = 0; i < 30; i++)
					  {
					  	for (var j = 1; j <= 16; j++)
					  	{
					  		var push_flag = 0;
					  		if (i < 10 && j < 10)
					    	{
					    		if(document.getElementById("Square0"+ i + "0" + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square0"+ i + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		if (document.getElementById("Square"+ i + "0" + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square"+ i + j).__data__.fill == 1)
					    			push_flag = 1;
					    	}

					    	if (push_flag == 1)
					    	{
					    		if (j - 1 < 10)
					                a_string = '10' + (j-1).toString();
					            else
					                a_string = '1' + (j-1).toString();
					            if (i < 10)
					                b_string = '0' + i.toString();
					            else
					                b_string = i.toString();
					            select_sid.push(a_string + b_string);
					    	}
					  	}
					  }
					  for (var i = 0; i < 30; i++)
					  {
					  	for (var j = 1; j <= 16; j++)
					  	{
					  		var push_flag1 = 0;
					  		if (i < 10 && j < 10)
					    	{
					    		if(document.getElementById("Square10"+ i + "0" + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}
					    	else if (i < 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square10"+ i + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}
					    	else if (i >= 10 && j < 10)
					    	{
					    		if (document.getElementById("Square1"+ i + "0" + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}
					    	else if (i >= 10 && j >= 10)
					    	{
					    		if(document.getElementById("Square1"+ i + j).__data__.fill == 1)
					    			push_flag1 = 1;
					    	}

					    	if (push_flag1 == 1)
					    	{
					    		if (j - 1 < 10)
					                a_string = '20' + (j-1).toString();
					            else
					                a_string = '2' + (j-1).toString();
					            if (i < 10)
					                b_string = '0' + i.toString();
					            else
					                b_string = i.toString();
					            select_sid.push(a_string + b_string);
					    	}
					  	}
					  }
					  console.log(select_sid);
					  d3.select("#container_line").selectAll('svg').remove();
					  width3 = document.getElementById('container_line').offsetWidth;
				      height3 = width3 / 2.7;
					  margin3 = { top: 10, right: 30, bottom: 30, left: 50 },
				        width3 = width3 - margin3.left - margin3.right,
				        height3 = height3 - margin3.top - margin3.bottom;

				      svg3 = d3.select("#container_line").append("svg")
				            .attr("width", width3 + margin3.left + margin3.right)
				            .attr("height", height3 + margin3.top + margin3.bottom)
				            .append("g")
				            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
				      but_day_choice = document.getElementById("but_day").value.substring(3,4);
					  draw_line(but_day_choice, select_sid);
					  document.getElementById("line_sid_number").innerHTML = "The size is: " + select_sid.length;
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
					var select_room_sid = [];
					select_room_sid.push("mainHall");

					function change(){

						var bean = document.getElementById("beans");
						bean.onmousemove = function(){
							var value = bean.value;
							but_day_choice = document.getElementById("but_day").value.substring(3,4);
							change_pie(parseInt(but_day_choice), Math.floor(value / 15) * 15, select_room_sid);	

							document.getElementById("circular_arr").innerHTML = "";
						    for (var i = 0; i < select_room_sid.length; i++)
						    {
						    	document.getElementById("circular_arr").innerHTML += select_room_sid[i] + " ";
						    }

						    if (choice_flag == "frame")
						    {
						    	heatmap(value);
						    }
						    else if (choice_flag == "noframe")
						    {
						    	heatmap_noframe(value);
						    }
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

						  select_sid = [];
						  for (var i = 0; i < 30; i++)
						  {
						  	for (var j = 1; j <= 16; j++)
						  	{
						  		var push_flag = 0;
						  		if (i < 10 && j < 10)
						    	{
						    		if(document.getElementById("Square0"+ i + "0" + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square0"+ i + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if (document.getElementById("Square"+ i + "0" + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square"+ i + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}

						    	if (push_flag == 1)
						    	{
						    		if (j - 1 < 10)
						                a_string = '10' + (j-1).toString();
						            else
						                a_string = '1' + (j-1).toString();
						            if (i < 10)
						                b_string = '0' + i.toString();
						            else
						                b_string = i.toString();
						            select_sid.push(a_string + b_string);
						    	}
						  	}
						  }
						  for (var i = 0; i < 30; i++)
						  {
						  	for (var j = 1; j <= 16; j++)
						  	{
						  		var push_flag1 = 0;
						  		if (i < 10 && j < 10)
						    	{
						    		if(document.getElementById("Square10"+ i + "0" + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square10"+ i + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if (document.getElementById("Square1"+ i + "0" + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square1"+ i + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}

						    	if (push_flag1 == 1)
						    	{
						    		if (j - 1 < 10)
						                a_string = '20' + (j-1).toString();
						            else
						                a_string = '2' + (j-1).toString();
						            if (i < 10)
						                b_string = '0' + i.toString();
						            else
						                b_string = i.toString();
						            select_sid.push(a_string + b_string);
						    	}
						  	}
						  }
						  console.log(select_sid);
						  d3.select("#container_line").selectAll('svg').remove();
						  width3 = document.getElementById('container_line').offsetWidth;
					      height3 = width3 / 2.7;
						  margin3 = { top: 10, right: 30, bottom: 30, left: 50 },
					        width3 = width3 - margin3.left - margin3.right,
					        height3 = height3 - margin3.top - margin3.bottom;

					      svg3 = d3.select("#container_line").append("svg")
					            .attr("width", width3 + margin3.left + margin3.right)
					            .attr("height", height3 + margin3.top + margin3.bottom)
					            .append("g")
					            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
					      but_day_choice = document.getElementById("but_day").value.substring(3,4);
						  draw_line(but_day_choice, select_sid);
						  document.getElementById("line_sid_number").innerHTML = "The size is: " + select_sid.length;
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

						  select_sid = [];
						  for (var i = 0; i < 30; i++)
						  {
						  	for (var j = 1; j <= 16; j++)
						  	{
						  		var push_flag = 0;
						  		if (i < 10 && j < 10)
						    	{
						    		if(document.getElementById("Square0"+ i + "0" + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square0"+ i + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if (document.getElementById("Square"+ i + "0" + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square"+ i + j).__data__.fill == 1)
						    			push_flag = 1;
						    	}

						    	if (push_flag == 1)
						    	{
						    		if (j - 1 < 10)
						                a_string = '10' + (j-1).toString();
						            else
						                a_string = '1' + (j-1).toString();
						            if (i < 10)
						                b_string = '0' + i.toString();
						            else
						                b_string = i.toString();
						            select_sid.push(a_string + b_string);
						    	}
						  	}
						  }
						  for (var i = 0; i < 30; i++)
						  {
						  	for (var j = 1; j <= 16; j++)
						  	{
						  		var push_flag1 = 0;
						  		if (i < 10 && j < 10)
						    	{
						    		if(document.getElementById("Square10"+ i + "0" + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}
						    	else if (i < 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square10"+ i + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}
						    	else if (i >= 10 && j < 10)
						    	{
						    		if (document.getElementById("Square1"+ i + "0" + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}
						    	else if (i >= 10 && j >= 10)
						    	{
						    		if(document.getElementById("Square1"+ i + j).__data__.fill == 1)
						    			push_flag1 = 1;
						    	}

						    	if (push_flag1 == 1)
						    	{
						    		if (j - 1 < 10)
						                a_string = '20' + (j-1).toString();
						            else
						                a_string = '2' + (j-1).toString();
						            if (i < 10)
						                b_string = '0' + i.toString();
						            else
						                b_string = i.toString();
						            select_sid.push(a_string + b_string);
						    	}
						  	}
						  }
						  console.log(select_sid);
						  d3.select("#container_line").selectAll('svg').remove();
						  width3 = document.getElementById('container_line').offsetWidth;
					      height3 = width3 / 2.7;
						  margin3 = { top: 10, right: 30, bottom: 30, left: 50 },
					        width3 = width3 - margin3.left - margin3.right,
					        height3 = height3 - margin3.top - margin3.bottom;

					      svg3 = d3.select("#container_line").append("svg")
					            .attr("width", width3 + margin3.left + margin3.right)
					            .attr("height", height3 + margin3.top + margin3.bottom)
					            .append("g")
					            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
					      but_day_choice = document.getElementById("but_day").value.substring(3,4);
						  draw_line(but_day_choice, select_sid);
						  document.getElementById("line_sid_number").innerHTML = "The size is: " + select_sid.length;
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

						document.getElementById("map_time").innerHTML = "The exact time is: " + (Math.floor(value / 60) + 7) + " : " + Math.floor(value % 60);

						//tooltip.html("The exact time is: " + (Math.floor(value / 60) + 7) + " : " + Math.floor(value % 60));
					}

					function heatmap_noframe(value){
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

						document.getElementById("map_time").innerHTML = "The exact time is: " + (Math.floor(value / 60) + 7) + " : " + Math.floor(value % 60);

						//tooltip.html("The exact time is: " + (Math.floor(value / 60) + 7) + " : " + Math.floor(value % 60));

					}
			
				//Choice
					choice();

					function choice(){
						var but_choice = document.getElementById("but_choice");
						but_choice.onclick = function(){
							var value = document.getElementById("beans").value;
							if (choice_flag == "frame")
							{
								heatmap_noframe(value);
								choice_flag = "noframe";
								but_choice.value = "Room";
							}
							else if (choice_flag == "noframe")
							{
								heatmap(value);
								choice_flag = "frame";
								but_choice.value = "Frame";
							}
							
						}
					}

					var select_room_arr = [];
					for (var i = 0; i <= 21; i++)
					{
						select_room_arr.push(0);
					}

					function select_room(){
						if ($(this).attr("id").length == 10)
						{
							var room_id = $(this).attr("id");
							var room_column = parseInt(room_id.substring(6,8));
							var room_row = parseInt(room_id.substring(8,10));
							if (room_column >= 1 && room_column <= 5 && room_row >= 3 && room_row <= 4)
							{
								if (select_room_arr[0] == 0)
								{
									select_room_arr[0] = 1;
								}
								else if (select_room_arr[0] == 1)
								{
									select_room_arr[0] = 0;
								}
								console.log("hallA");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 5 && room_row <= 6)
							{
								if (select_room_arr[1] == 0)
								{
									select_room_arr[1] = 1;
								}
								else if (select_room_arr[1] == 1)
								{
									select_room_arr[1] = 0;
								}
								console.log("hallB");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 7 && room_row <= 8)
							{
								if (select_room_arr[2] == 0)
								{
									select_room_arr[2] = 1;
								}
								else if (select_room_arr[2] == 1)
								{
									select_room_arr[2] = 0;
								}
								console.log("hallC");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 8 && room_row <= 10)
							{
								if (select_room_arr[3] == 0)
								{
									select_room_arr[3] = 1;
								}
								else if (select_room_arr[3] == 1)
								{
									select_room_arr[3] = 0;
								}
								console.log("hallD");
							}
							else if (room_column >= 7 && room_column <= 8 && room_row >= 4 && room_row <= 10)
							{
								if (select_room_arr[4] == 0)
								{
									select_room_arr[4] = 1;
								}
								else if (select_room_arr[4] == 1)
								{
									select_room_arr[4] = 0;
								}
								console.log("poster");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 5 && room_row <= 6)
							{
								if (select_room_arr[5] == 0)
								{
									select_room_arr[5] = 1;
								}
								else if (select_room_arr[5] == 1)
								{
									select_room_arr[5] = 0;
								}
								console.log("toilet1");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 7 && room_row <= 10)
							{
								if (select_room_arr[6] == 0)
								{
									select_room_arr[6] = 1;
								}
								else if (select_room_arr[6] == 1)
								{
									select_room_arr[6] = 0;
								}
								console.log("room1");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 11 && room_row <= 12)
							{
								if (select_room_arr[7] == 0)
								{
									select_room_arr[7] = 1;
								}
								else if (select_room_arr[7] == 1)
								{
									select_room_arr[7] = 0;
								}
								console.log("room2");
							}
							else if (room_column >= 15 && room_column <= 18 && room_row >= 3 && room_row <= 12)
							{
								if (select_room_arr[8] == 0)
								{
									select_room_arr[8] = 1;
								}
								else if (select_room_arr[8] == 1)
								{
									select_room_arr[8] = 0;
								}
								console.log("exhibition");
							}
							else if (room_column >= 19 && room_column <= 28 && room_row >= 3 && room_row <= 12)
							{
								if (select_room_arr[9] == 0)
								{
									select_room_arr[9] = 1;
								}
								else if (select_room_arr[9] == 1)
								{
									select_room_arr[9] = 0;
								}
								console.log("mainHall");
							}
							else if (room_column >= 2 && room_column <= 5 && room_row >= 13 && room_row <= 14)
							{
								if (select_room_arr[10] == 0)
								{
									select_room_arr[10] = 1;
								}
								else if (select_room_arr[10] == 1)
								{
									select_room_arr[10] = 0;
								}
								console.log("register");
							}
							else if (room_column >= 19 && room_column <= 20 && room_row >= 15 && room_row <= 16)
							{
								if (select_room_arr[11] == 0)
								{
									select_room_arr[11] = 1;
								}
								else if (select_room_arr[11] == 1)
								{
									select_room_arr[11] = 0;
								}
								console.log("service");
							}
							else if (room_column >= 21 && room_column <= 24 && room_row >= 15 && room_row <= 16)
							{
								if (select_room_arr[12] == 0)
								{
									select_room_arr[12] = 1;
								}
								else if (select_room_arr[12] == 1)
								{
									select_room_arr[12] = 0;
								}
								console.log("room3");
							}
							else if (room_column >= 25 && room_column <= 26 && room_row >= 15 && room_row <= 16)
							{
								if (select_room_arr[13] == 0)
								{
									select_room_arr[13] = 1;
								}
								else if (select_room_arr[13] == 1)
								{
									select_room_arr[13] = 0;
								}
								console.log("room4");
							}
							else if (room_column >= 27 && room_column <= 28 && room_row >= 15 && room_row <= 16)
							{
								if (select_room_arr[14] == 0)
								{
									select_room_arr[14] = 1;
								}
								else if (select_room_arr[14] == 1)
								{
									select_room_arr[14] = 0;
								}
								console.log("toilet2");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 2)
							{
								if (select_room_arr[15] == 0)
								{
									select_room_arr[15] = 1;
								}
								else if (select_room_arr[15] == 1)
								{
									select_room_arr[15] = 0;
								}
								console.log("elevator_up_floor1");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 15)
							{
								if (select_room_arr[16] == 0)
								{
									select_room_arr[16] = 1;
								}
								else if (select_room_arr[16] == 1)
								{
									select_room_arr[16] = 0;
								}
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
								if (select_room_arr[17] == 0)
								{
									select_room_arr[17] = 1;
								}
								else if (select_room_arr[17] == 1)
								{
									select_room_arr[17] = 0;
								}
								console.log("diningHall");
							}
							else if (room_column >= 1 && room_column <= 5 && room_row >= 11 && room_row <= 12)
							{
								if (select_room_arr[18] == 0)
								{
									select_room_arr[18] = 1;
								}
								else if (select_room_arr[18] == 1)
								{
									select_room_arr[18] = 0;
								}
								console.log("room5");
							}
							else if (room_column >= 0 && room_column <= 5 && room_row >= 14 && room_row <= 16)
							{
								if (select_room_arr[19] == 0)
								{
									select_room_arr[19] = 1;
								}
								else if (select_room_arr[19] == 1)
								{
									select_room_arr[19] = 0;
								}
								console.log("recreationArea");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 5 && room_row <= 6)
							{
								if (select_room_arr[20] == 0)
								{
									select_room_arr[20] = 1;
								}
								else if (select_room_arr[20] == 1)
								{
									select_room_arr[20] = 0;
								}
								console.log("toilet3");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row >= 7 && room_row <= 8)
							{
								if (select_room_arr[21] == 0)
								{
									select_room_arr[21] = 1;
								}
								else if (select_room_arr[21] == 1)
								{
									select_room_arr[21] = 0;
								}
								console.log("room6");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 2)
							{
								if (select_room_arr[15] == 0)
								{
									select_room_arr[15] = 1;
								}
								else if (select_room_arr[15] == 1)
								{
									select_room_arr[15] = 0;
								}
								console.log("elevator_up_floor2");
							}
							else if (room_column >= 10 && room_column <= 11 && room_row == 15)
							{
								if (select_room_arr[16] == 0)
								{
									select_room_arr[16] = 1;
								}
								else if (select_room_arr[16] == 1)
								{
									select_room_arr[16] = 0;
								}
								console.log("elevator_down_floor2");
							}
						}

						d3.select("#container_stacked").selectAll('svg').remove();

						width2 = document.getElementById('container_stacked').offsetWidth;
        				height2 = width2 / 2.88;
        				margin2 = { top: 40, right: 120, bottom: 50, left: 60 },
				            width2 = width2 - margin2.left - margin2.right,
				            height2 = height2 - margin2.top - margin2.bottom;

					    svg2 = d3.select("#container_stacked").append("svg")
            					.attr("width", width2 + margin2.left + margin2.right)
            					.attr("height", height2 + margin2.top + margin2.bottom)
            					.append("g")
            					.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            			select_room_sid = [];

            			if (select_room_arr[0] == 1){
            				select_room_sid.push("hallA");
            			}
            			if (select_room_arr[1] == 1){
            				select_room_sid.push("hallB");
            			}
            			if (select_room_arr[2] == 1){
            				select_room_sid.push("hallC");
            			}
            			if (select_room_arr[3] == 1){
            				select_room_sid.push("hallD");
            			}
            			if (select_room_arr[4] == 1){
            				select_room_sid.push("poster");
            			}
            			if (select_room_arr[5] == 1){
            				select_room_sid.push("toilet1");
            			}
            			if (select_room_arr[6] == 1){
            				select_room_sid.push("room1");
            			}
            			if (select_room_arr[7] == 1){
            				select_room_sid.push("room2");
            			}
            			if (select_room_arr[8] == 1){
            				select_room_sid.push("exhibition");
            			}
            			if (select_room_arr[9] == 1){
            				select_room_sid.push("mainHall");
            			}
            			if (select_room_arr[10] == 1){
            				select_room_sid.push("register");
            			}
            			if (select_room_arr[11] == 1){
            				select_room_sid.push("service");
            			}
            			if (select_room_arr[12] == 1){
            				select_room_sid.push("room3");
            			}
            			if (select_room_arr[13] == 1){
            				select_room_sid.push("room4");
            			}
            			if (select_room_arr[14] == 1){
            				select_room_sid.push("toilet2");
            			}
            			if (select_room_arr[15] == 1){
            				select_room_sid.push("elevatorUp");
            			}
            			if (select_room_arr[16] == 1){
            				select_room_sid.push("elevator");
            			}
            			if (select_room_arr[17] == 1){
            				select_room_sid.push("diningHall");
            			}
            			if (select_room_arr[18] == 1){
            				select_room_sid.push("room5");
            			}
            			if (select_room_arr[19] == 1){
            				select_room_sid.push("recreationArea");
            			}
            			if (select_room_arr[20] == 1){
            				select_room_sid.push("toilet3");
            			}
            			if (select_room_arr[21] == 1){
            				select_room_sid.push("room6");
            			}

            			but_day_choice = document.getElementById("but_day").value.substring(3,4);
						draw_stack(but_day_choice, select_room_sid);

						// d3.select("#container_circular").selectAll('svg').remove();

				  //       width6 = document.getElementById('container_circular').offsetWidth;
      //   				height6 = width6 / 1.35;
      //   				margin6 = { top: 10, right: 10, bottom: 10, left: 10 },
				  //           width6 = width6 - margin6.left - margin6.right,
				  //           height6 = height6 - margin6.top - margin6.bottom;

						// svg6 = d3.select("#container_circular").append("svg")
					 //            .attr("width", width6 + margin6.left + margin6.right)
					 //            .attr("height", height6 + margin6.top + margin6.bottom)
					 //            .append("g")
					 //            .attr("transform", "translate(" + margin6.left + "," + margin6.top + ")");

					    var temp_time = document.getElementById("beans").value;
					    but_day_choice = document.getElementById("but_day").value.substring(3,4);
					    change_pie(parseInt(but_day_choice), temp_time, select_room_sid);

					    document.getElementById("circular_arr").innerHTML = "";
					    for (var i = 0; i < select_room_sid.length; i++)
					    {
					    	document.getElementById("circular_arr").innerHTML += select_room_sid[i] + " ";
					    }   

					}

					function null_function(){

					}
			})
		})
	})

}