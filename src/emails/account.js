const mailgun = require('mailgun-js')


//const DOMAIN = 'sandbox0bb9c404f27f4a9a80758394972545f2.mailgun.org'
const DOMAIN = 'WORKGROUP'
const mg = mailgun({
    apiKey: process.env.MAILGUN_API,
    domain: DOMAIN
})

const sendWelcomeEmail = (email, name) => {
    mg.messages().send({
        from: 'Your Mom <yomom@samples.mailgun.org>',
        to: email,
        subject: `HEERRRROO ${name}`,
        text: `HEERRRROO ${name}, Thank you for signing up for my site over!`
    }, (err, body) => {
        if (err) {
            return console.log(err)
        }

        console.log(body)
    })
}


const sendCancellationEmail = (email, name) => {
    mg.messages().send({
        from: 'Your Mom <yomom@samples.mailgun.org>',
        to: email,
        subject: `HEERRRROO ${name}`,
        text: `SO LONG AND THANKS FOR ALL THE FISH!`
    }, (err, body) => {
        if (err) {
            return console.log(err)
        }

        console.log(body)
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}