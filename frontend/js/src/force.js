function drawForceSvg(day){
    // para: day(integer) selected day
    // para: pid(integer) selected pid
    const X = 16
    const Y = 30
    const INTERVAL = 1
    const UNIT_FORCE = 1
    const THRESHOLD = 8 // 设定认为他们是熟人的条件——同时出现的次数

    function timeSimilar(t1,t2){
        // para: t1, t2  time(integer)
        return Math.abs(t1-t2) < INTERVAL
    }

    function seperateSid(sid){
        fxy = [sid.substr(0,1),sid.substr(1,2),sid.substr(3,2)]
        fxy = fxy.map(ele=>parseInt(ele))
        return fxy
    }

    function downFile(json,filename) {
        // para: json(String)  content to store
        // para: filename(String)
        let blob = new Blob([json], {type: 'text/json'})
        let e = document.createEvent('MouseEvents')
        let a = document.createElement('a')
        a.download = filename + ".json"
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }

    function computeForceEdges(day){
        // para: day  1,2,3  represent three days
        // return : null (download json file)
        let csvData = []
        let grids = [[],[]]
        for(let x=0;x<X;x++){
            grids[0].push(Array.from({length:Y})) // first floor
            grids[0][x] = grids[0][x].map(()=>[])
            grids[1].push(Array.from({length:Y}))
            grids[1][x] = grids[1][x].map(()=>[])
        }
        return new Promise((resolve,reject)=>{
            d3.csv(`./static/day${day}.csv`,(err,data)=>{
                if(err){
                    reject()
                }
                csvData = data
                csvData.forEach(row => {
                    let sid = row.sid
                    let [f,x,y] = seperateSid(sid)
                    grids[f-1][x][y].push([parseInt(row.id),parseInt(row.time)])
                })
                console.log("csv data, fecthed")

                let allPeople = csvData.map(row=>row.id)
                allPeople = [...new Set(allPeople)] // remove the redundant items
                const PEOPLE_IDX = {}
                allPeople.forEach((p,idx)=>{
                    PEOPLE_IDX[p] = idx
                })
                const PEOPLE_NUM = Object.keys(PEOPLE_IDX).length
                console.log("people => index, done")
                
                let nodes = allPeople.map(p=>({id:p}))
                let edges = Array.from({length:PEOPLE_NUM}).map(ele=>Array.from({length:PEOPLE_NUM}))
                console.log(edges)
                for(let f=0;f<2;++f){
                    console.log(`floor ${f} done`)
                    for(let x=0;x<X;++x){
                        for(let y=0;y<Y;++y){
                            for(let r1 = 0;r1<grids[f][x][y].length;++r1){
                                for(let r2=r1+1;r2<grids[f][x][y].length;++r2){
                                    let [p1, t1] = grids[f][x][y][r1]
                                    let [p2, t2] = grids[f][x][y][r2]
                                    let idx1 = Math.min(PEOPLE_IDX[p1], PEOPLE_IDX[p2])
                                    let idx2 = Math.max(PEOPLE_IDX[p1], PEOPLE_IDX[p2])
                                    if(p1!==p2){ // different people in the same grid
                                        if(timeSimilar(t1,t2)){ // check the time these two people arrived at
                                            if(edges[idx1][idx2]!==undefined){
                                                edges[idx1][idx2].value += UNIT_FORCE
                                            }else{
                                                edges[idx1][idx2] = {source:idx1,target:idx2,value:UNIT_FORCE}
                                            }
                                        }else{
                                            break; // time is ordered ascently, so no need to check any more
                                        }
                                        
                                    }
                                }
                            }
                        }
                    }
                }
                console.log("relation edges, done")

                let d3edges = []
                for(let i=0;i<PEOPLE_NUM;++i){
                    for(let j=i;j<PEOPLE_NUM;++j){
                        if(edges[i][j]!==undefined){
                            d3edges.push({...edges[i][j]})
                        }
                    }
                }
                d3edges = d3edges.map((ele,idx)=>{
                    return Object.assign(ele,{index:idx})
                })
                console.log(d3edges)

                const jsonFile = JSON.stringify(d3edges)
                downFile(jsonFile,`ForceDay${day}`)
                resolve() // 其实还是不能用……不知道什么时候下载好
            })
        })
    }

    // computeForceEdges(day)
    $(document).ready(() => { // 是否直接算更省事？这种io不一定比算得快
        $.ajax({
            url: `./static/ForceDay${day}.json`,
            async: false,
            success: data => {
                d3.csv(`./static/day${day}.csv`,(err,csvData)=>{
                    let allPeople = csvData.map(row=>row.id)
                    allPeople = [...new Set(allPeople)] // remove the redundant items
                    const PEOPLE_IDX = {}
                    allPeople.forEach((p,idx)=>{
                        PEOPLE_IDX[p] = idx
                    })
                    const PEOPLE_NUM = Object.keys(PEOPLE_IDX).length
                    
                    let forceSvg = d3.select("#container_force")
                        .select("svg")
                    let nodes = allPeople.map(p=>({id:p}))
                    let edges = data
                    edges = edges.filter(e=>e.value>THRESHOLD) // 多次近乎同时一起出现在一个格子中才考虑可能认识
                    let freq = edges.map(ele=>ele.value)
                    const WIDTH = forceSvg.attr("width")
                    const HEIGHT = forceSvg.attr("height")
                    const COLOR = "#00AA00"
                    const RADIUS = 10
                    let tooltip = d3
                        .select("#container_force") // absolute相对父级对象
                        .append("div") // 悬浮框
                        .classed("tooltip", true)
                    
                    let forceSimulation = d3.forceSimulation()
                        .force("link",d3.forceLink())
                        .force("charge",d3.forceManyBody())
                        .force("center",d3.forceCenter())
                        .force("circle",d3.forceCollide(RADIUS))
                    let nodesForce = forceSimulation.nodes(nodes)

                    let g = forceSvg.select("g")
                    
                    forceSimulation.force("link")
                        .links(edges)
                        .distance(d=>500/d.value)
                    forceSimulation.force("center")
                        .x(WIDTH/2)
                        .y(HEIGHT/2)
                    
                    // we should draw links first, then draw the nodes!
                    let links = g.append("g")
                        .selectAll("line")
                        .data(edges)
                        .enter()
                        .append("line")
                        .attr("stroke",(d,i)=> COLOR)
                        .attr("stroke-width",d=>d.value/4)

                    let circles = g.selectAll(".circleText")
                        .data(nodes)
                        .enter()
                        .append("g")
                        .attr("transform",d=>`translate(${d.x},${d.y})`)
                        .call(d3.drag()
                        .on("start",(d)=>{
                            if(d3.event.active){
                            forceSimulation.alphaTarget(0.8).restart()
                            d.fx = d.x
                            d.fy = d.y
                            }
                        })
                        .on("drag",(d)=>{
                            d.fx = d3.event.x
                            d.fy = d3.event.y
                        })
                        .on("end",(d)=>{
                            if(!d3.event.active){
                            forceSimulation.alphaTarget(0)
                            }
                            d.fx = null
                            d.fy = null
                        })
                        )
                    
                    let selectedPeople = ["19145","18608","18364","16975"]        
                    circles.append("circle")
                        .attr("r",d=> {
                            if(selectedPeople.includes(d.id)){
                                return RADIUS*10
                            }else{
                                return RADIUS
                            }
                        })
                        .attr("fill",d=>COLOR)
                        .on("mouseover", function(d) {
                            // 边框突出
                            // 悬浮框
                            d3.select(this)
                                .attr("fill","blue")
                            tooltip
                                .html(`人员id: ${d.id}`)
                                .transition()
                                .duration(500)
                                .style("left", `${d3.event.pageX}px`)
                                .style("top", `${d3.event.pageY}px`)
                                .style("opacity", 1.0)
                            return d;
                            })
                            .on("mouseout", function() {
                                tooltip.transition().style("opacity", 0)
                                d3.select(this)
                                    .attr("fill",COLOR)
                            })
                    
                    forceSvg.selectAll("text")
                        .data(nodes)
                        .enter()
                        .append("text")
                        .style("fill", "red")
                        .attr("dx", 20)
                        .attr("dy", 20)
                        .text(`day ${day}`)
                    
                    nodesForce.on("tick",()=>{
                        links.attr("x1",(d)=>d.source.x)
                            .attr("y1",(d)=>d.source.y)
                            .attr("x2",(d)=>d.target.x)
                            .attr("y2",(d)=>d.target.y)
                        circles.attr("transform",d=>`translate(${d.x},${d.y})`)
                        })

                    let zoom = d3.zoom()
                        .scaleExtent([0.1,5])
                        .on("zoom",()=>{
                        g.attr('transform', `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${d3.event.transform.k})`)
                        })
                    forceSvg.call(zoom)
                    forceSimulation.restart()
                })
            }
        })
    })
}
