/**
 * fluent-drawer.js — Fluent Design System drawer (slide-out panel)
 *
 * Provides open/close behaviour for .fluent-drawer elements.
 * No build step required — this file is enqueued by functions.php.
 *
 * ================================================================
 * USAGE
 * ================================================================
 *
 * 1. TRIGGER — open or toggle a drawer:
 *    <button data-fluent-drawer-toggle="my-drawer">Open</button>
 *
 * 2. CLOSE — close a specific drawer:
 *    <button data-fluent-drawer-close="my-drawer">Close</button>
 *
 * 3. DRAWER MARKUP — see style.css for the full HTML template.
 *    The drawer ID referenced in the trigger must match the drawer
 *    element's id attribute:
 *
 *    <div class="fluent-drawer" id="my-drawer" role="dialog"
 *         aria-modal="true" aria-label="Navigation">
 *      <div class="fluent-drawer__overlay"
 *           data-fluent-drawer-close="my-drawer"></div>
 *      <div class="fluent-drawer__panel">
 *        <div class="fluent-drawer__header">
 *          <span class="fluent-text--subtitle">Title</span>
 *          <button class="fluent-btn fluent-btn--icon fluent-drawer__close"
 *                  data-fluent-drawer-close="my-drawer"
 *                  aria-label="Close drawer">✕</button>
 *        </div>
 *        <div class="fluent-drawer__body">…content…</div>
 *      </div>
 *    </div>
 *
 * 4. PROGRAMMATIC API:
 *    FluentDrawer.open('my-drawer');
 *    FluentDrawer.close('my-drawer');
 *    FluentDrawer.toggle('my-drawer');
 *    FluentDrawer.closeAll();
 *
 * 5. EVENTS — dispatched on the drawer element:
 *    fluent:drawer:open   — fired after the drawer is opened
 *    fluent:drawer:close  — fired after the drawer is closed
 *
 * ================================================================
 */

