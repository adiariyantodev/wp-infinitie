<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */
// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'mofamedi_infwp' );
/** Database username */
define( 'DB_USER', 'mofamedi_infwp' );
/** Database password */
define( 'DB_PASSWORD', 'Sp!64.kv5q' );
/** Database hostname */
define( 'DB_HOST', 'localhost' );
/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );
/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'wxri720ph6lgh9g19bnpvsdq7tjqmbbvv6fov8owromljf6djayj1ndbp8eiewow' );
define( 'SECURE_AUTH_KEY',  'iydqxyzkcdjzssbj4xdkxznjxdkucr5v8bgi7pdbrgrjqjpacdqhttdqpwdaxqkl' );
define( 'LOGGED_IN_KEY',    'ltm35kvfk0hmbbdae6g5evceuqji00qmbejgsfwz3war6uq8r7vszszaeofcvdto' );
define( 'NONCE_KEY',        'hd59p3rrwup7l7x49rhewsp5evzkxcpocgzhhcraoj60rk4u03rc7eecfmwwkv5w' );
define( 'AUTH_SALT',        'ngg5vgc2blnlrprneoopj1qnegloa2b5p0fjo9c5pxefbphbc4i8ooppc5piilk4' );
define( 'SECURE_AUTH_SALT', 'obinj3b1nygdpcstv8kqeyontvwgyto75azp3btx4ejwbidubzn2ntraaigja7jn' );
define( 'LOGGED_IN_SALT',   'zr3nppwk5rerlb4o6bxxw1kqdjnqrr5gclxlmogylctcxkmlmm6h4ij0pchcmb9x' );
define( 'NONCE_SALT',       'kgdxz0zthswgmguvem6p69o0snve8vvuyfvnjxyhdbebwuuosf3d7ewxlkfnyytw' );
/**#@-*/
/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wpin_';
/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );
/* Add any custom values between this line and the "stop editing" line. */
/* That's all, stop editing! Happy publishing. */
/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';