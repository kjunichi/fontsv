const { createCanvas, Image, registerFont } = require('canvas')
const { Hono } = require('hono')

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

const getJson = (data) => {

}

const genFontData = async (cs, moji, callback) => {
    const target = moji
    const fsize = 8

    cs.width = fsize
    cs.height = fsize //+ 2
    const ctx = cs.getContext("2d")
    
    ctx.font = `${fsize}px "Misaki"`
    
    ctx.textBaseline = "bottom"
    ctx.fillText(target, 0, fsize + 1);
    const arraySize = cs.width * cs.height * 4
    
    const simg = ctx.getImageData(0, 0, cs.width, cs.height)
    const img = new Image()
    const cs2 = createCanvas(400, 400)
    cs2.width = cs.width * 4
    cs2.height = cs.height * 4
    const ctx2 = cs2.getContext("2d")
    const out = { "value": "" }
    await new Promise((resolve) => {
        img.onload = async () => {
    
            ctx2.drawImage(img, 0, 0, cs2.width, cs2.height)
            const limage = ctx.getImageData(0, 0, cs.width, cs.height)

            let pidx = 0
    
            let buf = []
            for (let y = 0; y < cs.height; y++) {

                let line = ""
                for (let x = 0; x < cs.width; x++) {
                    if (limage.data[pidx + 3] > 100) {
                        line += "1"
                    } else {
                        line += "0"
                    }
                    pidx += 4
                }
    
                buf.push("0000"+line)
            }
            
            out.value = buf.length + "\n"
            out.line = buf.join("")
            resolve(out.line);           
        }
        img.src = cs.toDataURL("image/png");
    })
    return out.line
}

app.get('/moji', async (c) => {
    const mojiRetsu = c.req.query('m')
    console.log(`mojiRetsu = ${mojiRetsu}`)
    const len = mojiRetsu.length
    let counter = 0
    let matData = []
    
    for (const moji of mojiRetsu) {
        // dataに0,1で96ビット分が帰ってくる
        const data = await genFontData(cs, moji, null)
        //console.log(data.split(''))
        let frame = []
        for(let i= 0; i< 3; i++) {
            let tmpline=[]
            for(let j= 0; j< 32; j++) {
                tmpline.push(data[i*32+j])
            }
            tmpline = tmpline.join("")
            tmphex = parseInt(tmpline,2).toString(16)
            console.log(`tmpline = 0x${tmphex}`)
            frame.push(parseInt(tmpline,2))
        }
        
        // dataから32ビット区切りで16進数にする
        matData.push({"frame": frame})
    }
    
    return c.json(matData)
})


registerFont('misaki_gothic.ttf', { family: 'Misaki' })
const cs = createCanvas(400, 400)

module.exports = app
