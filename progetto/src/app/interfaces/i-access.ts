import { iFavorite } from './i-favorite';
import { iUser } from './i-user';
import { imovie } from './imovie';

export interface iAccess {
  accessToken: string;
  user: iUser;
  movies: imovie;
  favorite: iFavorite;
}
