import { BaseParser } from "./BaseParser.js";
import { PurchaseType, Category } from "../models/transaction.js";

const TRANSACTIONDATE = 0;
const DESCRIPTION = 3;
const CATEGORY = 4;
const DEBIT = 5;
const CREDIT = 6;

export class CapitalOneDataParser extends BaseParser {
  constructor(ops) {
    super(ops);
    this.defaultPurchaseType = PurchaseType.CREDIT;
    this.defaultCategory = Category.MISCCONSUMERISM;
  }

  normalizeRow(row /*, idx */) {
    // if rows are arrays (like your current code), map indexes
    return {
      date: row[TRANSACTIONDATE],
      description: row[DESCRIPTION],
      category: row[CATEGORY],
      amount: row[DEBIT] ? row[DEBIT] : row[CREDIT],
      purchaseType: row[DEBIT] ? PurchaseType.CREDIT : PurchaseType.DEBIT,
      memo: null,
    };
  }
  shouldSkip(normalized) {
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
        return this.specialCaseCategorize(normalized);
      case "Payment/Credit":
        return Category.CREDITCARDPAYMENT;
      default:
        console.warn("Unmapped category:", normalized.category);
        return Category.MISCCONSUMERISM;
    }
  }
}
