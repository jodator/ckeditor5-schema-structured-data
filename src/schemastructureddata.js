import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import SchemaStructuredDataEditing from './schemastructureddataediting';
import SchemaStructuredDataUI from './schemastructureddataui';

/**
 * The {@link https://schema.org/ schema.org} Structured Data plugin.
 */
export default class SchemaStructuredData extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ SchemaStructuredDataEditing, SchemaStructuredDataUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SchemaStructuredData';
	}
}
