import * as path from 'path';
import * as fs from 'fs-extra';

import { Validator } from 'jsonschema';
import Directory from '../Directory';
import Logger from '../Logger';
import { InvalidMosaicConfigException } from '../Exception';

const schema = require('./MosaicConfig.schema.json');

/**
 * Hold contract addresses on origin chain independent of auxiliary chain.
 */
export class OriginLibraries {
  public simpleTokenAddress: Address;

  public merklePatriciaLibAddress: Address;

  public gatewayLibAddress: Address;

  public messageBusAddress: Address;

  public ostComposerAddress: Address;
}

/**
 * Holds origin chain specific config.
 */
export class OriginChain {
  public chain: string;

  public contractAddresses: OriginLibraries;

  public constructor() {
    this.contractAddresses = new OriginLibraries();
  }
}

/**
 * Contract addresses of the origin chain specific to an auxiliary chain.
 */
export class OriginContracts {
  public anchorOrganizationAddress: Address;

  public anchorAddress: Address;

  public ostGatewayOrganizationAddress: Address;

  public ostEIP20GatewayAddress: Address;
}

/**
 * Contract addresses deployed on the auxiliary chain.
 */
export class AuxiliaryContracts {
  public ostPrimeAddress: Address;

  public anchorOrganizationAddress: Address;

  public anchorAddress: Address;

  public merklePatriciaLibAddress: Address;

  public gatewayLibAddress: Address;

  public messageBusAddress: Address;

  public ostCoGatewayOrganizationAddress: Address;

  public ostEIP20CogatewayAddress: Address;
}

/**
 * Hold contract addresses of origin and auxiliary chain specific to an auxiliary chain.
 */
export class ContractAddresses {
  public origin: OriginContracts;

  public auxiliary: AuxiliaryContracts;

  public constructor() {
    this.origin = new OriginContracts();
    this.auxiliary = new AuxiliaryContracts();
  }
}

/**
 * Holds config of an auxiliary chain.
 */
export class AuxiliaryChain {
  public chainId: number;

  public bootNodes: string[];

  public genesis: Record<string, any>;

  public contractAddresses: ContractAddresses;

  public constructor() {
    this.bootNodes = [];
    this.contractAddresses = new ContractAddresses();
  }
}

export type Address = string;

/**
 * Holds the config of mosaic chains of a specific origin chain.
 */
export default class MosaicConfig {
  public originChain: OriginChain;

  public auxiliaryChains: { [key: string]: AuxiliaryChain };

  public constructor(config: any) {
    this.originChain = config.originChain || new OriginChain();
    this.auxiliaryChains = config.auxiliaryChains || {};
  }

  /**
   * This reads mosaic config from the json file and creates MosaicConfig object.
   * @param {string} chain Chain Identifier.
   * @return {MosaicConfig} mosaicConfig Object of the class mosaic config.
   */
  public static from(chain): MosaicConfig {
    const filePath = path.join(
      Directory.getProjectMosaicConfigDir(),
      `${chain}.json`,
    );
    if (fs.existsSync(filePath)) {
      const config = fs.readFileSync(filePath).toString();
      if (config && config.length > 0) {
        const jsonObject = JSON.parse(config);
        MosaicConfig.validateSchema(jsonObject);
        return new MosaicConfig(jsonObject);
      }
    }
    return new MosaicConfig({} as any);
  }

  /**
   * This method validate json object against mosaic config schema also throws an exception on failure.
   * @param jsonObject JSON object to be validated against schema.
   */
  private static validateSchema(jsonObject: any): void {
    const validator = new Validator();
    try {
      validator.validate(jsonObject, schema, { throwError: true });
    } catch (error) {
      throw new InvalidMosaicConfigException(error.message);
    }
  }

  /**
   * Saves this config to a file in its auxiliary chain directory.
   */
  public writeToMosaicConfigDirectory(): void {
    const mosaicConfigDir = Directory.getProjectMosaicConfigDir();
    fs.ensureDirSync(mosaicConfigDir);
    const configPath = path.join(
      mosaicConfigDir,
      `${this.originChain.chain}.json`,
    );
    Logger.info('storing mosaic config', { configPath });

    fs.writeFileSync(
      configPath,
      JSON.stringify(this, null, '    '),
    );
  }
}