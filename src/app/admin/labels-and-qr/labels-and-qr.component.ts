import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Section } from 'src/app/shared/models/section.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-labels-and-qr',
  templateUrl: './labels-and-qr.component.html',
  styleUrls: ['./labels-and-qr.component.scss']
})
export class LabelsAndQrComponent implements OnInit, OnDestroy{
  sectionFormControl: FormControl
  public isLoading = false;
  private unSubscriptioNotifier = new Subject();
  public sectionList = new Array<Section>();
  public sectionList$: Observable<Section[]> = new Observable<Section[]>();
  public sectionListBehaviour: BehaviorSubject<Section[]>;

  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private firebaseAuth: AngularFireAuth,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.sectionFormControl = new FormControl('',Validators.nullValidator)

    this.sectionListBehaviour = new BehaviorSubject([]);
    this.sectionList$ = this.sectionListBehaviour.asObservable();
  }

  ngOnInit(): void {
      this.getSections();
  }

  getSections() {
    this.isLoading = true;
    this.backend
      .getSections()
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          let sections = result.map((item) => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            } as Section;
          });

          this.sectionList = sections;
          this.sectionListBehaviour.next(sections);
        },
      });
  }

  public generateQrCode(section:Section){

  }

  preview(section){}

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
