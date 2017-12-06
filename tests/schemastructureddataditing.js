import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';
import SchemaStructuredDataEditing from '../src/schemastructureddataediting';

describe( 'SchemaStructuredDataEditing', () => {
	let editor, doc;

	beforeEach( () => {
		return VirtualTestEditor
			.create( {
				plugins: [ SchemaStructuredDataEditing, Paragraph ]
			} )
			.then( newEditor => {
				editor = newEditor;

				doc = editor.document;
			} );
	} );

	afterEach( () => {
		editor.destroy();
	} );

	it( 'should set proper schema rules', () => {
		expect( doc.schema.check( { name: '$inline', attributes: 'schemaItemProp', inside: '$block' } ) ).to.be.true;
		expect( doc.schema.check( { name: '$inline', attributes: 'schemaItemProp', inside: '$clipboardHolder' } ) ).to.be.true;

		expect( doc.schema.check( { name: '$block', attributes: 'schemaItem', inside: '$root' } ) ).to.be.true;
	} );
} );
