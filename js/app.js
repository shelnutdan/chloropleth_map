/*Svg attribute*/
let svg=d3.select('svg'),
width=1000,height=600;

let path=d3.geoPath()
let projection=d3.geoMercator().scale(70).center([0,20]).translate([width/2,height/2])

var x = d3.scaleLinear()
    .domain([2.6, 75.1])
    .rangeRound([600, 860]);
/*Data and color scheme*/
let data=d3.map()
var colorScale=d3.scaleThreshold().domain(d3.range(2.6, 75.1, (75.1-2.6)/8)).range(d3.schemeReds[9])

let legend =svg.append('g').attr('class','key')
  .attr('id', 'legend')
  .attr('transform','translate(0,40)');

legend.selectAll('rect')
  .data(colorScale.range().map((d) =>{
    d=colorScale.invertExtent(d);
    if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];return d;
  }
))
.enter().append("rect")
    .attr("height", 8)
    .attr("x", (d) =>{
      return x(d[0])
    })
    .attr("width", (d) => {
       return x(d[1]) - x(d[0])
      })
    .attr("fill", (d) => {
      return colorScale(d[0])
    });

  legend.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")

    legend.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x) { return Math.round(x) + '%' })
        .tickValues(colorScale.domain()))
        .select(".domain")
        .remove();


let tip=d3.select('body').append('div').attr('class','tooltip').attr('id','tooltip').style('opacity',0);

d3.queue()
.defer(d3.json,'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json')
.defer(d3.json,'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
.await(ready)

function ready(error, education,us) {

  // Draw the map
  svg.append("g").attr('class','counties')
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path").attr("class","county")
    .attr('data-fips',(d)=> d.id)
    .attr('data-education', (d)=>{
      let result=education.filter((obj)=> {return obj.fips==d.id})
      if(result[0]){
        return result[0].bachelorsOrHigher
      } return 0
    })
    .attr("fill", function(d) {
        let result = education.filter(function( obj ) {
          return obj.fips == d.id;
        });
        if(result[0]){
          return colorScale(result[0].bachelorsOrHigher)
        }
        //could not find a matching fips id in the data
        return colorScale(0)
       })
      .attr("d",path)
      .on('mouseover', function(d) {
        tip.style('opacity',0.8);
        tip.html( ()=>{
          let result = education.filter(function( obj ) {
            return obj.fips == d.id;
          });
          if(result[0]){
            return result[0]['area_name'] + ', ' + result[0]['state'] + ': ' + result[0].bachelorsOrHigher
          }
          return 0;
        }).style("left", (d3.event.pageX + 10) + "px")
           .style("top", (d3.event.pageY - 28) + "px")

      })
      .attr("data-education", function(d) {
        var result = education.filter(function( obj ) {
          return obj.fips == d.id;
        });
        if(result[0]){
          return result[0].bachelorsOrHigher
        }
        //could not find a matching fips id in the data
        return 0
       })


    }
      // draw each country
    /*  .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.bachelorsOrHigher = data.get(d.area_name) || 0;
        return colorScale(d.bachelorsOrHigher);
      });
    }*/
/*
d3.json('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',function(error,data){
  data.forEach((d)=>console.log(d.area_name))
  data.forEach((d)=>console.log(d.bachelorsOrHigher))
  console.log(data)

})

d3.json('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',function(error,data){
  /*
  data.forEach((d)=>console.log(d.area_name))
  data.forEach((d)=>console.log(d.bachelorsOrHigher))*/
  /*console.log(data)

})*/
