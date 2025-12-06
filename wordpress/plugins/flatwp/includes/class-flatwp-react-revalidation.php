<?php
/**
 * FlatWP React Revalidation Class
 *
 * @package FlatWP_React
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FlatWP_React_Revalidation {
	public function __construct() {
		add_action( 'save_post', array( $this, 'handle_post_save' ), 10, 2 );
		add_action( 'transition_post_status', array( $this, 'handle_status_change' ), 10, 3 );
	}

	public function trigger_revalidation( $paths ) {
		$nextjs_url = flatwp_react()->get_setting( 'nextjs_url' );
		$secret = flatwp_react()->get_setting( 'revalidation_secret' );

		if ( empty( $nextjs_url ) || empty( $secret ) ) {
			$error = new WP_Error( 'missing_config', __( 'Next.js URL or secret not configured', 'flatwp-react' ) );
			$this->log_activity(
				'revalidation_failed',
				'error',
				'ISR revalidation failed: Next.js URL or secret not configured'
			);
			return $error;
		}

		$revalidate_url = trailingslashit( $nextjs_url ) . 'api/revalidate';

		// Log revalidation attempt with paths
		$paths_display = is_array( $paths ) ? implode( ', ', $paths ) : $paths;
		$this->log_activity(
			'revalidation_triggered',
			'info',
			sprintf( 'ISR revalidation triggered for %d path(s): %s', count( (array) $paths ), $paths_display )
		);

		// Measure request duration
		$start_time = microtime( true );

		$response = wp_remote_post(
			$revalidate_url,
			array(
				'body'    => wp_json_encode( array(
					'secret' => $secret,
					'paths'  => $paths,
				) ),
				'headers' => array(
					'Content-Type' => 'application/json',
				),
				'timeout' => flatwp_react()->get_setting( 'webhook_timeout', 30 ),
			)
		);

		$duration = round( ( microtime( true ) - $start_time ) * 1000, 2 );

		if ( is_wp_error( $response ) ) {
			$this->log_activity(
				'revalidation_failed',
				'error',
				sprintf( 'ISR webhook failed after %dms: %s', $duration, $response->get_error_message() )
			);
			return $response;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );

		// Parse response for success/failure details
		if ( $response_code === 200 ) {
			$this->log_activity(
				'revalidation_success',
				'success',
				sprintf( 'ISR revalidation successful (%dms) - %d path(s) marked for rebuild on next request', $duration, count( (array) $paths ) )
			);
			update_option( 'flatwp_react_cache_last_cleared', current_time( 'timestamp' ) );
			return true;
		} else {
			$error_detail = $response_body ? substr( $response_body, 0, 100 ) : 'Unknown error';
			$this->log_activity(
				'revalidation_failed',
				'warning',
				sprintf( 'ISR webhook returned HTTP %d after %dms: %s', $response_code, $duration, $error_detail )
			);
			return new WP_Error( 'revalidation_failed', sprintf( 'HTTP %d: %s', $response_code, $error_detail ) );
		}
	}

	public function handle_post_save( $post_id, $post ) {
		// Check if webhooks are enabled
		if ( ! flatwp_react()->get_setting( 'webhook_enabled', true ) ) {
			return;
		}

		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		if ( $post->post_status === 'publish' ) {
			$path = '/' . $post->post_name;
			$result = $this->trigger_revalidation( array( $path, '/blog' ) );

			if ( is_wp_error( $result ) ) {
				$this->log_activity(
					'revalidation_failed',
					'error',
					sprintf( 'Failed to revalidate %s: %s', $post->post_title, $result->get_error_message() )
				);
			} else {
				$this->log_activity(
					'revalidation_triggered',
					'success',
					sprintf( '%s "%s" updated - cache revalidated', ucfirst( $post->post_type ), $post->post_title )
				);
			}
		}
	}

	public function handle_status_change( $new_status, $old_status, $post ) {
		// Check if webhooks are enabled
		if ( ! flatwp_react()->get_setting( 'webhook_enabled', true ) ) {
			return;
		}

		if ( $new_status === 'publish' && $old_status !== 'publish' ) {
			$path = '/' . $post->post_name;
			$result = $this->trigger_revalidation( array( $path, '/blog', '/' ) );

			if ( is_wp_error( $result ) ) {
				$this->log_activity(
					'revalidation_failed',
					'error',
					sprintf( 'Failed to revalidate published %s: %s', $post->post_title, $result->get_error_message() )
				);
			} else {
				$this->log_activity(
					'revalidation_triggered',
					'success',
					sprintf( '%s "%s" published - cache revalidated', ucfirst( $post->post_type ), $post->post_title )
				);
			}
		}
	}

	/**
	 * Log activity
	 */
	private function log_activity( $type, $severity, $message ) {
		$logs = get_option( 'flatwp_react_activity_logs', array() );

		$log_entry = array(
			'id'        => uniqid(),
			'timestamp' => current_time( 'timestamp' ),
			'type'      => $type,
			'severity'  => $severity,
			'message'   => $message,
			'user'      => get_current_user_id(),
		);

		// Add to beginning of array
		array_unshift( $logs, $log_entry );

		// Keep only last 100 entries
		$logs = array_slice( $logs, 0, 100 );

		update_option( 'flatwp_react_activity_logs', $logs );
	}
}
