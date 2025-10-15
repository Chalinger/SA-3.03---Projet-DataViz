import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

        d3.json("../../api/aulnois-ss-laon/tx/TX_AULNOIS-SS-LAON.json").then(rawData => {
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
                .domain(filtered.map(d => d.date.getFullYear())) // clé discrète = année
                .range([0, width])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 18])
                .range([height, 0]);

            const svg = d3.select("#graph_tx_aulnois_ss_laon")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom); // retirer .call(zoom) pour le bar chart
            
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

            // Remplacer la ligne par des barres correctement espacées
            plot.selectAll(".bar")
                .data(filtered)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.date.getFullYear()))
                .attr("y", d => y(d.value))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.value))
                .attr("fill", "#1976d2");


            // Axe X adapté à scaleBand (affiche les années)
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