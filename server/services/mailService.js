module.exports = {
    sendMail: function(config, sendTo, view, attachment, production_mode){
        var fs = require('fs');
        var nodemailer = require('nodemailer');
        var mustache = require('mustache');

        if(!production_mode){
            console.log('sending mail:'+view.header+'\n', sendTo, view, attachment);
        }
        if (!config.mail.enableMail || config.mail.enableMail === false) {
            console.log('There is no configuration for sending mails. The email will not be sent.');
            return;
        }

        fs.readFile(config.mail.htmlFilePath, 'utf8', function (err, template) {
            if (err) {
                return console.log(err);
            }

            var html = mustache.render(template, view);

            var smtpConfig = {
                host: config.mail.host,
                port: config.mail.port,
                secureConnection: false,
                auth: {
                    user: config.mail.user,
                    pass: config.mail.pass
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            };

            var transporter = nodemailer.createTransport(smtpConfig);

            var mailOptions = {
                from: config.mail.address, // sender address
                bcc: sendTo, // list of receivers
                subject: view.title, // Subject line
                html: html
            };

            if (attachment) {
                mailOptions.attachments = attachment;
            }

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

        });
    }, 
    renderTemplates: function(template, meeting, user){
        var mustache = require('mustache');

        return {
            header: mustache.render(template.header, { meeting, user }),
            title: mustache.render(template.title, { meeting, user }),
            body: mustache.render(template.body, { meeting, user }),
            button_href: mustache.render(template.button_href, { meeting, user }),
            button_label: mustache.render(template.button_label, { meeting, user }),
            foot: mustache.render(template.foot, { meeting, user })
        };
    }
}