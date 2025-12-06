<?php
/**
 * FlatWP React Preview Class
 *
 * @package FlatWP_React
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FlatWP_React_Preview {
	public function __construct() {
		add_filter( 'preview_post_link', array( $this, 'modify_preview_link' ), 10, 2 );
	}

	public function modify_preview_link( $link, $post ) {
		$nextjs_url = flatwp_react()->get_setting( 'nextjs_url' );
		$secret = flatwp_react()->get_setting( 'preview_secret' );

		if ( empty( $nextjs_url ) || empty( $secret ) ) {
			return $link;
		}

		$preview_pattern = flatwp_react()->get_setting( 'preview_url_pattern' );
		
		$preview_url = str_replace(
			array( '{secret}', '{id}', '{type}' ),
			array( $secret, $post->ID, $post->post_type ),
			$preview_pattern
		);

		return trailingslashit( $nextjs_url ) . ltrim( $preview_url, '/' );
	}
}
