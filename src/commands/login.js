const { Command } = require('@oclif/command')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const open = require('open')
const Conf = require('conf')

class LoginCommand extends Command {
  async run() {
    // OAuth 2.0 Device flow
    // https://oauth.net/2/device-flow/
    this.log('Redirecting to Salesforce to login...Close your browser when you\'re done')

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
      this.log(authorizationBody)
      await open(
        `${authorizationBody.verification_uri}?user_code=${authorizationBody.user_code}`,
        { wait: true, app: 'chrome' }
      )

      // 4. Obtain a access token from the same token endpoint
      const tokenParams = new URLSearchParams()
      tokenParams.append('grant_type', 'device')
      tokenParams.append(
        'client_id',
        '3MVG9l2zHsylwlpRMdxSJfjHJuwMikx7T4H0MkhAdtSLSGCHuyTXrFc1l7QgQhDBZuvVbj5hC1RNhPTbrazBG'
      )
      tokenParams.append('code', authorizationBody.device_code)
      const tokenRequest = await fetch(
        'https://mohcontacttracing.my.salesforce.com/services/oauth2/token',
        { method: 'POST', body: tokenParams }
      )
      // 2. Salesforce returns an access token
      const tokenBody = await tokenRequest.json()

      // Save the access token
      // C:\Users\lane_j\AppData\Roaming\bulkup-nodejs\Config\config.json
      const config = new Conf()
      config.set('accessToken', tokenBody.access_token)
      this.log('Login complete!')
    } catch (error) {
      this.log('An error ocurred:', error)
    }
  }
}

LoginCommand.description = `Describe the command here
...
Extra documentation goes here
`

module.exports = LoginCommand
