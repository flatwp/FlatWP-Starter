<?php
/**
 * REST API for React Admin Dashboard
 *
 * Provides all endpoints needed for the React admin interface
 *
 * @package FlatWP_React
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * FlatWP React REST API Class
 */
class FlatWP_React_REST_API {

	/**
	 * API namespace
	 */
	const NAMESPACE = 'flatwp-react/v1';

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API routes
	 */
	public function register_routes() {
		// Dashboard endpoint
		register_rest_route(
			self::NAMESPACE,
			'/dashboard/stats',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_dashboard_stats' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		// Connection endpoints
		register_rest_route(
			self::NAMESPACE,
			'/connection/status',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_connection_status' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/connection/test',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'test_connection' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		// Cache endpoints
		register_rest_route(
			self::NAMESPACE,
			'/cache/stats',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_cache_stats' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/cache/clear',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'clear_cache' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'type' => array(
						'required'          => false,
						'type'              => 'string',
						'enum'              => array( 'all', 'homepage', 'posts', 'pages' ),
						'default'           => 'all',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/cache/clear-path',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'clear_path_cache' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'path' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Settings endpoints
		register_rest_route(
			self::NAMESPACE,
			'/settings',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
				array(
					'methods'             => 'PUT',
					'callback'            => array( $this, 'update_settings' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);

		// Activity log endpoints
		register_rest_route(
			self::NAMESPACE,
			'/logs',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_logs' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'page'     => array(
						'default'           => 1,
						'type'              => 'integer',
						'sanitize_callback' => 'absint',
					),
					'per_page' => array(
						'default'           => 20,
						'type'              => 'integer',
						'sanitize_callback' => 'absint',
					),
					'type'     => array(
						'default'           => 'all',
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Performance metrics endpoint
		register_rest_route(
			self::NAMESPACE,
			'/performance/metrics',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_performance_metrics' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'period' => array(
						'default'           => '24h',
						'type'              => 'string',
						'enum'              => array( '1h', '24h', '7d', '30d' ),
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Recent posts endpoint
		register_rest_route(
			self::NAMESPACE,
			'/posts/recent',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_recent_posts' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'limit' => array(
						'default'           => 5,
						'type'              => 'integer',
						'sanitize_callback' => 'absint',
					),
				),
			)
		);
	}

	/**
	 * Permission callback
	 */
	public function check_permission() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get dashboard statistics
	 */
	public function get_dashboard_stats( $request ) {
		$connection_status = $this->get_cached_connection_status();
		$cache_stats = $this->get_cached_cache_stats();

		$stats = array(
			'connection'    => $connection_status,
			'cache'         => $cache_stats,
			'content_stats' => array(
				'total_posts'  => wp_count_posts( 'post' )->publish,
				'total_pages'  => wp_count_posts( 'page' )->publish,
				'draft_posts'  => wp_count_posts( 'post' )->draft,
				'pending_posts' => wp_count_posts( 'post' )->pending,
			),
			'system_status' => array(
				'php_version'       => PHP_VERSION,
				'wp_version'        => get_bloginfo( 'version' ),
				'plugin_version'    => FLATWP_REACT_VERSION,
				'graphql_active'    => class_exists( 'WPGraphQL' ),
				'acf_active'        => class_exists( 'ACF' ) || function_exists( 'acf' ),
			),
		);

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => $stats,
			)
		);
	}

	/**
	 * Get connection status
	 */
	public function get_connection_status( $request ) {
		$status = $this->get_cached_connection_status();

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => $status,
			)
		);
	}

	/**
	 * Test connection to Next.js
	 */
	public function test_connection( $request ) {
		$nextjs_url = flatwp_react()->get_setting( 'nextjs_url' );

		if ( empty( $nextjs_url ) ) {
			return new WP_Error(
				'no_url',
				__( 'Next.js URL not configured', 'flatwp-react' ),
				array( 'status' => 400 )
			);
		}

		$health_url = trailingslashit( $nextjs_url ) . 'api/health';
		$start_time = microtime( true );
		$response = wp_remote_get(
			$health_url,
			array(
				'timeout' => 10,
				'headers' => array(
					'User-Agent' => 'FlatWP-React/' . FLATWP_REACT_VERSION,
				),
			)
		);
		$response_time = round( ( microtime( true ) - $start_time ) * 1000, 2 );

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();

			set_transient( 'flatwp_react_connection_test_result', 'failed', HOUR_IN_SECONDS );
			set_transient( 'flatwp_react_connection_test_timestamp', current_time( 'timestamp' ), HOUR_IN_SECONDS );

			$status = array(
				'connected'     => false,
				'url'           => $nextjs_url,
				'response_time' => $response_time,
				'last_tested'   => current_time( 'timestamp' ),
				'http_code'     => null,
				'error_message' => $error_message,
			);

			return rest_ensure_response(
				array(
					'success' => false,
					'data'    => $status,
					'message' => $error_message,
				)
			);
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$connected = $response_code === 200;

		set_transient( 'flatwp_react_connection_test_result', $connected ? 'success' : 'failed', HOUR_IN_SECONDS );
		set_transient( 'flatwp_react_connection_test_timestamp', current_time( 'timestamp' ), HOUR_IN_SECONDS );
		set_transient(
			'flatwp_react_connection_test_details',
			array(
				'http_code'     => $response_code,
				'response_time' => $response_time,
			),
			HOUR_IN_SECONDS
		);

		$status = array(
			'connected'     => $connected,
			'url'           => $nextjs_url,
			'response_time' => $response_time,
			'last_tested'   => current_time( 'timestamp' ),
			'http_code'     => $response_code,
		);

		return rest_ensure_response(
			array(
				'success' => $connected,
				'data'    => $status,
				'message' => $connected ? __( 'Connection successful', 'flatwp-react' ) : __( 'Connection failed', 'flatwp-react' ),
			)
		);
	}

	/**
	 * Get cache statistics
	 */
	public function get_cache_stats( $request ) {
		$stats = $this->get_cached_cache_stats();

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => $stats,
			)
		);
	}

	/**
	 * Clear cache
	 */
	public function clear_cache( $request ) {
		$type = $request->get_param( 'type' );
		$revalidation = flatwp_react()->revalidation;

		if ( ! $revalidation ) {
			return new WP_Error(
				'revalidation_unavailable',
				__( 'Revalidation functionality not available', 'flatwp-react' ),
				array( 'status' => 500 )
			);
		}

		$paths = $this->get_paths_by_type( $type );
		$result = $revalidation->trigger_revalidation( $paths );

		if ( is_wp_error( $result ) ) {
			// Logging is already handled in trigger_revalidation()
			return $result;
		}

		// Logging is already handled in trigger_revalidation() with detailed metrics

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => __( 'Cache cleared successfully', 'flatwp-react' ),
				'data'    => array(
					'type'  => $type,
					'paths' => $paths,
				),
			)
		);
	}

	/**
	 * Clear specific path cache
	 */
	public function clear_path_cache( $request ) {
		$path = $request->get_param( 'path' );
		$revalidation = flatwp_react()->revalidation;

		if ( ! $revalidation ) {
			return new WP_Error(
				'revalidation_unavailable',
				__( 'Revalidation functionality not available', 'flatwp-react' ),
				array( 'status' => 500 )
			);
		}

		$result = $revalidation->trigger_revalidation( array( $path ) );

		if ( is_wp_error( $result ) ) {
			// Logging is already handled in trigger_revalidation()
			return $result;
		}

		// Logging is already handled in trigger_revalidation() with detailed metrics

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => sprintf( __( 'Cache cleared for path: %s', 'flatwp-react' ), $path ),
			)
		);
	}

	/**
	 * Get settings
	 */
	public function get_settings( $request ) {
		$settings = get_option( 'flatwp_react_settings', array() );

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => $settings,
			)
		);
	}

	/**
	 * Update settings
	 */
	public function update_settings( $request ) {
		$new_settings = $request->get_json_params();
		$current_settings = get_option( 'flatwp_react_settings', array() );

		// Sanitize settings
		$sanitized_settings = $this->sanitize_settings( $new_settings );

		// Merge with current settings
		$updated_settings = array_merge( $current_settings, $sanitized_settings );
		update_option( 'flatwp_react_settings', $updated_settings );

		// Log the activity
		$this->log_activity( 'settings_updated', 'info', 'Plugin settings updated' );

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => __( 'Settings updated successfully', 'flatwp-react' ),
				'data'    => $updated_settings,
			)
		);
	}

	/**
	 * Get activity logs
	 */
	public function get_logs( $request ) {
		$page = $request->get_param( 'page' );
		$per_page = $request->get_param( 'per_page' );
		$type = $request->get_param( 'type' );

		$logs = get_option( 'flatwp_react_activity_logs', array() );

		// Filter by type if specified
		if ( $type && $type !== 'all' ) {
			$logs = array_filter( $logs, function( $log ) use ( $type ) {
				return $log['type'] === $type;
			});
		}

		// Sort by timestamp (newest first)
		usort( $logs, function( $a, $b ) {
			return $b['timestamp'] - $a['timestamp'];
		});

		// Paginate
		$total = count( $logs );
		$offset = ( $page - 1 ) * $per_page;
		$logs = array_slice( $logs, $offset, $per_page );

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => array(
					'logs'  => $logs,
					'total' => $total,
					'pages' => ceil( $total / $per_page ),
				),
			)
		);
	}

	/**
	 * Get performance metrics
	 */
	public function get_performance_metrics( $request ) {
		$period = $request->get_param( 'period' );

		// This would integrate with real performance monitoring
		// For now, return simulated data
		$metrics = array(
			'period'            => $period,
			'average_load_time' => 1.2,
			'lcp'               => 1.8,
			'fcp'               => 0.9,
			'ttfb'              => 0.3,
			'requests'          => 1250,
			'cache_hits'        => 980,
			'cache_misses'      => 270,
		);

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => $metrics,
			)
		);
	}

	/**
	 * Get recent posts
	 */
	public function get_recent_posts( $request ) {
		$limit = $request->get_param( 'limit' );

		$posts = get_posts(
			array(
				'numberposts' => $limit,
				'post_status' => array( 'publish', 'draft', 'pending' ),
				'orderby'     => 'modified',
				'order'       => 'DESC',
			)
		);

		$formatted_posts = array_map( function( $post ) {
			return array(
				'id'            => $post->ID,
				'title'         => get_the_title( $post ),
				'status'        => get_post_status( $post ),
				'modified'      => get_the_modified_date( 'c', $post ),
				'modified_ago'  => human_time_diff( get_the_modified_time( 'U', $post ), current_time( 'timestamp' ) ),
				'author'        => get_the_author_meta( 'display_name', $post->post_author ),
				'type'          => get_post_type( $post ),
				'edit_url'      => get_edit_post_link( $post->ID, 'raw' ),
			);
		}, $posts );

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => $formatted_posts,
			)
		);
	}

	/**
	 * Helper: Get cached connection status
	 */
	private function get_cached_connection_status() {
		$test_result = get_transient( 'flatwp_react_connection_test_result' );
		$test_timestamp = get_transient( 'flatwp_react_connection_test_timestamp' );
		$test_details = get_transient( 'flatwp_react_connection_test_details' );
		$nextjs_url = flatwp_react()->get_setting( 'nextjs_url' );

		// Ensure last_tested returns null instead of false
		if ( false === $test_timestamp || empty( $test_timestamp ) ) {
			$test_timestamp = null;
		}

		return array(
			'connected'     => $test_result === 'success',
			'url'           => $nextjs_url,
			'response_time' => isset( $test_details['response_time'] ) ? $test_details['response_time'] : null,
			'last_tested'   => $test_timestamp,
			'http_code'     => isset( $test_details['http_code'] ) ? $test_details['http_code'] : null,
		);
	}

	/**
	 * Helper: Get cached cache stats
	 */
	private function get_cached_cache_stats() {
		$total_posts = wp_count_posts( 'post' )->publish;
		$total_pages = wp_count_posts( 'page' )->publish;
		$total_paths = $total_posts + $total_pages + 1; // +1 for homepage

		// Calculate cache entries (pages + blog archives)
		$total_entries = $total_paths + ceil( $total_posts / 10 ); // Assuming 10 posts per archive page

		// Estimate cache size (very rough estimate: ~50KB per cached page)
		$total_size = $total_entries * 50 * 1024; // 50KB per entry in bytes

		// Get last cleared timestamp, return null if not set
		$last_cleared = get_option( 'flatwp_react_cache_last_cleared' );
		if ( false === $last_cleared || empty( $last_cleared ) ) {
			$last_cleared = null;
		}

		return array(
			'total_paths'   => $total_paths,
			'cached_paths'  => round( $total_paths * 0.85 ),
			'hit_rate'      => 85.0,
			'last_cleared'  => $last_cleared,
			'total_entries' => $total_entries,
			'total_size'    => $total_size,
		);
	}

	/**
	 * Helper: Get paths by cache type
	 */
	private function get_paths_by_type( $type ) {
		switch ( $type ) {
			case 'homepage':
				return array( '/' );
			case 'posts':
				return array( '/blog' );
			case 'pages':
				$pages = get_posts( array( 'post_type' => 'page', 'numberposts' => -1 ) );
				return array_map( function( $page ) {
					return '/' . $page->post_name;
				}, $pages );
			case 'all':
			default:
				return array( '/', '/blog' );
		}
	}

	/**
	 * Helper: Sanitize settings
	 */
	private function sanitize_settings( $settings ) {
		$sanitized = array();

		$string_fields = array( 'nextjs_url', 'revalidation_secret', 'preview_secret', 'preview_url_pattern', 'cache_strategy_posts', 'cache_strategy_pages', 'log_level' );
		$int_fields = array( 'revalidation_delay', 'max_concurrent_webhooks', 'webhook_timeout', 'preview_token_expiration', 'cache_strategy_categories', 'cache_strategy_tags', 'cache_strategy_homepage' );
		$bool_fields = array( 'enable_revalidation', 'webhook_enabled', 'enable_preview', 'enable_debug', 'show_admin_notices' );

		foreach ( $string_fields as $field ) {
			if ( isset( $settings[ $field ] ) ) {
				$sanitized[ $field ] = sanitize_text_field( $settings[ $field ] );
			}
		}

		foreach ( $int_fields as $field ) {
			if ( isset( $settings[ $field ] ) ) {
				$sanitized[ $field ] = absint( $settings[ $field ] );
			}
		}

		foreach ( $bool_fields as $field ) {
			if ( isset( $settings[ $field ] ) ) {
				$sanitized[ $field ] = (bool) $settings[ $field ];
			}
		}

		return $sanitized;
	}

	/**
	 * Helper: Log activity
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
