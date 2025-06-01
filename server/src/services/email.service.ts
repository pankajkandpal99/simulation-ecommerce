import nodemailer from "nodemailer";
import { IOrder } from "../types/model/i-order.model.js";
import { env } from "../config/env.js";

// Configure Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: env.MAILTRAP_HOST,
  port: env.MAILTRAP_PORT,
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASS,
  },
});

export const sendOrderConfirmationEmail = async (
  order: IOrder,
  success: boolean,
  customerEmail?: string
) => {
  try {
    let emailAddress: string;

    if (customerEmail) {
      emailAddress = customerEmail;
    } else if (
      typeof order.user === "object" &&
      order.user !== null &&
      "email" in order.user
    ) {
      emailAddress = (order.user as { email: string }).email;
    } else if (order.guestEmail) {
      emailAddress = order.guestEmail;
    } else {
      console.error("No email address found for order:", order.orderNumber);
      return;
    }

    const mailOptions = {
      from: '"Your Store" <no-reply@yourstore.com>',
      to: emailAddress,
      subject: success
        ? `Order Confirmation - #${order.orderNumber}`
        : `Payment Failed - Order #${order.orderNumber}`,
      html: success ? generateSuccessEmail(order) : generateFailureEmail(order),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

const generateSuccessEmail = (order: IOrder) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4CAF50;">Thank you for your order!</h1>
      <p>Your order #${order.orderNumber} has been confirmed.</p>
      
      <h2>Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Qty</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item: (typeof order.items)[number]) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                ${item.productSnapshot.title}
                ${item.variant ? `<br><small>${item.variant.name}: ${item.variant.value}</small>` : ""}
              </td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">₹${item.price.toFixed(2)}</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">₹${item.subtotal.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; text-align: right;">
        <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ₹${order.shipping.toFixed(2)}</p>
        <p><strong>Tax:</strong> ₹${order.tax.toFixed(2)}</p>
        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
      </div>
      
      <h2>Shipping Information</h2>
      <p>
        ${order.shippingAddress.fullName}<br>
        ${order.shippingAddress.addressLine1}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        ${order.shippingAddress.country}<br>
        Phone: ${order.shippingAddress.phoneNumber}
      </p>
      
      <p style="margin-top: 20px;">We'll notify you when your order ships.</p>
    </div>
  `;
};

const generateFailureEmail = (order: IOrder) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #F44336;">Payment Failed</h1>
      <p>We were unable to process your payment for order #${order.orderNumber}.</p>
      
      <h2>What to do next?</h2>
      <ol>
        <li>Check your payment details and try again</li>
        <li>Contact your bank if you suspect any issues</li>
        <li>Contact our support team if you need assistance</li>
      </ol>
      
      <p>You can retry your payment by visiting your order page.</p>
      
      <p style="margin-top: 20px;">If you believe this is an error, please contact our support team at support@yourstore.com.</p>
    </div>
  `;
};
