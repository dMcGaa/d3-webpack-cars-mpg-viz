import * as d3 from 'd3';
import data from './data/car-data';

console.log("bundle working");
console.log(data);

var width = 400;
var height = 220;

let svg = d3.select('svg#graph')
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate( ${width / 2}, ${height / 2})`)

let reduceMpg = (arr) => {
    let acc = {avgMpg: 0, numCars: 1};
    //console.log(arr[0]["model year"]);
    return arr.reduce((acc, curr) => {
        acc.avgMpg = (acc.avgMpg + curr["miles"]["gallon"]) / (acc.numCars);
        acc.numCars = 2;
        //console.log(acc.avgMpg);
        return acc;
    }, acc);
};

var someData = d3.nest()
    .key((d) => d["model year"])
    .entries(data);

    let pieGenerator = d3.pie()
.value((d, i) => reduceMpg(d.values).avgMpg)
    .sort((a, b) => a.key - b.key);

    //append many divs, only display relevant
    var tooltip = d3.select('body')
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "2px")
    .style("visibility", "hidden");

    let arcData = pieGenerator(someData);

    var arcGenerator = d3.arc()
.innerRadius(20)
    .outerRadius(100);

    console.log(arcData);

    var stdColor = "orange";
    var hltColor = "red";
    svg 
    .selectAll('path')
    .data(arcData)
.enter()
    .append('path')
    .style('fill', stdColor)
    .style('stroke', 'white')
    .attr('d', arcGenerator)
    .on("mouseover", function(d) {
        d3.select(this).style("fill", hltColor);
        return tooltip.style("visibility", "visible")
          .text(() => `year: 19${d.data.key} avg mpg: ${d.value.toFixed(2)}`);
    })
    .on("mousemove", function(d) {
        d3.select(this).style("fill", hltColor);
        return tooltip
            .style("top", (d3.event.pageY-10) + "px")
            .style("left", (d3.event.pageX+10) + "px");
        
    })
    .on("mouseout", function(){
        d3.select(this).style("fill", stdColor);
        return tooltip.style("visibility", "hidden");
    });

