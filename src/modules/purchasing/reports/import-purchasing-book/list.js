import { inject, computedFrom } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

var UnitReceiptNoteLoader = require('../../../../loader/unit-receipt-note-basic-loader');
var UnitLoader = require('../../../../loader/unit-loader');
var CategoryLoader = require('../../../../loader/category-loader');

@inject(Router, Service)
export class List {
  constructor(router, service) {
    this.service = service;
    this.router = router;
  }

  controlOptions = {
    label: {
      length: 4
    },
    control: {
      length: 5
    }
  }

  bind() {
    this.reset();
  }

  get unitReceiptNoteLoader() {
    return UnitReceiptNoteLoader;
  }
  get unitLoader() {
    return UnitLoader;
  }
  unitView = (unit) => {
    return `${unit.code} - ${unit.name}`
  }
  get categoryLoader() {
    return CategoryLoader;
  }
  categoryView = (category) => {
    return `${category.code} - ${category.name}`
  }

  searching() {
    if (false) {
      alert("");
    }
    else {
      var filter = {
        no: this.unitReceiptNote ? this.unitReceiptNote.no : "",
        category: this.category ? this.category.code : "",
        unit: this.unit ? this.unit.code : "",
        dateFrom: moment(this.dateFrom).format("DD MMM YYYY HH:mm"),
        dateTo: moment(this.dateTo).format("DD MMM YYYY HH:mm"),
      }
      this.service.search(filter)
        .then(result => {
          var dataByCategory = {};
          var subTotalCategory = {};
          for (var data of result) {
            for (var item of data.items) {
              var Category = item.purchaseOrder.category.name;
              if (!dataByCategory[Category]) dataByCategory[Category] = [];
              dataByCategory[Category].push({
                Date: moment(data.date).format("DD MMM YYYY"),
                No: data.no,
                Product: item.product.name,
                Category: item.purchaseOrder.category.name,
                Unit: data.unit.name,
                PIB: data.pibNo || "-",
                Nilai: Math.round(item.pricePerDealUnit * item.deliveredQuantity * 100) / 100,
                CurrencyRate: Math.round(item.currencyRate * 100) / 100,
                Total: Math.round(item.pricePerDealUnit * item.deliveredQuantity * item.currencyRate * 100) / 100,
              });

              if (!subTotalCategory[Category]) subTotalCategory[Category] = 0;
              subTotalCategory[Category] += Math.round(item.pricePerDealUnit * item.deliveredQuantity * item.currencyRate * 100) / 100;
            }
          }

          var categories = [];
          this.total = 0;
          for (var data in dataByCategory) {
            categories.push({
              data: dataByCategory[data],
              subTotal: subTotalCategory[data],
            });
            this.total += subTotalCategory[data];
          }
          this.categories = categories;

        });
    }
  }

  ExportToExcel() {
    if (false) {
      alert("");
    }
    else {
      var filter = {
        no: this.unitReceiptNote ? this.unitReceiptNote.no : "",
        category: this.category ? this.category.code : "",
        unit: this.unit ? this.unit.code : "",
        dateFrom: moment(this.dateFrom).format("DD MMM YYYY HH:mm"),
        dateTo: moment(this.dateTo).format("DD MMM YYYY HH:mm"),
      }
      this.service.generateExcel(filter)
        .catch(e => {
          alert(e.replace(e, "Error: ", ""));
        });
    }
  }

  reset() {
    this.unitReceiptNote = "";
    this.category = "";
    this.unit = "";
    this.dateFrom = new Date();
    this.dateTo = new Date();
  }
}
