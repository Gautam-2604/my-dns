const dgram = require('node:dgram')
const dnsPacket = require('dns-packet')

const server = dgram.createSocket('udp4')

const db = {
    'ggaurisaria.dev':'1.2.3.4',
    'blog.ggaurisaria.dev':'5.6.7.8'
}
server.on('message',(msg, rinfo)=>{
    const incomingReq = dnsPacket.decode(msg)
    const ipAddressfromDb = db[incomingReq.questions[0].name]

    const ans = dnsPacket.encode({
        type:'response',
        id: incomingReq.id,
        flags: dnsPacket.AUTHORITATIVE_ANSWER,
        questions: incomingReq.questions,
        answers:[{
            type:'A',
            class:'IN',
            name:incomingReq.questions[0].name,
            data: ipAddressfromDb
        }]
    })
    server.send(ans, rinfo.port, rinfo.address)
})



server.bind(53,()=>{
    console.log('DNS Running on Port 53');
    
})