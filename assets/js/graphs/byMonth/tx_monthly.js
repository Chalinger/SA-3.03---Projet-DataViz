import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function monthlyStats(locationLink, month, stepMin, stepMax, div){

    const objectApiLinksForAllLocations = {
        "AULNOIS-SS-LAON": "../../api/aulnois-ss-laon/tx/TX_AULNOIS-SS-LAON.json",
        "BELLE-ILE": "../../api/belle-ile/tx/TX_BELLE-ILE.json",
        "CAVILLARGUES": "../../api/cavillargues/tx/TX_CAVILLARGUES.json",
        "PARIS": "../../api/paris-mtsouris/tx/TX_PARIS-MTSOURIS",
        "VILLAR-ST-PANCRACE": "../../api/villar-st-pancrace/tx/TX_VILLAR-ST-PANCRACE.json"
    };

d3.json(objectApiLinksForAllLocations[locationLink]).then(rawData => {
    const parse = d3.timeParse("%Y%m");

    const data = rawData.map(d => ({
        date: parse(d.DateYYYYMM),
        value: +d.VALEUR
    }));

    const onlyJanuary = data.filter(d => d.date.getMonth() === month);

    onlyJanuary.sort((a, b) => a.date - b.date);

    const step = 2;
    const filtered = onlyJanuary.filter((_, i) => i % step === 0);

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
        // Démarre masqué pour l’animation de révélation
        .attr("width", 0)
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

    const path = plot.append("path")
        .datum(filtered)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#1976d2")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Animation 1: “dessin” de la ligne
    const totalLength = path.node().getTotalLength();
    path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);

    // Animation 2: révélation via clipPath (optionnelle, peut être supprimée si vous gardez la 1)
    defs.select("#clip-tx").select("rect")
        .transition()
        .delay(150) // légère synchro avec la ligne
        .duration(2500)
        .ease(d3.easeCubic)
        .attr("width", width);


    const xAxis = d3.axisBottom(x)
        .ticks(d3.timeYear.every(5))
        .tickFormat(d3.timeFormat("%Y"));

    const yAxis = d3.axisLeft(y);

    g.append("g")
        .attr("class", "x-axis")
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
monthlyStats("BELLE-ILE", 5, 15, 25, "graph_tx_aulnois_ss_laon_jan");