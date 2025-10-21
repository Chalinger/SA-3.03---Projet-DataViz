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

        const txFirstValue = txJson[0].VALEUR;
        const tnFirstValue = tnJson[0].VALEUR;

        const txLastValue = txJson[txJson.length - 1].VALEUR;
        const tnLastValue = tnJson[tnJson.length - 1].VALEUR;

        const txDifference = txLastValue - txFirstValue;
        const tnDifference = tnLastValue - tnFirstValue;
        const averageDifference = (txDifference + tnDifference) / 2;

        return averageDifference;
    }
    getData("AULNOIS-SS-LAON").then(data => console.log(`difference moyenne à Cavillaragues (depuis 1961): ${data > 0 ? "+" : ""}${data}°C`));
