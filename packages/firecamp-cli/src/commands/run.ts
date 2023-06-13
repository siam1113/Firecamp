import { Args, Command, Flags } from '@oclif/core'
import { loadJsonFile } from 'load-json-file';
import Runner from '@firecamp/collection-runner'

/**
 * Run command example
 * ./bin/dev run ../../test/data/FirecampRestEchoServer.firecamp_collection.json
 */
export default class Run extends Command {
  static description = 'Run Firecamp Collection'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    // force: Flags.boolean({ char: 'f' }),
  }

  static args = {
    file: Args.string({ description: 'firecamp collection path' }),
  }

  public async run(): Promise<void> {
    const { args } = await this.parse(Run)
    const { file } = args
    if (!file) {
      this.logToStderr('error: The collection path is missing')
      return
    }
    // const __dirname = dirname(fileURLToPath(file));
    // const _fp = path.join(__dirname, file)
    const _filepath = new URL(`../../${file}`, import.meta.url).pathname
    loadJsonFile(_filepath)
      .then(collection => {
        // this.logJson(collection);
        const runner = new Runner(collection, {})
        return runner.run();
      })
      .then(testResults => {
        console.log(testResults)
        // this.logJson(testResults)
      })
      .catch(e => {
        console.error(e)
        if (e.code == 'ENOENT') this.logToStderr(`error: file not exist at ${_filepath}`)
        else this.logToStderr('error: The collection file is not valid')
      })
  }
}
