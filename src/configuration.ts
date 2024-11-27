import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';

export default () => ({
  database: {
    type: process.env.DB_TYPE || 'postgres',
    url: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'student',
    password: process.env.DB_PASSWORD || 'student',
    database: process.env.DB_NAME || 'kupipodariday',
    entities: [User, Wish, Wishlist, Offer],
    synchronize: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'some-super-secret-key',
    lifetime: process.env.JWT_LIFETIME || '7d',
  },
});
