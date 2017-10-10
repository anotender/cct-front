export class Rating {
  id: number;
  points: number;
  comment: string = '';
  date: Date = new Date();
  versionId: string = '';
  userId: number;
}
