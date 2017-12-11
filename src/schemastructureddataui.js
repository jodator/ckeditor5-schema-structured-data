import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '../../ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon from '../../ckeditor5-ui/src/panel/balloon/contextualballoon';
import StructuredDataFormView from './ui/structureddataformview';
import ButtonView from '../../ckeditor5-ui/src/button/buttonview';

import schemaIcon from '@ckeditor/ckeditor5-core/theme/icons/input.svg';

/**
 * The {@link https://schema.org/ schema.org} Structured Data plugin.
 */
export default class SchemaStructuredDataUI extends Plugin {
	init() {
		const editor = this.editor;

		editor.editing.view.addObserver( ClickObserver );

		/**
		 * The form view displayed inside the balloon.
		 *
		 * @member {module:link/ui/linkformview~LinkFormView}
		 */
		this.formView = this._createForm();

		/**
		 * The contextual balloon plugin instance.
		 *
		 * @private
		 * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
		 */
		this._balloon = editor.plugins.get( ContextualBalloon );

		// Create toolbar buttons.
		this._createToolbarButton();

		// Attach lifecycle actions to the the balloon.
		// this._attachActions();

		this.options = [];
	}

	_createForm() {
		const editor = this.editor;
		const formView = new StructuredDataFormView( editor.locale );

		return formView;
	}

	_showPanel( focusInput ) {
		const editor = this.editor;
		const editing = editor.editing;
		const showViewDocument = editing.view;
		const showIsCollapsed = showViewDocument.selection.isCollapsed;
		// const showSelectedLink = this._getSelectedLinkElement();

		this.listenTo( showViewDocument, 'render', () => {
			// const renderSelectedLink = this._getSelectedLinkElement();
			const renderIsCollapsed = showViewDocument.selection.isCollapsed;
			const hasSellectionExpanded = showIsCollapsed && !renderIsCollapsed;

			// Hide the panel if:
			//   * the selection went out of the original link element
			//     (e.g. paragraph containing the link was removed),
			//   * the selection has expanded
			// upon the #render event.
			if ( hasSellectionExpanded /*|| showSelectedLink !== renderSelectedLink*/ ) {
				this._hidePanel( true );
			}
			// Update the position of the panel when:
			//  * the selection remains in the original link element,
			//  * there was no link element in the first place, i.e. creating a new link
			else {
				// If still in a link element, simply update the position of the balloon.
				// If there was no link, upon #render, the balloon must be moved
				// to the new position in the editing view (a new native DOM range).
				this._balloon.updatePosition( this._getBalloonPositionData() );
			}
		} );

		if ( this._balloon.hasView( this.formView ) ) {
			// Check if formView should be focused and focus it if is visible.
			if ( focusInput && this._balloon.visibleView === this.formView ) {
				this.formView.urlInputView.select();
			}
		} else {
			this._balloon.add( {
				view: this.formView,
				position: this._getBalloonPositionData()
			} );

			if ( focusInput ) {
				this.formView.nameInputView.select();
			}
		}
	}

	_getBalloonPositionData() {
		const viewDocument = this.editor.editing.view;
		const targetLink = false; //this._getSelectedLinkElement();

		const target = targetLink ?
			// When selection is inside link element, then attach panel to this element.
			viewDocument.domConverter.mapViewToDom( targetLink ) :
			// Otherwise attach panel to the selection.
			viewDocument.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

		return { target };
	}

	_createToolbarButton() {
		const editor = this.editor;
		// const command = editor.commands.get( 'schema' );
		const t = editor.t;

		editor.ui.componentFactory.add( 'schema', locale => {
			const button = new ButtonView( locale );

			button.isEnabled = true;
			button.label = t( 'Schema' );
			button.icon = schemaIcon;
			button.tooltip = true;

			// Bind button to the command.
			// button.bind( 'isEnabled' ).to( command, 'isEnabled' );

			// Show the panel on button click.
			this.listenTo( button, 'execute', () => this._showPanel( true ) );

			return button;
		} );
	}
}
