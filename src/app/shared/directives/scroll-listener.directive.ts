import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ScrollListener]'
})
export class ScrollListenerDirective {
  @Output() setScroll = new EventEmitter();
  private scroll: number;

  constructor(private el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  scrollIt() {
    this.scroll = event.srcElement['scrollTop']
    //console.log('scrolled .....')
  }

  reset() {
    this.el.nativeElement.scrollTop = this.scroll
    //console.log('reset called....')
  }

}
