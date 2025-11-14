export const PurchaseType = {
  CREDIT: 1,
  DEBIT: 2,
};

export const Category = {
  HOUSING: 1,
  FOOD: 2,
  TRANSPORTATION: 3,
  UTILITIES: 4,
  MEDICAL: 5,
  INSURANCE: 6,
  DINING: 7,
  VACATION: 8,
  EVENTS: 9,
  EMERGENCY_FUND: 10,
  INVESTMENTS: 11,
  MERCHENDISE: 12,
  MISCCONSUMERISM: 13,
  CREDIT
}

export class Transaction {
  constructor(id, date, amount, purchaseType, description = "", category = MISCCONSUMERISM, memo = "") {
    this.id = id;
    this.date = date;
    this.amount = amount;
    this.purchaseType = purchaseType;
    this.description = description;
    this.category = category;
    this.memo = memo;
  }
}

