import { Component, OnInit, Renderer2 } from '@angular/core';
import {FormControl, Validators,FormGroup,FormBuilder} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CommonserviceService } from 'src/services/commonservice/commonservice.service';
import { MessageService } from 'src/services/message/message.service';

import { Router } from "@angular/router";
import { OrdersService } from 'src/services/orders/orders.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  menues:any = [];
  orderForm:FormGroup;
  myOrders:any=[];
  local_cart:any = [];
  value:any;
  qty=0;

  


  order() {
    this.orderForm = this.fb.group({
    order :new FormControl('', Validators.required),
    givenPayment :new FormControl('', Validators.required),
    
    })
  }
  constructor(
    private fb: FormBuilder,private CookieService:CookieService,private OrdersService:OrdersService,private router:Router,private renderer: Renderer2,private MessageService:MessageService,private CommonService:CommonserviceService
  ) {
  
   
    this.order();
    // debugger;
    this.menues = JSON.parse(localStorage.getItem('list_of_menues'));
    //  this.getMenue();
    
  }
  getMenue(){
    // this.OrdersService.getMenues().subscribe(
    //   (data) => {
    //    console.log(data)
    //   //  this.menues=
    //     this.menues=data.list_of_menues;
    //     // localStorage.setItem('list_of_menues',JSON.stringify(this.menues));
    //     localStorage.setItem('list_of_menues',JSON.stringify(this.menues));
    //             console.log(localStorage.getItem('list_of_menues'))
    //   },
    //   error => {
    //     this.MessageService.error('Warning','Session Expired');
    //     this.MessageService.cancelSound();
    //     this.router.navigate(["/auth"]);
       
    //   }
    // );
  }
  ngOnInit(): void {
    this.local_cart = JSON.parse(localStorage.getItem('cart'));
    debugger
    this.CommonService.myOrdersSockets().subscribe((data)=>{

       this.myOrders = data.myOrders
       this.getSum(this.myOrders);
      
     })
  }


  createOrder(value: { order: any; givenPayment: any; }){
    let data = {
      'email':value.order,
      'givenPayment':value.givenPayment,
    }


    this.OrdersService.orderBook(data).subscribe((data)=>{

      console.log('dasda',data);
      //debugger;
      if(data.code==200){
        this.MessageService.successSound();
        this.MessageService.success('Success','Login Successfully.');
       if(data.user_token=='chef'){
        this.CookieService.set('user_token',data.user_token);
        this.CookieService.set('token',data.token);
        this.router.navigateByUrl("/chef");
       }else if(data.user_token=='user'){
        this.CookieService.set('user_token',data.user_token);
        this.CookieService.set('token',data.token);
        this.router.navigateByUrl("/order");
       }
      }
      // this.CookieService.set('role', 'Hello World' );
      // this.CookieService.set('token', 'Hello World' );
      // if(data.success==true){
      //   this.ToastMessageService.success('Success','Category Added Successfully');
      //   this.ToastMessageService.successSound();
      //   this.getCategory();
      //   this.table.renderRows();
      // }else{
      //   this.ToastMessageService.error('Error','Something went wrong.');
      // }

    },
    error => {
      this.MessageService.cancelSound();
      this.MessageService.error('Error','Email Already Exist.');
      
    },
    );
  }
  
   increaseCount(menue) {
        let dat = JSON.parse(localStorage.getItem('cart'));
        let obj:any=  {};
        let cart:any=[];
        let qty = menue.value+1;
        obj['description'] = menue.description;
        obj['id'] = menue.id;
        obj['menue'] = menue.menue;
        obj['price'] = menue.price*qty;
        obj['qty'] = qty;
      if(dat==null){
        cart.push(obj)
        
        localStorage.setItem('cart',JSON.stringify(cart))
        this.local_cart = cart;
      }else{
        let chk_if = dat.filter(a=>a.id===menue.id);
      if(chk_if.length==0){
          dat.push(obj);
      }else{

        let qty = menue.value+1;
        chk_if[0].qty = qty;
        chk_if[0].price = qty*menue.price;
      
        localStorage.setItem('cart',JSON.stringify(chk_if))
        // this.local_cart = dat;
      
      }
    
   
    localStorage.setItem('cart',JSON.stringify(dat))
    this.local_cart = dat;
  }
  
    menue.value += 1;
    let ss =  JSON.parse(localStorage.getItem('list_of_menues'));
      let data = ss.filter(x => x.id== menue.id);

      data[0].value = menue.value;
      localStorage.setItem('value',menue.value)
      

    
  }
  
   decreaseCount(menue) {


    



    
     


    
      if(menue.value<=0){
        menue.value;


      let ss =  JSON.parse(localStorage.getItem('list_of_menues'));
      let data = ss.filter(x => x.id== menue.id);

      data[0].value = menue.value;
      // localStorage.setItem('value',this.menues.value)
    

      localStorage.setItem('cart',menue.value)
        
      }  
      else{
        menue.value -=1;
        let ss =  JSON.parse(localStorage.getItem('list_of_menues'));
      let data = ss.filter(x => x.id== menue.id);

      data[0].value = menue.value;
      // localStorage.setItem('value',this.menues.value)
      localStorage.setItem('value',menue.value)
      }
    
  }  
  
  
getSum(array){
  return array.reduce((accum,item) => accum + item.price, 0);
}
  
}

// function price(price: any, arg1: string) {
//   throw new Error('Function not implemented.');
// }
