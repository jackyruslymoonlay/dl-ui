import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

export class DetailFooter {
  activate(context) {
    this.context = context;
    //this.error = context.items[0].error;
    //console.log(this.context);
  }

  get itemSum() {
    var qty = this.context.items
      .filter(item => !item.data.isCanceled) // for false and undefined
      .map((item) => item.data.quantity);
    return qty
      .reduce((prev, curr, index) => { return prev + curr }, 0);
  }

  // get error(){
  //   var error = this.context.items
  //     .map((item) => item.error.total);
  //   return error
  //     .reduce((prev, curr, index) => { return curr }, 0);
  // }

}
