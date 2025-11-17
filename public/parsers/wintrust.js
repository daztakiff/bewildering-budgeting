import { Transaction } from "../models/transaction.js";
import { PurchaseType } from "../models/transaction.js";
import { Category } from "../models/transaction.js";

const TRANSACTIONDATE = 0;
const DESCRIPTION = 2;
const CATEGORY = 4;
const MEMO = 5;
const CREDIT = 6;
const DEBIT = 7;

export function parseWintrustData(wintrustJson) {
  const wintrustData = wintrustJson.data;

  const transactionList = [];
  wintrustData.forEach((wintrustTransaction) => {
    console.log(
      "Wintrust Transaction Category:",
      wintrustTransaction[CATEGORY]
    );

    if (wintrustTransaction[CATEGORY] == "Totals:" || wintrustTransaction[CATEGORY] == "Category") {
      console.log("Skipping row:");
      return
    }

    const currentTransaction = new Transaction(
      crypto.randomUUID(),
      wintrustTransaction[TRANSACTIONDATE],
      getWintrustAmount(
        wintrustTransaction[CREDIT],
        wintrustTransaction[DEBIT]
      ),
      PurchaseType.DEBIT,
      wintrustTransaction[DESCRIPTION],
      getCorrectCategory(
        wintrustTransaction[CATEGORY],
        wintrustTransaction[DESCRIPTION]
      ),
      wintrustTransaction[MEMO]
    );
    transactionList.push(currentTransaction);
    console.log("Processed Transaction:", currentTransaction);
  });
}

function getWintrustAmount(wintrustCredit, wintrustDebit) {
  if (parseFloat(wintrustCredit) != 0) {
    return parseFloat(wintrustCredit);
  } else {
    return -parseFloat(wintrustDebit);
  }
}

function getCorrectCategory(wintrustCategory, wintrustDescription) {
  switch (wintrustCategory) {
    case "Transfer/Credit Card Payment":
      return Category.CREDITCARDPAYMENT;
    case "Investments/Buy":
      return Category.INVESTMENTS;
    case "Income":
    case "Income/Paycheck":
      return Category.INCOME;
    case "Transfer":
      if (wintrustDescription.includes("ZELLE") || wintrustDescription.includes("VENMO")) {
        return Category.ZELLEVENMO;
      } else {
        console.warn("transfer category with unmapped description:", wintrustDescription);
        return Category.MISCCONSUMERISM;
      }
    default:
      console.warn("Unmapped category:", wintrustCategory);
      return Category.MISCCONSUMERISM;
  }
}
