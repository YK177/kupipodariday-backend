import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import 'dotenv/config'

export default () => ({
  database: {
    type: process.env.DB_TYPE,
    url: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [User, Wish, Wishlist, Offer],
    synchronize: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    lifetime: process.env.JWT_LIFETIME,
  },
});
