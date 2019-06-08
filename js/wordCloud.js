function draw_wordcloud(choose_id){
    // interface:
    // string id : "19145"
    // List of words
    var myWords = [];

    // set the dimensions and margins of the graph
    var WCmargin = {top: 10, right: 10, bottom: 10, left: 10},
        WCwidth = width10 - WCmargin.left - WCmargin.right,
        WCheight = height10 - WCmargin.top - WCmargin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#wordcloud").append("svg")
        .attr("width", WCwidth + WCmargin.left + WCmargin.right)
        .attr("height", WCheight + WCmargin.top + WCmargin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + WCmargin.left + "," + WCmargin.top + ")");
    d3.json('data/person_room_count.json', function (error, data) {
        layout = d3.layout.cloud()
            .size([WCwidth, WCheight])
            .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
            .padding(5)        //space between words
            .rotate(function() { return (Math.random() * 2) * 90 - 90; })
            .fontSize(function(d) { return d.size; })      // font size of words
            .on("end", draw);
        layout.start();

        wordCloudPlot(choose_id,data);
    });

    

    // ----------------------------------
    function wordCloudPlot(id,data) {
        var person = id.toString();
        var words = data[person];
        var curWords = [];
        var rec = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
        for (var wr in words) {
            var tmpdict = {};
            tmpdict.word = wr;
            tmpdict.size = words[wr];
            if (words[wr] > rec[1])
                rec[1] = words[wr];
            if (words[wr] < rec[0])
                rec[0] = words[wr];
            curWords.push(tmpdict);
        }
        curWords.forEach(function (ele) {
            ele.size = (ele.size - rec[0]) / (rec[1] - rec[0]) * 40 + 15;
        });

        redraw(curWords);
    }

    function redraw(words) {
        d3.select("#wordcloud").html("");

        // append the svg object to the body of the page
        svg = d3.select("#wordcloud").append("svg")
            .attr("width", WCwidth + WCmargin.left + WCmargin.right)
            .attr("height", WCheight + WCmargin.top + WCmargin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + WCmargin.left + "," + WCmargin.top + ")");

        layout = d3.layout.cloud()
            .size([WCwidth, WCheight])
            .words(words.map(function(d) { return {text: d.word, size:d.size}; }))
            .padding(5)        //space between words
            .rotate(function() { return (Math.random() * 2) * 90 - 90; })
            .fontSize(function(d) { return d.size; })      // font size of words
            .on("end", draw);
        layout.start();


        // ----------------------------------
    }

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {

        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}