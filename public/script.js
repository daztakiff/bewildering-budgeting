import { parseCapitalOneData } from "./parsers/capitalone.js";
import { parseChaseData } from "./parsers/chase.js";
import { parseWintrustData } from "./parsers/wintrust.js";

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
  switch(selectedSource) {
    case Source.CAPITALONE:
      document.getElementById("results-capital-one").textContent = JSON.stringify(results.data[0], null, 2);
      parseCapitalOneData(results)
      break;
    case Source.CHASE:
      document.getElementById("results-chase").textContent = JSON.stringify(results.data[0], null, 2);
      parseChaseData(results)
      break;
    case Source.WINTRUST:
      document.getElementById("results-wintrust").textContent = JSON.stringify(results.data, null, 2);
      parseWintrustData(results)
      break;
    default:
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