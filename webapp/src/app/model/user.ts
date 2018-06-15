export class User {
  constructor(
    public username: string,
    public email?: string,
    public firstname?: string,
    public lastname?: string,
    public options?: {
      additional_info_visible: boolean,
      summary_of_meetings_visible: boolean
    },
    public additional_info?: {
      job_title: string,
      description: string,
      instagram_username: string,
      facebook_username: string,
      twitter_username: string,
      birthday: Date
    }
  ) {  }
}

