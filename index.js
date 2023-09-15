
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const g = svg.append('g')
const g2 = svg.append("g")

var margin = {top: 20, bottom: 60, left:20, right: 20}

svg.append("text")
    .attr("x", width/2)
    .attr("y", margin.bottom)
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .text("United States Educational Attainment")
    .style("font-size", "50px")

svg.append("text")
    .attr("x", width/2)
    .attr("y", margin.bottom * 2)
    .attr("id", "description")
    .attr("text-anchor", "middle")
    .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")
    .style("font-size", "20px")

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "10px")
    .style("padding", "10px")
    .style("position", "absolute")
    .style("font-size", "15px")
    .style("color", "white")
     
async function education() {
    const response = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json");
    const education = await response.json();

    const response3 = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json");
    const education2 = await response3.json();


    console.log(education);

    let temp = education;

    console.log(temp);


    const rowById = education.reduce((accumulator, d) => {
 
        accumulator[d.fips] = d;
       
        return accumulator
    }) 

  

    rowById[1001]=education2[0]

    console.log(rowById);

    const response2 = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    const counties = await response2.json()

    console.log(counties);
    console.log(counties.objects.states);

    var topoStates = topojson.feature(counties, counties.objects.states).features

    console.log(topoStates);

    var topoCounties = topojson.feature(counties, counties.objects.counties).features

    const colorScale = d3.scaleOrdinal();

    const colorValue = d => {
        return d;
    };

    console.log(colorValue);

   //console.log(topoCounties);

   topoStates = topoStates.sort(function(a,b){return a.id - b.id})

   console.log(topoStates);

    

    topoCounties = topoCounties.sort(function(a, b){return a.id - b.id});

    topoCounties.forEach(d => {
        //console.log(rowById[d.id])
        Object.assign(d.properties, rowById[d.id])
    })

    console.log(topoCounties);

    //let ultimateData = [topoCounties, topoStates];

    let ultimateData = d3.merge([topoStates, topoCounties])

    console.log(ultimateData);

    g.selectAll("path").data(ultimateData)
        .enter()
        .append("path")
        .attr("class", "counties")
        .attr("d", d3.geoPath())
        .attr("fill", (d, i) => {
            //console.log(d);
            //console.log(d.properties.bachelorsOrHigher)

            if (d.geometry.type=="MultiPolygon") {
                return "transparent"
            }
            else if (d.properties.bachelorsOrHigher >= 3 && d.properties.bachelorsOrHigher < 12) {
                return "rgb(224, 236, 218)"
            }
            else if (d.properties.bachelorsOrHigher >= 12 && d.properties.bachelorsOrHigher < 21) {
                return "rgb(206,232,195)"
            }
            else if (d.properties.bachelorsOrHigher >= 21 && d.properties.bachelorsOrHigher < 30) {
                return "rgb(173, 215, 161)"
            }
            else if (d.properties.bachelorsOrHigher >= 30 && d.properties.bachelorsOrHigher < 39) {
                return "rgb(135, 194, 126)"
            }
            else if (d.properties.bachelorsOrHigher >= 39 && d.properties.bachelorsOrHigher < 48) {
                return "rgb(96,169,101)"
            }
            else if (d.properties.bachelorsOrHigher >= 48 && d.properties.bachelorsOrHigher < 57) {
                return "rgb(69, 137, 76)"
            }
            else {
                return "rgb(50, 110, 56)"
            }
            console.log(d.properties.bachelorsOrHigher);
        })
        .attr("stroke", "white")
        .attr("stroke-width", d=> {
            if (d.geometry.type=="MultiPolygon") {
                //console.log("this is working")
                return "2px"
            }
            else {
                return "0px"
            }
        })
        .attr("transform", "translate(100, 150)")
        .on("mouseover", d => {
            /* console.log(d3.select(this))
            console.log(d);
            console.log(d.x);
            console.log(d.y);
            console.log(d['target']) */
            /* 
            console.log(d['target']['__data__']['properties']['state'])
            console.log(d['target']['__data__']['properties']['bachelorsOrHigher'])
            console.log(d['target']['__data__']['properties']['area_name']); */
            //console.log(d.target);

            tooltip.classed("hidden", false)


            tooltip.html(d['target']['__data__']['properties']['area_name'] + ", " + 
            d['target']['__data__']['properties']['state'] + ": " +
             d['target']['__data__']['properties']['bachelorsOrHigher'] + "%")
            .style("left", d.x + 20 + "px")
            .style("top", d.y - 50 + "px")
        })
        .on("mouseout", d => {
            //console.log("Son of a shit")
            //console.log(tooltip);
            tooltip.classed("hidden", true)
        })


    var linear = d3.scaleLinear()
        .domain([0.03, 0.66])
        .range(["0","240"]);

    var xAxis = d3.axisBottom(linear)
        .tickValues([0.03, 0.12, .21, 0.30, 0.39, 0.48, 0.57, 0.66])
        .tickFormat(d3.format("0.0%"))
        .tickSize(12.5)

    svg.append("g")
        .attr("transform", "translate(700,175)")
        .call(xAxis)

    var percentageGroup = svg.append('g')
        .attr("transform", 'translate(701, 174)')

    percentageGroup.append('rect')
        .attr('height', '12px')
        .attr('width', '33px')
        .attr("fill", "rgb(224, 236, 218)")

    percentageGroup.append('rect')
        .attr('height', '12px')
        .attr('width', '34px')
        .attr("fill", "rgb(206,232,195)")
        .attr("x", "34px")

    percentageGroup.append('rect')
        .attr('height', '12px')
        .attr('width', '33px')
        .attr("fill", "rgb(173, 215, 161)")
        .attr("x", "69px")

    percentageGroup.append('rect')
        .attr('height', '12px')
        .attr('width', '33px')
        .attr("fill", "rgb(135, 194, 126)")
        .attr("x", "103px")

    percentageGroup.append('rect')
        .attr('height', '12px')
        .attr('width', '33px')
        .attr("fill", "rgb(96,169,101)")
        .attr("x", "137px")
        
    percentageGroup.append('rect')
        .attr('height', '12px')
        .attr('width', '33px')
        .attr("fill", "rgb(69, 137, 76)")
        .attr("x", "171.5px")

    percentageGroup.append('rect')
        .attr('height', '12px')
        .attr('width', '33px')
        .attr("fill", "rgb(50, 110, 56)")
        .attr("x", "206px")
        

        //console.log("hello motherfuckers")
    
   
  }

education()




  