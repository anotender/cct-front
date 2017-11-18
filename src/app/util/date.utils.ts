export class DateUtils {

  private constructor() {
  }

  public static getCurrentTimeInMillis(): number {
    return new Date().getTime();
  }

  public static formatDate(millis: number): string {
    return new Date(millis).toLocaleDateString();
  }

}
