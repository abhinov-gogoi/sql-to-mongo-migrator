import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  horizontalStepperForm: FormGroup;
  verticalStepperForm: FormGroup;

  /**
   * CONSTANTS
   */
  url_regex: string = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  mongodb_uri_regex: string = "";
  mysqlConnectionSucceeded: boolean = false;
  mongodbConnectionSucceeded: boolean = false;
  BASE_URL: string = "https://notepad-spring.herokuapp.com/";
  API_TEST_MYSQL_CONNECTION: string = "testMySQLConnection";
  API_TEST_MONGODB_CONNECTION: string = "databases"
  API_GATEWAY: string = "STM"
  AVAILABLE_MONGO_DATABASES: string[] = []
  selectedMongoDatabase: string = ""
  selectedMySQLTable: string = ""
  MySQL_TABLES: string[] = []

  /**
   * Constructor
   */
  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Horizontal stepper form
    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        mysql_url: ['remotemysql.com/03ZeLcEdG3', [Validators.required, Validators.pattern(this.url_regex)]],
        mysql_username: ['03ZeLcEdG3', Validators.required],
        mysql_password: ['TGuPoOIlq9', Validators.required]
      }),
      step2: this._formBuilder.group({
        mongodb_uri: ['mongodb+srv://groot:root@meow.nqrji.mongodb.net', [Validators.required, Validators.pattern(this.mongodb_uri_regex)]]
      }),
      step3: this._formBuilder.group({
        selectedMySQLTable: ['', Validators.required],
        selectedMongoDatabase: ['', Validators.required]
      }),
      step4: this._formBuilder.group({

      })
    });
  }


  // ::::::::::::::::::::::::::::::::: API CALLS ::::::::::::::::::::::::::::::://
  testMySQLConnection(stepper: MatStepper) {
    // Build the URL
    var URL = this.BASE_URL + this.API_TEST_MYSQL_CONNECTION
    // create the request body
    var body = {
      "mysql_url": this.horizontalStepperForm.controls.step1.get('mysql_url').value,
      "username": this.horizontalStepperForm.controls.step1.get('mysql_username').value,
      "password": this.horizontalStepperForm.controls.step1.get('mysql_password').value
    }
    // create request header
    const headers = { "Content-Type": "application/json", "api_gateway": this.API_GATEWAY };
    // hit backend API
    this.http.post<any>(URL, JSON.stringify(body), { headers }).subscribe(resp => {
      console.log(resp)
      if (resp === null) {
        this.showToast("error", "Error", "Something went wrong")
      } else if (resp.STATUS === 'ERROR') {
        this.showToast("error", "Error", resp.MESSAGE)
      } else if (resp.STATUS === 'SUCCESS') {
        this.showToast("success", "Success", resp.MESSAGE);
        this.mysqlConnectionSucceeded = true;
        // go forward with the form
        stepper.next();
        // fetch the tables for this mysql database
        this.fetchMySQLTables()
      }
    }, (error) => {
      this.showToast("error", "Error", "Something went wrong")
    });
  }

  testMongoDBConnection(stepper: MatStepper) {
    // encode the uri string 
    var mongodb_uri = encodeURIComponent(this.horizontalStepperForm.controls.step2.get('mongodb_uri').value)
    // Build the URL
    var URL = this.BASE_URL + this.API_TEST_MONGODB_CONNECTION + "?mongodb_uri=" + mongodb_uri
    // create request header
    const headers = { "Content-Type": "application/json", "api_gateway": this.API_GATEWAY };
    // hit backend API
    this.http.get<any>(URL).subscribe(resp => {
      console.log(resp)
      if (resp === null) {
        this.showToast("error", "Error", "Something went wrong")
      } else if (resp.STATUS === 'ERROR') {
        this.showToast("error", "Error", resp.MESSAGE)
      } else if (resp.STATUS === 'SUCCESS') {
        this.showToast("success", "Success", resp.MESSAGE);
        // hold the available databases
        this.AVAILABLE_MONGO_DATABASES = resp.DATABASES;
        this.mongodbConnectionSucceeded = true;
        // go forward with the form
        stepper.next();
      }
    }, (error) => {
      this.showToast("error", "Error", "Something went wrong")
    });
  }

  fetchMySQLTables() {
    // Build the URL
    var URL = this.BASE_URL + "mysqlTables";
    // create request header
    const headers = { "Content-Type": "application/json", "api_gateway": this.API_GATEWAY };
    // hit backend API
    this.http.get<any>(URL).subscribe(resp => {
      console.log(resp)
      if (resp === null) {
        this.showToast("error", "Error", "Something went wrong while fetching Tables")
      } else if (resp.STATUS === 'ERROR') {
        this.showToast("error", "Error", resp.MESSAGE)
      } else if (resp.STATUS === 'SUCCESS') {
        // hold the available databases
        this.MySQL_TABLES = resp.DATA;
        console.log(this.MySQL_TABLES)
      }
    }, (error) => {
      this.showToast("error", "Error", "Something went wrong while fetching Tables")
    });
  }

  // :::::::::::::::::::::  TOASTER  :::::::::::::::::::::::::::://

  showToast(message1: string, message2: string, message3: string) {
    alert(message2 + '/n' + message3);
  }

  updateSelectedMongoDatabase(db: any) {
    this.selectedMongoDatabase = db;
    // console.log("selectedMongoDatabase :: " + this.selectedMongoDatabase)
  }

  updateSelectedMySQLTable(table: string) {
    this.selectedMySQLTable = table;
  }

  logger(message: any) {
    console.log(message)
    alert(message)
  }

  nextStep(stepper: MatStepper) {
    console.log(stepper)
    stepper.next();
  }
}
