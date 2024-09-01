import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Create SES service object.
const sesClient = new SESClient({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: '',
    secretAccessKey: ''
  }
});

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses:
      replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  });
};

const sendVerifyEmail = async (
  toAddress: string,
  subject: string,
  body: string
) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: 'anbeel191@gmail.com',
    toAddresses: toAddress,
    body,
    subject
  });

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (e) {
    console.error('Failed to send email.');
    console.log(e);
    return e;
  }
};

sendVerifyEmail(
  '21522112@gm.uit.edu.vn',
  'Tiêu đề email',
  '<h1>Nội dung email</h1>'
);
