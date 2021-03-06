import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Game } from './components/choose-game/game.model';
import { Observable } from 'rxjs';
import { Tournament } from './components/create-tournament/tournament.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
providedIn: 'root'
})
export class DataService {
tournaments: Tournament[];
firebase = 'https://firestore.googleapis.com/v1beta1/projects/battleboard-1cfb2/databases/(default)/documents/';
apiUrl = 'https://api.boardgameatlas.com/api/';
search = 'search?';
token = 'client_id=3KmM1phQnO';
public headers: HttpHeaders;

constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  getGames(): Observable<Game[]> {
     return this.http.get<Game[]>(this.apiUrl + this.search + this.token).pipe(map(res => res['games']));
  }

  getGameById(id): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl + this.search + 'ids=' + id + '&' + this.token).pipe(map(res => res['games']));
  }

  getGame(gameName): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl + this.search + 'name=' + gameName + '&' + this.token).pipe(map(res => res['games']));
  }

  setBasicTournamentData(tournament) {
    return new Promise<any>((resolve, reject) => {this.firestore.collection('basicTournamentsData').add(tournament).then(res => {}, err => reject(err)); });
  }
  getBasicTournamentsData() {
    return this.http.get<Tournament[]>(this.firebase + 'basicTournamentsData').pipe(map(res => res['fields']));
    // return this.firestore.collection('tournaments').snapshotChanges();
  }

  getBasicTournamentData(tournamentName) {
    return this.firestore.collection('basicTournamentsData').ref.where('name','==' , tournamentName).get();
  }

  setTournament(tournament) {
    return new Promise<any>((resolve, reject) => {this.firestore.collection('tournaments').add(tournament).then(res => {}, err => reject(err)); });
  }

  getTournaments() {
    return this.firestore.collection('tournaments').ref.get();
  }

  getTournamentsForUser() {
    return this.firestore.collection('tournaments').ref.where('userId', '==', JSON.parse(localStorage.getItem('user')).uid).get();
  }

  getTournament(tournamentName) {
    return this.firestore.collection('tournaments').ref.where('name','==' , tournamentName).get();
  }

  setBasicTournamentDataById(tournament) {
    const id = this.firestore.createId();
    return new Promise<any>((resolve, reject) => {this.firestore.collection('basicTournamentsData').add(tournament).then(res => {}, err => reject(err));});
  }

  getUsers() {
    return this.firestore.collection('users').ref.get();
  }

  getNews() {
      return this.http.get<object[]>('https://newsapi.org/v2/everything?q=boardgames&top-headlines?sources=Boardgamegeek.com&apiKey=f2428590402b4f0da55bfdac7f264291').pipe(map(res => res['articles']));
  }

  getHotestGames() {
      return this.http.get<Game[]>('https://api.boardgameatlas.com/api/search?order_by=popularity&ascending=false&gt_average_user_rating=3.999&limit=9&' + this.token).pipe(map(res => res['games']));
  }
}
