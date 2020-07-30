import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private mailClient: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
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

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const { from, to, subject, templateData } = data;
    const { template, variables } = templateData;
    const message = {
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse({
        template,
        variables,
      }),
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
