export class NumberUtils {

  private constructor() {
  }

  public static formatNumber(n: number, fractionDigits: number): string {
    return `${this.isDataProvided(n) ? Number(n).toFixed(fractionDigits) : 'N/A'}`;
  }

  public static countAverage(numbers: number[]): number {
    let sum: number = numbers.reduce((a, b) => a + b, 0);
    return sum / numbers.length;
  }

  private static isDataProvided(n: number): boolean {
    return n && n != null && n !== 0;
  }

}
