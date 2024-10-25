import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { imovie } from '../../interfaces/imovie';
import { iUser } from '../../interfaces/i-user';
import { iFavorite } from '../../interfaces/i-favorite';
import { Router } from '@angular/router';
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

  constructor(
    private movieSvc: MovieService,
    private router: Router,
    private authSvc: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.movieSvc.getMovie().subscribe((movies: imovie[]) => {
      this.arrMovie = movies;
      console.log(this.arrMovie);
    });

    this.authSvc.user$.pipe(filter((u): u is iUser => !!u)).subscribe((u) => {
      this.user = u;
    });
  }

  recuperaFavorite(userId: number) {
    this.movieSvc
      .userFavoriteMovie(userId)
      .subscribe((favorito: iFavorite[]) => {
        this.arrFavoriteMovies = favorito;
      });
  }
  addFavorite(idMovie: number) {
    if (!this.user) {
      console.log('impossibile aggiungere ai preferiti');
      return;
    }
    const favorito: iFavorite = {
      utenteId: this.user.id,
      filmId: idMovie,
    };

    this.movieSvc.addFavorite(favorito).subscribe(() => {
      this.recuperaFavorite(this.user!.id);
      this.router.navigate(['/account', { movieId: idMovie }]);
    });
  }
}
