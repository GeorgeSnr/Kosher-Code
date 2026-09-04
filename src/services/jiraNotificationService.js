import { registerUserAccount } from './storageService';

/**
 * Service to handle real automated email and WhatsApp dispatches for:
 * 1. New Team Member Onboarding & Invitation
 * 2. Jira Ticket Assignment & Workload Notifications
 */

export const getBasePortalUrl = () => {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return window.location.origin;
    }
    return 'https://koshercode.ug';
};

/**
 * Clean and format phone number for WhatsApp
 */
export const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = String(phone).replace(/[^0-9]/g, '');
    return cleaned;
};

/**
 * Dispatches an automated onboarding invitation to a new team member
 * 1. Creates a registered user account with assigned role
 * 2. Sends an invitation email via FormSubmit AJAX to member.email
 * 3. Builds a pre-filled WhatsApp welcome invitation URL
 */
export const sendTeamMemberInvite = async (member, inviter = null, customTempPassword = '') => {
    if (!member || !member.email) {
        return { success: false, error: 'Missing member email' };
    }

    const portalUrl = `${getBasePortalUrl()}/admin/login`;
    const tempPassword = customTempPassword || `Kosher@${Math.floor(1000 + Math.random() * 9000)}`;
    const inviterName = inviter?.name || 'George William Ochole (Super Administrator)';

    // 1. Provision account locally & in Firestore so they can authenticate
    try {
        registerUserAccount({
            name: member.name,
            email: member.email.toLowerCase().trim(),
            role: 'admin', // Admin portal tier with RBAC permissions
            department: member.department || 'Engineering',
            institution: 'Kosher Code Systems',
            phone: member.phone || '',
            password: tempPassword,
            img: member.avatar || ''
        });
    } catch (e) {
        console.warn('Auto account registration notice:', e.message);
    }

    // 2. Build email payload
    const emailPayload = {
        name: member.name,
        email: member.email,
        role: member.roleTitle || 'Team Member',
        department: member.department || 'Engineering',
        invited_by: inviterName,
        portal_access_url: portalUrl,
        temporary_password: tempPassword,
        security_instructions: 'Please sign in to the Kosher Code Admin Portal and update your profile password under Settings.',
        _subject: `[Kosher Code Workspace] Welcome to the Team, ${member.name} (${member.roleTitle || 'Developer'})`,
        _replyto: 'georgewilliamochole@gmail.com',
        _template: 'table',
        _captcha: 'false'
    };

    let emailSent = false;
    try {
        const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(member.email)}`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailPayload)
        });

        if (response.ok) {
            emailSent = true;
        } else {
            console.warn('Invite email response status:', response.status);
        }
    } catch (err) {
        console.warn('Invite email network warning:', err.message);
    }

    // 3. Build WhatsApp invite message
    const cleanPhone = cleanPhoneNumber(member.phone);
    const whatsappText = `*🚀 WELCOME TO KOSHER CODE ENGINEERING & AGILE HUB*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hello *${member.name}*, you have been onboarded to the Kosher Code engineering team as:
👔 *Role:* ${member.roleTitle || 'Engineer'}
🏢 *Department:* ${member.department || 'Engineering'}
👤 *Invited By:* ${inviterName}

🔗 *Workspace Access:* ${portalUrl}
🔑 *Initial Password:* ${tempPassword}

Please sign in to view your assigned Jira tickets, sprint cycles, and engineering tasks.
━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Kosher Code Executive Workspace_`;

    const whatsappUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`
        : null;

    return {
        success: true,
        emailSent,
        tempPassword,
        portalUrl,
        whatsappUrl,
        whatsappText
    };
};

/**
 * Dispatches an automated notification email & WhatsApp link when a Jira ticket is assigned
 */
export const sendTicketAssignmentNotification = async (ticket, assignee, assigner = null, sprintName = '') => {
    if (!ticket || !assignee || !assignee.email) {
        return { success: false, error: 'Missing ticket or assignee details' };
    }

    const ticketUrl = `${getBasePortalUrl()}/admin/tickets`;
    const assignerName = assigner?.name || 'Scrum Master / Administrator';

    const emailPayload = {
        assignee_name: assignee.name,
        ticket_key: ticket.key,
        ticket_title: ticket.title,
        issue_type: ticket.type,
        priority: ticket.priority,
        sprint: sprintName || 'Active Sprint Cycle',
        story_points: `${ticket.storyPoints || 0} pts`,
        due_date: ticket.dueDate || 'Flexible Target',
        assigned_by: assignerName,
        ticket_url: ticketUrl,
        ticket_description: ticket.description ? ticket.description.substring(0, 300) : 'No description provided.',
        _subject: `[Kosher Code Jira] Assigned: ${ticket.key} - ${ticket.title} (${ticket.priority} Priority)`,
        _replyto: 'georgewilliamochole@gmail.com',
        _template: 'table',
        _captcha: 'false'
    };

    let emailSent = false;
    try {
        const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(assignee.email)}`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailPayload)
        });

        if (response.ok) {
            emailSent = true;
        } else {
            console.warn('Ticket assignment email response status:', response.status);
        }
    } catch (err) {
        console.warn('Ticket assignment email network warning:', err.message);
    }

    // WhatsApp notification
    const cleanPhone = cleanPhoneNumber(assignee.phone);
    const whatsappText = `*📋 KOSHER CODE JIRA - NEW TICKET ASSIGNMENT*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hello *${assignee.name}*, a ticket has been assigned to you:
🏷️ *Key:* ${ticket.key}
📌 *Title:* ${ticket.title}
⚡ *Priority:* ${ticket.priority}
📦 *Type:* ${ticket.type} (${ticket.storyPoints || 0} pts)
🎯 *Sprint:* ${sprintName || 'Active Sprint'}
📅 *Due Date:* ${ticket.dueDate || 'Flexible'}
👤 *Assigned By:* ${assignerName}

🔗 *View Ticket:* ${ticketUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const whatsappUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`
        : null;

    return {
        success: true,
        emailSent,
        ticketUrl,
        whatsappUrl,
        whatsappText
    };
};
