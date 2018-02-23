import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';





@IonicPage()
@Component({
  selector: 'page-add-technology',
  templateUrl: 'add-technology.html',
})
export class AddTechnologyPage {




   public form                   : FormGroup;
   public technologyName         : any;
   public technologyDescription  : any;
   public isEdited               : boolean = false;
   public hideForm               : boolean = false;
   public pageTitle              : string;
   public recordID               : any      = null;
   private baseURI               : string  = "http://localhost:81/";

  constructor(public navCtrl    : NavController,
               public http       : HttpClient,
               public NP         : NavParams,
               public fb         : FormBuilder,
               public toastCtrl  : ToastController)
   {

      // Create form builder validation rules
      this.form = fb.group({
         "name"                  : ["", Validators.required],
         "description"           : ["", Validators.required]
      });
   }




ionViewWillEnter() : void
   {
      this.resetFields();

      if(this.NP.get("record"))
      {
         this.isEdited      = true;
         this.selectEntry(this.NP.get("record"));
         this.pageTitle     = 'Amend entry';
      }
      else
      {
         this.isEdited      = false;
         this.pageTitle     = 'Create entry';
      }
   }



   selectEntry(item : any) : void
   {
      this.technologyName        = item.name;
      this.technologyDescription = item.description;
      this.recordID              = item.id;
   }



createEntry(name : string, description : string) : void
   {
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "create", "name" : name, "description" : description },
          url       : any      	= this.baseURI + "manage-data.php";

      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data : any) =>
      {
         // If the request was successful notify the user
         this.hideForm   = true;
         this.sendNotification(`Congratulations the technology: ${name} was successfully added`);
      },
      (error : any) =>
      {
         this.sendNotification(`Something went wrong!: ${name}`);
      }
    );
   }


   saveEntry() : void
   {
      let name          : string = this.form.controls["name"].value,
          description   : string    = this.form.controls["description"].value;

      if(this.isEdited)
      {
         this.updateEntry(name, description);
      }
      else
      {
         this.createEntry(name, description);
      }
   }


   resetFields() : void
   {
      this.technologyName           = "";
      this.technologyDescription    = "";
   }

   sendNotification(message : string)  : void
   {
      let notification = this.toastCtrl.create({
          message       : message,
          duration      : 3000
      });
      notification.present();
   }


   updateEntry(name : string, description : string) : void
   {
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "update", "name" : name, "description" : description, "recordID" : this.recordID},
          url       : any      	= this.baseURI + "manage-data.php";

      this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         this.hideForm  =  true;
         this.sendNotification(`Congratulations the technology: ${name} was successfully updated`);
      },
      (error : any) =>
      {
         this.sendNotification('Something went wrong!');
      });
   }



    deleteEntry() : void
   {
      let name      : string 	= this.form.controls["name"].value,
          headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "delete", "recordID" : this.recordID},
          url       : any      	= this.baseURI + "manage-data.php";

      this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
      {
         this.hideForm     = true;
         this.sendNotification(`Congratulations the technology: ${name} was successfully deleted`);
      },
      (error : any) =>
      {
         this.sendNotification('Something went wrong!');
      });
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTechnologyPage');
  }

}

