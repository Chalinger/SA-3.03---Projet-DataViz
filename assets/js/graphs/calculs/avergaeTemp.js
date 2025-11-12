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

    async function getData(data) {
        const txUrl = jsonFiles[data].tx;
        const tnUrl = jsonFiles[data].tn;

        const txData = await fetch(txUrl);
        const tnData = await fetch(tnUrl);

        const txJson = await txData.json();
        const tnJson = await tnData.json();

        const tnValues = tnJson.map(entry => entry.VALEUR);
        const txValues = txJson.map(entry => entry.VALEUR);

        const averageTemp = (tnValues.reduce((a, b) => a + b, 0) + txValues.reduce((a, b) => a + b, 0)) / (tnValues.length + txValues.length);

        return averageTemp.toFixed(2);
    }
    getData("AULNOIS-SS-LAON").then(data => console.log(`Température moyenne à Aulnois sous Laon (depuis 1961): ${data > 0 ? "+" : ""}${data}°C`));
    // getData("BELLE-ILE").then(data => console.log(`Température moyenne à Belle-ile (depuis 1961): ${data > 0 ? "+" : ""}${data}°C`));
    // getData("CAVILLARGUES").then(data => console.log(`Température moyenne à Cavillargues (depuis 1961): ${data > 0 ? "+" : ""}${data}°C`));
    // getData("PARIS-MTSOURIS").then(data => console.log(`Température moyenne à Paris-Mtsouris (depuis 1961): ${data > 0 ? "+" : ""}${data}°C`));
    // getData("VILLAR-ST-PANCRACE").then(data => console.log(`Température moyenne à Vellar-St-Pancrace (depuis 1961): ${data > 0 ? "+" : ""}${data}°C`));


    function displayAverageTemp(data, elementId) {
        document.getElementById(elementId).textContent = `${data > 0 ? "+" : ""}${data}°C`;
    }
    getData("AULNOIS-SS-LAON").then(data => displayAverageTemp(data, "average-temp"));

    const select = document.getElementById("location-select");
    select.addEventListener("change", function() {
        const selectedLocation = select.value;
        getData(selectedLocation).then(data => displayAverageTemp(data, "average-temp"));
    })