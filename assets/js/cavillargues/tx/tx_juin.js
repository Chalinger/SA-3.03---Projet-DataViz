 import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

        d3.json("../../api/cavillargues/tx/TX_CAVILLARGUES.json").then(rawData => {
            const parse = d3.timeParse("%Y%m");

            const data = rawData.map(d => ({
                date: parse(d.DateYYYYMM),
                value: +d.VALEUR
            }));

            const onlyJune = data.filter(d => d.date.getMonth() === 5);

            onlyJune.sort((a, b) => a.date - b.date);

            const step = 6;
            const filtered = onlyJune.filter((_, i) => i % step === 0);

            const margin = { top: 20, right: 20, bottom: 40, left: 60 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const x = d3.scaleTime()
                .domain(d3.extent(filtered, d => d.date))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([15, 30])
                .range([height, 0]);

            const svg = d3.select("#graph_tx_aulnois_ss_laon")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
                .curve(d3.curveMonotoneX);

            g.append("path")
                .datum(filtered)
                .attr("fill", "none")
                .attr("stroke", "#1976d2")
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
        });