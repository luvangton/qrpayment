/* ===== XU TOGGLE ===== */
let xuEnabled = true; // MẶC ĐỊNH ON

const xuSwitch = document.getElementById("xuSwitch");
const xuToggle = document.getElementById("xuToggle");

function renderXuState() {
  xuSwitch.classList.toggle("on", xuEnabled);
  xuToggle.classList.toggle("on", xuEnabled);
  xuToggle.classList.toggle("off", !xuEnabled);

  console.log("Xu toggle:", xuEnabled ? "ON" : "OFF");
}

xuSwitch.addEventListener("click", () => {
  xuEnabled = !xuEnabled;
  renderXuState();
});

// init
renderXuState();

/* ===== SHEET CONTROL ===== */
function openSheet() {
  document.getElementById("overlay").classList.add("show");
  document.getElementById("sheet").classList.add("show");
}
function closeSheet() {
  document.getElementById("overlay").classList.remove("show");
  document.getElementById("sheet").classList.remove("show");
}
/* ===== QR COUNTDOWN + MANUAL REFRESH ===== */
let t = 60;
const cd = document.getElementById("cd");
const qr = document.getElementById("qrImg");
const refreshBtn = document.getElementById("manualRefresh");
const qrBox = document.querySelector(".qr-box");

function refreshQR(source = "auto") {
  // 1. Refresh QR data
  qr.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MoMo-" +
    Date.now();

  // 2. Reward palette
  const rewardMap = [
    { color: "#FEC8DC", xu: "x1", textColor: "#A50064" },
    { color: "#F3F8D9", xu: "x0.5",textColor: "#396F0F" },
    { color: "#E5F9F2", xu: "x2" ,textColor: "#007F6F"},
    { color: "#D2C0FF", xu: "x10",textColor: "#4E189A"}
  ];

  const reward =
    rewardMap[Math.floor(Math.random() * rewardMap.length)];

  // 3. Apply QR overlay color
  document.getElementById("qrColor").style.background = reward.color;

  // 4. Update xu banner text + background
  const xuBanner = document.getElementById("xuBanner");
  xuBanner.style.background = reward.color;
  xuBanner.innerHTML =
    `<b style="color:${reward.textColor}">CHÚC MỪNG</b>, thanh toán nhận liền <b style="color:${reward.textColor}"> ${reward.xu} XU</b>`;
  
  
  // 5. Reset countdown & CTA
  t = 60;
  refreshBtn.classList.add("hidden");

  console.log(
    "QR refreshed:",
    source,
    "reward:",
    reward.xu,
    "color:",
    reward.color
  );
}


// manual click
refreshBtn.addEventListener("click", () => {
  refreshQR("manual");
});

setInterval(() => {
  t--;
  cd.textContent = t + "s";

  // show manual refresh when <= 6s
  if (t <= 58) {
    refreshBtn.classList.remove("hidden");
  }

  if (t <= 0) {
    refreshQR("auto");
  }
}, 1000);

// VOUHCER TIME

const VOUCHER_STATES = [
  "auto_on",
  "applying",
  "auto_off"
];

let voucherIndex = 0;

function renderVoucher() {
  const voucher = document.getElementById("voucher");
  const title = voucher.querySelector(".voucher-title");
  const desc = voucher.querySelector(".voucher-desc");
  const action = voucher.querySelector(".voucher-action");

  voucher.className = "voucher";

  const state = VOUCHER_STATES[voucherIndex];

  if (state === "auto_on") {
    voucher.classList.add("state-auto-on");
    title.textContent = "Tự động áp dụng ưu đãi phù hợp";
    desc.textContent = "";
    action.textContent = "Ưu đãi khác >";
  }

  if (state === "applying") {
    voucher.classList.add("state-applying");
    title.textContent = "Đang chọn (1) ưu đãi";
    desc.textContent = "";
    action.textContent = "Ưu đãi khác >";
  }

  if (state === "auto_off") {
    voucher.classList.add("state-auto-off");
    title.textContent = "Chưa bật áp dụng ưu đãi tự động";
    desc.textContent =
      "Bật để tối ưu chi tiêu hoặc tự chọn ưu đãi";
    action.textContent = "Xem thêm >";
  }

  // tracking (nếu có)
  track?.("voucher_state_change", { state });
}

document
  .getElementById("voucher")
  .addEventListener("click", () => {
    voucherIndex =
      (voucherIndex + 1) % VOUCHER_STATES.length;
    renderVoucher();
  });


// click handler (optional element; keep demo from crashing)
const voucherToggleEl = document.getElementById("voucherToggle");
if (voucherToggleEl) {
  voucherToggleEl.addEventListener("click", () => {
    voucherIndex = (voucherIndex + 1) % VOUCHER_STATES.length;
    renderVoucher();
  });
}

renderVoucher();
// init
function showComing() {
  document.getElementById("comingOverlay").classList.add("show");
}

function closeComing() {
  document.getElementById("comingOverlay").classList.remove("show");
}

// click ra ngoài popup để đóng
document.getElementById("comingOverlay").addEventListener("click", (e) => {
  if (e.target.id === "comingOverlay") {
    closeComing();
  }
});
