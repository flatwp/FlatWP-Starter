<?php
/**
 * GraphQL Extensions Class
 *
 * Extends WPGraphQL with custom fields for FlatWP features.
 *
 * @package FlatWP_React
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * FlatWP GraphQL Extensions Class
 */
class FlatWP_React_GraphQL_Extensions {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 */
	private function init_hooks() {
		// Only initialize if WPGraphQL is active.
		if ( ! class_exists( 'WPGraphQL' ) ) {
			add_action( 'admin_notices', array( $this, 'wpgraphql_not_active_notice' ) );
			return;
		}

		// Register custom fields.
		add_action( 'graphql_register_types', array( $this, 'register_seo_fields' ) );
		// Featured post field no longer needed - using WordPress built-in isSticky field
		// add_action( 'graphql_register_types', array( $this, 'register_featured_post_field' ) );
		add_action( 'graphql_register_types', array( $this, 'register_revalidate_time_field' ) );
		add_action( 'graphql_register_types', array( $this, 'register_page_settings_field' ) );
		add_action( 'graphql_register_types', array( $this, 'register_settings_query' ) );
		add_action( 'graphql_register_types', array( $this, 'register_search_index_query' ) );
	}

	/**
	 * Show admin notice if WPGraphQL is not active.
	 */
	public function wpgraphql_not_active_notice() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		?>
		<div class="notice notice-warning">
			<p>
				<strong><?php esc_html_e( 'FlatWP Companion:', 'flatwp-react' ); ?></strong>
				<?php
				printf(
					/* translators: %s: WPGraphQL plugin link */
					esc_html__( 'WPGraphQL plugin is required for GraphQL features. %s', 'flatwp-react' ),
					'<a href="https://wordpress.org/plugins/wp-graphql/" target="_blank">' . esc_html__( 'Install WPGraphQL', 'flatwp-react' ) . '</a>'
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Register SEO metadata fields for Post and Page types.
	 */
	public function register_seo_fields() {
		// Only if SEO integration is enabled.
		if ( ! flatwp_react()->get_setting( 'enable_seo_integration', true ) ) {
			return;
		}

		// Register SEO type.
		register_graphql_object_type( 'SEOMetadata', array(
			'description' => __( 'SEO metadata for posts and pages', 'flatwp-react' ),
			'fields'      => array(
				'title'       => array(
					'type'        => 'String',
					'description' => __( 'SEO title', 'flatwp-react' ),
				),
				'description' => array(
					'type'        => 'String',
					'description' => __( 'SEO description', 'flatwp-react' ),
				),
				'canonical'   => array(
					'type'        => 'String',
					'description' => __( 'Canonical URL', 'flatwp-react' ),
				),
				'robots'      => array(
					'type'        => 'String',
					'description' => __( 'Robots meta tag', 'flatwp-react' ),
				),
			),
		) );

		// Register Open Graph type.
		register_graphql_object_type( 'OpenGraphMetadata', array(
			'description' => __( 'Open Graph metadata', 'flatwp-react' ),
			'fields'      => array(
				'title'       => array(
					'type'        => 'String',
					'description' => __( 'Open Graph title', 'flatwp-react' ),
				),
				'description' => array(
					'type'        => 'String',
					'description' => __( 'Open Graph description', 'flatwp-react' ),
				),
				'image'       => array(
					'type'        => 'String',
					'description' => __( 'Open Graph image URL', 'flatwp-react' ),
				),
			),
		) );

		// Register Twitter Card type.
		register_graphql_object_type( 'TwitterCardMetadata', array(
			'description' => __( 'Twitter Card metadata', 'flatwp-react' ),
			'fields'      => array(
				'title'       => array(
					'type'        => 'String',
					'description' => __( 'Twitter Card title', 'flatwp-react' ),
				),
				'description' => array(
					'type'        => 'String',
					'description' => __( 'Twitter Card description', 'flatwp-react' ),
				),
				'image'       => array(
					'type'        => 'String',
					'description' => __( 'Twitter Card image URL', 'flatwp-react' ),
				),
			),
		) );

		// Register complete SEO data type.
		register_graphql_object_type( 'SEO', array(
			'description' => __( 'Complete SEO metadata', 'flatwp-react' ),
			'fields'      => array(
				'meta'    => array(
					'type'        => 'SEOMetadata',
					'description' => __( 'Basic SEO metadata', 'flatwp-react' ),
				),
				'og'      => array(
					'type'        => 'OpenGraphMetadata',
					'description' => __( 'Open Graph metadata', 'flatwp-react' ),
				),
				'twitter' => array(
					'type'        => 'TwitterCardMetadata',
					'description' => __( 'Twitter Card metadata', 'flatwp-react' ),
				),
				'schema'  => array(
					'type'        => 'String',
					'description' => __( 'JSON-LD structured data', 'flatwp-react' ),
				),
			),
		) );

		// Add SEO field to content types.
		$post_types = get_post_types( array( 'public' => true ), 'names' );
		foreach ( $post_types as $post_type ) {
			$graphql_type = ucfirst( $post_type );

			register_graphql_field( $graphql_type, 'seo', array(
				'type'        => 'SEO',
				'description' => __( 'SEO metadata from installed SEO plugin or defaults', 'flatwp-react' ),
				'resolve'     => function( $post ) {
					$seo_integration = flatwp_react()->seo_integration;
					if ( ! $seo_integration ) {
						return null;
					}

					// Get metadata.
					$metadata = $seo_integration->get_seo_metadata( $post->ID );

					// Build return structure.
					$seo_data = array(
						'meta' => array(
							'title'       => isset( $metadata['title'] ) ? $metadata['title'] : null,
							'description' => isset( $metadata['description'] ) ? $metadata['description'] : null,
							'canonical'   => isset( $metadata['canonical'] ) ? $metadata['canonical'] : null,
							'robots'      => isset( $metadata['robots'] ) ? $metadata['robots'] : null,
						),
					);

					// Add Open Graph if available.
					if ( isset( $metadata['og'] ) ) {
						$seo_data['og'] = $metadata['og'];
					}

					// Add Twitter Card if available.
					if ( isset( $metadata['twitter'] ) ) {
						$seo_data['twitter'] = $metadata['twitter'];
					}

					// Add structured data.
					$schema = $seo_integration->get_structured_data( $post->ID );
					if ( $schema ) {
						$seo_data['schema'] = wp_json_encode( $schema );
					}

					return $seo_data;
				},
			) );
		}
	}

	/**
	 * Register featured post field for Post type.
	 */
	public function register_featured_post_field() {
		// Register boolean field for featured status.
		register_graphql_field( 'Post', 'isFeatured', array(
			'type'        => 'Boolean',
			'description' => __( 'Whether this post is marked as featured', 'flatwp-react' ),
			'resolve'     => function( $post ) {
				return (bool) get_post_meta( $post->ID, '_is_featured', true );
			},
		) );
	}

	/**
	 * Register revalidate time field for content types.
	 */
	public function register_revalidate_time_field() {
		$cache_manager = flatwp_react()->cache_manager;
		if ( ! $cache_manager ) {
			return;
		}

		// Register for all public post types.
		$post_types = get_post_types( array( 'public' => true ), 'names' );
		foreach ( $post_types as $post_type ) {
			$graphql_type = ucfirst( $post_type );

			register_graphql_field( $graphql_type, 'revalidateTime', array(
				'type'        => 'Int',
				'description' => __( 'ISR revalidate time in seconds for Next.js caching', 'flatwp-react' ),
				'resolve'     => function( $post ) use ( $cache_manager ) {
					return $cache_manager->get_revalidate_time( $post->ID, get_post_type( $post->ID ) );
				},
			) );
		}
	}

	/**
	 * Register page settings field for Page type.
	 */
	public function register_page_settings_field() {
		$page_settings = flatwp_react()->page_settings;
		if ( ! $page_settings ) {
			return;
		}

		// Register FlatWPPageSettings type.
		register_graphql_object_type( 'FlatWPPageSettings', array(
			'description' => __( 'FlatWP page-specific settings', 'flatwp-react' ),
			'fields'      => array(
				'hideTitle' => array(
					'type'        => 'Boolean',
					'description' => __( 'Whether to hide the page title', 'flatwp-react' ),
				),
				'containerWidth' => array(
					'type'        => 'String',
					'description' => __( 'Container width setting: default, contained, or full-width', 'flatwp-react' ),
				),
				'hideHeader' => array(
					'type'        => 'Boolean',
					'description' => __( 'Whether to hide the site header', 'flatwp-react' ),
				),
				'hideFooter' => array(
					'type'        => 'Boolean',
					'description' => __( 'Whether to hide the site footer', 'flatwp-react' ),
				),
				'customCssClass' => array(
					'type'        => 'String',
					'description' => __( 'Custom CSS classes for the page', 'flatwp-react' ),
				),
				'showSidebar' => array(
					'type'        => 'Boolean',
					'description' => __( 'Whether to show the sidebar on this page', 'flatwp-react' ),
				),
			),
		) );

		// Add flatwpSettings field to Page type.
		register_graphql_field( 'Page', 'flatwpSettings', array(
			'type'        => 'FlatWPPageSettings',
			'description' => __( 'FlatWP page settings', 'flatwp-react' ),
			'resolve'     => function( $page ) use ( $page_settings ) {
				return $page_settings->get_settings( $page->ID );
			},
		) );

		// Register ACF flexible content field for sidebar blocks.
		// This leverages WPGraphQL for ACF plugin to expose the sidebar_blocks field.
		// The actual field registration happens in ACF, this just documents it.
		// WPGraphQL for ACF automatically exposes ACF fields to GraphQL.
	}

	/**
	 * Register settings query.
	 */
	public function register_settings_query() {
		register_graphql_object_type( 'FlatWPSettings', array(
			'description' => __( 'FlatWP plugin settings', 'flatwp-react' ),
			'fields'      => array(
				'version'           => array(
					'type'        => 'String',
					'description' => __( 'Plugin version', 'flatwp-react' ),
				),
				'enablePreview'     => array(
					'type'        => 'Boolean',
					'description' => __( 'Whether preview mode is enabled', 'flatwp-react' ),
				),
				'enableBlurPlaceholder' => array(
					'type'        => 'Boolean',
					'description' => __( 'Whether blur placeholders are enabled', 'flatwp-react' ),
				),
				'enableSearchIndex' => array(
					'type'        => 'Boolean',
					'description' => __( 'Whether search index is enabled', 'flatwp-react' ),
				),
				'searchIndexUrl'    => array(
					'type'        => 'String',
					'description' => __( 'URL to search index JSON file', 'flatwp-react' ),
				),
				'seoPlugin'         => array(
					'type'        => 'String',
					'description' => __( 'Active SEO plugin', 'flatwp-react' ),
				),
			),
		) );

		register_graphql_field( 'RootQuery', 'flatwpSettings', array(
			'type'        => 'FlatWPSettings',
			'description' => __( 'Get FlatWP plugin settings', 'flatwp-react' ),
			'resolve'     => function() {
				$settings = array(
					'version'              => FLATWP_VERSION,
					'enablePreview'        => flatwp_react()->get_setting( 'enable_preview', true ),
					'enableBlurPlaceholder' => flatwp_react()->get_setting( 'enable_blur_placeholder', true ),
					'enableSearchIndex'    => flatwp_react()->get_setting( 'enable_search_index', false ),
				);

				// Add search index URL if enabled.
				if ( $settings['enableSearchIndex'] ) {
					$search_index = flatwp_react()->search_index;
					if ( $search_index ) {
						$settings['searchIndexUrl'] = $search_index->get_index_url();
					}
				}

				// Add SEO plugin info.
				$seo_integration = flatwp_react()->seo_integration;
				if ( $seo_integration ) {
					$settings['seoPlugin'] = $seo_integration->get_active_plugin();
				}

				return $settings;
			},
		) );
	}

	/**
	 * Register search index query.
	 */
	public function register_search_index_query() {
		// Only if search index is enabled.
		if ( ! flatwp_react()->get_setting( 'enable_search_index', false ) ) {
			return;
		}

		register_graphql_object_type( 'SearchIndexMetadata', array(
			'description' => __( 'Search index metadata', 'flatwp-react' ),
			'fields'      => array(
				'url'       => array(
					'type'        => 'String',
					'description' => __( 'URL to search index JSON file', 'flatwp-react' ),
				),
				'version'   => array(
					'type'        => 'String',
					'description' => __( 'Index version/timestamp', 'flatwp-react' ),
				),
				'generated' => array(
					'type'        => 'String',
					'description' => __( 'When the index was generated', 'flatwp-react' ),
				),
				'postCount' => array(
					'type'        => 'Int',
					'description' => __( 'Number of posts in the index', 'flatwp-react' ),
				),
				'fileSize'  => array(
					'type'        => 'Int',
					'description' => __( 'Index file size in bytes', 'flatwp-react' ),
				),
			),
		) );

		register_graphql_field( 'RootQuery', 'searchIndexMetadata', array(
			'type'        => 'SearchIndexMetadata',
			'description' => __( 'Get search index metadata', 'flatwp-react' ),
			'resolve'     => function() {
				$search_index = flatwp_react()->search_index;
				if ( ! $search_index ) {
					return null;
				}

				return $search_index->get_index_metadata();
			},
		) );
	}

	/**
	 * Get GraphQL endpoint URL.
	 *
	 * @return string
	 */
	public function get_endpoint_url() {
		if ( ! function_exists( 'get_graphql_endpoint' ) ) {
			return home_url( '/graphql' );
		}

		return get_graphql_endpoint();
	}

	/**
	 * Check if WPGraphQL is active.
	 *
	 * @return bool
	 */
	public function is_wpgraphql_active() {
		return class_exists( 'WPGraphQL' );
	}
}
