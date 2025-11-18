import { Category, PurchaseType, Transaction } from "../models/transaction.js";
import { parseDate } from "./util.js";

export class BaseParser {
  constructor(options = {}) {
    this.logger = options.logger || console;
    this.parseDate = options.parseDate || parseDate;
  }

  parse(results) {
    const rows = results?.data || [];
    this.transactionList = [];
    rows.forEach((row, idx) => {
      const normalized = this.normalizeRow(row, idx);
      if (!normalized || this.shouldSkip(normalized)) return;
      const txn = this.createTransaction(normalized);
      if (txn) this.transactionList.push(txn);
    });
    return this.transactionList;
  }

  normalizeRow(row /*, idx */) {
    return row;
  }
  shouldSkip(normalized) {
    // skip falsy rows
    return !normalized ? true : false;
  }
  parseAmount(normalized) {
    return 0;
  }
  specialCaseCategorize(normalized) {
    //TODO: implement more advanced SHARED categorization logic here
    console.warn(
      "Special case categorization needed for description:",
      normalized.description
    );
    return;
  }
  mapCategory(/* normalized */) {
    return null;
  }
  createTransaction(normalized) {
    // expects Transaction and enums to be imported in subclass file
    return new Transaction(
      crypto.randomUUID(),
      this.parseDate(normalized.date),
      this.parseAmount(normalized.amount),
      normalized.purchaseType ?? PurchaseType.CREDIT,
      normalized.description ?? "",
      this.mapCategory(normalized) ?? Category.MISCCONSUMERISM,
      normalized.memo ?? "",
    );
  }
}
