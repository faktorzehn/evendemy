export class User {
  constructor(
    public username: string,
    public email?: string,
    public firstname?: string,
    public lastname?: string,
    public options?: {
      additional_info_visible: boolean,
      summary_of_meetings_visible: boolean
    }
  ) {  }
}
