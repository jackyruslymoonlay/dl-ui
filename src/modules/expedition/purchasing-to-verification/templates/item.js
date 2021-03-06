import { bindable } from 'aurelia-framework';
import moment from 'moment';
import numeral from 'numeral';
const UnitPaymentOrderLoader = require('../../../../loader/unit-payment-order-loader');

export class Item {
    @bindable unitPaymentOrder;

    constructor() {
        this.queryUPO = { position: 1 }; // PURCHASING_DIVISION
        this.selectUPO = [
            'invoceNo', 'division.code', 'division.name',
            'supplier.code', 'supplier.name',
            'currency.code', 'no', 'date', 'dueDate',
            'items.unitReceiptNote.date',
            'items.unitReceiptNote.items.product.name',
            'items.unitReceiptNote.items.deliveredQuantity',
            'items.unitReceiptNote.items.deliveredUom.unit',
            'items.unitReceiptNote.items.pricePerDealUnit',
            'items.unitReceiptNote.items.purchaseOrder.purchaseOrderExternal.no',
        ];

        this.columns = ['Nama Barang', 'Jumlah', 'UOM', 'Harga'];
    }

    activate(context) {
        this.data = context.data;
        this.error = context.error;
        this.isShowing = false;

        if (this.data.no)
            this.unitPaymentOrder = { no: this.data.no };
    }

    unitPaymentOrderChanged(newV, oldV) {
        if (newV) {
            let details = [], totalPaid = 0;
            for (let item of newV.items) {
                for (let detail of item.unitReceiptNote.items) {
                    details.push({
                        productName: detail.product.name,
                        quantity: detail.deliveredQuantity,
                        uom: detail.deliveredUom.unit,
                        price: numeral(detail.pricePerDealUnit * detail.deliveredQuantity).format('0,000.00'),
                    });

                    totalPaid += detail.pricePerDealUnit * detail.deliveredQuantity;
                }
            }

            Object.assign(this.data, {
                no: newV.no,
                date: newV.date,
                dueDate: newV.dueDate,
                invoceNo: newV.invoceNo,
                supplierCode: newV.supplier.code,
                supplierName: newV.supplier.name,
                divisionCode: newV.division.code,
                divisionName: newV.division.name,
                totalPaid: numeral(totalPaid).format('0,000.00'),
                currency: newV.currency.code,
                details: details,
            });
        }
        else {
            Object.assign(this.data, {
                no: undefined,
                date: undefined,
                dueDate: undefined,
                invoceNo: undefined,
                supplierCode: undefined,
                supplierName: undefined,
                divisionCode: undefined,
                divisionName: undefined,
                totalPaid: undefined,
                currency: undefined,
                details: [],
            });
        }
    }

    toggle() {
        this.isShowing = !this.isShowing;
    }

    onRemove() {
        this.bind();
    }

    get unitPaymentOrderLoader() {
        return UnitPaymentOrderLoader;
    }
}
