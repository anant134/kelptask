import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataserviceService } from '../dataservice.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DataserviceService, BsModalService],
})
export class DashboardComponent implements OnInit {
  isProcessing: boolean = false;
  searchhis: any = [];
  showDtl: boolean = false;
  formtc = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  searchResult: any;
  message: any;
  modalRef: BsModalRef | undefined;
  modelpopuptitle: any;
  viewinfo: any;
  constructor(
    private dataserviceService: DataserviceService,
    private modalService: BsModalService
  ) {}
  onSubmit() {
    var searchInfoArr: any = [];
    var sessiondata = sessionStorage.getItem('searchHistory');
    this.showDtl = false;
    //this.dataserviceService.getHttp();
    if (this.formtc.invalid) {
      return;
    } else {
      this.searchResult = {};
      var searchKey = this.formtc.get('search')?.value?.split(' ').join('');
      var searchdata = '/users/' + searchKey;
      this.dataserviceService.getHttp(searchdata, {}).subscribe(
        (res: any) => {
          if (res) {
            this.message = '';
            this.searchResult = res;
            var searchinfo = {
              info: res,
              isSuccess: true,
              key: searchKey,
              searchOn: moment().format('DD/MM/YYYY hh:mm:ss a'),
            };
            this.showDtl = true;

            if (sessiondata == null) {
              searchInfoArr.push(searchinfo);
              sessionStorage.setItem(
                'searchHistory',
                JSON.stringify(searchInfoArr)
              );
            } else {
              searchInfoArr = JSON.parse(sessiondata);
              searchInfoArr.push(searchinfo);
              sessionStorage.setItem(
                'searchHistory',
                JSON.stringify(searchInfoArr)
              );
            }
          }
        },
        (error: any) => {
          //let data1 = error;
          this.message =
            error?.error?.message == 'Not Found'
              ? 'User not found'
              : error?.message;
          var searchinfo = {
            info: error,
            isSuccess: false,
            key: searchKey,
            searchOn: moment().format('DD/MM/YYYY hh:mm:ss a'),
          };
          if (sessiondata == null) {
            searchInfoArr.push(searchinfo);
            sessionStorage.setItem(
              'searchHistory',
              JSON.stringify(searchInfoArr)
            );
          } else {
            searchInfoArr = JSON.parse(sessiondata);
            searchInfoArr.push(searchinfo);
            sessionStorage.setItem(
              'searchHistory',
              JSON.stringify(searchInfoArr)
            );
          }
        }
      );
    }
  }
  clear() {
    this.searchResult = null;
    this.showDtl = false;
    this.formtc.reset();
  }
  onChange($event: any) {
    debugger;
    if ($event?.index == 1) {
      var tempsessiondata = sessionStorage.getItem('searchHistory');
      this.searchhis =
        tempsessiondata == null ? [] : JSON.parse(tempsessiondata);
      this.searchhis.reverse();
    }
  }
  get f() {
    return this.formtc.controls;
  }
  ngOnInit(): void {}
  clearHistory(data: any) {
    sessionStorage.clear();
    this.searchhis = [];
  }
  viewDetail(temp: any, info: any) {
    this.viewinfo = info;
    this.openModal(temp, {});
  }

  openModal(template: TemplateRef<any>, itemdata: any) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-xl',
      animated: true,
      backdrop: 'static',
    });
  }
}
