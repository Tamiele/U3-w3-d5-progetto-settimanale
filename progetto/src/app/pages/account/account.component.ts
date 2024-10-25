import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { iUser } from '../../interfaces/i-user';
import { AuthenticationService } from '../../authentication/authentication.service';
import { imovie } from '../../interfaces/imovie';
import { iFavorite } from '../../interfaces/i-favorite';
import { MovieService } from '../movie.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  selectedProfile: iUser | null = null;

  arrMovie: imovie[] = [];
  arrFavoriteMovies: iFavorite[] = [];
  user!: iUser;
  userId!: number;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private authService: AuthenticationService,
    private movieSvc: MovieService,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userId = user.id;
        const movieId = this.router.snapshot.paramMap.get('movieId');
        if (movieId) {
          console.log('Film aggiunto ai preferiti:', movieId);
          this.movieSvc
            .userFavoriteMovie(this.userId)
            .subscribe((preferito: iFavorite[]) => {
              this.arrFavoriteMovies = preferito;
              this.stampaFavoriteMovie();
            });
        } else {
          console.log('user non autenitcato');
        }
      }
    });
  }

  stampaFavoriteMovie() {
    if (this.arrFavoriteMovies.length === 0) return;
    this.arrFavoriteMovies.forEach((favorito) =>
      this.movieSvc.detailMovie(favorito.filmId).subscribe(
        (detailMovie) => {
          this.arrMovie.push(detailMovie);
        },
        (error) => {
          console.error(
            `Errore nel recuperare i dettagli del film con ID" ${favorito.filmId}:`,
            error
          );
        }
      )
    );
  }

  openProfileOffcanvas(content: TemplateRef<any>) {
    this.authService.user$.subscribe((user) => {
      console.log('Utente dal servizio:', user);
      this.selectedProfile = user ?? null;
    });
    console.log(this.selectedProfile);

    this.offcanvasService.open(content, { position: 'start' });
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

          complete: () => {
            console.log('Operazione di rimozione completata.');
          },
        });
      }
    });
  }
}
