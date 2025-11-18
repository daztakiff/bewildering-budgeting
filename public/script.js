import { CapitalOneDataParser } from "./parsers/CapitalOneParser.js";
import { ChaseDataParser } from "./parsers/ChaseParser.js";
import { WintrustDataParser } from "./parsers/WintrustParser.js";

const Source = {
    CAPITALONE: "capitalone",
    CHASE: "chase",
    WINTRUST: "wintrust"
};

var selectedSource = Source.CAPITALONE;

document.getElementById("file-source").addEventListener("change", function(event) {
  selectedSource = event.target.value;
  console.log("Selected source:", selectedSource);
});

document.getElementById("upload-input").addEventListener("change", function(event) {
  console.log("File selected");  
  const file = event.target.files[0];
    if (file) {
        if (validateFileSize(file)) {
            // Proceed with file processing
            Papa.parse(file, {
              complete: function(results) {
                console.log("Parsed data:", results);
                displayTransactionInfo(results);
              },
              skipEmptyLines: true,
              skipFirstNLines: 1
            });
        } else {
            // Handle file size error
            event.target.value = ""; // Clear the input
        }
    }

  });

function displayTransactionInfo(results) {
  let transactionList;
  switch(selectedSource) {
    case Source.CAPITALONE:
      transactionList = new CapitalOneDataParser().parse(results);
      console.log("Parsed Transactions:", transactionList);
      document.getElementById("results-capital-one").textContent = JSON.stringify(transactionList, null, 2);
      break;
    case Source.CHASE:
      transactionList = new ChaseDataParser().parse(results);
      console.log("Parsed Transactions:", transactionList);
      document.getElementById("results-chase").textContent = JSON.stringify(transactionList, null, 2);
      break;
    case Source.WINTRUST:
      transactionList = new WintrustDataParser().parse(results);
      console.log("Parsed Transactions:", transactionList);
      document.getElementById("results-wintrust").textContent = JSON.stringify(transactionList, null, 2);
      break;
    default:
      transactionList = []
      console.error("Unknown source:", selectedSource);
  }
}

function validateFileSize(file) {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
        alert("File size exceeds 5MB limit.");
        return false;
    }
    return true;
}