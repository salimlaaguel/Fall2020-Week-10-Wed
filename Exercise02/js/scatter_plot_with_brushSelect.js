function scatter_plot(data,
                                 ax,
                                 title="",
                                 xLabel="",
                                 yLabel="",
                                 legend=[],
                                 legendcolors=[],
                                 margin = 100)
{

    let xScale= d3.scaleLinear().domain(d3.extent(data,function (d){return d.x}))
                                .range([margin,1000-margin])
    let yScale= d3.scaleLinear().domain(d3.extent(data,function (d){return d.y})).range([1000-margin,margin])
    let rScale= d3.scaleLinear().domain(d3.extent(data,function (d){return d.r})).range([2,10])
    let axis = d3.select(`${ax}`)

    axis.selectAll('.markers')
        .data(data)
        .enter()
        .append('g')
        .attr("class",'markers')
        .attr('transform', function(d) {
            return `translate(${xScale(d.x)}, ${yScale(d.y)})`})
        .append('circle')
        .attr("class",function (d,i){
                    return `cls_${i}`})
        .attr("r",function (d){return rScale(d.r)})
        .attr("fill",function (d){return d.c})

    // x and y Axis function
    let x_axis = d3.axisBottom(xScale).ticks(4)
    let y_axis = d3.axisLeft(yScale).ticks(4)
    //X Axis
    axis.append("g").attr("class","axis")
        .attr("transform", `translate(${0},${1000-margin})`)
        .call(x_axis)
    // Y Axis
    axis.append("g").attr("class","axis")
        .attr("transform", `translate(${margin},${0})`)
        .call(y_axis)
    // Labels
    axis.append("g").attr("class","label")
        .attr("transform", `translate(${500},${1000-10})`)
        .append("text")
        .attr("class","label")
        .text(xLabel)

    axis.append("g")
        .attr("transform", `translate(${35},${500}) rotate(270)`)
        .append("text")
        .attr("class","label")
        .text(yLabel)
    // Title
    axis.append('text')
        .attr('x',500)
        .attr('y',80)
        .attr("text-anchor","middle")
        .text(title)
        .attr("class","title")
    // legend
    if (legend.length>0){
        legend.forEach(
            function (d,i){
            let space = 50
            let lgnd = axis.append("g").attr('transform',`translate(${900},${i*50 + space})`);
            lgnd.append('rect').attr('width',function (d){return 40})
                               .attr('height',function (d){return 40})
                               .attr('fill',function (d){
                                   return legendcolors[i]
                               })
                .attr("class",d)
            lgnd.append('text').attr("class","legend").attr("dx","-80").attr("dy","30").text(d)

        })
    }
////////////////////////////////////////////////////////
/////////////////////brush//////////////////////////////
////////////////////////////////////////////////////////

    // declare brush
    let brush = d3
        .brush()
        .on("start",  brushStart)
        .on("brush", brushed)
        .extent([
            [margin, margin],
            [1000-margin,1000-margin]
        ]);
    // call brush event handler
    axis.call(brush);

    // add a group for the brushed data points
    let GroupBrush = axis.append("g").attr("class", "GroupBrush");
    // style brushed circles


    function brushed() {
        // use d3.brushSelection to get bounds of the brush
        let selected_items = d3.brushSelection(this); // these are values on the screen
        // where is brushed?
        let X1 = xScale.invert(selected_items[0][0])
        let X2 = xScale.invert(selected_items[1][0])
        let Y1 = yScale.invert(selected_items[0][1])
        let Y2 = yScale.invert(selected_items[1][1])
        // let us select elements that are between the brush area
        d3.selectAll(".markers").classed("selected",function (d){
            // data between the scaled brush coordinates
            if(+d.x >= X1 &&
                +d.x <=X2 &&
                +d.y <=Y1 &&
                +d.y >=Y2)
            {
                return 'true'
            }
        })
    }

    function brushStart() {
        // if no selection already exists, colour all circles black
        if (d3.brushSelection(this)[0][0] == d3.brushSelection(this)[1][0]) {
            d3.selectAll(".markers").classed("selected",false)
        }
    }


}