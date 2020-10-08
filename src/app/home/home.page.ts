import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { question } from '../models/question';
import { OpenTriviaService } from '../services/open_trivia.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  //variables de connexion
  public pseudo : string ="damien";
  public difficulte : string ="medium";
  public nbQuestions : number = 10;
  public isSave : boolean = true;
  public isLogged :boolean = false;
  //variables de jeu
  public isAnswered :boolean = false;
  public questions :question[] = [];
  public questionCourante : question;
  public index :number = 0;
  public goodAnswers :number = 0;
  //variable de fin de jeu
  public isOver : boolean= false;

  constructor(private alertCtrl : AlertController, public toastCtrl : ToastController, private otServ : OpenTriviaService) {}

  ngOnInit(){}

  public async commencer(){
    if(!this.pseudo || this.pseudo.length<3){
      const alert = await this.toastCtrl.create({
        header : 'Informations manquantes',
        message : "veuillez saisir un pseudo d'au moins 3 caractères",
        duration : 666
    });
    alert.present();
      return;
    }
    if(!this.difficulte || this.difficulte === "undefined"){
      const alert = await this.alertCtrl.create({
        header : 'Informations manquantes',
        message : "veuillez choisir un niveau de difficulté",
        buttons : ['OK']
    });
    alert.present();
    return;
    }
    await this.otServ.getSessionToken();
    await this.initQuestions(this.nbQuestions, this.difficulte);
    this.modifierQuestion();
    this.isLogged = true;
  }

  public async clickAnswer(reponse:string){
    if(reponse === this.questionCourante.correct_answer){
      this.goodAnswers++;
      const alert = await this.toastCtrl.create({
        message : "bonne réponse!",
        duration : 666
      });
      alert.present();
    }else{
      const alert = await this.toastCtrl.create({
        message : "dommage!",
        duration : 666
      });
      alert.present();
    }
    this.isAnswered = true;;
  }

  public clickSuivant(){
    this.isAnswered = false;
    this.index++;
    if(this.index < this.questions.length){
      this.modifierQuestion();
    }else {
      this.isOver = true;
    }
  }

  public clickRestart(){
    this.isLogged = false;
    this.isAnswered = false;
    this.isOver = false;
    this.index = 0;
    this.goodAnswers = 0;
    this.questions = null;
  }

  private async initQuestions(nbQuestions:number, difficulte:string){
    await this.otServ.getQuestions(nbQuestions, difficulte)
    .then((resultat)=>{
      this.questions = resultat;
    })
    .catch(async(err)=>{
      const alert = await this.alertCtrl.create({
          header : 'Erreur appel Service ',
          message : "Impossible de récupérer les données",
          buttons : ['OK']
      });
      alert.present();
    })
  }

  private modifierQuestion(){
    this.questionCourante = this.questions[this.index];
    this.questionCourante.incorrect_answers.splice(
      Math.random()*this.questionCourante.incorrect_answers.length, 
      null, 
      this.questionCourante.correct_answer);
  }
}
