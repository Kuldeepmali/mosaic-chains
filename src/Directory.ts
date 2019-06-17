import * as path from 'path';
import * as os from 'os';

/**
 * Directory provides operations on strings representing directories.
 */
export default class Directory {

  /**
   * @returns The absolute path to the directory in which we store mosaic data.
   */
  public static get getDefaultMosaicDataDir(): string {
    return path.join(
      os.homedir(),
      '.mosaic',
    );
  }

  /**
   * @returns The absolute path to the directory in which we publish mosaic configs.
   */
  public static get getPublishMosaicConfigDir(): string {
    return path.join(
      Directory.getDefaultMosaicDataDir,
      'configs',
    );
  }

  /**
   * @returns The absolute path to the root of this project.
   */
  public static get projectRoot(): string {
    return path.join(
      __dirname,
      '..',
    );
  }

  /**
   * @returns The absolute path to the utility chains directory in the project.
   */
  public static get projectUtilityChainsDir(): string {
    return path.join(
      Directory.projectRoot,
      'utility_chains',
    );
  }

  /**
   * @param chainId The chain id of the chain.
   * @returns The absolute path to the directory of the given utility chain.
   * @throws If `chainId` is an empty string.
   */
  public static getProjectUtilityChainDir(chainId: string): string {
    if (chainId === '') {
      throw new Error('a chain id cannot be empty in order to get its directory');
    }

    return path.join(
      Directory.projectUtilityChainsDir,
      `utility_chain_${chainId}`,
    );
  }

  /**
   * @returns The absolute path to the directory of the code base where we keep mosaic config of existing chains.
   */
  public static get getProjectMosaicConfigDir(): string {
    return path.join(
      Directory.projectRoot,
      'mosaic_configs',
    );
  }

  /**
   * @returns The absolute path to the directory of the Graph code.
   */
  public static getProjectGraphDir(): string {
    return path.join(
      Directory.projectRoot,
      'src',
      'Graph',
    );
  }

  /**
   * Sanitizes given directory strings:
   * - replaces `~` at the beginning with the absolute path to the home directory.
   * - translates relative paths to absolute paths.
   * @param directory The directory string to sanitize.
   */
  public static sanitize(directory: string): string {
    let sanitized: string = directory;

    if (sanitized.substr(0, 1) === '~') {
      sanitized = path.join(os.homedir(), sanitized.substr(1));
    }

    // Relative directory name
    if (sanitized.substr(0, 1) !== '/') {
      sanitized = path.join(
        process.cwd(),
        sanitized,
      );
    }

    return sanitized;
  }
}
