import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Directive({
    selector: '[ngInit]',
    exportAs: '[ngInit]'
  }) 
  export class NgInitDirective implements OnInit {

  @Output()
  appMyInit: EventEmitter<any> = new EventEmitter();
  
    //@Input() ngInit;
    // ngOnInit(): void {
    //   if(this.ngInit) { this.ngInit(); }
    // } 
    
    ngOnInit(): void {
      console.log('NgInitDirective called')
    }

  }