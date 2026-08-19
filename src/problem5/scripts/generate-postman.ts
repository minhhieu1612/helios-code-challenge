/// <reference path="../src/types/openapi-to-postmanv2.d.ts" />
import fs from 'fs';
import path from 'path';
import Converter from 'openapi-to-postmanv2';
import { swaggerSpec } from '../src/swagger/swagger';

const generatePostmanCollection = async (): Promise<void> => {
  try {
    console.log('[Sync Docs] Converting Swagger OpenAPI spec to Postman v2.1 collection...');

    Converter.convert(
      { type: 'json', data: swaggerSpec },
      { folderStrategy: 'Tags' },
      (err: any, result: any) => {
        if (err || !result || !result.result) {
          console.error('[Sync Docs] Error converting OpenAPI to Postman:', err || result?.reason);
          process.exit(1);
        }

        const collectionJSON = JSON.stringify(result.output[0].data, null, 2);
        const outputPath = path.join(__dirname, '../postman_collection.json');
        fs.writeFileSync(outputPath, collectionJSON, 'utf8');

        console.log(`[Sync Docs] Successfully generated Postman collection at: ${outputPath}`);
      }
    );
  } catch (error) {
    console.error('[Sync Docs] Unexpected error during Postman collection generation:', error);
    process.exit(1);
  }
};

generatePostmanCollection();
