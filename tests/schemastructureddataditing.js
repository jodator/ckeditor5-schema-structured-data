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
			editor.setData( '<p itemscope itemtype="http://schema.org/Product">foo</p>' );

			expect( getModelData( doc ) ).to.equal( '<paragraph schemaItem="Product">[]foo</paragraph>' );

			expect( editor.getData() ).to.equal( '<p itemtype="http://schema.org/Product" itemscope="itemscope">foo</p>' );
		} );

		it( 'should convert block with defined item property', () => {
			editor.setData( '<p itemscope itemtype="http://schema.org/Product">foo <span itemprop="name">bar</span></p>' );

			expect( getModelData( doc ) )
				.to.equal( '<paragraph schemaItem="Product">[]foo <$text schemaItemProp="name">bar</$text></paragraph>' );

			expect( editor.getData() )
				.to.equal( '<p itemtype="http://schema.org/Product" itemscope="itemscope">foo <span itemprop="name">bar</span></p>' );
		} );
	} );

	describe( 'editing pipeline conversion', () => {
		it( 'should convert block with defined item', () => {
			setModelData( doc, '<paragraph schemaItem="Product">[]foo</paragraph>' );

			expect( editor.getData() ).to.equal( '<p itemtype="http://schema.org/Product" itemscope="itemscope">foo</p>' );
		} );

		it( 'should convert block with defined item property', () => {
			setModelData( doc, '<paragraph schemaItem="Product">[]foo <$text schemaItemProp="name">bar</$text></paragraph>' );

			expect( editor.getData() )
				.to.equal( '<p itemtype="http://schema.org/Product" itemscope="itemscope">foo <span itemprop="name">bar</span></p>' );
		} );
	} );
} );
