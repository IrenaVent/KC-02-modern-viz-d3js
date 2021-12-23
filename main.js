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
    // xAxisGroup.select(".domain").remove();

    let bAges = barAges.selectAll("rect").data(data);
    bAges
        .enter()
        .append("rect")
        .attr("class", (d) => d.name)
        .attr("height", (d) => height - y(d.age) - margin.bottom - margin.top)
        .attr("y", (d) => y(d.age))
        .attr("x", (d) => x(d.year))
        .attr("width", x.bandwidth());

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

    // console.log(diCaprioAges);

    let cRefAge = circleRefAge.selectAll("circle").data(diCaprioAges);
    cRefAge
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d.age))
        .attr("r", x.bandwidth() / 5);

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

    // yAxisGroup
    //     .append("g")
    //     .attr("class", "y-grid")
    //     .call(
    //         d3
    //             .axisLeft()
    //             .scale(y)
    //             .tickSize(-width + margin.left + margin.right, 0, 0)
    //             .tickFormat("")
    //     );

    let title = tooltip.append("text").attr("id", "title");
    title
        .text("Leonardo Dicaprio's Age VS Lonardo's Girlfriend's Age")
        .attr("x", width / 2 - margin.right - margin.left)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("fill", "#798777");
});
