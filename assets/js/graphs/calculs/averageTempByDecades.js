const jsonFiles = {
    "AULNOIS-SS-LAON": {
        "tx": "./api/aulnois-ss-laon/tx/TX_AULNOIS-SS-LAON.json",
        "tn": "./api/aulnois-ss-laon/tn/TN_AULNOIS-SS-LAON.json"
    },
    "BELLE-ILE": {
        "tx": "./api/belle-ile/tx/TX_BELLE-ILE.json",
        "tn": "./api/belle-ile/tn/TN_BELLE-ILE.json"
    },
    "CAVILLARGUES": {
        "tx": "./api/cavillargues/tx/TX_CAVILLARGUES.json",
        "tn": "./api/cavillargues/tn/TN_CAVILLARGUES.json"
    },
    "PARIS-MTSOURIS": {
        "tx": "./api/paris-mtsouris/tx/TX_PARIS-MTSOURIS.json",
        "tn": "./api/paris-mtsouris/tn/TN_PARIS-MTSOURIS.json"
    },
    "VILLAR-ST-PANCRACE": {
        "tx": "./api/villar-st-pancrace/tx/TX_VILLAR-ST-PANCRACE.json",
        "tn": "./api/villar-st-pancrace/tn/TN_VILLAR-ST-PANCRACE.json"
    }
};

async function getDecadeAverages(station) {
    const txUrl = jsonFiles[station].tx;
    const tnUrl = jsonFiles[station].tn;

    const txJson = await (await fetch(txUrl)).json();
    const tnJson = await (await fetch(tnUrl)).json();

    const txMonthly = new Map(
        txJson
            .filter(o => Number.isFinite(o.DateYYYYMM) && Number.isFinite(o.VALEUR))
            .map(o => [Number(o.DateYYYYMM), Number(o.VALEUR)])
    );
    const tnMonthly = new Map(
        tnJson
            .filter(o => Number.isFinite(o.DateYYYYMM) && Number.isFinite(o.VALEUR))
            .map(o => [Number(o.DateYYYYMM), Number(o.VALEUR)])
    );

    const monthlyAverages = [];
    for (const [yyyymm, txVal] of txMonthly) {
        const tnVal = tnMonthly.get(yyyymm);
        if (!Number.isFinite(tnVal)) continue;
        const year = Math.floor(yyyymm / 100);
        const avg = (Number(txVal) + Number(tnVal)) / 2;
        monthlyAverages.push({ year, avg });
    }

    if (monthlyAverages.length === 0) return [];

    const minYear = Math.min(...monthlyAverages.map(m => m.year));

    const decadeAgg = new Map();
    for (const { year, avg } of monthlyAverages) {
        const idx = Math.floor((year - minYear) / 10);
        const start = minYear + idx * 10;
        const end = start + 9;
        const key = `${start}-${end}`;
        const bucket = decadeAgg.get(key);
        if (bucket) {
            bucket.sum += avg;
            bucket.count += 1;
        } else {
            decadeAgg.set(key, { sum: avg, count: 1, start, end });
        }
    }

    return Array
        .from(decadeAgg.values())
        .sort((a, b) => a.start - b.start)
        .map(d => ({
            decade: `${d.start}-${d.end}`,
            averageTemp: Number((d.sum / d.count).toFixed(2))
        }));
}

getDecadeAverages("AULNOIS-SS-LAON").then(decades => {
    console.log("Décennies AULNOIS-SS-LAON:", decades);
});
getDecadeAverages("BELLE-ILE").then(decades => {
    console.log("Décennies BELLE-ILE:", decades);
});
getDecadeAverages("CAVILLARGUES").then(decades => {
    console.log("Décennies CAVILLARGUES:", decades);
});
getDecadeAverages("PARIS-MTSOURIS").then(decades => {
    console.log("Décennies PARIS-MTSOURIS:", decades);
});
getDecadeAverages("VILLAR-ST-PANCRACE").then(decades => {
    console.log("Décennies VILLAR-ST-PANCRACE:", decades);
});

const stationsIndices = {
    "AULNOIS-SS-LAON": [0, 2, 3, 5],
    "BELLE-ILE": [1, 3, 5, 6],
    "CAVILLARGUES": [0, 2, 4, 6],
    "PARIS-MTSOURIS": [1, 3, 5, 6],
    "VILLAR-ST-PANCRACE": [0, 2, 4, 6]
}

function updateGrid(station, decades) {
    const grid = document.querySelector(`.${station}-grid`);
    if (!grid) return console.warn(`No grid found for station: ${station}`);

    const indices = stationsIndices[station];
    if (!indices) return console.warn(`No indices found for station: ${station}`);

    const temps = indices
        .map(i => decades[i]?.averageTemp)
        .filter(t => Number.isFinite(t));

    const tempInfos = Array.from(grid.querySelectorAll(".temp-info"));
    temps.forEach((temp, i) => {
        const cell = tempInfos[i];
        if (!cell) return;

        const value = `${Number(temp).toFixed(1)} °C`;
        const h1 = cell.querySelector("h1");
        if (h1) {
            h1.textContent = value;
        } else {
            const newH1 = document.createElement("h1");
            newH1.textContent = value;
            cell.innerHTML = "";
            cell.appendChild(newH1);
        }
    });
}

["AULNOIS-SS-LAON", "BELLE-ILE", "CAVILLARGUES", "PARIS-MTSOURIS", "VILLAR-ST-PANCRACE"]
  .forEach(station => {
    getDecadeAverages(station).then(decades => {
      console.log(`Décennies ${station}:`, decades);
      updateGrid(station, decades);
    });
  });