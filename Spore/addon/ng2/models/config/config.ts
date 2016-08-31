import * as fs from 'fs';
import * as path from 'path';

import {SchemaClass, SchemaClassFactory} from '../json-schema/schema-class-factory';


const DEFAULT_CONFIG_SCHEMA_PATH = path.join(__dirname, '../../../../lib/config/schema.json');


export class InvalidConfigError extends Error {
  constructor(err: Error) {
    super(err.message);
  }
}


export class CliConfig<JsonType> {
  private _config: SchemaClass<JsonType>;

  constructor(private _configPath: string,
                      schema: Object,
                      configJson: JsonType,
                      fallbacks: JsonType[] = []) {
    this._config = new (SchemaClassFactory<JsonType>(schema))(configJson, ...fallbacks);
  }

  get config(): JsonType { return <any>this._config; }

  save(path: string = this._configPath) {
    return fs.writeFileSync(path, this.serialize(), 'utf-8');
  }
  serialize(mimetype = 'application/json'): string {
    return this._config.$$serialize(mimetype);
  }

  alias(path: string, newPath: string): boolean {
    return this._config.$$alias(path, newPath);
  }

  get(jsonPath: string) {
    return this._config.$$get(jsonPath);
  }

  typeOf(jsonPath: string): string {
    return this._config.$$typeOf(jsonPath);
  }
  isDefined(jsonPath: string): boolean {
    return this._config.$$defined(jsonPath);
  }
  deletePath(jsonPath: string) {
    return this._config.$$delete(jsonPath);
  }

  set(jsonPath: string, value: any) {
    this._config.$$set(jsonPath, value);
  }

  static fromJson<ConfigType>(content: ConfigType, ...global: ConfigType[]) {
    const schemaContent = fs.readFileSync(DEFAULT_CONFIG_SCHEMA_PATH, 'utf-8');
    let schema: Object;
    try {
      schema = JSON.parse(schemaContent);
    } catch (err) {
      throw new InvalidConfigError(err);
    }

    return new CliConfig<ConfigType>(null, schema, content, global);
  }

  static fromConfigPath<T>(configPath: string, otherPath: string[] = []): CliConfig<T> {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const schemaContent = fs.readFileSync(DEFAULT_CONFIG_SCHEMA_PATH, 'utf-8');
    const otherContents = otherPath
      .map(path => fs.existsSync(path) && fs.readFileSync(path, 'utf-8'))
      .filter(content => !!content);

    let content: T;
    let schema: Object;
    let others: T[];

    try {
      content = JSON.parse(configContent);
      schema = JSON.parse(schemaContent);
      others = otherContents.map(otherContent => JSON.parse(otherContent));
    } catch (err) {
      throw new InvalidConfigError(err);
    }

    return new CliConfig<T>(configPath, schema, content, others);
  }
}
