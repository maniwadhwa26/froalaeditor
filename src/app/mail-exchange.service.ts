import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MailExchangeService {

  mailURL = 'http://localhost:59290/api/MailExchange';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }


  SendMail(mailbody) {
  return this.http.post(this.mailURL, mailbody);
    // return this.http.get(this.mailURL);
  }
}
