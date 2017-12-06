/* globals console, window, document */

import ClassicEditor from '../../../ckeditor5-editor-classic/src/classiceditor';
import ArticlePluginSet from '../../../ckeditor5-core/tests/_utils/articlepluginset';
import SchemaStructuredData from '../../src/schemastructureddata';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ ArticlePluginSet, SchemaStructuredData ],
		toolbar: [
			'headings', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'
		]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
