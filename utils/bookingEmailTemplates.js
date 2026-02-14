// BOOKING EMAIL TEMPLATES

export const userBookingConfirmationTemplate = (firstName, booking, listing, status) => {
  const formatDate = date => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case "approved":
        return "#28a745";
      case "rejected":
        return "#dc3545";
      case "cancelled":
        return "#ffc107";
      default:
        return "#007bff";
    }
  };

  const getStatusText = status => {
    switch (status) {
      case "approved":
        return "Confirmed";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  let bookingDetails = "";

  if (booking.__t === "RestaurantBooking") {
    bookingDetails = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Booking Date</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.details.date)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Number of Guests</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.details.numberOfGuest}</td>
      </tr>
    `;
  } else if (booking.__t === "RestaurantBooking") {
    bookingDetails = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Service Schedule</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.details.serviceSchedule)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Service Location</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.details.streetAddress}, ${booking.details.city}, ${booking.details.state}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Service Description</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.details.serviceDescription}</td>
      </tr>
    `;
  } else if (booking.__t === "EventBooking") {
    bookingDetails = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Event Date</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.details.eventDate)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">SStart Time</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.details.startTime)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">End Time</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.details.endTime)}</td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Booking ${getStatusText(status)}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #007bff; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Ajani Booking</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #333; margin-top: 0;">Hello ${firstName},</h2>
                  
                  <div style="background-color: ${getStatusColor(status)}; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <h3 style="margin: 0; font-size: 18px;">Your booking has been ${getStatusText(status).toLowerCase()}</h3>
                  </div>

                  <h3 style="color: #333;">Booking Details</h3>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Booking ID</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking._id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Listing</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${listing.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Category</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-transform: capitalize;">${booking.__t}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Status</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <span style="background-color: ${getStatusColor(status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${getStatusText(status)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Booking Date</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.createdAt)}</td>
                    </tr>
                    ${bookingDetails}
                    ${
                      booking.specialRequest
                        ? `
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Special Request</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.specialRequest}</td>
                      </tr>
                    `
                        : ""
                    }
                    ${
                      booking.message
                        ? `
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Your Message</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.message}</td>
                      </tr>
                    `
                        : ""
                    }
                  </table>

                  ${
                    status === "approved"
                      ? `
                    <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
                      <h4 style="margin-top: 0; color: #007bff;">Next Steps</h4>
                      <p style="margin-bottom: 0;">Your booking is confirmed! Please contact the vendor if you need to make any changes or have questions about your booking.</p>
                    </div>
                  `
                      : status === "rejected"
                        ? `
                    <div style="background-color: #ffeaea; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
                      <h4 style="margin-top: 0; color: #dc3545;">Booking Rejected</h4>
                      <p style="margin-bottom: 0;">Unfortunately, your booking has been rejected by the vendor. You can try booking again or contact us for assistance.</p>
                    </div>
                  `
                        : status === "cancelled"
                          ? `
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                      <h4 style="margin-top: 0; color: #856404;">Booking Cancelled</h4>
                      <p style="margin-bottom: 0;">Your booking has been cancelled. If this was not initiated by you, please contact the vendor or our support team.</p>
                    </div>
                  `
                          : `
                    <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
                      <h4 style="margin-top: 0; color: #007bff;">Awaiting Confirmation</h4>
                      <p style="margin-bottom: 0;">Your booking is currently pending approval from the vendor. You will receive an email notification once the status changes.</p>
                    </div>
                  `
                  }

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL}/bookings" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View All Bookings</a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                  <p style="margin: 0;">This is an automated message from Ajani. Please do not reply to this email.</p>
                  <p style="margin: 5px 0 0;">If you have any questions, please contact our support team.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const vendorBookingNotificationTemplate = (vendorName, booking, listing, status) => {
  const formatDate = date => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = status => {
    switch (status) {
      case "approved":
        return "Confirmed";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  let bookingDetails = "";

  if (booking.__t === "RestaurantBooking") {
    bookingDetails = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Booking Date</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.date)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Number of Guests</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.numberOfGuest}</td>
      </tr>
    `;
  } else if (booking.__t === "ServicesBooking") {
    bookingDetails = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Service Schedule</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.serviceSchedule)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Service Location</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.streetAddress}, ${booking.city}, ${booking.state}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Service Description</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.serviceDescription}</td>
      </tr>
    `;
  } else if (booking.__t === "EventBooking") {
    bookingDetails = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Event Start</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.startDate)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Event End</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.endDate)}</td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Booking Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #28a745; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Ajani Booking</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #333; margin-top: 0;">Hello ${vendorName},</h2>
                  
                  <div style="background-color: #28a745; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <h3 style="margin: 0; font-size: 18px;">New booking received for your ${listing.category} listing</h3>
                  </div>

                  <h3 style="color: #333;">Booking Details</h3>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Booking ID</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking._id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.firstName} ${booking.lastName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Email</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Phone</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Listing</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${listing.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Category</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-transform: capitalize;">${booking.__t}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Status</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <span style="background-color: #007bff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${getStatusText(status)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Booking Date</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.createdAt)}</td>
                    </tr>
                    ${bookingDetails}
                    ${
                      booking.specialRequest
                        ? `
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Special Request</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.specialRequest}</td>
                      </tr>
                    `
                        : ""
                    }
                    ${
                      booking.message
                        ? `
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Message</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.message}</td>
                      </tr>
                    `
                        : ""
                    }
                  </table>

                  <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #007bff;">Action Required</h4>
                    <p style="margin-bottom: 0;">Please review this booking request and update the status as needed. You can manage all your bookings through your vendor dashboard.</p>
                  </div>

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL}/vendor/bookings" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Manage Bookings</a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                  <p style="margin: 0;">This is an automated message from Ajani. Please do not reply to this email.</p>
                  <p style="margin: 5px 0 0;">If you have any questions, please contact our support team.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const adminBookingNotificationTemplate = (booking, listing, status) => {
  const formatDate = date => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = status => {
    switch (status) {
      case "approved":
        return "Confirmed";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Booking Activity Report</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #6c757d; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Ajani Admin</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #333; margin-top: 0;">Booking Activity Report</h2>
                  
                  <div style="background-color: #6c757d; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <h3 style="margin: 0; font-size: 18px;">New booking activity detected</h3>
                  </div>

                  <h3 style="color: #333;">Booking Summary</h3>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Booking ID</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking._id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.firstName} ${booking.lastName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Vendor</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${listing.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Category</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-transform: capitalize;">${booking.__t}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Status</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <span style="background-color: #007bff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${getStatusText(status)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Booking Date</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDate(booking.createdAt)}</td>
                    </tr>
                  </table>

                  <div style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #495057;">Admin Dashboard</h4>
                    <p style="margin-bottom: 0;">You can review and manage all bookings through the admin dashboard.</p>
                  </div>

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL}/admin/bookings" style="background-color: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Admin Dashboard</a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                  <p style="margin: 0;">This is an automated message from Ajani. Please do not reply to this email.</p>
                  <p style="margin: 5px 0 0;">For system issues, please contact the development team.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
