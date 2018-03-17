import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from "../home/home";
import { Signup } from '../signup/signup';
import { Login } from '../login/login';
import * as WC from 'woocommerce-api';
import { ProductsByCategory } from '../products-by-category/products-by-category'
import { Storage } from "@ionic/storage";
import { Modal } from 'ionic-angular/components/modal/modal';
import { Cart } from '../cart/cart';



@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: any;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;
  loggedIn: boolean;
  user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
  this.homePage = HomePage
  this.categories =[];
  this.user = {};

  this.WooCommerce = WC({
    url:"http://cloudsnails.online/test",
    consumerKey: "ck_9fff3a318b6d57336840f06d2faa63234350ad0a",
    consumerSecret: "cs_601ddc6d302b4d86a5e1d05f2478906473e89f5c"
  });

this.WooCommerce.getAsync("products/categories").then((data) =>{
  console.log(JSON.parse(data.body).product_categories);

   let temp: any[] = JSON.parse(data.body).product_categories;
   for(let i = 0; i < temp.length; i ++){
     if(temp[i].parent ==0){

      if(temp[i].slug == "clothing"){
       temp[i].icon = "shirt";
      }
      if(temp[i].slug == "fashion"){
        temp[i].icon = "shirt";
      }
       if(temp[i].slug == "electrical"){
        temp[i].icon = "shirt";
      }
       
       this.categories.push(temp[i]); 
     }
   }

}, (err)=> {
  console.log(err)
})

  }

  ionViewDidEnter() {
    
    this.storage.ready().then ( () =>{
      this.storage.get("userLoginInfo").then( (userLoginInfo) => {

        if(userLoginInfo != null){

          console.log("User logged in..");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        }
        else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }
      })
    })


  }

  openCategoryPage(category){
  
    this.childNavCtrl.setRoot(ProductsByCategory, { "category": category});

  }

  openPage(pageName: string){
    if(pageName == "signup"){
      this.navCtrl.push(Signup);
    }

    if(pageName == "login"){
      this.navCtrl.push(Login);
    }

    if(pageName == 'logout'){
      this.storage.remove('userLoginInfo').then( () =>{
        this.user = {};
        this.loggedIn = false;
      })
    }

    if(pageName == "cart"){
      let modal = this.modalCtrl.create(Cart);
      modal.present();
    }

  }

  
}
