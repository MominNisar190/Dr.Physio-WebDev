const API_BASE = 'https://dr-physio-webdev.onrender.com/api';

function showBookingPopup() {
  const popup = document.getElementById('bookingPopup');
  if (popup) { popup.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeBookingPopup() {
  const popup = document.getElementById('bookingPopup');
  if (popup) { popup.style.display = 'none'; document.body.style.overflow = ''; }
}
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeBookingPopup(); });

document.addEventListener('DOMContentLoaded', function () {

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const step = target / (1600 / 16);
    let current = 0;
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + (el.dataset.suffix || '');
          if (current >= target) clearInterval(timer);
        }, 16);
        counterObserver.unobserve(el);
      }
    });
    counterObserver.observe(el);
  });

  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    appointmentForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const msg = document.getElementById('formMessage');
      const btn = document.getElementById('submitBtn');

      if (!appointmentForm.checkValidity()) {
        msg.textContent = 'Please fill out all required fields correctly.';
        msg.className = 'form-message error';
        return;
      }

      btn.textContent = '⏳ Submitting…';
      btn.disabled = true;
      msg.className = 'form-message';
      msg.style.display = 'none';

      const payload = {
        name:    document.getElementById('name').value.trim(),
        email:   document.getElementById('email').value.trim(),
        phone:   document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        date:    document.getElementById('date').value,
        time:    document.getElementById('time').value,
        message: document.getElementById('message')?.value.trim() || ''
      };

      try {
        const res = await fetch(`${API_BASE}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Submission failed');
        msg.textContent = '✅ Appointment booked successfully!';
        msg.className = 'form-message success';
        appointmentForm.reset();
        showBookingPopup();
      } catch (err) {
        msg.textContent = '❌ ' + err.message;
        msg.className = 'form-message error';
      } finally {
        btn.textContent = '📅 Confirm Booking';
        btn.disabled = false;
      }
    });
  }

  const videoUploadForm = document.getElementById('videoUploadForm');
  const videosContainer = document.getElementById('videosContainer');

  if (videoUploadForm && videosContainer) {
    const savedVideos = JSON.parse(localStorage.getItem('trainingVideos') || '[]');
    savedVideos.forEach(addVideoToDOM);

    videoUploadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const title    = videoUploadForm.videoTitle.value.trim();
      const category = videoUploadForm.videoCategory.value;
      const file     = videoUploadForm.videoFile.files[0];
      const uploadMsg = document.getElementById('uploadMessage');

      if (!title || !category || !file) {
        uploadMsg.textContent = 'Please fill out all fields and select a video file.';
        uploadMsg.className = 'form-message error';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const newVideo = { id: Date.now(), title, category, videoUrl: event.target.result };
        savedVideos.push(newVideo);
        localStorage.setItem('trainingVideos', JSON.stringify(savedVideos));
        addVideoToDOM(newVideo);
        uploadMsg.textContent = '✅ Video uploaded successfully.';
        uploadMsg.className = 'form-message success';
        videoUploadForm.reset();
      };
      reader.readAsDataURL(file);
    });
  }

  function addVideoToDOM(video) {
    const article = document.createElement('article');
    article.className = 'video-item reveal';
    article.setAttribute('data-category', video.category);
    article.innerHTML = `
      <h3>${video.title}</h3>
      <video controls width="100%" style="max-width:480px;" src="${video.videoUrl}" aria-label="${video.title}"></video>
    `;
    videosContainer.appendChild(article);
    revealObserver.observe(article);
  }

  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('galleryDots');
  if (slides.length && dotsWrap) {
    let current = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    function goTo(index) {
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = index % slides.length;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }
    setInterval(() => goTo(current + 1), 4500);
  }

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.floating-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
  });

  const reviewsList = document.getElementById('reviewsList');
  const reviewForm  = document.getElementById('reviewForm');

  if (reviewsList) loadReviews();

  let allReviewsData = [];

  async function loadReviews() {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      allReviewsData = await res.json();
      if (!allReviewsData.length) {
        reviewsList.innerHTML = `<div class="no-reviews">No reviews yet — be the first to share your experience!</div>`;
        return;
      }
      renderReviews(3);
    } catch {
      reviewsList.innerHTML = `<div class="no-reviews">Could not load reviews.</div>`;
    }
  }

  function renderReviews(limit) {
    const data = limit ? allReviewsData.slice(0, limit) : allReviewsData;
    reviewsList.innerHTML = `<div class="reviews-grid">${data.map(r => `
      <div class="review-card">
        <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p>"${r.review}"</p>
        <strong>— ${r.name}</strong>
        <div class="review-date">${new Date(r.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
      </div>`).join('')}</div>`;
    const moreWrap = document.getElementById('moreReviewsWrap');
    if (moreWrap) moreWrap.style.display = allReviewsData.length > 3 && limit ? 'block' : 'none';
  }

  window.showAllReviews = function() {
    renderReviews(null);
    document.getElementById('moreReviewsWrap').style.display = 'none';
  };

  const starPicker = document.getElementById('starPicker');
  const ratingVal  = document.getElementById('ratingVal');
  if (starPicker) {
    starPicker.querySelectorAll('span').forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.val);
        ratingVal.value = val;
        starPicker.querySelectorAll('span').forEach((s, i) => s.classList.toggle('active', i < val));
      });
      star.addEventListener('mouseover', () => {
        const val = parseInt(star.dataset.val);
        starPicker.querySelectorAll('span').forEach((s, i) => { s.style.color = i < val ? '#f59e0b' : '#d1d5db'; });
      });
      star.addEventListener('mouseout', () => {
        const selected = parseInt(ratingVal.value);
        starPicker.querySelectorAll('span').forEach((s, i) => { s.style.color = i < selected ? '#f59e0b' : '#d1d5db'; });
      });
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg    = document.getElementById('reviewMsg');
      const btn    = document.getElementById('reviewSubmitBtn');
      const name   = document.getElementById('reviewName').value.trim();
      const rating = parseInt(document.getElementById('ratingVal').value);
      const review = document.getElementById('reviewText').value.trim();

      if (!name || !review || rating < 1) {
        msg.textContent = 'Please fill all fields and select a star rating.';
        msg.className = 'form-message error';
        return;
      }
      btn.textContent = '⏳ Submitting…'; btn.disabled = true;
      try {
        const res = await fetch(`${API_BASE}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, rating, review })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        msg.textContent = '✅ Thank you! Your review has been submitted and is awaiting approval.';
        msg.className = 'form-message success';
        reviewForm.reset();
        ratingVal.value = 0;
        starPicker.querySelectorAll('span').forEach(s => { s.classList.remove('active'); s.style.color = ''; });
        loadReviews();
      } catch (err) {
        msg.textContent = '❌ ' + (err.message || 'Submission failed');
        msg.className = 'form-message error';
      } finally {
        btn.textContent = 'Submit Review'; btn.disabled = false;
      }
    });
  }

});
