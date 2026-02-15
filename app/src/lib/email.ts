/**
 * Email Notification Service
 * 
 * This module provides email notification functionality using SendGrid or Postmark.
 * 
 * Setup Instructions:
 * 1. Choose email provider (SendGrid or Postmark)
 * 2. Install package: npm install @sendgrid/mail OR npm install postmark
 * 3. Add API keys to .env.local
 * 4. Configure sender email
 */

// Email configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'sendgrid'; // 'sendgrid' or 'postmark'
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@dulili.com.au';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Dulili';

// SendGrid configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

// Postmark configuration
const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY || '';

/**
 * Email template types
 */
export type EmailTemplate = 
  | 'maintenance-created'
  | 'maintenance-updated'
  | 'announcement-posted'
  | 'levy-due'
  | 'levy-overdue'
  | 'meeting-scheduled'
  | 'document-uploaded'
  | 'welcome';

/**
 * Email data interface
 */
export interface EmailData {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

/**
 * Send email using configured provider
 */
export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    if (EMAIL_PROVIDER === 'sendgrid') {
      return await sendWithSendGrid(emailData);
    } else if (EMAIL_PROVIDER === 'postmark') {
      return await sendWithPostmark(emailData);
    } else {
      console.log('[Email] No provider configured, logging email:', emailData);
      return { success: true }; // Development mode - just log
    }
  } catch (error) {
    console.error('[Email] Send error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

/**
 * Send email using SendGrid
 */
async function sendWithSendGrid(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  if (!SENDGRID_API_KEY) {
    console.log('[Email] SendGrid not configured, skipping email');
    return { success: true };
  }

  try {
    // Dynamic import to avoid errors if package not installed
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(SENDGRID_API_KEY);

    const html = generateEmailHTML(emailData.template, emailData.data);

    await sgMail.default.send({
      to: emailData.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: emailData.subject,
      html,
    });

    console.log('[Email] Sent via SendGrid to:', emailData.to);
    return { success: true };
  } catch (error) {
    console.error('[Email] SendGrid error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'SendGrid send failed' 
    };
  }
}

/**
 * Send email using Postmark
 */
async function sendWithPostmark(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  if (!POSTMARK_API_KEY) {
    console.log('[Email] Postmark not configured, skipping email');
    return { success: true };
  }

  try {
    // Dynamic import to avoid errors if package not installed
    const postmark = await import('postmark');
    const client = new postmark.ServerClient(POSTMARK_API_KEY);

    const html = generateEmailHTML(emailData.template, emailData.data);

    await client.sendEmail({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: emailData.to,
      Subject: emailData.subject,
      HtmlBody: html,
    });

    console.log('[Email] Sent via Postmark to:', emailData.to);
    return { success: true };
  } catch (error) {
    console.error('[Email] Postmark error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Postmark send failed' 
    };
  }
}

/**
 * Generate HTML email content based on template
 */
function generateEmailHTML(template: EmailTemplate, data: Record<string, any>): string {
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border: 1px solid #E2E8F0; border-top: none; }
      .footer { background: #F8FAFC; padding: 20px; text-align: center; font-size: 12px; color: #64748B; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
      .badge-urgent { background: #FEE2E2; color: #991B1B; }
      .badge-high { background: #FED7AA; color: #9A3412; }
      .badge-medium { background: #DBEAFE; color: #1E40AF; }
      .badge-low { background: #F1F5F9; color: #475569; }
    </style>
  `;

  const templates: Record<EmailTemplate, string> = {
    'maintenance-created': `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>🔧 New Maintenance Request</h1>
        </div>
        <div class="content">
          <p>Hi ${data.managerName},</p>
          <p>A new maintenance request has been submitted:</p>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${data.title}</h3>
            <p><strong>Priority:</strong> <span class="badge badge-${data.priority}">${data.priority.toUpperCase()}</span></p>
            <p><strong>Category:</strong> ${data.category}</p>
            <p><strong>Location:</strong> ${data.location || 'Not specified'}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            <p><strong>Submitted by:</strong> ${data.submittedBy}</p>
          </div>
          <p style="text-align: center;">
            <a href="${data.url}" class="button">View Request</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    `,

    'announcement-posted': `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>📢 New Announcement</h1>
        </div>
        <div class="content">
          <p>Hi ${data.residentName},</p>
          <p>A new announcement has been posted for your building:</p>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${data.title}</h3>
            <p>${data.content}</p>
            <p style="font-size: 12px; color: #64748B; margin-top: 15px;">
              Posted by ${data.author} • ${data.date}
            </p>
          </div>
          <p style="text-align: center;">
            <a href="${data.url}" class="button">View Announcement</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
        </div>
      </div>
    `,

    'levy-due': `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>💳 Levy Payment Due</h1>
        </div>
        <div class="content">
          <p>Hi ${data.ownerName},</p>
          <p>Your levy payment is due soon:</p>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Period:</strong> ${data.period}</p>
            <p><strong>Amount:</strong> <span style="font-size: 24px; font-weight: bold; color: #4F46E5;">$${data.amount}</span></p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Unit:</strong> ${data.unit}</p>
          </div>
          <p style="text-align: center;">
            <a href="${data.url}" class="button">Pay Now</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
        </div>
      </div>
    `,

    'levy-overdue': `
      ${baseStyles}
      <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);">
          <h1>⚠️ Overdue Levy Payment</h1>
        </div>
        <div class="content">
          <p>Hi ${data.ownerName},</p>
          <p><strong>Your levy payment is now overdue.</strong></p>
          <div style="background: #FEE2E2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
            <p><strong>Period:</strong> ${data.period}</p>
            <p><strong>Amount:</strong> <span style="font-size: 24px; font-weight: bold; color: #DC2626;">$${data.amount}</span></p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Days Overdue:</strong> ${data.daysOverdue}</p>
          </div>
          <p>Please make payment as soon as possible to avoid additional interest charges.</p>
          <p style="text-align: center;">
            <a href="${data.url}" class="button">Pay Now</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
        </div>
      </div>
    `,

    'meeting-scheduled': `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>📅 Meeting Scheduled</h1>
        </div>
        <div class="content">
          <p>Hi ${data.memberName},</p>
          <p>A ${data.meetingType} has been scheduled:</p>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${data.title}</h3>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            ${data.description ? `<p><strong>Details:</strong> ${data.description}</p>` : ''}
          </div>
          <p style="text-align: center;">
            <a href="${data.url}" class="button">View Details</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
        </div>
      </div>
    `,

    'document-uploaded': `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>📄 New Document Uploaded</h1>
        </div>
        <div class="content">
          <p>Hi ${data.memberName},</p>
          <p>A new document has been uploaded to your building library:</p>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Document:</strong> ${data.documentName}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            <p><strong>Uploaded by:</strong> ${data.uploadedBy}</p>
            ${data.expiryDate ? `<p><strong>Expiry Date:</strong> ${data.expiryDate}</p>` : ''}
          </div>
          <p style="text-align: center;">
            <a href="${data.url}" class="button">View Document</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
        </div>
      </div>
    `,

    'welcome': `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Wattle!</h1>
        </div>
        <div class="content">
          <p>Hi ${data.name},</p>
          <p>Welcome to Dulili - your modern strata management platform!</p>
          <p>We're excited to have you on board. Here's what you can do:</p>
          <ul style="line-height: 2;">
            <li>📋 View and report maintenance issues</li>
            <li>📢 Stay updated with announcements</li>
            <li>📄 Access important documents</li>
            <li>💳 Manage levy payments</li>
            <li>👥 Connect with your community</li>
          </ul>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${data.url}" class="button">Get Started</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
          <p>Need help? Contact us at support@dulili.com.au</p>
        </div>
      </div>
    `,

    'maintenance-updated': `
      ${baseStyles}
      <div class="container">
        <div class="header">
          <h1>🔄 Maintenance Request Updated</h1>
        </div>
        <div class="content">
          <p>Hi ${data.residentName},</p>
          <p>Your maintenance request has been updated:</p>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${data.title}</h3>
            <p><strong>New Status:</strong> <span class="badge badge-medium">${data.status.toUpperCase()}</span></p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          </div>
          <p style="text-align: center;">
            <a href="${data.url}" class="button">View Request</a>
          </p>
        </div>
        <div class="footer">
          <p>Dulili - Modern Strata Management</p>
        </div>
      </div>
    `,
  };

  return templates[template] || templates['welcome'];
}

/**
 * Helper functions for common email scenarios
 */

export async function sendMaintenanceCreatedEmail(data: {
  managerEmail: string;
  managerName: string;
  title: string;
  priority: string;
  category: string;
  location?: string;
  description: string;
  submittedBy: string;
  url: string;
}) {
  return sendEmail({
    to: data.managerEmail,
    subject: `🔧 New ${data.priority.toUpperCase()} Maintenance Request: ${data.title}`,
    template: 'maintenance-created',
    data,
  });
}

export async function sendAnnouncementEmail(data: {
  residentEmail: string;
  residentName: string;
  title: string;
  content: string;
  author: string;
  date: string;
  url: string;
}) {
  return sendEmail({
    to: data.residentEmail,
    subject: `📢 New Announcement: ${data.title}`,
    template: 'announcement-posted',
    data,
  });
}

export async function sendLevyDueEmail(data: {
  ownerEmail: string;
  ownerName: string;
  period: string;
  amount: string;
  dueDate: string;
  unit: string;
  url: string;
}) {
  return sendEmail({
    to: data.ownerEmail,
    subject: `💳 Levy Payment Due - ${data.period}`,
    template: 'levy-due',
    data,
  });
}

export async function sendLevyOverdueEmail(data: {
  ownerEmail: string;
  ownerName: string;
  period: string;
  amount: string;
  dueDate: string;
  daysOverdue: number;
  url: string;
}) {
  return sendEmail({
    to: data.ownerEmail,
    subject: `⚠️ OVERDUE: Levy Payment - ${data.period}`,
    template: 'levy-overdue',
    data,
  });
}

export async function sendWelcomeEmail(data: {
  email: string;
  name: string;
  url: string;
}) {
  return sendEmail({
    to: data.email,
    subject: '🎉 Welcome to Wattle!',
    template: 'welcome',
    data,
  });
}
