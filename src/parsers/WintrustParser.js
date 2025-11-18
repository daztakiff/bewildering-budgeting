import { BaseParser } from "./BaseParser.js";
import { PurchaseType, Category } from "../models/transaction.js";

const TRANSACTIONDATE = 0;
const DESCRIPTION = 2;
const CATEGORY = 4;
const MEMO = 5;
const CREDIT = 6;
const DEBIT = 7;

export class WintrustDataParser extends BaseParser {
  constructor(ops) {
    super(ops);
    this.defaultPurchaseType = PurchaseType.DEBIT;
    this.defaultCategory = Category.MISCCONSUMERISM;
  }

  normalizeRow(row /*, idx */) {
    // if rows are arrays (like your current code), map indexes
    return {
      date: row[TRANSACTIONDATE],
      description: row[DESCRIPTION],
      category: row[CATEGORY],
      amount: row[DEBIT] ? row[DEBIT] : row[CREDIT],
      purchaseType: PurchaseType.DEBIT,
      memo: row[MEMO],
    };
  }
  shouldSkip(normalized) {
    if (normalized.category == "Totals:" || normalized.category == "Category") {
      console.log("Skipping header and totals row:");
      return true;
    }
    return super.shouldSkip(normalized);
  }
  parseAmount(amount) {
    return parseFloat(amount);
  }
  specialCaseCategorize(normalized) {
    super.specialCaseCategorize(normalized);
  }
  mapCategory(normalized) {
    switch (normalized.category) {
      case "Transfer/Credit Card Payment":
        return Category.CREDITCARDPAYMENT;
      case "Investments/Buy":
        return Category.INVESTMENTS;
      case "Income":
      case "Income/Paycheck":
        return Category.INCOME;
      case "Transfer":
        if (
          normalized.description.includes("ZELLE") ||
          normalized.description.includes("VENMO")
        ) {
          return Category.ZELLEVENMO;
        } else {
          return this.specialCaseCategorize(normalized);
        }
      default:
        console.warn("Unmapped category:", normalized.category);
        return Category.MISCCONSUMERISM;
    }
  }
}
