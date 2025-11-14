import { Transaction } from "../models/transaction.js";
import { PurchaseType } from "../models/transaction.js";
import { Category } from "../models/transaction.js";


const TRANSACTIONDATE = 0;
const DESCRIPTION = 3;
const CATEGORY = 4;
const DEBIT = 5;
const CREDIT = 6;

export function parseCapitalOneData(capitalOneJson) {
  
  const capitalOneData = capitalOneJson.data;

  const transactionList = [];
  capitalOneData.forEach(capOneTransaction => { 
    
    const currentTransaction = new Transaction(
      crypto.randomUUID(),
      capOneTransaction[TRANSACTIONDATE],
      capOneTransaction[DEBIT] ? parseFloat(capOneTransaction[DEBIT]) : parseFloat(capOneTransaction[CREDIT]),
      PurchaseType.CREDIT,
      capOneTransaction[DESCRIPTION],
      getCorrectCategory(capOneTransaction[CATEGORY], capOneTransaction[DESCRIPTION]),
      ""
    );
    transactionList.push(currentTransaction);
    console.log("Processed Transaction:", currentTransaction);
  });
}


function getCorrectCategory(capOneCategory, capOneDescription="") {
  switch(capOneCategory) {
    case "Grocery":
      return Category.FOOD;
    case "Dining":
      return Category.DINING;
    case "Other Travel":
      return Category.TRANSPORTATION;
    case "Health":
    case "Health Care":
      return Category.MEDICAL;
    case "Insurance":
      return Category.INSURANCE;
    case "Merchandise":
    case "Gas/Automotive":
    case "Other Services":
    case "Other":
      return specialCaseCategorize(capOneCategory, capOneDescription);
    case "Payment/Credit":
      return Category.CREDITCARDPAYMENT;
    default:
      console.warn("Unmapped category:", capOneCategory);
      return Category.MISCCONSUMERISM;
  }
}

function specialCaseCategorize(capOneDescription) {
  //TODO: implement more advanced categorization logic here
  return Category.MISCCONSUMERISM;
}