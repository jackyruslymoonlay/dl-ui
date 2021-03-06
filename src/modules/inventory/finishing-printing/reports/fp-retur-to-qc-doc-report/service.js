import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../../../utils/rest-service';

const serviceUri = "inventory/reports/fp-retur-to-qc-docs";

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "inventory");
    }

    search(info) {
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    generateExcel(info) {
        var endpoint = this._getEndPoint(info);
        return super.getXls(endpoint);
    }

    _getEndPoint(info) {
        var endpoint = `${serviceUri}`;
        var query = '';

        if (info.returNo) {
            query = (query === '') ? `returNo=${info.returNo}` : `${query}&returNo=${info.returNo}`;
        }

        if (info.destination) {
            query = (query === '') ? `destination=${info.destination}` : `${query}&destination=${info.destination}`;
        }

        if (info.deliveryOrderNo) {
            query = (query === '') ? `deliveryOrderNo=${info.deliveryOrderNo}` : `${query}&deliveryOrderNo=${info.deliveryOrderNo}`;
        }

        if (info.productionOrderNo) {
            query = (query === '') ? `productionOrderNo=${info.productionOrderNo}` : `${query}&productionOrderNo=${info.productionOrderNo}`;
        }

        if (info.dateFrom)
            query = `${query}&dateFrom=${info.dateFrom}`;

        if (info.dateTo)
            query = `${query}&dateTo=${info.dateTo}`;

        if (query !== '') {
            endpoint = `${serviceUri}?${query}`;
        }

        return endpoint;
    }
}