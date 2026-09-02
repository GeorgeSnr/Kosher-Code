import { saveContactMessage } from './storageService';

export const RECIPIENT_EMAIL = 'georgewilliamochole@gmail.com';
export const WHATSAPP_NUMBER = '+256703275790';
export const WHATSAPP_RAW_NUMBER = '256703275790';

/**
 * Formats a structured WhatsApp message with consultation details
 */
export const buildWhatsAppMessage = (formData = {}) => {
    return `*🚀 KOSHER CODE - ENTERPRISE DEMO & CONSULTATION REQUEST*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${formData.name || 'N/A'}
📧 *Corporate Email:* ${formData.email || 'N/A'}
📞 *Phone / WhatsApp:* ${formData.phone || 'N/A'}
🏢 *Institution / Sector:* ${formData.institution || 'N/A'}
🌍 *Operational Region:* ${formData.region || 'N/A'}
📋 *Subject / Scope:* ${formData.subject || 'N/A'}

📝 *Requirements & Project Details:*
${formData.description || 'No additional details provided.'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Submitted via Kosher Code Enterprise Portal_`;
};

/**
 * Returns direct WhatsApp link with pre-filled consultation message
 */
export const getWhatsAppUrl = (formData = {}) => {
    const text = buildWhatsAppMessage(formData);
    return `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(text)}`;
};

/**
 * Returns a quick direct WhatsApp chat link
 */
export const getQuickWhatsAppUrl = () => {
    const defaultText = `Hello Kosher Code team, I would like to inquire about your enterprise software, SACCO ERP, and core banking solutions.`;
    return `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(defaultText)}`;
};

/**
 * Sends the consultation request email to georgewilliamochole@gmail.com via formsubmit.co AJAX API
 */
export const sendConsultationEmail = async (formData) => {
    const endpoint = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;
    
    const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        institution: formData.institution,
        region: formData.region,
        subject: formData.subject,
        message: formData.description,
        _subject: `[Kosher Code Inquiry] ${formData.subject || 'Enterprise Consultation'} - ${formData.name} (${formData.institution})`,
        _replyto: formData.email,
        _template: 'table',
        _captcha: 'false'
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            console.warn('FormSubmit email notice: response status', response.status);
            return { success: false, status: response.status };
        }
    } catch (error) {
        console.warn('FormSubmit email network warning:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Unified dispatch: Saves to Firestore & sends email to georgewilliamochole@gmail.com
 */
export const dispatchConsultationRequest = async (formData) => {
    // 1. Save to Cloud Firestore contacts collection for Admin Dashboard
    try {
        saveContactMessage(formData);
    } catch (e) {
        console.warn('Firestore contact save warning:', e.message);
    }

    // 2. Dispatch email to georgewilliamochole@gmail.com
    const emailResult = await sendConsultationEmail(formData);

    // 3. Generate WhatsApp link for immediate chat
    const whatsAppUrl = getWhatsAppUrl(formData);

    return {
        success: true,
        emailSent: emailResult.success,
        whatsAppUrl
    };
};