import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Meeting } from '../../model/meeting';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '@ngx-config/core';

@Component({
  selector: 'evendemy-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {

  private _meetings = new BehaviorSubject<Meeting[]>([]);

  @Input()
  set meetings(value) {
    this._meetings.next(value);
  };

  get meetings(): Meeting[] {
    return this._meetings.getValue();
  }

  private randomizedNumber = Math.floor(Math.random() * 10000);
  private imageFolder = this.config.getSettings().meeting_image_folder;

  constructor(private config: ConfigService) { 
  }

  ngOnInit() {
  }

  getImage(mid: number) {
    if(!this.imageFolder){
      return;
    }
    return this.imageFolder + '/' + mid + '.jpg' + '?r=' + this.randomizedNumber;
  }

}
