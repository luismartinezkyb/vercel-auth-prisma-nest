export interface IFiterDataDatabase {
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
  where?: {
    [key: string]: any;
  };
  skip?: number;
  take?: number;
}
