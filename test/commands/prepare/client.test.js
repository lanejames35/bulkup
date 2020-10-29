const {expect, test} = require('@oclif/test')

describe('prepare:client', () => {
  test
  .stdout()
  .command(['prepare:client'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['prepare:client', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
