const test = require('node:test')
const assert = require('node:assert')

const kanji = require('./kanji')
const testClient = require('hono/testing').testClient


test('kanji', async (context) => {
    const client = testClient(kanji)

    const res = await client.moji.$get({
      query: { m: 'A' }
    })

    assert.strictEqual(res.status, 200)
    const json = await res.json()
    assert.deepStrictEqual(json, [ {frame: [ 16394,10489344,2685009920]}])
})


