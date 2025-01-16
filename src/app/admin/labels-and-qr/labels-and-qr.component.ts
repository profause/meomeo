import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Section } from 'src/app/shared/models/section.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-labels-and-qr',
  templateUrl: './labels-and-qr.component.html',
  styleUrls: ['./labels-and-qr.component.scss'],
})
export class LabelsAndQrComponent implements OnInit, OnDestroy {
  sectionFormControl: FormControl;
  public isLoading = false;
  private unSubscriptioNotifier = new Subject();
  public sectionList = new Array<Section>();
  public sectionList$: Observable<Section[]> = new Observable<Section[]>();
  public sectionListBehaviour: BehaviorSubject<Section[]>;

  public labelList = new Array<any>();
  public labelList$: Observable<any[]> = new Observable<any[]>();
  public labelListBehaviour: BehaviorSubject<any[]>;
  public user: User = {};

  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private firebaseAuth: AngularFireAuth,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.sectionFormControl = new FormControl('', Validators.nullValidator);

    this.sectionListBehaviour = new BehaviorSubject([]);
    this.sectionList$ = this.sectionListBehaviour.asObservable();

    this.labelListBehaviour = new BehaviorSubject([]);
    this.labelList$ = this.labelListBehaviour.asObservable();

    this.user = this.localAuth.getUser();
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

  public generateQrCode(section: Section) {
    this.labelList = new Array<any>();
    this.isLoading = true;
    const alphabets = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 
      'H', 'I', 'J', 'K', 'L', 'M', 'N', 
      'O', 'P', 'Q', 'R', 'S', 'T', 'U', 
      'V', 'W', 'X', 'Y', 'Z'
    ];
    for (let index = 0; index < section.numberOfTables; index++) {
      if (section.tableNamePattern == 'NUMERIC') {
        let label = `${section.tableNamePrefix} ${index + 1} ${section.tableNameSuffix}`;
        let urlPattern = `http://localhost:4200/menu/${section.accountId}/${section.name}?table=${index + 1}`;
        const logo = this.user.account?.logo;
        let data = {
          urlPattern: urlPattern,
          label: label,
          logo:logo
        };
        this.labelList.push(data);
      }else if (section.tableNamePattern == 'ALPHANUMERIC') {
        let label = `${section.tableNamePrefix} ${alphabets[index]} ${section.tableNameSuffix}`;
        let urlPattern = `http://localhost:4200/menu/${section.accountId}/${section.name}?table=${alphabets[index]}`;
        const logo = this.user.account?.logo;
        let data = {
          urlPattern: urlPattern,
          label: label,
          logo:logo
        };
        this.labelList.push(data);
      }
    }

    this.labelListBehaviour.next(this.labelList);
    this.isLoading = false;
    console.log(section);
  }

  onChangeURL(url: SafeUrl,index:number) {
    let data = this.labelList[index];
    data['qrCodeDownloadLink'] = url;
    this.labelList[index] = data
  }

  preview(section) {}

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
