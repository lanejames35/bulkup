const {Command, flags} = require('@oclif/command')

class ClientCommand extends Command {
  async run() {
    const {flags} = this.parse(ClientCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from C:\\Users\\lane_j\\bulkup\\src\\commands\\prepare\\client.js`)
  }
}

ClientCommand.description = `Describe the command here
...
Extra documentation goes here
`

ClientCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ClientCommand
