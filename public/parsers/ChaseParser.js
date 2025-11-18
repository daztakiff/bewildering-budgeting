import { BaseParser } from "./BaseParser.js";
import { PurchaseType, Category } from "../models/transaction.js";

const TRANSACTIONDATE = 0;
const DESCRIPTION = 2;
const CATEGORY = 3;
const TYPE = 4;
const AMOUNT = 5;
const MEMO = 6;

export class ChaseDataParser extends BaseParser {
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
      amount: row[AMOUNT],
      purchaseType: row[TYPE],
      memo: row[MEMO],
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
    if (normalized.purchaseType === "Payment") {
      return Category.CREDITCARDPAYMENT;
    }

    switch (normalized.category) {
      case "Groceries":
        return Category.FOOD;
      case "Food & Drink":
        return Category.DINING;
      case "":
        return this.specialCaseCategorize(normalized);
      default:
        console.warn("Unmapped category:", normalized.category);
        return Category.MISCCONSUMERISM;
    }
  }
}
