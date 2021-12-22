const diCaprioBirthYear = 1974;
const age = function (year) {
    return year - diCaprioBirthYear;
};
const today = new Date().getFullYear();
const ageToday = age(today);
// ----------------------------------------------------------

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
const elementGroup = svg.append("g").attr("id", "elementGroup");

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
const yAxis = d3.axisLeft().scale(y).ticks(6);

// const formatDate = d3.timeParse("%Y");

d3.csv("data.csv").then((data) => {
    data.map((d) => {
        d.age = +d.age;
        // d.year = formatDate(d.year);
    });

    x.domain(data.map((d) => d.year));
    y.domain([
        d3.min(data.map((d) => d.age)) - 2,
        d3.max(data.map((d) => d.age)),
    ]);

    // console.log(data);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
});
