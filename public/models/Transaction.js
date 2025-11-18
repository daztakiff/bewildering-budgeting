export const PurchaseType = {
  CREDIT: "credit",
  DEBIT: "debit",
};

export const Category = {
  HOUSING: "housing",
  FOOD: "food",
  TRANSPORTATION: "transportation",
  UTILITIES: "utilities",
  MEDICAL: "medical",
  INSURANCE: "insurance",
  DINING: "dining",
  VACATION: "vacation",
  EVENTS: "events",
  EMERGENCY_FUND: "emergency_fund",
  INVESTMENTS: "investments",
  MERCHENDISE: "merchendise",
  INCOME: "income",
  CREDITCARDPAYMENT: "creditcardpayment",
  MISCCONSUMERISM: "miscconsumerism",
  ZELLEVENMO: "zellevenmo",
};

export class Transaction {
  constructor(id, date, amount, purchaseType, description = "", category = Category.MISCCONSUMERISM, memo = "") {
    this.id = id;
    this.date = date;
    this.amount = amount;
    this.purchaseType = purchaseType;
    this.description = description;
    this.category = category;
    this.memo = memo;
  }
}

