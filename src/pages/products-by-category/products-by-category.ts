import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import {ProductDetails} from '../product-details/product-details';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategory {

  WooCommerce:any;
  products:any[];
  page:number;
  category:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

     this.page = 1;
     this.category = this.navParams.get("category");
    this.WooCommerce = WC({
      url:"http://cloudsnails.online/test",
      consumerKey: "ck_9fff3a318b6d57336840f06d2faa63234350ad0a",
      consumerSecret: "cs_601ddc6d302b4d86a5e1d05f2478906473e89f5c"
    });


    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then( (data) =>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    },(err) => {
     console.log(err)
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategory');
  }


     loadMoreProducts(event) {
       this.page++;
       console.log("Getting page" + this.page);
       this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug +"&page" +this.page).then((data) =>{
         let temp = (JSON.parse(data.body).products);
         
         this.products = this.products.concat(JSON.parse(data.body).products)
         console.log(this.products);
         event.complete();

         if (temp.length < 10)
         event.enable(false);
       })


       }

       openProductPage(product){
        this.navCtrl.push(ProductDetails, {"product": product});
      }
     

}
