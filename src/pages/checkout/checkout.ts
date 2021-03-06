import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';

import { HomePage } from "../home/home";
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class Checkout {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public aleartCtrl : AlertController, public payPal: PayPal){
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      { method_id: "cod", method_title:"Cash On Delivery"},
      { method_id: "paypal", method_title:"PayPal"}];

      this.WooCommerce = WC({
        url:"http://cloudsnails.online/test",
        consumerKey: "ck_9fff3a318b6d57336840f06d2faa63234350ad0a",
        consumerSecret: "cs_601ddc6d302b4d86a5e1d05f2478906473e89f5c"
      });

    this.storage.get("userLoginInfo").then( (userLoginInfo) =>{
   
      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/"+email).then( (data) => {

        this.newOrder = JSON.parse(data.body).customer;
      })
    })

  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;

    if(this.billing_shipping_same){
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }

  }
placeOrder(){

  let orderItems: any[] = [];
  let data: any= {};

  let paymentData: any = {};

  this.paymentMethods.forEach( (element, index) => {
    if (element.method_id == this.paymentMethod){
      paymentData = element;
    }
  });

  data = {
    payment_details : {
      method_id: paymentData.method_id,
      method_title: paymentData.method_title,
      paid: true
    },

    billing_address: this.newOrder.billing_address,
    shipping_address: this.newOrder.shipping_address,
    customer_id: this.userInfo.id || '',
    line_items: orderItems
  };


  if(paymentData.method_id == "paypal"){
     
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AbYBWXbH8DDQBCbvJzrZyRpjUqn7XkUweepJrjHW9BwtsQpAnFGNfv_h34hQoUR5LNYZV3qeePI9oqNx'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {

        this.storage.get("cart").then ( (cart) => {

          let total = 0.00;
          cart.forEach((element, index) => {
            orderItems.push({ product_id: element.price * element.qty});
            total = total + (element.product.price * element.qty);
          });


          let payment = new PayPalPayment(total.toString(), 'INR', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then(( response ) => {
            // Successfully paid
      
            alert(JSON.stringify(response));


            data.line_items = orderItems;
            //console.log(data);
            let orderData: any = {};

            orderData.order = data;

            this.WooCommerce.postAsync('orders', orderData, (err, data, res) => {
              alert("Order placed successfully!");


              let response = (JSON.parse(data.body).order);

              this.aleartCtrl.create({
                title: "Order PLaced Successfully",
                message: "Your order has been placed successfully with order no :"+ response.order_number,
                buttons: [{
                  text: "OK",
                  handler: () => {
                    this.navCtrl.setRoot(HomePage);
                  }
                }]
              }).present();
            })


        })


        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });



  } else {

    this.storage.get("cart").then( (cart)=> {

      cart.forEach( (element, index) => {
         orderItems.push({
           product_id: element.product.id,
           quantity: element.qty
         });
      });

      data.line_items = orderItems;

      let orderData: any = {};

      orderData.order = data;

      this.WooCommerce.postAsync("orders", orderData).then( (data) => {

        let response = (JSON.parse(data.body).order);

        this.aleartCtrl.create({
          title: "Order PLaced Successfully",
          message: "Your order has been placed successfully with order no :"+ response.order_number,
          buttons: [{
            text: "OK",
            handler: () => {
              this.navCtrl.setRoot(HomePage);
            }
          }]
        }).present();
      })




    })
  }



}

}
 