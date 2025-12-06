<?php
/**
 * FlatWP React Admin Class
 *
 * Handles loading and rendering the React admin app
 *
 * @package FlatWP_React
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FlatWP_React_Admin {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_admin_pages' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_app' ) );
	}

	public function register_admin_pages() {
		add_menu_page(
			__( 'FlatWP React', 'flatwp-react' ),
			__( 'FlatWP', 'flatwp-react' ),
			'manage_options',
			'flatwp-react',
			array( $this, 'render_admin_app' ),
			'data:image/svg+xml;base64,' . base64_encode( '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3v7h8l-10 11v-7H3l10-11z"/></svg>' ),
			30
		);
	}

	public function enqueue_admin_app( $hook ) {
		// Only load on FlatWP React admin pages
		if ( strpos( $hook, 'flatwp-react' ) === false ) {
			return;
		}

		// Check if compiled app exists
		$asset_file = FLATWP_REACT_PLUGIN_DIR . 'admin-react/dist/assets/index.js';

		if ( ! file_exists( $asset_file ) ) {
			add_action(
				'admin_notices',
				function() {
					?>
					<div class="notice notice-error">
						<p>
							<strong><?php esc_html_e( 'FlatWP React:', 'flatwp-react' ); ?></strong>
							<?php esc_html_e( 'React admin app not compiled. Please run: cd admin-react && npm install && npm run build', 'flatwp-react' ); ?>
						</p>
					</div>
					<?php
				}
			);
			return;
		}

		// Enqueue the built React app
		$asset_url = FLATWP_REACT_PLUGIN_URL . 'admin-react/dist/assets/index.js';
		$css_url = FLATWP_REACT_PLUGIN_URL . 'admin-react/dist/assets/index.css';

		wp_enqueue_script(
			'flatwp-react-admin-app',
			$asset_url,
			array(),
			FLATWP_REACT_VERSION,
			true
		);

		// Add type="module" attribute for ES modules
		add_filter(
			'script_loader_tag',
			function( $tag, $handle, $src ) {
				if ( 'flatwp-react-admin-app' === $handle ) {
					$tag = '<script type="module" crossorigin src="' . esc_url( $src ) . '"></script>';
				}
				return $tag;
			},
			10,
			3
		);

		if ( file_exists( FLATWP_REACT_PLUGIN_DIR . 'admin-react/dist/assets/index.css' ) ) {
			wp_enqueue_style(
				'flatwp-react-admin-app',
				$css_url,
				array(),
				FLATWP_REACT_VERSION
			);
		}

		// Localize script with data - MUST come before script tag is printed
		wp_localize_script(
			'flatwp-react-admin-app',
			'flatwpReactAdmin',
			array(
				'apiUrl'    => rest_url( 'flatwp-react/v1' ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'pluginUrl' => FLATWP_REACT_PLUGIN_URL,
				'version'   => FLATWP_REACT_VERSION,
				'siteUrl'   => get_site_url(),
				'adminUrl'  => admin_url(),
			)
		);
	}

	public function render_admin_app() {
		?>
		<div class="wrap">
			<div id="flatwp-react-root"></div>
		</div>
		<?php
	}
}
