import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function monthlyStats(locationLink, month, stepMin, stepMax, div){

    const objectApiLinksForAllLocations = {
        "AULNOIS-SS-LAON": "./api/aulnois-ss-laon/tn/TN_AULNOIS-SS-LAON.json",
        "BELLE-ILE": "./api/belle-ile/tn/TN_BELLE-ILE.json",
        "CAVILLARGUES": "./api/cavillargues/tn/TN_CAVILLARGUES.json",
        "PARIS-MTSOURIS": "./api/paris-mtsouris/tn/TN_PARIS-MTSOURIS.json",
        "VILLAR-ST-PANCRACE": "./api/villar-st-pancrace/tn/TN_VILLAR-ST-PANCRACE.json"
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

    // Garde: pas de données -> affiche un message et stoppe
    if (filtered.length === 0) {
        d3.select(`#${div}`).append("p").attr("class", "no-data").text("Pas de données pour cette sélection.");
        return;
    }

    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

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
    const clipId = `clip-${div}`;
    defs.append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const plot = g.append("g")
        .attr("class", "plot")
        .attr("clip-path", `url(#${clipId})`);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

    const path = plot.append("path")
        .datum(filtered)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "rgba(244, 68, 46, 1)")
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

    // Animation 2: révélation via clipPath
    defs.select(`#${clipId}`).select("rect")
        .transition()
        .delay(150)
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
monthlyStats("AULNOIS-SS-LAON", 0, -10, 10, "graph_tn_aulnois_ss_laon");

const select = document.getElementById("location-select");
const tnDivId = "graph_tn_aulnois_ss_laon";
let location = "AULNOIS-SS-LAON-text";

function getLocationTextElement(loc) {
    return document.querySelector(`.${loc.toLowerCase()}`) || document.querySelector(`.${loc}`);
}

let locationDiv = getLocationTextElement(location);

select.addEventListener("change", (event) => {
    const selectedLocation = event.target.value;

    if (locationDiv) {
        locationDiv.classList.add("text-hidden");
    }

    location = selectedLocation + "-text";
    locationDiv = getLocationTextElement(location);

    if (locationDiv) {
        locationDiv.classList.remove("text-hidden");
    } else {
        console.warn(`No text element found for location: ${selectedLocation}`);
    }

    d3.select(`#${tnDivId}`).select("svg").remove();
    d3.select(`#${tnDivId}`).selectAll(".no-data").remove();

    const handleMinTempForEachLoc = (location) => {
        if (location == "CAVILLARGUES") {
            return -7;
        } if (location == "PARIS-MTSOURIS") {
            return -5;
        }  if (location == "VILLAR-ST-PANCRACE") {
            return -15;
        }
        if (location == "BELLE-ILE") {
            return -4;
        }
        else {
            return -10
        }
    }
    const handleMaxTempForEachLoc =  (location) => {
        if(location == "CAVILLARGUES") {
            return 6;
        } if (location == "PARIS-MTSOURIS") {
            return 6;
        } if (location == "VILLAR-ST-PANCRACE") {
            return 2;
        }
        if (location == "BELLE-ILE") {
            return 10;
        }
         else {
            return 19;
        }
    }

    monthlyStats(selectedLocation, 0, handleMinTempForEachLoc(selectedLocation), handleMaxTempForEachLoc(selectedLocation), tnDivId);
});