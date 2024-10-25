import { iFavorite } from './../interfaces/i-favorite';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { imovie } from '../interfaces/imovie';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  movieUrl: string = environment.movieUrl;
  favoriteUrl: string = environment.favoriteUrl;

  getMovie(): Observable<imovie[]> {
    return this.http.get<imovie[]>(this.movieUrl);
  }

  addFavorite(favorite: iFavorite): Observable<iFavorite> {
    return this.http.post<iFavorite>(this.favoriteUrl, favorite);
  }

  userFavoriteMovie(userId: number): Observable<iFavorite[]> {
    return this.http.get<iFavorite[]>(`${this.favoriteUrl}?utenteId=${userId}`);
  }

  detailMovie(movieId: number): Observable<imovie> {
    return this.http.get<imovie>(`${this.movieUrl}/${movieId}`);
  }

  searchFavorite(userId: number, movieId: number): Observable<iFavorite[]> {
    return this.http.get<iFavorite[]>(
      `${this.favoriteUrl}?utenteId=${userId}&filmId=${movieId}`
    );
  }

  removeMovie(movieId: number): Observable<iFavorite> {
    return this.http.delete<iFavorite>(`${this.favoriteUrl}/${movieId}`);
  }
}
