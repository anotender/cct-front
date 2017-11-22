export class StringUtils {

  private constructor() {
  }

  static isEmpty(s: string): boolean {
    return !s || s.trim().length === 0;
  }

  static isNotEmpty(s: string): boolean {
    return !this.isEmpty(s);
  }

  static contains(str: string, substr: string): boolean {
    return str.includes(substr);
  }

  static containsIgnoreCase(str: string, substr: string): boolean {
    return this.contains(str.toLowerCase(), substr.toLowerCase());
  }

}
