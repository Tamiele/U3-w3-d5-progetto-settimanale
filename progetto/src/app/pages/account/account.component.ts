import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { iUser } from '../../interfaces/i-user';
import { AuthenticationService } from '../../authentication/authentication.service';
import { imovie } from '../../interfaces/imovie';
import { iFavorite } from '../../interfaces/i-favorite';
import { MovieService } from '../movie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  selectedProfile: iUser | null = null;
  arrMovie: imovie[] = [];
  arrFavoriteMovies: iFavorite[] = [];
  user!: iUser;
  userId!: number;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private offcanvasService: NgbOffcanvas,
    private authService: AuthenticationService,
    private movieSvc: MovieService
  ) {}

  ngOnInit(): void {
    const userSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userId = user.id;
        this.selectedProfile = user;
        this.retrieveFavorites();
      }
    });

    this.subscriptions.add(userSubscription);
  }

  stampaFavoriteMovie() {
    if (this.arrFavoriteMovies.length === 0) return;
    this.arrFavoriteMovies.forEach((favorito) =>
      this.movieSvc.detailMovie(favorito.filmId).subscribe(
        (filmPreferito) => {
          this.arrMovie.push(filmPreferito);
        },
        (error) => {
          console.error(
            `Errore nel recuperare i dettagli del film con ID ${favorito.filmId}:`,
            error
          );
        }
      )
    );
  }

  retrieveFavorites() {
    this.movieSvc
      .userFavoriteMovie(this.userId)
      .subscribe((preferito: iFavorite[]) => {
        this.arrFavoriteMovies = preferito;
        if (this.arrFavoriteMovies.length > 0) {
          this.stampaFavoriteMovie();
        } else {
          console.log('Nessun film preferito trovato.');
        }
      });
  }

  removeFavorite(filmId: number) {
    this.movieSvc.searchFavorite(this.userId, filmId).subscribe((preferiti) => {
      if (preferiti.length > 0 && preferiti[0].id !== undefined) {
        const preferitoId = preferiti[0].id;

        this.movieSvc.removeMovie(preferitoId).subscribe({
          next: () => {
            this.arrMovie = this.arrMovie.filter((film) => film.id !== filmId);
            this.arrFavoriteMovies = this.arrFavoriteMovies.filter(
              (fav) => fav.filmId !== filmId
            );
          },
        });
      }
    });
  }

  openProfileOffcanvas(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'start' });
  }
}
