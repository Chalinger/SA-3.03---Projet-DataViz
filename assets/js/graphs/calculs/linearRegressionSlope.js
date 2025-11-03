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
  // 1. Récupère les URLs
  const txUrl = jsonFiles[data].tx;
  const tnUrl = jsonFiles[data].tn;

  // 2. Fetch des données
  const txJson = await (await fetch(txUrl)).json();
  const tnJson = await (await fetch(tnUrl)).json();

  // 3. Aligner par mois et calculer la moyenne seulement quand les 2 existent
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

  const pairs = [];
  for (const [year, agg] of yearAgg) {
    pairs.push({ x: year, y: agg.sum / agg.count });
  }

  if (pairs.length < 2) {
    return NaN;
  }

  // 5. Calculs Σ
  const n = pairs.length;
  const sumX = pairs.reduce((acc, p) => acc + p.x, 0);
  const sumY = pairs.reduce((acc, p) => acc + p.y, 0);
  const sumXY = pairs.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = pairs.reduce((acc, p) => acc + p.x * p.x, 0);

  // 6. Calcul de la pente b
  const denom = n * sumX2 - sumX * sumX;
  const b = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : NaN;

  // 8. Retourne la pente
  return b.toFixed(3);
}
getData("AULNOIS-SS-LAON").then(data => console.log(`pente de régression linéaire à Aulnois-SS-Laon (depuis 1961): ${data}`));

function displayLinearRegressionSlope(data, elementId) {
    getData(data).then(slope => {
        document.getElementById(elementId).textContent = `${slope > 0 ? "+" : ""}${slope}°C/année`;
    });
}
displayLinearRegressionSlope("AULNOIS-SS-LAON", "average-evolution_aulnois-ss-laon");

// SOURCE: https://fr.wikipedia.org/wiki/R%C3%A9gression_lin%C3%A9aire 
