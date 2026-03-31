// Hotjar tracking
(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:'YOUR_SITE_ID',hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

// Fallback noop nếu hj chưa load
window.hj = window.hj || function(){};

// ── Drag-to-scroll carousel ──
(function(){
  var el = document.getElementById('selectRow');
  if(!el) return;
  var isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', function(e){
    isDown = true; el.classList.add('active');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', function(){ isDown = false; el.classList.remove('active'); });
  el.addEventListener('mouseup',    function(){ isDown = false; el.classList.remove('active'); });
  el.addEventListener('mousemove',  function(e){
    if(!isDown) return;
    e.preventDefault();
    var x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX);
  });
})();

// ── QR double-tap → success sheet ──
var tapT = null;
function onQrTap() {
  if (window.hj) hj('event','tap_qr');
  if (tapT) {
    clearTimeout(tapT); tapT = null;
    document.getElementById('sheet').classList.add('show');
    if (window.hj) hj('event','payment_success_demo');
  } else {
    tapT = setTimeout(function(){ tapT = null; }, 380);
  }
}

// ── Select account card ──
var selIdx = 0;
function selectAcc(idx) {
  var cards = document.querySelectorAll('.acc-card');
  cards.forEach(function(c){ c.classList.remove('selected'); });
  cards[idx].classList.add('selected');
  selIdx = idx;
  if (window.hj) hj('event','select_acc_' + idx);

  // Reset nút Đổi nguồn nếu chọn lại acc đầu tiên
  var btn = document.getElementById('doiNguonBtn');
  if (btn) {
    if (idx === 0) {
      btn.classList.remove('done');
      btn.innerHTML = 'Đổi nguồn';
    }
  }
}

// ── Promo toggle ──
var promoOn = true;
function togglePromo() {
  promoOn = !promoOn;
  var t = document.getElementById('promoToggle');
  t.className = promoOn ? 'toggle' : 'toggle off';
  if (window.hj) hj('event', promoOn ? 'promo_on' : 'promo_off');
}

// ── Đóng success sheet ──
function closeSheet() {
  document.getElementById('sheet').classList.remove('show');
}

// ── Scroll carousel đến Túi Thần Tài (acc3) và chọn nó ──
function scrollToTuiThanTai() {
  var targetIdx = 3;
  var targetCard = document.getElementById('acc' + targetIdx);
  var row = document.getElementById('selectRow');
  if (!targetCard || !row) return;

  var cardLeft  = targetCard.offsetLeft;
  var cardWidth = targetCard.offsetWidth;
  var rowWidth  = row.offsetWidth;
  var scrollTo  = cardLeft - (rowWidth / 2) + (cardWidth / 2);

  row.scrollTo({ left: scrollTo, behavior: 'smooth' });

  // Sau khi scroll xong: select + đổi nút thành "Đã đổi"
  setTimeout(function() {
    selectAcc(targetIdx);
    var btn = document.getElementById('doiNguonBtn');
    if (btn) {
      btn.classList.add('done');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polyline points="2,7 6,11 12,3" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Đã đổi';
    }
  }, 400);

  if (window.hj) hj('event', 'doi_nguon_tui_than_tai');
}
