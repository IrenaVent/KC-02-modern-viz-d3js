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
    .padding(0.1);
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

let tooltip = elementGroup.append("g").attr("id", "tooltip");

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

    // let prueba = [];
    // for (let i = 0; i < data.length; i++) {
    //     const hisAge = calculateHisAge(data[i].year);
    //     const yearAge = [data[i].year, hisAge];
    //     prueba.push(yearAge);
    // }

    x.domain(data.map((d) => d.year));
    y.domain([
        d3.min(data.map((d) => d.age)) - 2,
        d3.max(diCaprioAges.map((d) => d.age)) + 2,
    ]);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    yAxisGroup.select(".domain").remove();

    let barAges = elementGroup.selectAll("rect").data(data);
    barAges
        .enter()
        .append("rect")
        .attr("class", (d) => d.name)
        .attr("height", (d) => height - y(d.age) - margin.bottom - margin.top)
        .attr("y", (d) => y(d.age))
        .attr("x", (d) => x(d.year))
        .attr("width", x.bandwidth());

    let valueLine = d3
        .line()
        .x((d) => x(d.year) + x.bandwidth() / 2)
        .y((d) => y(d.age));

    let lineAges = elementGroup
        .append("path")
        .attr("class", "diCaprioAgesLine")
        .attr("d", valueLine(diCaprioAges));
    lineAges.attr("stroke", "black");

    // console.log(diCaprioAges);

    let circleRefAge = tooltip.selectAll("circle").data(diCaprioAges);
    circleRefAge
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d.age))
        .attr("r", x.bandwidth() / 8);
});
