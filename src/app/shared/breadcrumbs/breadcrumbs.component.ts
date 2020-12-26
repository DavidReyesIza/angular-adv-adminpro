import { Component, OnDestroy} from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy  {

  public tituloSubs$: Subscription;

  public titulo: string;

  constructor(private router: Router, private route: ActivatedRoute) {


   this.tituloSubs$ = this.getArgumentosRuta().subscribe(data =>{
    console.log(data);
    this.titulo = data.titulo;
    document.title = `Admin Pro - ${data.titulo}`
  })
  
   }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

   getArgumentosRuta(){
    return this.router.events
    .pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data),
    )

   }

 
 

}
