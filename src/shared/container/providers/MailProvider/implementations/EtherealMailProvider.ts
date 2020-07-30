import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
  private mailClient: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then(account => {
        this.mailClient = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
      })
      .catch(err => {
        console.error(`Failed to create a testing account. ${err.message}`);
        return process.exit(1);
      });
  }

  public async sendMail(to: string, body: string): Promise<void> {
    const message = {
      from: 'Equipe GoBarber <equipe@gobarber.com.br>',
      to,
      subject: 'Recuperação de senha',
      text: body,
    };

    this.mailClient
      .sendMail(message)
      .then(info => {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      })
      .catch(err => {
        console.log(`Error occurred. ${err.message}`);
        return process.exit(1);
      });
  }
}
