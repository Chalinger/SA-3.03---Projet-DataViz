 import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function txGLobal(locationLink, stepMin, stepMax, div) {
    const objectLocationLink = {
        "AULNOIS-SS-LAON": "./api/aulnois-ss-laon/tx/TX_AULNOIS-SS-LAON.json",
        "BELLE-ILE": "./api/belle-ile/tx/TX_BELLE-ILE.json",
        "CAVILLARGUES": "./api/cavillargues/tx/TX_CAVILLARGUES.json",
        "PARIS-MTSOURIS": "./api/paris-mtsouris/tx/TX_PARIS-MTSOURIS.json",
        "VILLAR-ST-PANCRACE": "./api/villar-st-pancrace/tx/TX_VILLAR-ST-PANCRACE.json"
    }
        d3.json(objectLocationLink[locationLink]).then(rawData => {
            const parse = d3.timeParse("%Y%m");

            const data = rawData.map(d => ({
                date: parse(d.DateYYYYMM),
                value: +d.VALEUR
            }));

            data.sort((a, b) => a.date - b.date);

            const step = 6;
            const filtered = data.filter((_, i) => i % step === 0);

            const margin = { top: 20, right: 20, bottom: 40, left: 60 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const x = d3.scaleTime()
                .domain(d3.extent(filtered, d => d.date))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([stepMin, stepMax])
                .range([height, 0]);

            const svg = d3.select(`#${div}`)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(zoom);
            
            const defs = svg.append("defs");
            defs.append("clipPath")
                .attr("id", "clip-tx")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height);

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
            
            const plot = g.append("g")
                .attr("class", "plot")
                .attr("clip-path", "url(#clip-tx)");

            const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
                .curve(d3.curveMonotoneX);

            plot.append("path")
                .datum(filtered)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "#f4442")
                .attr("stroke-width", 2)
                .attr("d", line);
            
            const xAxis = d3.axisBottom(x)
                .ticks(d3.timeYear.every(5))
                .tickFormat(d3.timeFormat("%Y"));

            const yAxis = d3.axisLeft(y);

            g.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            g.append("g")
                .call(yAxis);

            function zoom(svg) {
    const extent = [[margin.left, margin.top], [width - margin.right, height - margin.bottom]];

    svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed));

    function zoomed(event) {
      x.range([0, width].map(d => event.transform.applyX(d)));

    g.select(".line").attr("d", line);
    g.select(".x-axis").call(xAxis);
    }
  }
        });
    }
txGLobal("AULNOIS-SS-LAON", -3, 30, "graph_tx_aulnois_ss_laon");