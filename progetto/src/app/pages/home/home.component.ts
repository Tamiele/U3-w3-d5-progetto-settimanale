import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { imovie } from '../../interfaces/imovie';
import { iUser } from '../../interfaces/i-user';
import { iFavorite } from '../../interfaces/i-favorite';

import { AuthenticationService } from '../../authentication/authentication.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  arrMovie: imovie[] = [];
  arrFavoriteMovies: iFavorite[] = [];
  user?: iUser;
  alertMessage: string | null = null;
  showMovies: boolean = true;

  constructor(
    private movieSvc: MovieService,

    private authSvc: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.movieSvc.getMovie().subscribe((movies: imovie[]) => {
      this.arrMovie = movies;
    });

    this.authSvc.user$.pipe(filter((u): u is iUser => !!u)).subscribe((u) => {
      this.user = u;
    });
  }

  // recuperaro i film preferiti dell'utente
  retrieveFavorites(userId: number) {
    this.movieSvc
      .userFavoriteMovie(userId)
      .subscribe((favorito: iFavorite[]) => {
        this.arrFavoriteMovies = favorito;
      });
  }
  addFavorite(idMovie: number) {
    if (!this.user) {
      return;
    }
    // Controllo se il film è già nei preferiti
    this.movieSvc
      .searchFavorite(this.user.id, idMovie)
      .subscribe((preferiti) => {
        if (preferiti.length > 0) {
          this.alertMessage = 'Questo film è già nei preferiti';
          return;
        }
        // Se il film non è già nei preferiti, lo aggiungo
        const favorito: iFavorite = {
          utenteId: this.user!.id,
          filmId: idMovie,
        };
        this.movieSvc.addFavorite(favorito).subscribe(() => {
          this.retrieveFavorites(this.user!.id); // Aggiorna l'elenco dei preferiti
        });
      });
  }
  toggleMovies() {
    this.showMovies = !this.showMovies;
  }
}
