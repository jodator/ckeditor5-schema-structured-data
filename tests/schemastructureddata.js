/* global document */

import SchemaStructuredData from './../src/schemastructureddata';

import ClassicTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/classictesteditor';

describe( 'SchemaStructuredData', () => {
	let editor, element;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return ClassicTestEditor
			.create( element, {
				plugins: [ SchemaStructuredData ]
			} )
			.then( newEditor => {
				editor = newEditor;
			} );
	} );

	afterEach( () => {
		element.remove();

		return editor.destroy();
	} );

	it( 'defines plugin name', () => {
		expect( SchemaStructuredData.pluginName ).to.equal( 'SchemaStructuredData' );
	} );

	it( 'requires SchemaStructuredDataEditing and SchemaStructuredDataUI', () => {
		expect( SchemaStructuredData.requires ).to.deep.equal( [] );
	} );
} );
