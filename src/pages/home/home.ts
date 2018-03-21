import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController, Searchbar } from 'ionic-angular';
import { ProductDetails } from '../product-details/product-details';

import * as WC from 'woocommerce-api';
import { DEPRECATED_PLURAL_FN } from '@angular/common/src/i18n/localization';
import { Search } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;
  searchQuery: string = "";

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {
  

    this.page = 2;

    this.WooCommerce = WC({
      url:"http://cloudsnails.online/test",
      consumerKey: "ck_9fff3a318b6d57336840f06d2faa63234350ad0a",
      consumerSecret: "cs_601ddc6d302b4d86a5e1d05f2478906473e89f5c"
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) =>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    },(err) => {
     console.log(err)
    })

  }
  
    ionViewDidLoad(){
      setInterval(()=> {

        if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
        this.productSlides.slideTo(0);

       this.productSlides.slideNext();
      },3000)
    }

   loadMoreProducts(event){

    if(event == null)
     {
       this.page = 2;
       this.moreProducts = [];
     }
     else
     this.page ++;

    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if(event !=null)
      {
        event.complete();
      }


      if(JSON.parse(data.body).products.length <10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 3000
        }).present();
      }


    }, (err) => {
     console.log(err)
    })

   }

   openProductPage(product){
     this.navCtrl.push(ProductDetails, {"product": product});
   }


   onSearch(event){
     if(this.searchQuery.length > 0) {
       this.navCtrl.push(Search, {"searchQuery": this.searchQuery});
     }
   }

}
