<?php
/**
 * FlatWP React Settings Class
 *
 * @package FlatWP_React
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FlatWP_React_Settings {
	public function __construct() {
		// Settings initialization
	}

	public function get( $key, $default = null ) {
		return flatwp_react()->get_setting( $key, $default );
	}

	public function set( $key, $value ) {
		return flatwp_react()->update_setting( $key, $value );
	}
}
