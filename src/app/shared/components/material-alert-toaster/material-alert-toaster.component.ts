import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertService, AlertType } from '../../services/alert.service';

@Component({
  selector: 'material-alert-toaster',
  templateUrl: './material-alert-toaster.component.html',
  styleUrls: ['./material-alert-toaster.component.scss']
})
export class MaterialAlertToasterComponent implements OnInit, AfterViewInit {

  public showAlert: boolean = false;
  public message: string = ''
  public alertType: AlertType;
  public iconUrl = ''
  constructor(public alertService: AlertService) {
    this.alertService.show.subscribe(data => {
      this.showAlert = data.showAlert
      this.message = data.message
      this.alertType = data.alertType

      switch (data.alertType) {
        case AlertType.success:
          this.iconUrl = 'assets/icons/success-icon.png'
          break
        case AlertType.error:
          this.iconUrl = 'assets/icons/error-icon.png'
          break
        case AlertType.info:
          this.iconUrl = 'assets/icons/info-icon.png'
          break
      }
    })
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

  }

}
