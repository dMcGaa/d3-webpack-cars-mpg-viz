import * as d3 from 'd3';
import data from './data/car-data';

console.log("bundle working");
console.log(data);

let svg = d3.select('svg#pie g')
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
    .style("visibility", "hidden");

    let arcData = pieGenerator(someData);

    var arcGenerator = d3.arc()
.innerRadius(20)
    .outerRadius(100);

    console.log(arcData);

    svg 
    .selectAll('path')
    .data(arcData)
.enter()
    .append('path')
    .style('fill', 'orange')
    .style('stroke', 'white')
    .attr('d', arcGenerator)
    .on("mouseover", function(d) {
        return tooltip.style("visibility", "visible")
          .text(() => `year: 19${d.data.key} avg mpg: ${d.value.toFixed(2)}`);
    })
    .on("mousemove", function(d) {
        return tooltip
            .style("top", (d3.event.pageY-10) + "px")
            .style("left", (d3.event.pageX+10) + "px");
        
    })
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

