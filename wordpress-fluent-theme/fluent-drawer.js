/**
 * fluent-drawer.js — Fluent Design System drawer helper
 * Version: 0.2.0
 *
 * Bridges data-attribute triggers to both:
 *   A) <fluent-drawer> web component  (.show() / .hide() methods)
 *   B) <dialog class="fluent-drawer-dialog">  (showModal() / close())
 *
 * Spec reference:
 *   https://github.com/microsoft/fluentui/tree/master/packages/web-components/src/drawer
 *
 * ================================================================
 * USAGE — triggers (add to any clickable element)
 * ================================================================
 *
 *   data-fluent-drawer-toggle="drawer-id"   open ↔ close
 *   data-fluent-drawer-close="drawer-id"    close only
 *
 * ================================================================
 * USAGE — programmatic API
 * ================================================================
 *
 *   FluentDrawer.show('drawer-id')
 *   FluentDrawer.hide('drawer-id')
 *   FluentDrawer.toggle('drawer-id')
 *   FluentDrawer.closeAll()
 *
 * ================================================================
 * EVENTS (dispatched on the drawer element, bubbles=true)
 * ================================================================
 *
 *   beforetoggle  — fires before state changes
 *                   event.detail = { newState, oldState }
 *   toggle        — fires after state changes
 *                   event.detail = { newState, oldState }
 *
 *   These match the CustomEvent names used by the official
 *   <fluent-drawer> web component and the HTML <dialog> spec
 *   proposal (https://github.com/whatwg/html/issues/9733).
 *
 * ================================================================
 * MARKUP — Approach A: <fluent-drawer> Web Component
 * ================================================================
 *
 *   <!-- trigger -->
 *   <button data-fluent-drawer-toggle="nav-drawer">Open</button>
 *
 *   <fluent-drawer id="nav-drawer" type="modal" position="start"
 *                  size="medium" aria-labelledby="nav-title">
 *     <drawer-body>
 *       <h2 id="nav-title" slot="title">Navigation</h2>
 *       <nav><!-- links --></nav>
 *       <div slot="footer">
 *         <fluent-button appearance="outline"
 *                        data-fluent-drawer-close="nav-drawer">Close</fluent-button>
 *       </div>
 *     </drawer-body>
 *   </fluent-drawer>
 *
 * ================================================================
 * MARKUP — Approach B: <dialog class="fluent-drawer-dialog">
 * ================================================================
 *
 *   <!-- trigger -->
 *   <button data-fluent-drawer-toggle="nav-dialog">Open</button>
 *
 *   <dialog class="fluent-drawer-dialog" id="nav-dialog"
 *           data-position="start" data-size="medium"
 *           aria-labelledby="nav-dialog-title">
 *     <div class="fluent-drawer-body">
 *       <div class="fluent-drawer-body__header">
 *         <h2 id="nav-dialog-title" class="fluent-text--subtitle">Navigation</h2>
 *         <button class="fluent-btn fluent-btn--icon"
 *                 data-fluent-drawer-close="nav-dialog"
 *                 aria-label="Close drawer">&#x2715;</button>
 *       </div>
 *       <div class="fluent-drawer-body__content">
 *         <!-- scrollable content -->
 *       </div>
 *       <div class="fluent-drawer-body__footer">
 *         <button class="fluent-btn fluent-btn--outline"
 *                 data-fluent-drawer-close="nav-dialog">Close</button>
 *       </div>
 *     </div>
 *   </dialog>
 */

