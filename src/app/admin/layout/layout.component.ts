import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Section } from 'src/app/shared/models/section.interface';
import { User } from 'src/app/shared/models/user.interface';
import { AlertType } from 'src/app/shared/services/alert.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DialogButton } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  public sectionFormGroup: FormGroup;
  private unSubscriptioNotifier = new Subject();
  public loginFormToggle = false;
  public isLoading = false;
  isEdit = false;
  user: User = {};

  public sectionList = new Array<Section>();
  public sectionList$: Observable<Section[]> = new Observable<User[]>();
  public sectionListBehaviour: BehaviorSubject<Section[]>;

  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private firebaseAuth: AngularFireAuth,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.user = this.localAuth.getUser();
    this.sectionFormGroup = new FormGroup({
      id: new FormControl(Utils.generateUUID(), Validators.nullValidator),
      accountId: new FormControl(
        this.user.account.id,
        Validators.nullValidator
      ),
      createdBy: new FormControl(this.user.id, Validators.nullValidator),
      name: new FormControl('', Validators.required),
      numberOfTables: new FormControl(0, Validators.required),
      tableNamePrefix: new FormControl('', Validators.nullValidator),
      tableNameSuffix: new FormControl('', Validators.nullValidator),
      tableNamePattern: new FormControl('NUMERIC', Validators.required),
    });

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
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          let sections = result.map((item) => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            } as User;
          });

          this.sectionList = sections;
          this.sectionListBehaviour.next(sections);
        },
      });
  }

  public save() {
    this.isLoading = true;
    let formData = this.sectionFormGroup.value;
    //console.log(formData)
    this.backend
      .createSection(formData)
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.isLoading = false;
            this.appMaterialComponent.showAlertToaster(
              AlertType.success,
              `Welcome ${this.user.fullname}`,
              5
            );
            this.sectionFormGroup.reset();
            this.isEdit = false;
          }, 500);
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
          this.isEdit = false;
        },
        complete:()=>{
          this.getSections();
        }
      });
  }

  public onEditSection(section:Section){
    this.isEdit = true;
    this.sectionFormGroup.patchValue({
      id: section.id,
      accountId: section.accountId,
      createdBy: section.createdBy,
      name: section.name,
      numberOfTables: section.numberOfTables,
      tableNamePrefix: section.tableNamePrefix,
      tableNameSuffix: section.tableNameSuffix,
      tableNamePattern: section.tableNamePattern,
    })
  }

  public onDeleteSection(section:Section){
    this.appMaterialComponent
    .openDialog(ConfirmDialogComponent, {
      title: 'Confirm',
      message: `Are you sure you want to delete this sale?`,
    })
    .pipe(
      takeUntil(this.unSubscriptioNotifier),
      switchMap((result) => {
        if (result['button'] == DialogButton.ok) {
          this.appMaterialComponent.showProgressDialog(
            'Deleting section. Please wait a while.'
          );
          return this.backend.deleteSection(section.id);
        }
        return of(null);
      })
    )
    .subscribe({
      next: (result) => {
        this.appMaterialComponent.hideProgressDialog();
        this.appMaterialComponent.showAlertToaster(
          AlertType.success,
          `Section has been deleted.`,
          5
        );
        this.getSections();
      },
      error: (error) => {
        this.appMaterialComponent.hideProgressDialog();
        console.log(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
