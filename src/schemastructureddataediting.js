import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import buildViewConverter from '../../ckeditor5-engine/src/conversion/buildviewconverter';
import { eventNameToConsumableType } from '../../ckeditor5-engine/src/conversion/model-to-view-converters';

const schemaOrgUri = 'http://schema.org/';

/**
 * The editing feature of Structured Data plugin.
 */
export default class SchemaStructuredDataEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const data = editor.data;
		const editing = editor.editing;
		const schema = editor.document.schema;

		schema.allow( { name: '$block', attributes: 'schemaItem', inside: '$root' } );

		schema.allow( { name: '$inline', attributes: 'schemaItemProp', inside: '$block' } );
		schema.allow( { name: '$inline', attributes: 'schemaItemProp', inside: '$clipboardHolder' } );

		attributeToAttributesConverter(
			[ data.modelToView, editing.modelToView ],
			'schemaItem',
			attribute => ( { itemtype: schemaOrgUri + attribute, itemscope: 'itemscope' } ),
			() => [ 'itemtype', 'itemscope' ]
		);

		buildViewConverter().for( data.viewToModel )
			.fromAttribute( 'itemtype' )
			.consuming( { attribute: [ 'itemtype', 'itemscope' ] } )
			.toAttribute( viewBlock => {
				let attribute = viewBlock.getAttribute( 'itemtype' );

				if ( !attribute ) {
					return;
				}

				if ( attribute.startsWith( schemaOrgUri ) ) {
					attribute = attribute.substr( schemaOrgUri.length );
				}

				return {
					key: 'schemaItem',
					value: attribute
				};
			} );
	}
}

// Defines attribute to attributes converters.
// @private
function attributeToAttributesConverter( dispatchers, modelAttributeName, setAttributesFn, removeAttributesFn ) {
	for ( const dispatcher of dispatchers ) {
		dispatcher.on( `addAttribute:${ modelAttributeName }`, setAttributes( setAttributesFn ) );
		dispatcher.on( `changeAttribute:${ modelAttributeName }`, setAttributes( setAttributesFn ) );
		dispatcher.on( `removeAttribute:${ modelAttributeName }`, removeAttributes( removeAttributesFn ) );
	}
}

// Dispatcher handler responsible for setting attributes to a view element.
// @private
function setAttributes( setAttributeFn ) {
	return ( evt, data, consumable, conversionApi ) => {
		if ( !consumable.consume( data.item, eventNameToConsumableType( evt.name ) ) ) {
			return;
		}

		const attributes = setAttributeFn( data.attributeNewValue );

		const viewElement = conversionApi.mapper.toViewElement( data.item );

		for ( const key in attributes ) {
			viewElement.setAttribute( key, attributes[ key ] );
		}
	};
}

// Dispatcher handler responsible for removing attributes from a view element.
// @private
function removeAttributes( removeAttributesFn ) {
	return ( evt, data, consumable, conversionApi ) => {
		if ( !consumable.consume( data.item, eventNameToConsumableType( evt.name ) ) ) {
			return;
		}

		const attributes = removeAttributesFn();
		const viewElement = conversionApi.mapper.toViewElement( data.item );

		viewElement.removeAttribute( ...attributes );
	};
}
