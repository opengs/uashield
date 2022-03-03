export class Random {
  static int (number: number):number {
    return Math.floor(Math.random() * number)
  }

  static bool ():boolean {
    return Math.random() < 0.5
  }
}
