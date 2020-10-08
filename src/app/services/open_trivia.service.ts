import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { question } from '../models/question';

@Injectable(
    {
        providedIn:"root" 
    }
)
export class OpenTriviaService{
    private sessionToken :string;

    public constructor (private httpClient:HttpClient){}

    public async getQuestions(nb:number, niveau:string):Promise<Array<question>>{
        let params = new HttpParams();
        params = params.append('token', this.sessionToken );
        params = params.append('amount', nb.toString() );
        return new Promise((resolve, reject)=>{
            this.httpClient.get('https://opentdb.com/api.php', {params : params})
            .toPromise()
            .then((reponse)=>{
                resolve(reponse['results']);
            })
            .catch((error) =>{
                reject(error)
            })
        });
    }
    public async getSessionToken(){
        if(!this.sessionToken){
            return new Promise((resolve, reject)=>{
                this.httpClient.get('https://opentdb.com/api_token.php?command=request')
                .toPromise()
                .then((reponse)=>{
                    this.sessionToken = reponse['token'];
                    resolve()
                })
                .catch((error) =>{
                    reject(error)
                })
            });
        }
    }
}