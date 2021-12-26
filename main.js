const diCaprioBirthYear = 1974;
const calculateHisAge = function (year) {
    return year - diCaprioBirthYear;
};
const height = 600;
const width = 800;
const margin = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 10,
};

const svg = d3
    .select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

elementGroup = svg
    .append("g")
    .attr("id", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x = d3
    .scaleBand()
    .range([0, width - margin.left - margin.right])
    .padding(0.4);
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

const axisGroup = svg.append("g").attr("id", "axisGroup");
const xAxisGroup = axisGroup
    .append("g")
    .attr("id", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`);
const yAxisGroup = axisGroup
    .append("g")
    .attr("id", "yAxisGroup")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxis = d3.axisBottom().scale(x);
const yAxis = d3.axisLeft().scale(y).ticks(10);

let barAges = elementGroup.append("g").attr("id", "barAges");
let lineAges = elementGroup.append("g").attr("id", "lineAges");

let tooltip = elementGroup.append("g").attr("id", "tooltip");
let girlsTexAge = tooltip.append("g").attr("id", "girlsTexAge");
let diCaprioTexAge = tooltip.append("g").attr("id", "diCaprioTexAge");
let circleRefAge = tooltip.append("g").attr("id", "circleRefAge");
let lineRefAge = tooltip.append("g").attr("id", "lineRefAge");
let label = d3.select("body").append("div").attr("class", "label");

// const formatDate = d3.timeParse("%Y");

d3.csv("data.csv").then((data) => {
    data.map((d) => {
        d.age = +d.age;
        d.year = +d.year;
    });

    let diCaprioAges = [];
    for (let i = 0; i < data.length; i++) {
        const hisAge = calculateHisAge(data[i].year);
        const yearAge = { year: data[i].year, age: hisAge };
        diCaprioAges.push(yearAge);
    }

    x.domain(data.map((d) => d.year));
    y.domain([
        d3.min(data.map((d) => d.age)) - 2,
        d3.max(diCaprioAges.map((d) => d.age)) + 2,
    ]);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    yAxisGroup.select(".domain").remove();
    xAxisGroup.select(".domain").remove();

    let bAges = barAges.selectAll("rect").data(data);
    bAges
        .enter()
        .append("rect")
        .attr("class", (d) => d.name)
        .attr("y", (d) => y(d.age))
        .attr("x", (d) => x(d.year))
        .attr("width", x.bandwidth())
        .on("mousemove", function (d) {
            label
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY + 70 + "px")
                .style("display", "inline-block")
                .html(d.name);
        })
        .on("mouseout", function (d) {
            label.style("display", "none");
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .delay((d, i) => i * 50)
        .attr("height", (d) => height - y(d.age) - margin.bottom - margin.top);

    // Animation ---> bars from bottom to top
    //           ---> reminder replace y(d.age) (bAges) -> 0
    // svg.selectAll("rect")
    //     .transition()
    //     .duration(800)
    //     .attr("y", (d) => y(d.age))
    //     .attr("height", (d) => height - y(d.age) - margin.bottom - margin.top)
    //     .delay((d, i) => i * 60);

    let gTexAge = girlsTexAge.selectAll("text").data(data);
    gTexAge
        .enter()
        .append("text")
        .attr("class", "girlsTextAge")
        .text((d) => d.age)
        .attr("text-anchor", "middle")
        .attr("x", (d) => x(d.year) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.age) - x.bandwidth() / 4)
        .attr("font-size", "10px");

    let valueLine = d3
        .line()
        .x((d) => x(d.year) + x.bandwidth() / 2)
        .y((d) => y(d.age));

    let lAges = lineAges
        .append("path")
        .attr("class", "diCaprioAgesLine")
        .attr("d", valueLine(diCaprioAges));
    // lAges.attr("stroke", "black");

    let cRefAge = circleRefAge.selectAll("circle").data(diCaprioAges);
    cRefAge
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
        .attr("cy", (d) => y(16))
        .attr("r", x.bandwidth() / 5);

    svg.selectAll("circle")
        .transition()
        .duration(3000)
        .attr("cy", (d) => y(d.age))
        .delay((d, i) => i * 50);

    let dTexAge = diCaprioTexAge.selectAll("text").data(diCaprioAges);
    dTexAge
        .enter()
        .append("text")
        .attr("class", "girlsTextAge")
        .text((d) => d.age)
        .attr("text-anchor", "middle")
        .attr("x", (d) => x(d.year) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.age) - x.bandwidth() / 2)
        .attr("font-size", "10px");

    let title = tooltip.append("text").attr("id", "title");
    title
        .text("Leonardo DiCaprio's age vs Lonardo's girlfriend's age")
        .attr("x", width / 2 - margin.right - margin.left)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("fill", "#798777");

    let divLeyend = tooltip.append("g").attr("id", "divLeyend");
    divLeyend
        .append("circle")
        .attr("cx", margin.left)
        .attr("cy", margin.top * 4)
        .attr("r", 6)
        .style("fill", "#fb743e");
    divLeyend
        .append("circle")
        .attr("cx", margin.left)
        .attr("cy", margin.top * 6)
        .attr("r", 6)
        .style("fill", "#c5d7bd");
    divLeyend
        .append("text")
        .attr("x", margin.left * 1.5)
        .attr("y", margin.top * 4.5)
        .text("Leonardos's age")
        .attr("alignment-baseline", "middle")
        .style("fill", "#fb743e")
        .style("font-size", "10px");
    divLeyend
        .append("text")
        .attr("x", margin.left * 1.5)
        .attr("y", margin.top * 6.5)
        .text("Leonardo's girlfriend's age")
        .attr("alignment-baseline", "middle")
        .style("fill", "#c5d7bd")
        .style("font-size", "10px");
});
