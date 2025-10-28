const test = require('node:test')
const assert = require('node:assert')

const kanji = require('./kanji')
const testClient = require('hono/testing').testClient

if (require.main === module) {
  main()
}

async function main () {
  try {
    const tests = [ // <2>
      helloTest,
      alwaysFailTest,
    ]

    for (const test of tests) { // <3>
      try {
        await test()
        console.info(`OK ${test.name}`) // <4>
      } catch (err) {
        console.info(`NG ${test.name}`) // <5>
        console.error(err)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function helloTest () {
    const client = testClient(kanji)

    const res = await client.moji.$get({
      query: { m: 'hono' },
    })

  
    assert.strictEqual(res.status, 200)
}

async function alwaysFailTest () {
  assert.fail('alwaysFail')
}


