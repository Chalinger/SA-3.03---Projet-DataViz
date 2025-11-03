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

// FORMAT : {
//     "DateYYYYMM": 196401,
//     "VALEUR": -2.7,
//     "Q_HOM": 1
//   },

async function getData(data) {
    const txUrl = jsonFiles[data].tx;
    const tnUrl = jsonFiles[data].tn;

    const txData = await fetch(txUrl);
    const tnData = await fetch(tnUrl);

    const txJson = await txData.json();
    const tnJson = await tnData.json();

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

    const yearAgg = new Map();
    for (const [yyyymm, txVal] of txMonthly) {
        const tnVal = tnMonthly.get(yyyymm);
        if (!Number.isFinite(tnVal)) continue;
        const year = Math.floor(yyyymm / 100);
        const mAvg = (txVal + tnVal) / 2;
        const bucket = yearAgg.get(year);
        if (bucket) {
            bucket.sum += mAvg;
            bucket.count += 1;
        } else {
            yearAgg.set(year, { sum: mAvg, count: 1 });
        }
    }

    const yearAverages = Array
        .from(yearAgg.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([year, { sum, count }]) => ({ year, averageTemp: sum / count }));
    
    
    const hottestYear = yearAverages.reduce((a, b) => a.averageTemp > b.averageTemp ? a : b);
    const coldestYear = yearAverages.reduce((a, b) => a.averageTemp < b.averageTemp ? a : b);

    console.log(hottestYear, coldestYear);

    return `${hottestYear.year} ${hottestYear.averageTemp > 0 ? "+" : ""}${hottestYear.averageTemp.toFixed(2)}°C \n${coldestYear.year} ${coldestYear.averageTemp > 0 ? "+" : ""}${coldestYear.averageTemp.toFixed(2)}°C`;

}
getData("AULNOIS-SS-LAON").then(data => console.log(data));

function displayHottestYear(data, elementIdYear, elementIdTemp) {
    getData(data).then(hottestYear => {
        document.getElementById(elementIdYear).textContent = hottestYear.split(" ")[0];
        document.getElementById(elementIdTemp).textContent = `${hottestYear.split(" ")[1]}`;
    });
}

function displayColdestYear(data, elementIdYear, elementIdTemp) {
    getData(data).then(coldestYear => {
        document.getElementById(elementIdYear).textContent = coldestYear.split(" ")[2];
        document.getElementById(elementIdTemp).textContent = `${coldestYear.split(" ")[3]}`;
    });
}
displayColdestYear("AULNOIS-SS-LAON", "coldest-year_aulnois-ss-laon", "coldest-temp_aulnois-ss-laon");
displayHottestYear("AULNOIS-SS-LAON", "hottest-year_aulnois-ss-laon", "hottest-temp_aulnois-ss-laon");