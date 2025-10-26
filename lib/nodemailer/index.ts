import nodemailer from "nodemailer";
import {
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  STOCK_ALERT_UPPER_EMAIL_TEMPLATE,
  STOCK_ALERT_LOWER_EMAIL_TEMPLATE,
} from "./templates";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro
  );

  const mailOptions = {
    from: `Signalist <signalist@safabelhtrading.pro>`,
    to: email,
    subject: `Welcome to Signalist - your stock market toolkit is ready!`,
    text: "Thanks for joining Signalist",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}) => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
    "{{date}}",
    date
  ).replace("{{newsContent}}", newsContent);

  const mailOptions = {
    from: `Signalist News <signalist@safabelhtrading.pro>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendUpperAlertEmail = async ({
  email,
  symbol,
  company,
  targetPrice,
  currentPrice,
}: {
  email: string;
  symbol: string;
  company: string;
  targetPrice: string;
  currentPrice: string;
}) => {
  const html = STOCK_ALERT_UPPER_EMAIL_TEMPLATE.replace("{{symbol}}", symbol)
    .replace("{{company}}", company)
    .replace("{{targetPrice}}", targetPrice)
    .replace("{{currentPrice}}", currentPrice)
    .replace("{{timestamp}}", new Date().toLocaleString());

  await transporter.sendMail({
    from: "Signalist Alerts <signalist@safabelhtrading.pro>",
    to: email,
    subject: `📈 Price Alert: ${symbol} Hit Upper Target`,
    html,
  });
};

export const sendLowerAlertEmail = async ({
  email,
  symbol,
  company,
  targetPrice,
  currentPrice,
}: {
  email: string;
  symbol: string;
  company: string;
  targetPrice: string;
  currentPrice: string;
}) => {
  const html = STOCK_ALERT_LOWER_EMAIL_TEMPLATE.replace("{{symbol}}", symbol)
    .replace("{{company}}", company)
    .replace("{{targetPrice}}", targetPrice)
    .replace("{{currentPrice}}", currentPrice)
    .replace("{{timestamp}}", new Date().toLocaleString());

  await transporter.sendMail({
    from: "Signalist Alerts <signalist@safabelhtrading.pro>",
    to: email,
    subject: `📉 Price Alert: ${symbol} Hit Lower Target`,
    html,
  });
};
