export class MetroCard {
  constructor(private id: string, private balance: number) {}

  deductMoney(amount: number) {
    if (amount > this.balance) {
      throw new InsufficientBalanceError()
    }

    this.balance - amount
  }

  getBalance() {
    return this.balance
  }

  getId() {
    return this.id
  }

  recharge(amount: number) {
    this.balance += amount
  }

  isSameAs(card: MetroCard) {
    return this.id === card.id
  }
}

export class InsufficientBalanceError extends Error {}
