<?php
/**
 * Plugin Name: FlatWP React Companion
 * Plugin URI: https://flatwp.com
 * Description: Modern React-powered admin dashboard for FlatWP with Next.js integration, cache management, and real-time monitoring.
 * Version: 0.1.2
 * Author: FlatWP
 * Author URI: https://flatwp.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flatwp-react
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 *
 * @package FlatWP_React
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( 'FLATWP_REACT_VERSION', '1.0.6' );
define( 'FLATWP_REACT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'FLATWP_REACT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'FLATWP_REACT_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main FlatWP React Companion Class
 *
 * @since 1.0.0
 */
final class FlatWP_React_Companion {

	/**
	 * Plugin instance.
	 *
	 * @var FlatWP_React_Companion
	 */
	private static $instance = null;

	/**
	 * Settings instance.
	 *
	 * @var FlatWP_React_Settings
	 */
	public $settings;

	/**
	 * Revalidation instance.
	 *
	 * @var FlatWP_React_Revalidation
	 */
	public $revalidation;

	/**
	 * Preview instance.
	 *
	 * @var FlatWP_React_Preview
	 */
	public $preview;

	/**
	 * Cache Manager instance.
	 *
	 * @var FlatWP_React_Cache_Manager
	 */
	public $cache_manager;

	/**
	 * REST API instance.
	 *
	 * @var FlatWP_React_REST_API
	 */
	public $rest_api;

	/**
	 * Admin instance.
	 *
	 * @var FlatWP_React_Admin
	 */
	public $admin;

	/**
	 * ACF Fields instance.
	 *
	 * @var FlatWP_React_ACF_Fields
	 */
	public $acf_fields;

	/**
	 * Page Settings instance.
	 *
	 * @var FlatWP_React_Page_Settings
	 */
	public $page_settings;

	/**
	 * GraphQL Extensions instance.
	 *
	 * @var FlatWP_React_GraphQL_Extensions
	 */
	public $graphql;

	/**
	 * Get plugin instance.
	 *
	 * @return FlatWP_React_Companion
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->load_dependencies();
		$this->init_hooks();
	}

	/**
	 * Load required dependencies.
	 */
	private function load_dependencies() {
		// Core classes.
		require_once FLATWP_REACT_PLUGIN_DIR . 'includes/class-flatwp-react-settings.php';
		require_once FLATWP_REACT_PLUGIN_DIR . 'includes/class-flatwp-react-revalidation.php';
		require_once FLATWP_REACT_PLUGIN_DIR . 'includes/class-flatwp-react-preview.php';
		require_once FLATWP_REACT_PLUGIN_DIR . 'includes/class-flatwp-react-cache-manager.php';
		require_once FLATWP_REACT_PLUGIN_DIR . 'includes/class-flatwp-react-acf-fields.php';
		require_once FLATWP_REACT_PLUGIN_DIR . 'includes/class-flatwp-react-page-settings.php';

		// GraphQL.
		require_once FLATWP_REACT_PLUGIN_DIR . 'graphql/class-flatwp-react-graphql-extensions.php';

		// API.
		require_once FLATWP_REACT_PLUGIN_DIR . 'api/class-flatwp-react-rest-api.php';

		// Admin.
		if ( is_admin() ) {
			require_once FLATWP_REACT_PLUGIN_DIR . 'includes/class-flatwp-react-admin.php';
		}
	}

	/**
	 * Initialize hooks.
	 */
	private function init_hooks() {
		// Activation and deactivation hooks.
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

		// Initialize components.
		add_action( 'plugins_loaded', array( $this, 'init' ), 10 );

		// Load text domain.
		add_action( 'init', array( $this, 'load_textdomain' ) );
	}

	/**
	 * Initialize plugin components.
	 */
	public function init() {
		// Initialize core classes.
		$this->settings       = new FlatWP_React_Settings();
		$this->revalidation   = new FlatWP_React_Revalidation();
		$this->preview        = new FlatWP_React_Preview();
		$this->cache_manager  = new FlatWP_React_Cache_Manager();
		$this->acf_fields     = new FlatWP_React_ACF_Fields();
		$this->page_settings  = new FlatWP_React_Page_Settings();
		$this->graphql        = new FlatWP_React_GraphQL_Extensions();
		$this->rest_api       = new FlatWP_React_REST_API();

		// Initialize admin interface.
		if ( is_admin() ) {
			$this->admin = new FlatWP_React_Admin();
		}

		// Fire init action for extensions.
		do_action( 'flatwp_react_init', $this );
	}

