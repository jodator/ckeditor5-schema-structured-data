import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';
import SchemaStructuredDataEditing from '../src/schemastructureddataediting';
import { getData as getModelData, setData as setModelData } from '../../ckeditor5-engine/src/dev-utils/model';

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

	describe( 'data pipeline conversions', () => {
		it( 'should convert block with defined item', () => {
			editor.setData( '<p itemscope itemtype="http://schema.org/Article">foo</p>' );

			expect( getModelData( doc ) ).to.equal( '<paragraph schemaItem="Article">[]foo</paragraph>' );

			expect( editor.getData() ).to.equal( '<p itemtype="http://schema.org/Article" itemscope="itemscope">foo</p>' );
		} );
	} );

	describe( 'editing pipeline conversion', () => {
		it( 'should convert block with defined item', () => {
			setModelData( doc, '<paragraph schemaItem="Article">[]foo</paragraph>' );

			expect( editor.getData() ).to.equal( '<p itemtype="http://schema.org/Article" itemscope="itemscope">foo</p>' );
		} );
	} );
} );
