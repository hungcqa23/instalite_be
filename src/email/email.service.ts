import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private sesClient: SESClient;
  constructor(private readonly configService: ConfigService) {
    this.sesClient = new SESClient({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')
      }
    });
  }

  private createSendEmailCommand({
    fromAddress,
    toAddresses,
    ccAddresses = [],
    body,
    subject,
    replyToAddresses = []
  }: {
    fromAddress: string;
    toAddresses: string | string[];
    ccAddresses?: string | string[];
    body: string;
    subject: string;
    replyToAddresses?: string[];
  }) {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
        ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
      },
      Message: {
        Body: {
          Html: {
            Data: body
          }
        },
        Subject: {
          Data: subject
        }
      },
      Source: fromAddress,
      ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
    });
  }

  async sendWelcomeEmail(toAddress: string, subject: string, body: string) {
    const sendEmailCommand = this.createSendEmailCommand({
      fromAddress: this.configService.get<string>('SES_FROM_ADDRESS'),
      toAddresses: toAddress,
      subject,
      body
    });

    try {
      return await this.sesClient.send(sendEmailCommand);
    } catch (e) {
      console.error('Failed to send email');
      console.log(e);
      return e;
    }
  }
}