	/**
	 * Plugin activation.
	 */
	public function activate() {
		// Check WordPress version.
		if ( version_compare( get_bloginfo( 'version' ), '6.0', '<' ) ) {
			deactivate_plugins( FLATWP_REACT_PLUGIN_BASENAME );
			wp_die(
				esc_html__( 'FlatWP React Companion requires WordPress 6.0 or higher.', 'flatwp-react' ),
				esc_html__( 'Plugin Activation Error', 'flatwp-react' ),
				array( 'back_link' => true )
			);
		}

		// Check PHP version.
		if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
			deactivate_plugins( FLATWP_REACT_PLUGIN_BASENAME );
			wp_die(
				esc_html__( 'FlatWP React Companion requires PHP 7.4 or higher.', 'flatwp-react' ),
				esc_html__( 'Plugin Activation Error', 'flatwp-react' ),
				array( 'back_link' => true )
			);
		}

		// Set default options.
		$this->set_default_options();

		// Create upload directory.
		$upload_dir = wp_upload_dir();
		$flatwp_dir = $upload_dir['basedir'] . '/flatwp-react';
		if ( ! file_exists( $flatwp_dir ) ) {
			wp_mkdir_p( $flatwp_dir );
		}

		// Flush rewrite rules.
		flush_rewrite_rules();

		// Set activation flag.
		set_transient( 'flatwp_react_activated', true, 30 );
	}

	/**
	 * Plugin deactivation.
	 */
	public function deactivate() {
		// Clear scheduled events.
		wp_clear_scheduled_hook( 'flatwp_react_revalidation_retry' );

		// Flush rewrite rules.
		flush_rewrite_rules();
	}

	/**
	 * Set default plugin options.
	 */
	private function set_default_options() {
		$defaults = array(
			// General settings.
			'nextjs_url'                => '',
			'revalidation_secret'       => wp_generate_password( 32, false ),
			'preview_secret'            => wp_generate_password( 32, false ),
			'enable_revalidation'       => true,
			'webhook_enabled'           => true,
			'revalidation_delay'        => 0,
			'max_concurrent_webhooks'   => 3,
			'webhook_timeout'           => 30,
			'enable_preview'            => true,
			'preview_url_pattern'       => '/api/preview?secret={secret}&id={id}&type={type}',
			'preview_token_expiration'  => 3600,

			// Cache settings.
			'cache_strategy_posts'      => 'on-demand',
			'cache_strategy_pages'      => 'static',
			'cache_strategy_categories' => '900',
			'cache_strategy_tags'       => '900',
			'cache_strategy_homepage'   => '60',

			// Developer settings.
			'enable_debug'              => false,
			'show_admin_notices'        => true,
			'log_level'                 => 'error',
		);

		// Only set defaults if option doesn't exist.
		if ( ! get_option( 'flatwp_react_settings' ) ) {
			add_option( 'flatwp_react_settings', $defaults );
		}
	}

	/**
	 * Load plugin text domain.
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'flatwp-react',
			false,
			dirname( FLATWP_REACT_PLUGIN_BASENAME ) . '/languages'
		);
	}

	/**
	 * Get plugin setting.
	 *
	 * @param string $key     Setting key.
	 * @param mixed  $default Default value.
	 * @return mixed
	 */
	public function get_setting( $key, $default = null ) {
		$settings = get_option( 'flatwp_react_settings', array() );
		return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
	}

	/**
	 * Update plugin setting.
	 *
	 * @param string $key   Setting key.
	 * @param mixed  $value Setting value.
	 * @return bool
	 */
	public function update_setting( $key, $value ) {
		$settings = get_option( 'flatwp_react_settings', array() );
		$settings[ $key ] = $value;
		return update_option( 'flatwp_react_settings', $settings );
	}
}

/**
 * Get main plugin instance.
 *
 * @return FlatWP_React_Companion
 */
function flatwp_react() {
	return FlatWP_React_Companion::instance();
}

// Initialize plugin.
flatwp_react();
