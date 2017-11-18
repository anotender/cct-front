export class DateUtils {

  private constructor() {
  }

  public static formatDate(millis: number): string {
    return new Date(millis).toLocaleDateString();
  }

}
