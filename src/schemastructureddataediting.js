import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * The editing feature of Structured Data plugin.
 */
export default class SchemaStructuredDataEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const schema = this.editor.document.schema;

		schema.allow( { name: '$block', attributes: 'schemaItem', inside: '$root' } );

		schema.allow( { name: '$inline', attributes: 'schemaItemProp', inside: '$block' } );
		schema.allow( { name: '$inline', attributes: 'schemaItemProp', inside: '$clipboardHolder' } );
	}
}
