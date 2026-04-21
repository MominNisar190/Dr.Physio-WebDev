# 🚀 Quick Start Guide - Dr. Zishaan Shaha Physiotherapy Website

**Last Updated:** April 21, 2026  
**Status:** Production Ready

---

## ⚡ Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/physio_clinic
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### 3. Start Server
```bash
npm start
```

### 4. Access Website
- **Public Site:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin.html

---

## 🔑 Default Admin Credentials

**Username:** (Set in .env ADMIN_USERNAME)  
**Password:** (Set in .env ADMIN_PASSWORD)

⚠️ **IMPORTANT:** Change these before deployment!

---

## 📱 Key Features Quick Access

### For Users:
1. **Book Appointment:** http://localhost:3000/contact.html
2. **View Services:** http://localhost:3000/services.html
3. **Watch Videos:** http://localhost:3000/training-videos.html
4. **Read Blog:** http://localhost:3000/blog.html
5. **Submit Review:** http://localhost:3000/index.html (scroll to reviews)

### For Admin:
1. **Login:** http://localhost:3000/admin.html
2. **Manage Bookings:** Dashboard → Bookings section
3. **WhatsApp Messages:** Click WhatsApp button on confirmed bookings
4. **Add Videos:** Dashboard → Video Management
5. **Moderate Reviews:** Dashboard → Review Management

---

## 🎯 Common Tasks

### Add a New Booking (User):
1. Go to Contact page
2. Fill form (all fields required)
3. Select date (today or future)
4. Select time
5. Click "Confirm Booking"
6. Success popup appears

### Confirm Booking & Send WhatsApp (Admin):
1. Login to admin dashboard
2. Find booking in table
3. Click ✓ button to confirm
4. WhatsApp button appears
5. Click WhatsApp button
6. WhatsApp opens with pre-filled message
7. Click Send in WhatsApp

### Add YouTube Video (Admin):
1. Login to admin dashboard
2. Scroll to Video Management
3. Enter video title
4. Select category
5. Paste YouTube URL
6. Click "Add Video"

### Approve Review (Admin):
1. Login to admin dashboard
2. Scroll to Review Management
3. Find pending review
4. Click "✓ Approve" button
5. Review appears on homepage

---

## 🔧 Troubleshooting

### Issue: Can't connect to database
**Solution:** Check MONGO_URI in .env file

### Issue: Admin login fails
**Solution:** Verify ADMIN_USERNAME and ADMIN_PASSWORD in .env

### Issue: WhatsApp button not working
**Solution:** Ensure booking status is "confirmed" and phone number exists

### Issue: Videos not loading
**Solution:** Check YouTube URL format and internet connection

### Issue: Form validation errors
**Solution:** 
- Phone: Must be 10-15 digits
- Email: Must be valid format
- Date: Must be today or future
- All fields: Required

---

## 📊 File Locations

### HTML Pages:
- Homepage: `index.html`
- Services: `services.html`
- Blog: `blog.html`
- Videos: `training-videos.html`
- Contact: `contact.html`
- About: `about.html`
- Admin: `admin.html`

### Styles:
- Main CSS: `styles.css`
- Animations: `animations.css`

### Scripts:
- Client JS: `scripts.js`
- Server: `server.js`

### Images:
- All images: `DATA/` folder

---

## 🌐 API Endpoints

### Public Endpoints:
- `POST /api/bookings` - Create booking
- `GET /api/videos` - Get all videos
- `POST /api/reviews` - Submit review
- `GET /api/reviews` - Get approved reviews

### Admin Endpoints (Require JWT):
- `POST /api/admin/login` - Admin login
- `GET /api/admin/bookings` - Get all bookings
- `PATCH /api/admin/bookings/:id` - Update booking status
- `DELETE /api/admin/bookings/:id` - Delete booking
- `POST /api/admin/videos` - Add video
- `DELETE /api/admin/videos/:id` - Delete video
- `GET /api/admin/reviews` - Get all reviews
- `PATCH /api/admin/reviews/:id` - Approve/unapprove review
- `DELETE /api/admin/reviews/:id` - Delete review

---

## 🎨 Customization Quick Tips

### Change Colors:
Edit `styles.css` - Search for color codes:
- Primary: `#3A86FF`
- Secondary: `#2EC4B6`
- Success: `#22c55e`
- Warning: `#f59e0b`
- Error: `#ef4444`

### Change Contact Info:
Edit footer in each HTML file:
- Phone: `+91 96894 25706`
- Email: `zishaanshaha6@gmail.com`
- Location: `Nanded 431604, Maharashtra`

### Change Services:
Edit `services.html` - Add/remove service cards

### Change WhatsApp Message:
Edit `admin.html` - Find `generateWhatsAppURL` function

---

## 📱 Mobile Testing

### Test on Real Devices:
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from mobile: `http://YOUR_IP:3000`
3. Test all features

### Responsive Breakpoints:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

---

## 🔒 Security Checklist

Before deployment:
- [ ] Change admin credentials
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Set secure CORS policy
- [ ] Use environment variables
- [ ] Don't commit .env file
- [ ] Update MongoDB connection string
- [ ] Test all validation

---

## 🚀 Deployment Steps

### Option 1: Render (Recommended)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Add environment variables
5. Deploy

### Option 2: Railway
1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repo
4. Add environment variables
5. Deploy

### Option 3: Heroku
1. Install Heroku CLI
2. `heroku create`
3. `heroku config:set` for env vars
4. `git push heroku main`

---

## 📞 Support

### Issues?
1. Check console for errors (F12)
2. Verify environment variables
3. Check database connection
4. Review error messages
5. Check network tab

### Need Help?
- **Developer:** Nisar Momin
- **Email:** mominnisar190@gmail.com
- **GitHub:** github.com/MominNisar190

---

## ✅ Pre-Launch Checklist

- [ ] Environment variables configured
- [ ] Database connected
- [ ] Admin credentials set
- [ ] All pages tested
- [ ] Mobile responsive checked
- [ ] Forms validated
- [ ] WhatsApp integration tested
- [ ] Images optimized
- [ ] Contact info updated
- [ ] SSL certificate installed (production)

---

## 🎉 You're Ready!

**Everything is set up and ready to go!**

Start accepting bookings and managing your physiotherapy practice online! 🚀

---

**Quick Start Guide Version:** 1.0  
**Last Updated:** April 21, 2026
