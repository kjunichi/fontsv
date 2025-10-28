const { serve } = require(`@hono/node-server`)
const app = require('./kanji')

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})
