const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const open = require('open')

class LoginCommand extends Command {
  async run() {
    // const { flags } = this.parse(LoginCommand)
    // const name = flags.name || 'world'
    // OAuth 2.0 Device flow
    // https://oauth.net/2/device-flow/

    // 1. Device request authorization
    // Post an authorization request to the Salesforce token endpoint
    const authorizationParams = new URLSearchParams()
    authorizationParams.append('response_type', 'device_code')
    authorizationParams.append(
      'client_id',
      '3MVG9l2zHsylwlpRMdxSJfjHJuwMikx7T4H0MkhAdtSLSGCHuyTXrFc1l7QgQhDBZuvVbj5hC1RNhPTbrazBG'
    )
    try {
      const authorizationRequest = await fetch(
        'https://mohcontacttracing.my.salesforce.com/services/oauth2/token',
        { method: 'POST', body: authorizationParams }
      )
      // 2. Salesforce returns verification codes
      const authorizationBody = await authorizationRequest.json()

      // 3. User authenticates and authorizes
      open(
        `${authorizationBody.verification_uri}?user_code=${authorizationBody.user_code}`
      )

      // 4. Obtain a access token from the same token endpoint
      const tokenParams = new URLSearchParams()
      tokenParams.append('grant_type', 'device')
      tokenParams.append(
        'client_id',
        '3MVG9l2zHsylwlpRMdxSJfjHJuwMikx7T4H0MkhAdtSLSGCHuyTXrFc1l7QgQhDBZuvVbj5hC1RNhPTbrazBG'
      )
      const tokenRequest = await fetch(
        'https://mohcontacttracing.my.salesforce.com/services/oauth2/token',
        { method: 'POST', body: tokenParams }
      )
      // 2. Salesforce returns an access token
      const tokenBody = await tokenRequest.json()
      this.log(`Success! Obtained token: ${tokenBody}`)
    } catch (error) {
      this.log('An error ocurred: %s', error)
    }
  }
}

LoginCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = LoginCommand
