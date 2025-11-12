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

}

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


// function displayDecadeAverages(station, containerId) {
//     getDecadeAverages(station).then(decades => {
//         const el = document.getElementById(containerId);
//         if (!el) return;
//         el.innerHTML = "";
//         decades.forEach(d => {
//             const row = document.createElement("div");
//             row.textContent = `${d.decade}: ${d.averageTemp > 0 ? "+" : ""}${d.averageTemp}°C`;
//             el.appendChild(row);
//         });
//     });
// }