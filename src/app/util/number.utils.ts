export class NumberUtils {

  private constructor() {
  }

  public static formatNumber(n: number, fractionDigits: number): string {
    return `${this.isDataProvided(n) ? Number(n).toFixed(fractionDigits) : 'N/A'}`;
  }

  public static countSum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
  }

  public static countAverage(numbers: number[]): number {
    return NumberUtils.countSum(numbers) / numbers.length;
  }

  private static isDataProvided(n: number): boolean {
    return n && n != null && n !== 0;
  }

}
