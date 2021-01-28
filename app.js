const width = 900;
const height = 400;
const padding = 80;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", "0 0 900 430")
  .attr("preserveAspectRatio", "xMidYMid");

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then((response) => {
  
  const baseTemp = 8.66
  
  let rectWidth = width/(response["monthlyVariance"].length)
   
  let xScale = d3
    .scaleLinear()
    .domain([
      d3.min(response["monthlyVariance"], (d) => d.year),
      d3.max(response["monthlyVariance"], (d) => d.year)
    ])
    .range([padding+1, width-30]);

  let yScale = d3
    .scaleLinear()
    .domain([
      d3.min(response["monthlyVariance"], (d) => d.month),
      d3.max(response["monthlyVariance"], (d) => d.month)
    ])
    .range([padding, height - 34]);

  let xAxis = d3.axisBottom(xScale).tickFormat((d) => d);

  let yAxis = d3.axisLeft(yScale).tickFormat((d) => {
    {return monthNames[d-1]}
    
  });

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ")")
    .call(yAxis);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute");

  const mousemove = (event, d) => {
    let pageX = event.pageX;
    let pageY = event.pageY;

    const text = d3
      .select("#tooltip")
       .attr("data-year", d.year)
      .html("<p>" + d.year + ": " + ((d.variance+baseTemp).toFixed(2))+"&deg;C</p>")
      .style("left", pageX + "px")
      .style("top", pageY + "px");
  };

  svg
    .selectAll("rect")
    .data(response["monthlyVariance"])
    .enter()
    .append("rect")
    .attr("class","cell")
    .attr("data-month",(d,i) => d.month-1)
    .attr("data-year",(d,i) => d.year)
    .attr("data-temp", (d,i) => {
    return d.variance + baseTemp
  })
    .attr("x", (d, i) => xScale(d["year"]))
    .attr("y", (d, i) => yScale(d["month"]))
    .attr("width",rectWidth*10)
    .attr("height", height/12)
    .style("fill", (d,i) => {
    if(d.variance >= -7 && d.variance <= -4.40) {return "blue"} else if(d.variance >= -4.39 && d.variance <= -1.80) {return "yellow"} else if (d.variance >= -1.79 && d.variance <= 0.80) {return "orange"} else if (d.variance >= 0.81 && d.variance <=3.4) {return "OrangeRed"}else if (d.variance >= 3.41 && d.variance <=7.3) {return "Red"}
  })
    .on("mouseover", (d, i) => d3.select("#tooltip").style("opacity", "1"))
    .on("mouseleave", (d, i) => d3.select("#tooltip").style("opacity", "0"))
    .on("mousemove", mousemove);

 var legend = svg
      .append('g')
      .attr('id', 'legend')
      
  
 let keys = ["-7C to -4.4C","-4.4C to -1.8C","-1.8C to 0.8C","0.8C to 3.4C","3.4C+"]
    let color = d3.scaleOrdinal()
  .domain(keys)
  .range(["Blue","Yellow","Orange","OrangeRed","Red"])

  legend
    .selectAll("rect")
    .data(keys)
  .enter()
  .append("rect")
    .attr("id","legend")
    .attr("y", 43)
    .attr("x", function(d,i){ return 200 + i*150}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", 10)
    .attr("height",10)
    .style("fill", function(d){ return color(d)})
  
  
  legend.selectAll("text")
    
    .data(keys)
    .enter()
    .append("text")
    .attr("y", 50)
    .attr("x", function(d,i){ return 200 + i*150 + 15}).text(function(d){ return d}).attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  .style("font-family", "monospace")

});

