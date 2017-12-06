import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import SchemaStructuredDataEditing from './schemastructureddataediting';

/**
 * The {@link https://schema.org/ schema.org} Structured Data plugin.
 */
export default class SchemaStructuredData extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ SchemaStructuredDataEditing ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SchemaStructuredData';
	}
}
