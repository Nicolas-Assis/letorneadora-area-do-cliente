// interface Database {
//   url: string;
//   enableSSL: boolean;
// }

// type Account = Database;

// interface DEV {
//   userAuthEmail?: string;
// }

// type Configuration = {
//   isDevelopment?: boolean;
//   dev: DEV;
//   database: Account;
//   firebaseCredentials?: string;
// };

// export default (): Configuration => ({
//   isDevelopment: process.env.NODE_ENV === 'development',
//   dev: {
//     userAuthEmail: process.env.DEV_USER_AUTH_EMAIL,
//   },
//   database: {
//     url: process.env.SUPABASE_URL ?? '',
//     enableSSL: process.env.SUPABASE_ENABLE_SSL === 'true',
//   },
//   firebaseCredentials: process.env.FIREBASE_CREDENTIALS,
// });

// export type { Configuration, Database, Account };
