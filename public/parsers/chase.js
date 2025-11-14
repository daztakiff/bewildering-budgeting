import { Transaction } from "../models/transaction.js";
import { PurchaseType } from "../models/transaction.js";
import { Category } from "../models/transaction.js";

const TRANSACTIONDATE = 0;
const DESCRIPTION = 2;
const CATEGORY = 3;
const TYPE = 4;
const AMOUNT = 5;
const MEMO = 6;

export function parseChaseData(chaseJson) {
  const chaseData = chaseJson.data;

  const transactionList = [];
  chaseData.forEach((chaseTransaction) => {
    console.log("Chase Transaction Category:", chaseTransaction[CATEGORY]);

    const currentTransaction = new Transaction(
      crypto.randomUUID(),
      chaseTransaction[TRANSACTIONDATE],
      parseFloat(chaseTransaction[AMOUNT]),
      (chaseTransaction[TYPE] = "Payment"
        ? PurchaseType.DEBIT
        : PurchaseType.CREDIT),
      chaseTransaction[DESCRIPTION],
      getCorrectCategory(
        chaseTransaction[CATEGORY],
        chaseTransaction[DESCRIPTION],
        chaseTransaction[TYPE]
      ),
      chaseTransaction[MEMO]
    );
    transactionList.push(currentTransaction);
    console.log("Processed Transaction:", currentTransaction);
  });
}

function getCorrectCategory(chaseCategory, chaseDescription, chaseType) {
  if (chaseType === "Payment") {
    return Category.CREDITCARDPAYMENT;
  }

  switch (chaseCategory) {
    case "Groceries":
      return Category.FOOD;
    case "Food & Drink":
      return Category.DINING;
    case "":
      return specialCaseCategorize(chaseDescription);
    default:
      console.warn("Unmapped category:", chaseCategory);
      return Category.MISCCONSUMERISM;
  }
}

function specialCaseCategorize(chaseDescription) {
  //TODO: implement more advanced categorization logic here
  return Category.MISCCONSUMERISM;
}