( function () {
	'use strict';

	/** CSS class that marks a drawer as visible/open */
	var OPEN_CLASS = 'fluent-drawer--open';

	/**
	 * All currently tracked drawer element IDs.
	 * Used for bulk-close operations.
	 * @type {Set<string>}
	 */
	var activeDrawers = new Set();

	/* --------------------------------------------------------
	 * Core API
	 * -------------------------------------------------------- */

	var FluentDrawer = {

		/**
		 * Open a drawer by its element ID.
		 *
		 * @param {string} id - The id attribute of the .fluent-drawer element.
		 */
		open: function ( id ) {
			var drawer = document.getElementById( id );
			if ( ! drawer ) {
				return;
			}

			drawer.classList.add( OPEN_CLASS );
			drawer.setAttribute( 'aria-hidden', 'false' );
			activeDrawers.add( id );

			// Move focus to the panel so screen readers announce it.
			var panel = drawer.querySelector( '.fluent-drawer__panel' );
			if ( panel ) {
				panel.setAttribute( 'tabindex', '-1' );
				panel.focus( { preventScroll: true } );
			}

			// Prevent body from scrolling while drawer is open.
			document.body.style.overflow = 'hidden';

			drawer.dispatchEvent( new CustomEvent( 'fluent:drawer:open', {
				bubbles: true,
				detail: { id: id }
			} ) );
		},

		/**
		 * Close a drawer by its element ID.
		 *
		 * @param {string} id - The id attribute of the .fluent-drawer element.
		 */
		close: function ( id ) {
			var drawer = document.getElementById( id );
			if ( ! drawer ) {
				return;
			}

			drawer.classList.remove( OPEN_CLASS );
			drawer.setAttribute( 'aria-hidden', 'true' );
			activeDrawers.delete( id );

			// Restore body scrolling only when no other drawers are open.
			if ( activeDrawers.size === 0 ) {
				document.body.style.overflow = '';
			}

			// Return focus to the element that originally triggered the drawer.
			var trigger = document.querySelector(
				'[data-fluent-drawer-toggle="' + id + '"]'
			);
			if ( trigger ) {
				trigger.focus();
			}

			drawer.dispatchEvent( new CustomEvent( 'fluent:drawer:close', {
				bubbles: true,
				detail: { id: id }
			} ) );
		},

		/**
		 * Toggle a drawer open ↔ closed.
		 *
		 * @param {string} id
		 */
		toggle: function ( id ) {
			var drawer = document.getElementById( id );
			if ( ! drawer ) {
				return;
			}

			if ( drawer.classList.contains( OPEN_CLASS ) ) {
				FluentDrawer.close( id );
			} else {
				FluentDrawer.open( id );
			}
		},

		/**
		 * Close every currently open drawer.
		 */
		closeAll: function () {
			activeDrawers.forEach( function ( id ) {
				FluentDrawer.close( id );
			} );
		}
	};

	/* --------------------------------------------------------
	 * Initialise accessibility attributes on all drawers.
	 * -------------------------------------------------------- */
	function initDrawers() {
		document.querySelectorAll( '.fluent-drawer' ).forEach( function ( drawer ) {
			if ( ! drawer.id ) {
				return; // Skip drawers without an id.
			}

			// Ensure drawers start with aria-hidden unless already open.
			if ( ! drawer.classList.contains( OPEN_CLASS ) ) {
				drawer.setAttribute( 'aria-hidden', 'true' );
			}
		} );
	}

	/* --------------------------------------------------------
	 * Delegate click events for triggers and close buttons.
	 * -------------------------------------------------------- */
	document.addEventListener( 'click', function ( event ) {
		var target = event.target;

		// Walk up the DOM in case the click hit a child element (e.g. an icon).
		while ( target && target !== document ) {
			var toggleId = target.getAttribute( 'data-fluent-drawer-toggle' );
			if ( toggleId ) {
				event.preventDefault();
				FluentDrawer.toggle( toggleId );
				return;
			}

			var closeId = target.getAttribute( 'data-fluent-drawer-close' );
			if ( closeId ) {
				event.preventDefault();
				FluentDrawer.close( closeId );
				return;
			}

			target = target.parentElement;
		}
	} );

	/* --------------------------------------------------------
	 * Keyboard: Escape closes the topmost open drawer.
	 * -------------------------------------------------------- */
	document.addEventListener( 'keydown', function ( event ) {
		if ( event.key !== 'Escape' ) {
			return;
		}

		// Close the most-recently-opened drawer.
		var ids = Array.from( activeDrawers );
		if ( ids.length > 0 ) {
			FluentDrawer.close( ids[ ids.length - 1 ] );
		}
	} );

	/* --------------------------------------------------------
	 * Focus trap: keep keyboard focus inside the open drawer.
	 * -------------------------------------------------------- */
	document.addEventListener( 'keydown', function ( event ) {
		if ( event.key !== 'Tab' || activeDrawers.size === 0 ) {
			return;
		}

		// Get the last opened drawer.
		var ids = Array.from( activeDrawers );
		var drawer = document.getElementById( ids[ ids.length - 1 ] );
		if ( ! drawer ) {
			return;
		}

		var focusable = drawer.querySelectorAll(
			'a[href], button:not([disabled]), input:not([disabled]), ' +
			'select:not([disabled]), textarea:not([disabled]), ' +
			'[tabindex]:not([tabindex="-1"])'
		);

		var focusableArray = Array.from( focusable ).filter( function ( el ) {
			return el.offsetParent !== null; // visible elements only
		} );

		if ( focusableArray.length === 0 ) {
			return;
		}

		var first = focusableArray[ 0 ];
		var last  = focusableArray[ focusableArray.length - 1 ];

		if ( event.shiftKey ) {
			// Shift+Tab: wrap from first → last.
			if ( document.activeElement === first ) {
				event.preventDefault();
				last.focus();
			}
		} else {
			// Tab: wrap from last → first.
			if ( document.activeElement === last ) {
				event.preventDefault();
				first.focus();
			}
		}
	} );

	/* --------------------------------------------------------
	 * Expose the API globally.
	 * -------------------------------------------------------- */
	window.FluentDrawer = FluentDrawer;

	/* --------------------------------------------------------
	 * Run init when the DOM is ready.
	 * -------------------------------------------------------- */
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initDrawers );
	} else {
		initDrawers();
	}

} )();
