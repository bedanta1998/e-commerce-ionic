import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Cart } from '../cart/cart';

import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetails {

  product: any;
  WooCommerce: any;
  reviews: any[]= [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController) {
  
   this.product = this.navParams.get("product");
   console.log(this.product);
   this.WooCommerce = WC({
    url:"http://cloudsnails.online/test",
    consumerKey: "ck_9fff3a318b6d57336840f06d2faa63234350ad0a",
    consumerSecret: "cs_601ddc6d302b4d86a5e1d05f2478906473e89f5c"
  });

  this.WooCommerce.getAsync('products/'+this.product.id + '/reviews').then((data)=>{

     this.reviews = JSON.parse(data.body).product_reviews;
     console.log(this.reviews);

  }, (err)=>{
    console.log(err);
  })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product){

    this.storage.get("cart").then((data)=>{
     
      if(data ==null || data.length ==0 ){
         
        data = [];
        data.push({
          "product": product,
          "qty":1,
          "amount": parseFloat(product.price)
        });

      } else {

        let added = 0;
        for(let i=0; i<data.length; i++) {
          if(product.id == data[i].product.id){

            console.log("Product is already in the cart");

            let qty = data[i].qty;
            data[i].qty=qty+1;
            data[i].amount =parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }
        }

        if(added ==0){
          data.push({
            "product": product,
            "qty":1,
            "amount": parseFloat(product.price)
          });
        }
      }

    
      this.storage.set("cart",data).then( ()=> {
   
        console.log("Cart Updated");
        console.log(data);

        this.toastCtrl.create({
          message: "Cart Updated",
          duration: 3000
        }).present();
      })
    });

  }

  openCart(){
    this.modalCtrl.create(Cart).present();
  }
  
}
