import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function averageByDecades(locationLink, stepMin, stepMax, div) {
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
            function calculAverageByDecades(data) {
                const decades = [];
                for (let i = 1961; i < 2024; i += 10) {
                    const decade = data.filter(d => d.date.getFullYear() >= i && d.date.getFullYear() < i + 10);
                    const average = d3.mean(decade, d => d.value);
                    decades.push({
                        date: new Date(i, 5),
                        value: average
                    });
                }
                return decades;
            }

            const result = calculAverageByDecades(data);
            console.log(result);

            const step = 1;
            const filtered = result.filter((_, i) => i % step === 0);

            const margin = { top: 20, right: 20, bottom: 40, left: 60 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // Remplacer l'échelle temporelle par une échelle catégorielle basée sur l'année (décennie)
            const x = d3.scaleBand()
                .domain(filtered.map(d => d.date.getFullYear()))
                .range([0, width])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([stepMin, stepMax])
                .range([height, 0]);

            const svg = d3.select(`#${div}`)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
            
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

            // Replace the chained rect.append("text") with a grouped bar + label
            const bars = plot.selectAll(".bar")
                .data(filtered)
                .enter()
                .append("g")
                .attr("class", "bar")
                .attr("transform", d => `translate(${x(d.date.getFullYear())}, 0)`);
            
            bars.append("rect")
                .attr("x", 0)
                .attr("y", d => y(d.value))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.value))
                .attr("fill", "rgba(244, 68, 46, 0.25)")
                .attr("rx", 5)
                .attr("ry", 5)
                .on("mouseover", (event, d) => {
                    d3.select(event.target)
                        .transition()
                        .duration(200)
                        .attr("fill", "rgba(244, 68, 46, 1)");
                    d3.select(event.target.parentNode)
                        .select("text")
                        .attr("display", "block");
                })
                .on("mouseout", (event, d) => {
                    d3.select(event.target)
                        .transition()
                        .duration(200)
                        .attr("fill", "rgba(244, 68, 46, 0.25)");
                    d3.select(event.target.parentNode)
                        .select("text")
                        .attr("display", "none");
                });
            
            bars.append("text")
                .attr("x", x.bandwidth() / 2)
                .attr("y", d => Math.max(0, y(d.value) - 5)) // keep inside clip
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("font-size", "12px")
                .attr("display", "none")
                .attr("font-family", "sans-serif")
                .text(d => (d.value != null && !Number.isNaN(d.value)) ? d.value.toFixed(2) + "°C" : "");

            const xAxis = d3.axisBottom(x)
                .tickValues(x.domain())
                .tickFormat(d3.format("d"));

            const yAxis = d3.axisLeft(y);

            g.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            g.append("g")
                .call(yAxis);
        });
    }
averageByDecades("AULNOIS-SS-LAON", 0, 25, "graph_tx_aulnois_ss_laon")