( function () {
'use strict';

/* --------------------------------------------------------
 * Helpers
 * -------------------------------------------------------- */

/**
 * Returns true when the element is an official <fluent-drawer>
 * web component that exposes .show() / .hide().
 *
 * @param {Element} el
 * @returns {boolean}
 */
function isFluentDrawerWC( el ) {
return (
el.tagName === 'FLUENT-DRAWER' &&
typeof el.show === 'function' &&
typeof el.hide === 'function'
);
}

/**
 * Returns true when the element is a native <dialog> element.
 *
 * @param {Element} el
 * @returns {boolean}
 */
function isDialogEl( el ) {
return el.tagName === 'DIALOG';
}

/**
 * Emit a CustomEvent that mirrors the <fluent-drawer> / <dialog>
 * beforetoggle / toggle event shape.
 *
 * @param {Element}  el       - Target element to dispatch on.
 * @param {string}   name     - "beforetoggle" or "toggle".
 * @param {string}   oldState - "open" or "closed".
 * @param {string}   newState - "open" or "closed".
 */
function emitToggleEvent( el, name, oldState, newState ) {
el.dispatchEvent( new CustomEvent( name, {
bubbles:    true,
cancelable: name === 'beforetoggle',
detail: { oldState: oldState, newState: newState }
} ) );
}

/* --------------------------------------------------------
 * Core API
 * -------------------------------------------------------- */

var FluentDrawer = {

/**
 * Show / open a drawer by its element ID.
 * Works with <fluent-drawer> web component and <dialog> elements.
 *
 * @param {string} id
 */
show: function ( id ) {
var el = document.getElementById( id );
if ( ! el ) {
return;
}

/* ── A: <fluent-drawer> web component ── */
if ( isFluentDrawerWC( el ) ) {
/* The WC fires its own beforetoggle/toggle events internally. */
el.show();
return;
}

/* ── B: native <dialog> element ── */
if ( isDialogEl( el ) ) {
if ( el.open ) {
return; /* already open */
}

var type = el.getAttribute( 'data-type' ) || 'modal';

emitToggleEvent( el, 'beforetoggle', 'closed', 'open' );

if ( type === 'non-modal' ) {
el.show();
} else {
el.showModal();
}

emitToggleEvent( el, 'toggle', 'closed', 'open' );

/* Prevent body scroll while modal is open */
if ( type !== 'non-modal' && type !== 'inline' ) {
document.body.style.overflow = 'hidden';
}

/* Return focus to trigger on ESC / close */
el._fluentTrigger = document.activeElement || null;
return;
}
},

/**
 * Hide / close a drawer by its element ID.
 *
 * @param {string} id
 */
hide: function ( id ) {
var el = document.getElementById( id );
if ( ! el ) {
return;
}

/* ── A: <fluent-drawer> web component ── */
if ( isFluentDrawerWC( el ) ) {
el.hide();
return;
}

/* ── B: native <dialog> element ── */
if ( isDialogEl( el ) ) {
if ( ! el.open ) {
return; /* already closed */
}

emitToggleEvent( el, 'beforetoggle', 'open', 'closed' );

el.close();

emitToggleEvent( el, 'toggle', 'open', 'closed' );

/* Restore body scroll */
document.body.style.overflow = '';

/* Return focus to the element that triggered this drawer */
if ( el._fluentTrigger && typeof el._fluentTrigger.focus === 'function' ) {
el._fluentTrigger.focus();
el._fluentTrigger = null;
}
}
},

/**
 * Toggle a drawer open ↔ closed.
 *
 * @param {string} id
 */
toggle: function ( id ) {
var el = document.getElementById( id );
if ( ! el ) {
return;
}

/* <fluent-drawer> WC: check the internal dialog's open state */
if ( isFluentDrawerWC( el ) ) {
var internalDialog = el.shadowRoot
? el.shadowRoot.querySelector( 'dialog' )
: null;
var isOpen = internalDialog ? internalDialog.open : false;
if ( isOpen ) {
el.hide();
} else {
el.show();
}
return;
}

/* <dialog> element */
if ( isDialogEl( el ) ) {
if ( el.open ) {
FluentDrawer.hide( id );
} else {
FluentDrawer.show( id );
}
}
},

/**
 * Close every currently open drawer on the page.
 */
closeAll: function () {
/* Close all open native dialogs that are fluent drawers */
document.querySelectorAll( 'dialog.fluent-drawer-dialog[open]' ).forEach(
function ( el ) {
if ( el.id ) {
FluentDrawer.hide( el.id );
}
}
);

/* Close all open fluent-drawer web components */
document.querySelectorAll( 'fluent-drawer' ).forEach( function ( el ) {
if ( el.id ) {
var shadow = el.shadowRoot;
var dlg    = shadow ? shadow.querySelector( 'dialog[open]' ) : null;
if ( dlg ) {
FluentDrawer.hide( el.id );
}
}
} );
}
};

/* --------------------------------------------------------
 * Event delegation — handle trigger clicks anywhere
 * -------------------------------------------------------- */
document.addEventListener( 'click', function ( event ) {
var target = event.target;

/* Walk up the DOM; a click on a child (e.g. an icon) should
   still be caught by the trigger element. */
while ( target && target !== document.documentElement ) {
var toggleId = target.getAttribute( 'data-fluent-drawer-toggle' );
if ( toggleId ) {
event.preventDefault();
FluentDrawer.toggle( toggleId );
return;
}

var closeId = target.getAttribute( 'data-fluent-drawer-close' );
if ( closeId ) {
event.preventDefault();
FluentDrawer.hide( closeId );
return;
}

target = target.parentElement;
}
} );

/* --------------------------------------------------------
 * Native <dialog> cancel event (Escape key fires cancel)
 * Mirror the WC behaviour: hide + restore focus.
 * -------------------------------------------------------- */
document.addEventListener( 'cancel', function ( event ) {
var el = event.target;
if ( isDialogEl( el ) && el.classList.contains( 'fluent-drawer-dialog' ) ) {
/* Prevent the browser's default close (we handle it ourselves
   so the beforetoggle event and focus restoration both fire). */
event.preventDefault();
if ( el.id ) {
FluentDrawer.hide( el.id );
}
}
}, true /* capture — fires before the dialog closes */ );

/* --------------------------------------------------------
 * Expose the public API
 * -------------------------------------------------------- */
window.FluentDrawer = FluentDrawer;

} )();
