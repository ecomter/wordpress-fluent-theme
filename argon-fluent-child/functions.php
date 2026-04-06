<?php
/**
 * Argon Fluent Child Theme — functions.php
 *
 * Responsibilities:
 *  1. Enqueue the parent Argon theme stylesheet.
 *  2. Enqueue the child theme stylesheet (Fluent Design overrides).
 *  3. Load Fluent UI Web Components via CDN (no build step required).
 *
 * Usage / Setup:
 *  1. Download the Argon parent theme from https://github.com/solstice23/argon-theme
 *     and install it via WP Admin → Appearance → Themes → Add New → Upload Theme.
 *  2. Upload this child-theme folder (argon-fluent-child/) to /wp-content/themes/.
 *  3. In WP Admin → Appearance → Themes, activate "Argon Fluent Child".
 *  4. Customise Fluent Design tokens in style.css (:root block) to match your brand.
 *
 * @package argon-fluent-child
 * @version 0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Prevent direct file access.
}

// ---------------------------------------------------------------------------
// 1. Enqueue parent + child stylesheets and Fluent UI Web Components
// ---------------------------------------------------------------------------
add_action( 'wp_enqueue_scripts', 'argon_fluent_child_enqueue_assets' );

/**
 * Enqueue all front-end assets for the child theme.
 *
 * Load order:
 *   argon-parent-style  → the full Argon parent CSS
 *   argon-fluent-style  → our Fluent Design overrides (child style.css)
 *   fluent-web-components → Fluent UI Web Components bundle via CDN
 */
function argon_fluent_child_enqueue_assets() {

    // ------------------------------------------------------------------
    // Parent theme stylesheet
    // Using get_template_directory_uri() always points to the parent.
    // ------------------------------------------------------------------
    wp_enqueue_style(
        'argon-parent-style',
        get_template_directory_uri() . '/style.css',
        array(),    // no dependencies
        null        // let WordPress use the parent's version
    );

    // ------------------------------------------------------------------
    // Child theme stylesheet — Fluent Design System overrides
    // Depends on the parent so it is loaded after it.
    // ------------------------------------------------------------------
    wp_enqueue_style(
        'argon-fluent-style',
        get_stylesheet_uri(),           // points to this child's style.css
        array( 'argon-parent-style' ),  // loads after parent
        '0.1.0'
    );

    // ------------------------------------------------------------------
    // Fluent UI Web Components (Microsoft)
    // CDN: jsDelivr mirror of @fluentui/web-components
    //
    // The bundle registers custom elements such as <fluent-button>,
    // <fluent-card>, <fluent-text-input>, etc. which can be used
    // in theme templates, widgets, or the block editor without any
    // build step on your server.
    //
    // Version pin: update the version string here when you want to
    // upgrade. Check https://github.com/microsoft/fluentui/releases
    // for the latest @fluentui/web-components release.
    // ------------------------------------------------------------------
    wp_enqueue_script(
        'fluent-web-components',
        'https://cdn.jsdelivr.net/npm/@fluentui/web-components@3/dist/web-components.min.js',
        array(),    // no JS dependencies
        null,       // version handled by the CDN URL
        true        // load in footer to avoid blocking page render
    );
}

// ---------------------------------------------------------------------------
// 2. Add "type=module" to the Fluent Web Components script tag
//    The @fluentui/web-components v3 bundle is an ES module.
// ---------------------------------------------------------------------------
add_filter( 'script_loader_tag', 'argon_fluent_child_module_script', 10, 3 );

/**
 * Adds type="module" to the Fluent Web Components <script> tag.
 *
 * @param string $tag    The <script> HTML tag.
 * @param string $handle The registered script handle.
 * @param string $src    The script URL.
 * @return string Modified tag.
 */
function argon_fluent_child_module_script( $tag, $handle, $src ) {
    if ( 'fluent-web-components' === $handle ) {
        // Replace the standard <script src=…> with a module script.
        $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>' . "\n";
    }
    return $tag;
}

// ---------------------------------------------------------------------------
// 3. Register child-theme textdomain for future translations
// ---------------------------------------------------------------------------
add_action( 'after_setup_theme', 'argon_fluent_child_load_textdomain' );

/**
 * Load the child theme's translated strings (if any translation files exist
 * in argon-fluent-child/languages/).
 */
function argon_fluent_child_load_textdomain() {
    load_child_theme_textdomain(
        'argon-fluent-child',
        get_stylesheet_directory() . '/languages'
    );
}
