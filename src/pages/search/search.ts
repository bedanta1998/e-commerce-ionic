import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class Search {

  searchQuery: string = "";
  WooCommerce: any; 
  products: any[] = [];
  page: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
     console.log(this.navParams.get("searchQuery"));
     this.searchQuery = this.navParams.get("searchQuery");

     this.WooCommerce = WC({
      url:"http://cloudsnails.online/test",
      consumerKey: "ck_9fff3a318b6d57336840f06d2faa63234350ad0a",
      consumerSecret: "cs_601ddc6d302b4d86a5e1d05f2478906473e89f5c"
    });

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery).then((searchData) => {
      this.products = JSON.parse(searchData.body).products;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Search');
  }

  loadMoreProducts(event){
    

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery + "&page=" + this.page).then((searchData) => {
      this.products = this.products.concat(JSON.parse(searchData.body).products);

       if(JSON.parse(searchData.body).products.length < 10){
         event.enable(false);

         this.toastCtrl.create({
          message: "No more products!",
          duration: 3000
        }).present();
       }

      event.complete();
       this.page ++;
    });
  }
}
