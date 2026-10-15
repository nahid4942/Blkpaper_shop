/**
 * BLKPAPER Admin Panel  (Supabase edition)
 * ONE self-contained file (logic + styles). Loaded on demand — normal visitors never download it.
 * Everything you change is saved straight to Supabase and goes LIVE immediately.
 * Login = a real Supabase Auth account (email + password) that is listed in the admin_users table.
 */
(function () {
    'use strict';

    // ---------- styles (built in, so the whole admin panel is ONE file) ----------
    const ADMIN_CSS = `
/* BLKPAPER admin panel — everything is scoped to #blkAdmin so it never touches the shop styles */
#blkAdmin, #blkAdmin * { box-sizing: border-box; }
#blkAdmin {
  position: fixed; inset: 0; z-index: 5000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px; color: #15171a; line-height: 1.45;
}
#blkAdmin button { font-family: inherit; cursor: pointer; }
#blkAdmin input, #blkAdmin select, #blkAdmin textarea { font-family: inherit; font-size: 14px; }

/* ---------- Lock screen ---------- */
#blkAdmin .ba-lock {
  position: absolute; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
#blkAdmin .ba-lock-card {
  width: 100%; max-width: 380px; background: #fff; border-radius: 16px; padding: 32px 28px; text-align: center;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
}
#blkAdmin .ba-lock-logo { font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 700; letter-spacing: 4px; font-size: 18px; margin-bottom: 4px; }
#blkAdmin .ba-lock-card h2 { margin: 6px 0 4px; font-size: 22px; }
#blkAdmin .ba-lock-card p { margin: 0 0 18px; color: #6c757d; font-size: 13px; }
#blkAdmin .ba-lock-card input {
  width: 100%; padding: 13px 14px; border: 1.5px solid #dee2e6; border-radius: 10px; margin-bottom: 12px; text-align: center; letter-spacing: 2px;
}
#blkAdmin .ba-lock-card input:focus { outline: none; border-color: #000; }
#blkAdmin .ba-lock-msg { min-height: 20px; font-size: 13px; color: #dc3545; margin-bottom: 8px; }
#blkAdmin .ba-lock-card .ba-btn { width: 100%; justify-content: center; padding: 13px; }
#blkAdmin .ba-link { background: none; border: none; color: #6c757d; margin-top: 12px; font-size: 13px; text-decoration: underline; }

/* ---------- Shell ---------- */
#blkAdmin .ba-shell { position: absolute; inset: 0; display: flex; background: #f3f4f6; }
#blkAdmin .ba-side {
  width: 232px; flex-shrink: 0; background: #0b0b0c; color: #fff; display: flex; flex-direction: column; padding: 20px 14px;
}
#blkAdmin .ba-brand { font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 700; letter-spacing: 3px; font-size: 16px; padding: 4px 10px 2px; }
#blkAdmin .ba-brand small { display: block; font-family: 'Inter', sans-serif; letter-spacing: 0.4px; font-weight: 400; font-size: 11px; color: #8d949b; margin-top: 2px; }
#blkAdmin .ba-nav { display: flex; flex-direction: column; gap: 4px; margin-top: 24px; }
#blkAdmin .ba-nav button {
  display: flex; align-items: center; gap: 12px; text-align: left; background: transparent; border: none; color: #b8bec4;
  padding: 11px 12px; border-radius: 10px; font-size: 14px; font-weight: 500;
}
#blkAdmin .ba-nav button i { width: 18px; text-align: center; }
#blkAdmin .ba-nav button:hover { background: #1b1c1e; color: #fff; }
#blkAdmin .ba-nav button.active { background: #fff; color: #000; }
#blkAdmin .ba-side-foot { margin-top: auto; display: flex; flex-direction: column; gap: 6px; }
#blkAdmin .ba-side-foot button { background: #1b1c1e; color: #fff; border: none; padding: 10px 12px; border-radius: 10px; font-size: 13px; text-align: left; display: flex; gap: 10px; align-items: center; }
#blkAdmin .ba-side-foot button:hover { background: #2a2c2f; }

#blkAdmin .ba-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
#blkAdmin .ba-top {
  display: flex; align-items: center; gap: 12px; padding: 16px 28px; background: #fff; border-bottom: 1px solid #e5e7eb; flex-wrap: wrap;
}
#blkAdmin .ba-top h1 { margin: 0; font-size: 20px; font-weight: 700; flex: 1; min-width: 140px; }
#blkAdmin .ba-view { flex: 1; overflow-y: auto; padding: 24px 28px 60px; }

/* ---------- Common ---------- */
#blkAdmin .ba-btn {
  display: inline-flex; align-items: center; gap: 8px; background: #000; color: #fff; border: 1.5px solid #000; border-radius: 10px;
  padding: 9px 16px; font-size: 14px; font-weight: 600; white-space: nowrap;
}
#blkAdmin .ba-btn:hover { background: #2a2a2a; }
#blkAdmin .ba-btn.ghost { background: #fff; color: #000; border-color: #d1d5db; }
#blkAdmin .ba-btn.ghost:hover { border-color: #000; }
#blkAdmin .ba-btn.danger { background: #fff; color: #dc3545; border-color: #f1b0b7; }
#blkAdmin .ba-btn.danger:hover { background: #dc3545; color: #fff; }
#blkAdmin .ba-btn.sm { padding: 6px 10px; font-size: 12.5px; border-radius: 8px; }
#blkAdmin .ba-btn.green { background: #1e8e3e; border-color: #1e8e3e; }
#blkAdmin .ba-btn.green:hover { background: #17722f; }

#blkAdmin .ba-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
#blkAdmin .ba-card h3 { margin: 0 0 4px; font-size: 16px; }
#blkAdmin .ba-card .ba-sub { margin: 0 0 16px; color: #6b7280; font-size: 13px; }
#blkAdmin .ba-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; margin-bottom: 20px; }
#blkAdmin .ba-stat { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px 18px; }
#blkAdmin .ba-stat span { display: block; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
#blkAdmin .ba-stat strong { display: block; font-size: 26px; margin-top: 4px; font-family: 'Space Grotesk', 'Inter', sans-serif; }
#blkAdmin .ba-stat.warn strong { color: #dc3545; }

#blkAdmin .ba-pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #eef0f2; color: #374151; }
#blkAdmin .ba-pill.green { background: #e6f4ea; color: #1e7e34; }
#blkAdmin .ba-pill.red { background: #fde8ea; color: #c42b3a; }
#blkAdmin .ba-pill.amber { background: #fff4d6; color: #8a6100; }
#blkAdmin .ba-badge-unpub { background: #fff4d6; color: #8a6100; padding: 6px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 600; }
#blkAdmin .ba-badge-pub { background: #e6f4ea; color: #1e7e34; padding: 6px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 600; }

#blkAdmin .ba-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 16px; }
#blkAdmin .ba-toolbar input[type=search], #blkAdmin .ba-toolbar select { padding: 9px 12px; border: 1.5px solid #d1d5db; border-radius: 10px; background: #fff; min-width: 160px; }
#blkAdmin .ba-toolbar .grow { flex: 1; min-width: 180px; }

#blkAdmin .ba-tablewrap { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow-x: auto; }
#blkAdmin table.ba-table { width: 100%; border-collapse: collapse; min-width: 760px; }
#blkAdmin .ba-table th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; color: #6b7280; padding: 12px 14px; background: #fafafa; border-bottom: 1px solid #e5e7eb; }
#blkAdmin .ba-table td { padding: 12px 14px; border-bottom: 1px solid #f0f1f3; vertical-align: middle; }
#blkAdmin .ba-table tr:last-child td { border-bottom: none; }
#blkAdmin .ba-table tr.hidden-row { opacity: 0.55; }
#blkAdmin .ba-prod { display: flex; align-items: center; gap: 12px; }
#blkAdmin .ba-prod img { width: 46px; height: 46px; object-fit: cover; border-radius: 8px; background: #eee; flex-shrink: 0; }
#blkAdmin .ba-prod b { display: block; font-weight: 600; }
#blkAdmin .ba-prod small { color: #9ca3af; }
#blkAdmin .ba-actions { display: flex; gap: 6px; flex-wrap: wrap; }
#blkAdmin .ba-old { color: #9ca3af; text-decoration: line-through; font-size: 12px; margin-left: 6px; }
#blkAdmin .ba-chip { display: inline-block; padding: 2px 8px; border-radius: 6px; background: #eef0f2; font-size: 12px; margin: 2px 4px 2px 0; font-weight: 600; }
#blkAdmin .ba-chip.low { background: #fff4d6; color: #8a6100; }
#blkAdmin .ba-chip.out { background: #fde8ea; color: #c42b3a; }
#blkAdmin .ba-empty { text-align: center; padding: 40px 20px; color: #9ca3af; }

/* ---------- Forms ---------- */
#blkAdmin .ba-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
#blkAdmin .ba-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 16px; }
#blkAdmin .ba-span2 { grid-column: 1 / -1; }
#blkAdmin .ba-f { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: #374151; }
#blkAdmin .ba-f input[type=text], #blkAdmin .ba-f input[type=number], #blkAdmin .ba-f input[type=date], #blkAdmin .ba-f input[type=datetime-local],
#blkAdmin .ba-f input[type=url], #blkAdmin .ba-f input[type=email], #blkAdmin .ba-f select, #blkAdmin .ba-f textarea {
  padding: 10px 12px; border: 1.5px solid #d1d5db; border-radius: 10px; background: #fff; font-weight: 400; color: #111; width: 100%;
}
#blkAdmin .ba-f input:focus, #blkAdmin .ba-f select:focus, #blkAdmin .ba-f textarea:focus { outline: none; border-color: #000; }
#blkAdmin .ba-f small { font-weight: 400; color: #6b7280; font-size: 12px; }
#blkAdmin .ba-check { display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 14px; color: #111; cursor: pointer; }
#blkAdmin .ba-check input { width: 18px; height: 18px; accent-color: #000; }
#blkAdmin .ba-checks { flex-direction: row; gap: 24px; flex-wrap: wrap; }
#blkAdmin .ba-formactions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
#blkAdmin .ba-note { background: #f5f6f8; border-radius: 10px; padding: 12px 14px; color: #4b5563; font-size: 13px; }
#blkAdmin .ba-note.warn { background: #fff8e1; color: #6d5200; }
#blkAdmin .ba-imgrow { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; }
#blkAdmin .ba-imgrow img { width: 90px; height: 90px; object-fit: cover; border-radius: 10px; background: #eee; border: 1px solid #e5e7eb; }
#blkAdmin .ba-imgrow .ba-imginputs { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 8px; }
#blkAdmin .ba-modes { display: flex; gap: 10px; flex-wrap: wrap; }
#blkAdmin .ba-mode { display: flex; align-items: center; gap: 8px; border: 1.5px solid #d1d5db; border-radius: 10px; padding: 9px 14px; font-weight: 500; cursor: pointer; background: #fff; }
#blkAdmin .ba-mode:has(input:checked) { border-color: #000; background: #f5f5f5; }
#blkAdmin .ba-sizes { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 10px; }
#blkAdmin .ba-sizerow { display: flex; align-items: center; gap: 8px; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; background: #fff; }
#blkAdmin .ba-sizerow label { display: flex; align-items: center; gap: 6px; font-weight: 700; min-width: 48px; }
#blkAdmin .ba-sizerow input[type=number] { width: 70px; padding: 6px 8px; border: 1.5px solid #d1d5db; border-radius: 8px; }
#blkAdmin .ba-sizerow.off { opacity: 0.5; }
#blkAdmin .ba-addsize { display: flex; gap: 8px; margin-top: 10px; max-width: 360px; }
#blkAdmin .ba-addsize input { flex: 1; padding: 8px 10px; border: 1.5px solid #d1d5db; border-radius: 10px; }

/* stock grid */
#blkAdmin .ba-stockcells { display: flex; flex-wrap: wrap; gap: 10px; }
#blkAdmin .ba-stockcell { display: flex; flex-direction: column; gap: 3px; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; }
#blkAdmin .ba-stockcell input { width: 74px; padding: 7px 8px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 600; }
#blkAdmin .ba-stockcell input.low { border-color: #e0a800; background: #fffbea; }
#blkAdmin .ba-stockcell input.out { border-color: #dc3545; background: #fff5f5; }

/* ---------- Modal ---------- */
#blkAdmin .ba-modal-bg { position: absolute; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: flex-start; justify-content: center; padding: 30px 16px; overflow-y: auto; z-index: 5; }
#blkAdmin .ba-modal-card { background: #fff; border-radius: 16px; width: 100%; max-width: 760px; box-shadow: 0 30px 80px rgba(0,0,0,0.35); }
#blkAdmin .ba-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #e5e7eb; }
#blkAdmin .ba-modal-head h3 { margin: 0; font-size: 18px; }
#blkAdmin .ba-x { background: none; border: none; font-size: 20px; color: #6b7280; width: 34px; height: 34px; border-radius: 8px; }
#blkAdmin .ba-x:hover { background: #f1f2f4; color: #000; }
#blkAdmin .ba-modal-body { padding: 22px; }

/* ---------- Toast ---------- */
#blkAdmin .ba-toast { position: absolute; bottom: 22px; left: 50%; transform: translate(-50%, 20px); opacity: 0; pointer-events: none; background: #111; color: #fff; padding: 11px 18px; border-radius: 10px; font-size: 14px; transition: 0.25s; z-index: 10; max-width: 90vw; }
#blkAdmin .ba-toast.show { opacity: 1; transform: translate(-50%, 0); }
#blkAdmin .ba-toast.error { background: #c42b3a; }
#blkAdmin .ba-toast.success { background: #1e7e34; }

/* ---------- Mobile ---------- */
@media (max-width: 860px) {
  #blkAdmin .ba-shell { flex-direction: column; }
  #blkAdmin .ba-side { width: 100%; flex-direction: row; align-items: center; padding: 10px; gap: 8px; overflow-x: auto; }
  #blkAdmin .ba-brand { display: none; }
  #blkAdmin .ba-nav { flex-direction: row; margin: 0; }
  #blkAdmin .ba-nav button { padding: 9px 12px; white-space: nowrap; }
  #blkAdmin .ba-nav button span { display: none; }
  #blkAdmin .ba-side-foot { margin: 0 0 0 auto; flex-direction: row; }
  #blkAdmin .ba-side-foot button span { display: none; }
  #blkAdmin .ba-top { padding: 12px 16px; }
  #blkAdmin .ba-view { padding: 16px 14px 60px; }
  #blkAdmin .ba-grid2, #blkAdmin .ba-grid3 { grid-template-columns: 1fr; }
}

/* ---------- Supabase edition additions ---------- */
#blkAdmin .ba-lock-card input[type=email] { letter-spacing: normal; text-align: left; }
#blkAdmin .ba-lock-card input[type=password] { text-align: left; letter-spacing: 1px; }
#blkAdmin .ba-count { margin-left: auto; background: #dc3545; color: #fff; font-style: normal; font-size: 11px; font-weight: 700; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; }
#blkAdmin .ba-nav button.active .ba-count { background: #dc3545; }
@media (max-width: 860px) { #blkAdmin .ba-count { margin-left: 4px; } }

#blkAdmin .ba-note.warn { background: #fff8e1; color: #6d5200; }
#blkAdmin #stQrPrev { width: 110px; height: 110px; object-fit: contain; background: #fff; }

/* manual sales */
#blkAdmin .ba-msline, #blkAdmin .ba-mshead { display: grid; grid-template-columns: 2fr 1fr 70px 100px 40px; gap: 8px; align-items: center; margin-bottom: 8px; }
#blkAdmin .ba-mshead { font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
#blkAdmin .ba-msline select, #blkAdmin .ba-msline input { padding: 9px 10px; border: 1.5px solid #d1d5db; border-radius: 10px; background: #fff; width: 100%; min-width: 0; }
#blkAdmin .ba-msline select:focus, #blkAdmin .ba-msline input:focus { outline: none; border-color: #000; }
#blkAdmin .ba-pill.blue { background: #e7f0fd; color: #1a56b0; }
@media (max-width: 860px) { #blkAdmin .ba-msline, #blkAdmin .ba-mshead { grid-template-columns: 1.4fr 1fr 58px 80px 36px; } }

/* ---------- iPhone / small screens (built for iPhone 12: 390 x 844, notch + home bar) ---------- */
#blkAdmin { -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
#blkAdmin .ba-view { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
#blkAdmin .ba-ms-c, #blkAdmin .ms-c { display: block; margin: 0; }
#blkAdmin .ms-c small { display: none; }
@media (max-width: 860px) {
  /* 16px inputs stop iOS from zooming the page when you tap a field */
  #blkAdmin input, #blkAdmin select, #blkAdmin textarea { font-size: 16px !important; }
  #blkAdmin .ba-shell { overflow-x: hidden; }

  /* top nav row sits under the notch / status bar */
  #blkAdmin .ba-side {
    padding: calc(8px + env(safe-area-inset-top, 0px)) calc(10px + env(safe-area-inset-right, 0px)) 8px calc(10px + env(safe-area-inset-left, 0px));
    scrollbar-width: none; -webkit-overflow-scrolling: touch;
  }
  #blkAdmin .ba-side::-webkit-scrollbar { display: none; }
  #blkAdmin .ba-nav button, #blkAdmin .ba-side-foot button { min-height: 44px; min-width: 44px; justify-content: center; }
  #blkAdmin .ba-nav button { position: relative; }
  #blkAdmin .ba-count { position: absolute; top: 2px; right: 0; margin: 0; min-width: 18px; height: 18px; font-size: 10px; }

  #blkAdmin .ba-top { padding: 10px calc(14px + env(safe-area-inset-right, 0px)) 10px calc(14px + env(safe-area-inset-left, 0px)); gap: 8px; flex-wrap: nowrap; }
  #blkAdmin .ba-top h1 { font-size: 18px; min-width: 0; }
  #blkAdmin .ba-badge-pub { font-size: 0; padding: 0; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
  #blkAdmin .ba-top .ba-btn span { display: none; }
  #blkAdmin .ba-top .ba-btn { padding: 0 14px; flex-shrink: 0; }

  #blkAdmin .ba-view { padding: 14px calc(12px + env(safe-area-inset-right, 0px)) calc(70px + env(safe-area-inset-bottom, 0px)) calc(12px + env(safe-area-inset-left, 0px)); }

  /* finger-sized buttons */
  #blkAdmin .ba-btn { min-height: 44px; justify-content: center; }
  #blkAdmin .ba-btn.sm { min-height: 40px; }
  #blkAdmin .ba-x { width: 44px; height: 44px; }
  #blkAdmin .ba-check input { width: 22px; height: 22px; }
  #blkAdmin .ba-stat { padding: 12px 14px; }
  #blkAdmin .ba-stat strong { font-size: 22px; }
  #blkAdmin .ba-card { padding: 16px 14px; }
  #blkAdmin .ba-toolbar .grow { flex-basis: 100%; }
  #blkAdmin .ba-toolbar input[type=search], #blkAdmin .ba-toolbar select { min-width: 0; min-height: 44px; }
  #blkAdmin .ba-addsale { order: -1; width: 100%; margin-left: 0 !important; }

  /* toast clears the home-indicator bar */
  #blkAdmin .ba-toast { bottom: calc(18px + env(safe-area-inset-bottom, 0px)); }

  /* login screen */
  #blkAdmin .ba-lock { overflow-y: auto; padding: calc(20px + env(safe-area-inset-top, 0px)) 16px calc(20px + env(safe-area-inset-bottom, 0px)); }
  #blkAdmin .ba-lock-card { margin: auto; padding: 26px 20px; }

  /* pop-ups become full-screen sheets */
  #blkAdmin .ba-modal-bg { padding: 0; align-items: stretch; -webkit-overflow-scrolling: touch; }
  #blkAdmin .ba-modal-card { max-width: none; min-height: 100%; border-radius: 0; box-shadow: none; }
  #blkAdmin .ba-modal-head { position: sticky; top: 0; z-index: 2; background: #fff; padding: calc(8px + env(safe-area-inset-top, 0px)) 8px 8px 16px; }
  #blkAdmin .ba-modal-body { padding: 16px calc(14px + env(safe-area-inset-right, 0px)) calc(32px + env(safe-area-inset-bottom, 0px)) calc(14px + env(safe-area-inset-left, 0px)); }
  #blkAdmin #baModal .ba-table { min-width: 0 !important; }
  #blkAdmin #baModal .ba-table th, #blkAdmin #baModal .ba-table td { padding: 9px 8px; font-size: 13px; }
  #blkAdmin .ba-formactions .ba-btn { flex: 1 1 140px; }

  /* tables turn into cards so nothing needs sideways scrolling */
  #blkAdmin table.ba-t-orders, #blkAdmin table.ba-t-prods, #blkAdmin table.ba-t-stack { min-width: 0 !important; display: block; }
  #blkAdmin .ba-t-orders thead, #blkAdmin .ba-t-prods thead, #blkAdmin .ba-t-stack thead { display: none; }
  #blkAdmin .ba-t-orders tbody, #blkAdmin .ba-t-prods tbody, #blkAdmin .ba-t-stack tbody { display: block; }
  #blkAdmin .ba-t-orders td, #blkAdmin .ba-t-prods td, #blkAdmin .ba-t-stack td { padding: 0; border: 0; }

  #blkAdmin .ba-t-orders tr { display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; padding: 13px 14px; border-bottom: 1px solid #f0f1f3; }
  #blkAdmin .ba-t-orders td:nth-child(1) { grid-column: 1; grid-row: 1; }
  #blkAdmin .ba-t-orders td:nth-child(4) { grid-column: 2; grid-row: 1; text-align: right; font-size: 16px; }
  #blkAdmin .ba-t-orders td:nth-child(2) { grid-column: 1; grid-row: 2; }
  #blkAdmin .ba-t-orders td:nth-child(6) { grid-column: 2; grid-row: 2; text-align: right; }
  #blkAdmin .ba-t-orders td:nth-child(3) { grid-column: 1; grid-row: 3; color: #6b7280; font-size: 13px; }
  #blkAdmin .ba-t-orders td:nth-child(5) { grid-column: 2; grid-row: 3; text-align: right; font-size: 12.5px; }
  #blkAdmin .ba-t-orders td:nth-child(7) { grid-column: 1 / -1; grid-row: 4; margin-top: 6px; }
  #blkAdmin .ba-t-orders td:nth-child(7) .ba-btn { width: 100%; }
  #blkAdmin .ba-t-orders td[colspan] { grid-column: 1 / -1; grid-row: auto; }

  #blkAdmin .ba-t-prods tr { display: grid; grid-template-columns: 1fr auto; gap: 8px 12px; padding: 13px 14px; border-bottom: 1px solid #f0f1f3; align-items: center; }
  #blkAdmin .ba-t-prods td:nth-child(1), #blkAdmin .ba-t-prods td:nth-child(4), #blkAdmin .ba-t-prods td:nth-child(6), #blkAdmin .ba-t-prods td[colspan] { grid-column: 1 / -1; }
  #blkAdmin .ba-t-prods td:nth-child(3) { text-align: right; }
  #blkAdmin .ba-t-prods .ba-actions .ba-btn { flex: 1; }

  #blkAdmin .ba-t-stack tr { display: block; padding: 13px 14px; border-bottom: 1px solid #f0f1f3; }
  #blkAdmin .ba-t-stack td { display: block; }
  #blkAdmin .ba-t-stack td + td { margin-top: 10px; }
  #blkAdmin .ba-stockcell input { width: 78px; min-height: 44px; }
}
/* manual-sale item rows on a phone: product on its own line, then size / qty / price / remove */
@media (max-width: 600px) {
  #blkAdmin .ba-mshead { display: none; }
  #blkAdmin .ba-msline { grid-template-columns: 1fr 66px 94px 44px; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px dashed #e5e7eb; }
  #blkAdmin .ba-msline .ms-c:first-child { grid-column: 1 / -1; }
  #blkAdmin .ms-c small { display: block; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-bottom: 3px; }
  #blkAdmin .ba-msline > .ba-btn { align-self: end; padding: 0; min-height: 44px; }
  #blkAdmin .ba-msline select, #blkAdmin .ba-msline input { min-height: 44px; }
}

`;
    function injectStyles() {
        if (document.getElementById('blkAdminStyles')) return;
        const st = document.createElement('style');
        st.id = 'blkAdminStyles';
        st.textContent = ADMIN_CSS;
        document.head.appendChild(st);
    }

    const BUCKET = 'product-images';
    const EMAIL_KEY = 'blkpaper_admin_email';
    const FAIL_KEY = 'blkpaper_admin_fail';
    const CATS = { 'clothing': 'Clothing', 'sunglasses': 'Sunglasses', 'accessories': 'Accessories', 'memory-band': 'Memory Band' };
    const STATUS = {
        awaiting_payment: ['Awaiting payment', 'amber'], pending: ['New', 'amber'], confirmed: ['Confirmed', 'green'], shipped: ['Shipped', ''],
        delivered: ['Delivered', 'green'], cancelled: ['Cancelled', 'red']
    };
    const NEXT = { pending: ['confirmed', 'Confirm order'], confirmed: ['shipped', 'Mark as shipped'], shipped: ['delivered', 'Mark as delivered'] };

    // ---------- helpers ----------
    const $ = (sel, r) => (r || document).querySelector(sel);
    const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const clone = (o) => JSON.parse(JSON.stringify(o));
    const money = (n) => '৳' + (Number(n) || 0).toLocaleString();
    const sb = () => window.BLKStore && window.BLKStore.client();
    const pad = (n) => String(n).padStart(2, '0');
    const isoToLocal = (iso) => { if (!iso) return ''; const d = new Date(iso); return isNaN(d) ? '' : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
    const localToIso = (v) => (v ? new Date(v).toISOString() : '');
    const fmtDate = (iso) => new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

    function sizeKeys(obj) { return window.sortSizeKeys(Object.keys(obj || {})); }
    function prodStock(p) {
        if (p.sizes && Object.keys(p.sizes).length) return Object.values(p.sizes).reduce((a, b) => a + (parseInt(b) || 0), 0);
        return parseInt(p.stock) || 0;
    }
    const lowAt = () => Number(S.settings.lowStockAt) || 0;
    const stockSig = (sizes, stock) => sizes ? 'S|' + Object.keys(sizes).sort().map(k => k + ':' + sizes[k]).join(',') : 'N|' + stock;

    // ---------- state ----------
    let S = { products: [], settings: {}, sale: {}, coupons: [] };
    let orders = [];
    let payments = [];
    let stQr = '';
    const paidToasted = {};
    let root = null, channel = null, panelOpen = false, listening = false;
    let ui = { tab: 'dashboard', q: '', cat: 'all', lowOnly: false, couponIdx: -1, orderFilter: 'all', orderSrc: 'all' };
    let edImage = '', edId = null, edOrigImage = '', edOrigSig = '';

    function toast(msg, type) {
        const t = $('#baToast');
        if (!t) return;
        t.textContent = msg;
        t.className = 'ba-toast show ' + (type || '');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => { t.className = 'ba-toast'; }, 3400);
    }

    // run a Supabase call; show the error if it fails
    async function run(promise, okMsg) {
        try {
            const r = await promise;
            if (r && r.error) throw r.error;
            if (okMsg) toast(okMsg, 'success');
            return r || {};
        } catch (e) {
            toast((e && e.message) || 'Something went wrong', 'error');
            return null;
        }
    }

    // ---------- data loading ----------
    async function pullStore() {
        const st = await window.fetchStoreFromServer();
        S.products = clone(st.products);
        S.settings = clone(st.settings);
        S.sale = clone(st.sale);
    }
    async function pullCoupons() {
        const r = await run(sb().from('coupons').select('*').order('code'));
        if (!r) return;
        S.coupons = (r.data || []).map(c => ({ code: c.code, type: c.type, value: Number(c.value), minOrder: Number(c.min_order) || 0, expires: c.expires || '', note: c.note || '', active: c.active }));
    }
    async function pullPayments() {
        const r = await run(sb().from('bkash_payments').select('*').order('received_at', { ascending: false }).limit(300));
        if (r) payments = r.data || [];
    }
    async function pullOrders() {
        try { await sb().rpc('expire_unpaid_orders'); } catch (e) { /* ignore */ }
        const r = await run(sb().from('orders').select('*').order('created_at', { ascending: false }).limit(300));
        if (r) orders = r.data || [];
    }
    async function loadAll() {
        try { await Promise.all([pullStore(), pullCoupons(), pullOrders(), pullPayments()]); }
        catch (e) { toast('Could not load data: ' + (e.message || e), 'error'); }
    }
    // after any change: reload admin data and refresh the shop behind the panel
    async function afterWrite() {
        try { await pullStore(); } catch (e) { /* realtime will catch up */ }
        window.BLKStore.refresh();
    }

    // ---------- login ----------
    function getFails() { try { return JSON.parse(localStorage.getItem(FAIL_KEY)) || { n: 0, until: 0 }; } catch (e) { return { n: 0, until: 0 }; } }

    function showLock(message) {
        panelOpen = false;
        const configured = !!sb();
        root.innerHTML = `
            <div class="ba-lock">
                <div class="ba-lock-card">
                    <div class="ba-lock-logo">BLKPAPER</div>
                    <h2>Admin Login</h2>
                    ${configured ? '<p>Sign in with your admin account.</p>' : '<p style="color:#c42b3a">Supabase is not connected yet. Open <b>supabase-config.js</b> and paste your Project URL and anon key.</p>'}
                    <input type="email" id="baEmail" placeholder="Email" autocomplete="username" value="${esc(localStorage.getItem(EMAIL_KEY) || '')}" ${configured ? '' : 'disabled'}>
                    <input type="password" id="baPw" placeholder="Password" autocomplete="current-password" ${configured ? '' : 'disabled'}>
                    <div class="ba-lock-msg" id="baLockMsg">${esc(message || '')}</div>
                    <button class="ba-btn" id="baUnlock" ${configured ? '' : 'disabled'}>Sign in</button>
                    <button class="ba-link" id="baLockClose">Cancel</button>
                </div>
            </div>`;
        const email = $('#baEmail'), pw = $('#baPw'), msg = $('#baLockMsg'), btn = $('#baUnlock');
        setTimeout(() => (email.value ? pw : email).focus(), 50);
        const attempt = async () => {
            const f = getFails();
            if (Date.now() < f.until) { msg.textContent = `Too many attempts. Try again in ${Math.ceil((f.until - Date.now()) / 1000)}s.`; return; }
            if (!email.value.trim() || !pw.value) { msg.textContent = 'Enter your email and password.'; return; }
            btn.disabled = true; btn.textContent = 'Signing in…';
            try {
                const { error } = await sb().auth.signInWithPassword({ email: email.value.trim(), password: pw.value });
                if (error) throw error;
                const { data: ok } = await sb().rpc('is_admin');
                if (!ok) {
                    await sb().auth.signOut();
                    msg.textContent = 'This account is not an admin.';
                    btn.disabled = false; btn.textContent = 'Sign in';
                    return;
                }
                localStorage.setItem(EMAIL_KEY, email.value.trim());
                localStorage.removeItem(FAIL_KEY);
                showPanel();
            } catch (e) {
                f.n = (f.n || 0) + 1;
                if (f.n >= 5) f.until = Date.now() + 30000 * (f.n - 4);
                localStorage.setItem(FAIL_KEY, JSON.stringify(f));
                msg.textContent = 'Incorrect email or password.';
                pw.value = '';
                btn.disabled = false; btn.textContent = 'Sign in';
                pw.focus();
            }
        };
        btn.onclick = attempt;
        pw.onkeydown = (e) => { if (e.key === 'Enter') attempt(); };
        email.onkeydown = (e) => { if (e.key === 'Enter') pw.focus(); };
        $('#baLockClose').onclick = close;
    }

    // ---------- shell ----------
    const NAV = [
        ['dashboard', 'fa-gauge', 'Dashboard'],
        ['orders', 'fa-receipt', 'Orders'],
        ['payments', 'fa-money-bill-wave', 'bKash Payments'],
        ['products', 'fa-shirt', 'Products'],
        ['stock', 'fa-boxes-stacked', 'Stock'],
        ['offers', 'fa-tags', 'Offers & Coupons'],
        ['settings', 'fa-sliders', 'Site Settings']
    ];

    async function showPanel() {
        panelOpen = true;
        root.innerHTML = `
            <div class="ba-shell">
                <aside class="ba-side">
                    <div class="ba-brand">BLKPAPER<small>Admin panel</small></div>
                    <nav class="ba-nav">
                        ${NAV.map(n => `<button data-act="tab" data-tab="${n[0]}"><i class="fas ${n[1]}"></i><span>${n[2]}</span>${n[0] === 'orders' ? '<em class="ba-count" id="baOrderCount" style="display:none"></em>' : ''}</button>`).join('')}
                    </nav>
                    <div class="ba-side-foot">
                        <button data-act="close"><i class="fas fa-store"></i><span>View site</span></button>
                        <button data-act="lock"><i class="fas fa-right-from-bracket"></i><span>Sign out</span></button>
                    </div>
                </aside>
                <main class="ba-main">
                    <div class="ba-top">
                        <h1 id="baTitle"></h1>
                        <span class="ba-badge-pub"><i class="fas fa-circle" style="font-size:8px"></i> Live — changes save instantly</span>
                        <button class="ba-btn ghost" data-act="reload"><i class="fas fa-rotate"></i> <span>Reload</span></button>
                    </div>
                    <div class="ba-view" id="baView"><div class="ba-empty">Loading…</div></div>
                </main>
            </div>
            <div id="baModalHost"></div>
            <div class="ba-toast" id="baToast"></div>`;
        await loadAll();
        updateNavBadge();
        renderTab(ui.tab);
        startLive();
    }

    function updateNavBadge() {
        const n = orders.filter(o => o.status === 'pending').length;
        const el = $('#baOrderCount');
        if (!el) return;
        el.textContent = n;
        el.style.display = n ? '' : 'none';
    }

    function renderTab(tab, keepScroll) {
        ui.tab = tab;
        const v = $('#baView');
        if (!v) return;
        const y = v.scrollTop;
        root.querySelectorAll('.ba-nav button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        const titles = { dashboard: 'Dashboard', orders: 'Orders', payments: 'bKash Payments', products: 'Products', stock: 'Stock by size', offers: 'Offers & Coupons', settings: 'Site Settings' };
        $('#baTitle').textContent = titles[tab];
        ({ dashboard: renderDashboard, orders: renderOrders, payments: renderPayments, products: renderProducts, stock: renderStock, offers: renderOffers, settings: renderSettings })[tab](v);
        v.scrollTop = keepScroll ? y : 0;
    }

    // ---------- live updates ----------
    function startLive() {
        stopLive();
        try {
            channel = sb().channel('blk-admin-orders')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async (payload) => {
                    const o = payload.new || {};
                    if (payload.eventType === 'INSERT' && o.source !== 'manual') {
                        toast(`🛒 New order ${o.id || ''} — ${money(o.total)}${o.status === 'awaiting_payment' ? ' (waiting for bKash payment)' : ''}`, 'success');
                    } else if (payload.eventType === 'UPDATE' && o.payment_status === 'paid' && o.paid_at && Date.now() - new Date(o.paid_at).getTime() < 20000 && !paidToasted[o.id]) {
                        paidToasted[o.id] = true;
                        toast(`💚 bKash payment confirmed — order ${o.id} (${money(o.total)})`, 'success');
                    }
                    await Promise.all([pullOrders(), pullPayments()]);
                    updateNavBadge();
                    if (panelOpen && ['orders', 'dashboard', 'payments'].includes(ui.tab) && !$('#baModal')) renderTab(ui.tab, true);
                })
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bkash_payments' }, async (payload) => {
                    const p = payload.new || {};
                    toast(`💰 bKash received ${money(p.amount)} (${p.trx_id || ''})`, 'success');
                    await pullPayments();
                    if (panelOpen && ui.tab === 'payments' && !$('#baModal')) renderTab('payments', true);
                })
                .subscribe();
        } catch (e) { /* realtime optional */ }
        if (!listening) {
            listening = true;
            window.BLKStore.onChange((st) => {
                if (!panelOpen) return;
                S.products = clone(st.products);
                S.settings = clone(st.settings);
                S.sale = clone(st.sale);
                if ($('#baModal')) return;
                const typing = document.activeElement && root.contains(document.activeElement) && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
                if (['dashboard', 'products'].includes(ui.tab) && !typing) renderTab(ui.tab, true);
                else if (ui.tab === 'stock' && !typing) drawStockRows();
            });
        }
    }
    function stopLive() { if (channel) { try { sb().removeChannel(channel); } catch (e) { /* ignore */ } channel = null; } }

    // ---------- Dashboard ----------
    function attention(p) {
        const total = prodStock(p);
        if (p.active === false) return null;
        if (total <= 0) return { level: 'out', text: 'Out of stock' };
        if (p.sizes && Object.keys(p.sizes).length) {
            const ks = sizeKeys(p.sizes);
            const sold = ks.filter(k => (parseInt(p.sizes[k]) || 0) <= 0);
            const low = ks.filter(k => { const q = parseInt(p.sizes[k]) || 0; return q > 0 && q <= lowAt(); });
            const parts = [];
            if (sold.length) parts.push('Sold out: ' + sold.join(', '));
            if (low.length) parts.push('Low: ' + low.map(k => `${k} (${p.sizes[k]})`).join(', '));
            if (parts.length) return { level: sold.length ? 'out' : 'low', text: parts.join(' · ') };
            return null;
        }
        if (total <= lowAt()) return { level: 'low', text: `Low stock (${total} left)` };
        return null;
    }

    function renderDashboard(v) {
        const visible = S.products.filter(p => p.active !== false);
        const out = visible.filter(p => prodStock(p) <= 0).length;
        const units = S.products.reduce((a, p) => a + prodStock(p), 0);
        const saleStatus = window.getSaleStatus(S.sale);
        const pending = orders.filter(o => o.status === 'pending').length;
        const awaiting = orders.filter(o => o.status === 'awaiting_payment').length;
        const today = new Date().toDateString();
        const todays = orders.filter(o => o.status !== 'cancelled' && new Date(o.created_at).toDateString() === today);
        const revenue = orders.filter(o => o.status !== 'cancelled').reduce((a, o) => a + Number(o.total), 0);
        const manualRev = orders.filter(o => o.status !== 'cancelled' && o.source === 'manual').reduce((a, o) => a + Number(o.total), 0);
        const needs = visible.map(p => ({ p, a: attention(p) })).filter(x => x.a);

        v.innerHTML = `
            <div class="ba-stats">
                <div class="ba-stat ${pending ? 'warn' : ''}"><span>New orders to confirm</span><strong>${pending}</strong></div>
                <div class="ba-stat ${awaiting ? 'warn' : ''}"><span>Waiting for bKash payment</span><strong>${awaiting}</strong></div>
                <div class="ba-stat"><span>Orders today</span><strong>${todays.length}</strong></div>
                <div class="ba-stat"><span>Sales today</span><strong>${money(todays.reduce((a, o) => a + Number(o.total), 0))}</strong></div>
                <div class="ba-stat"><span>Total sales (excl. cancelled)</span><strong>${money(revenue)}</strong></div>
                <div class="ba-stat"><span>Manual sales (excl. cancelled)</span><strong>${money(manualRev)}</strong></div>
                <div class="ba-stat"><span>Products live</span><strong>${visible.length}</strong></div>
                <div class="ba-stat ${out ? 'warn' : ''}"><span>Out of stock</span><strong>${out}</strong></div>
                <div class="ba-stat"><span>Units in stock</span><strong>${units.toLocaleString()}</strong></div>
            </div>
            <div class="ba-card">
                <h3>Site-wide sale</h3>
                <p class="ba-sub">${saleStatus === 'active' ? `<span class="ba-pill green">Running</span> ${esc(S.sale.name)} — ${esc(S.sale.percent)}% off ${S.sale.category === 'all' ? 'everything' : esc(CATS[S.sale.category])}`
                : saleStatus === 'scheduled' ? '<span class="ba-pill amber">Scheduled</span> It will start automatically.'
                : saleStatus === 'expired' ? '<span class="ba-pill red">Ended</span> The end date has passed.'
                : '<span class="ba-pill">Off</span> No sale is running right now.'}</p>
                <button class="ba-btn ghost sm" data-act="tab" data-tab="offers">Manage offers</button>
            </div>
            <div class="ba-card">
                <h3>Needs attention</h3>
                <p class="ba-sub">Sold-out sizes and low stock (low = ${lowAt()} or fewer). Stock is deducted automatically when a customer orders.</p>
                ${needs.length ? `<div class="ba-tablewrap"><table class="ba-table ba-t-stack"><tbody>
                    ${needs.map(({ p, a }) => `<tr><td><div class="ba-prod"><img src="${esc(p.image)}" alt=""><div><b>${esc(p.name)}</b><small>${esc(CATS[p.category] || p.category)}</small></div></div></td>
                    <td><span class="ba-pill ${a.level === 'out' ? 'red' : 'amber'}">${esc(a.text)}</span></td>
                    <td style="text-align:right"><button class="ba-btn ghost sm" data-act="tab-stock">Update stock</button></td></tr>`).join('')}
                </tbody></table></div>` : '<div class="ba-empty">Everything is well stocked 🎉</div>'}
            </div>`;
    }

    // ---------- Orders ----------
    function renderOrders(v) {
        const counts = { all: orders.length };
        Object.keys(STATUS).forEach(k => { counts[k] = orders.filter(o => o.status === k).length; });
        const filters = ['all', ...Object.keys(STATUS)];
        v.innerHTML = `
            <div class="ba-toolbar">
                ${filters.map(f => `<button class="ba-btn sm ${ui.orderFilter === f ? '' : 'ghost'}" data-act="order-filter" data-f="${f}">${f === 'all' ? 'All' : STATUS[f][0]} (${counts[f]})</button>`).join('')}
                <select id="baSrcFilter" style="padding:7px 10px;border:1.5px solid #d1d5db;border-radius:8px;background:#fff">
                    <option value="all" ${ui.orderSrc === 'all' ? 'selected' : ''}>All sources</option>
                    <option value="website" ${ui.orderSrc === 'website' ? 'selected' : ''}>Website only</option>
                    <option value="manual" ${ui.orderSrc === 'manual' ? 'selected' : ''}>Manual only</option>
                </select>
                <button class="ba-btn ba-addsale" data-act="ms-open" style="margin-left:auto"><i class="fas fa-plus"></i> Add manual sale</button>
            </div>
            <div class="ba-note" style="margin-bottom:16px">Stock is deducted the moment a customer places an order (or when you add a manual sale). <b>Cancel &amp; restock</b> puts the items back automatically.</div>
            <div class="ba-tablewrap"><table class="ba-table ba-t-orders">
                <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
                <tbody>
                ${(() => {
                    const rows = orders.filter(o => (ui.orderFilter === 'all' || o.status === ui.orderFilter) && (ui.orderSrc === 'all' || (o.source === 'manual' ? 'manual' : 'website') === ui.orderSrc));
                    if (!rows.length) return '<tr><td colspan="7"><div class="ba-empty">No orders here yet.</div></td></tr>';
                    return rows.map(o => {
                        const st = STATUS[o.status] || [o.status, ''];
                        const qty = (o.items || []).reduce((a, l) => a + (l.qty || 0), 0);
                        return `<tr>
                            <td><b>${esc(o.id)}</b><br><small style="color:#9ca3af">${esc(fmtDate(o.created_at))}</small>${o.source === 'manual' ? `<br><span class="ba-pill blue">Manual${o.channel ? ' · ' + esc(o.channel) : ''}</span>` : ''}</td>
                            <td>${esc(o.full_name)}<br><small style="color:#9ca3af">${esc(o.phone)}</small></td>
                            <td>${qty} item${qty === 1 ? '' : 's'}</td>
                            <td><b>${money(o.total)}</b></td>
                            <td>${esc(String(o.payment_method).toUpperCase())}${o.payment_method === 'bkash' ? (o.payment_status === 'paid' ? '<br><span class="ba-pill green">Paid ✔</span>' : '<br><span class="ba-pill amber">Unpaid</span>') : ''}</td>
                            <td><span class="ba-pill ${st[1]}">${esc(st[0])}</span></td>
                            <td><button class="ba-btn ghost sm" data-act="order-view" data-id="${esc(o.id)}">View</button></td></tr>`;
                    }).join('');
                })()}
                </tbody></table></div>`;
    }

    function openOrder(id) {
        const o = orders.find(x => x.id === id);
        if (!o) return;
        const st = STATUS[o.status] || [o.status, ''];
        const next = NEXT[o.status];
        $('#baModalHost').innerHTML = `
            <div class="ba-modal-bg" id="baModal"><div class="ba-modal-card">
                <div class="ba-modal-head"><h3>Order ${esc(o.id)} <span class="ba-pill ${st[1]}" style="margin-left:8px">${esc(st[0])}</span></h3><button class="ba-x" data-act="close-editor">✕</button></div>
                <div class="ba-modal-body">
                    <div class="ba-grid2" style="margin-bottom:18px">
                        <div><small style="color:#6b7280">CUSTOMER</small><br><b>${esc(o.full_name)}</b><br>${esc(o.phone)}<br>${esc(o.email || '')}</div>
                        <div><small style="color:#6b7280">DELIVER TO</small><br>${esc(o.address)}<br>${esc(o.city)}<br><small style="color:#6b7280">Payment: ${esc(String(o.payment_method).toUpperCase())}</small></div>
                        ${o.source === 'manual' ? `<div class="ba-span2 ba-note"><b>Manual sale</b> — came from ${esc(o.channel || 'another source')}</div>` : ''}
                        ${o.notes ? `<div class="ba-span2 ba-note"><b>Note:</b> ${esc(o.notes)}</div>` : ''}
                        ${['bkash', 'nagad'].includes(o.payment_method) ? `<div class="ba-span2 ba-note ${o.payment_status === 'paid' ? '' : 'warn'}"><b>${esc(String(o.payment_method).toUpperCase())} payment:</b> ${o.payment_status === 'paid' ? `Paid ✔${o.payment_trx ? ' — TrxID <b>' + esc(o.payment_trx) + '</b>' : ''}${o.paid_at ? ' · ' + esc(fmtDate(o.paid_at)) : ''}` : (o.status === 'awaiting_payment' ? 'Waiting for the customer to pay and enter the Transaction ID.' : 'Not paid yet.')}</div>` : ''}
                    </div>
                    <div class="ba-tablewrap"><table class="ba-table" style="min-width:420px"><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
                        ${(o.items || []).map(l => `<tr><td>${esc(l.name)}${l.size ? ` <span class="ba-chip">${esc(l.size)}</span>` : ''}</td><td>${l.qty}</td><td>${money(l.unit_price)}</td><td>${money(l.line_total)}</td></tr>`).join('')}
                    </tbody></table></div>
                    <div style="text-align:right;margin:14px 2px 0;line-height:1.9">
                        Subtotal: <b>${money(o.subtotal)}</b><br>
                        ${Number(o.discount) > 0 ? `Discount${o.coupon_code ? ' (' + esc(o.coupon_code) + ')' : ''}: <b>-${money(o.discount)}</b><br>` : ''}
                        Shipping: <b>${Number(o.shipping) === 0 ? 'Free' : money(o.shipping)}</b><br>
                        <span style="font-size:18px">Total: <b>${money(o.total)}</b></span>
                    </div>
                    <div class="ba-formactions">
                        ${['bkash', 'nagad'].includes(o.payment_method) && o.payment_status !== 'paid' && o.status !== 'cancelled' ? `<button class="ba-btn green" data-act="order-markpaid" data-id="${esc(o.id)}"><i class="fas fa-check"></i> Mark as paid &amp; confirm</button>` : ''}
                        ${next ? `<button class="ba-btn green" data-act="order-status" data-id="${esc(o.id)}" data-s="${next[0]}">${next[1]}</button>` : ''}
                        ${o.status !== 'cancelled' ? `<button class="ba-btn danger" data-act="order-cancel" data-id="${esc(o.id)}"><i class="fas fa-ban"></i> Cancel &amp; restock</button>` : ''}
                        <button class="ba-btn ghost" data-act="close-editor">Close</button>
                    </div>
                </div></div></div>`;
    }

    async function markOrderPaid(id) {
        const trx = prompt('bKash Transaction ID (optional — leave empty if you do not have it):');
        if (trx === null) return;
        const r = await run(sb().rpc('admin_mark_paid', { p_id: id, p_trx: trx.trim() || null }));
        if (!r) return;
        closeEditor();
        await Promise.all([pullOrders(), pullPayments(), afterWrite()]);
        updateNavBadge();
        renderTab(ui.tab, true);
        toast('Marked as paid — order confirmed.', 'success');
    }

    async function setOrderStatus(id, status) {
        const r = await run(sb().rpc('set_order_status', { p_id: id, p_status: status }));
        if (!r) return;
        closeEditor();
        await Promise.all([pullOrders(), afterWrite()]);
        updateNavBadge();
        renderTab(ui.tab, true);
        toast(status === 'cancelled' ? 'Order cancelled — stock put back.' : 'Order updated.', 'success');
    }

    // ---------- Manual sales (orders that came from outside the website) ----------
    const CHANNELS = ['Facebook', 'Instagram', 'WhatsApp', 'Phone call', 'In person / Walk-in', 'Other'];
    const PAY_METHODS = { cash: 'Cash', bkash: 'bKash', nagad: 'Nagad', bank: 'Bank transfer', other: 'Other' };
    let msLines = [];

    function openManualSale() {
        msLines = [{ pid: '', size: '', qty: 1, price: 0 }];
        $('#baModalHost').innerHTML = `
            <div class="ba-modal-bg" id="baModal"><div class="ba-modal-card" id="msBox">
                <div class="ba-modal-head"><h3>Add manual sale</h3><button class="ba-x" data-act="close-editor">✕</button></div>
                <div class="ba-modal-body">
                    <div class="ba-note" style="margin-bottom:16px">For orders that came from outside the website (Facebook, Instagram, WhatsApp, in person…). It is saved in the same orders list, counted in your sales totals, and the stock is deducted automatically.</div>
                    <div class="ba-grid2">
                        <label class="ba-f">Sale date &amp; time<input type="datetime-local" id="msDate" value="${isoToLocal(new Date().toISOString())}"></label>
                        <label class="ba-f">Where did it come from?<select id="msChannel">${CHANNELS.map(c => `<option>${esc(c)}</option>`).join('')}</select></label>
                        <label class="ba-f">Customer name (optional)<input type="text" id="msName" placeholder="e.g. Rahim"></label>
                        <label class="ba-f">Phone (optional)<input type="text" id="msPhone" placeholder="017XXXXXXXX"></label>
                        <label class="ba-f ba-span2">Address / city (optional)<input type="text" id="msAddr"></label>
                    </div>
                    <h3 style="margin:20px 0 8px;font-size:15px">Items sold</h3>
                    <div class="ba-mshead"><span>Product</span><span>Size</span><span>Qty</span><span>Price each</span><span></span></div>
                    <div id="msLines"></div>
                    <button class="ba-btn ghost sm" data-act="ms-add-line" style="margin-top:6px"><i class="fas fa-plus"></i> Add another item</button>
                    <div class="ba-grid2" style="margin-top:18px">
                        <label class="ba-f">Discount given (৳)<input type="number" id="msDisc" min="0" step="1" value="0"></label>
                        <label class="ba-f">Delivery charge (৳)<input type="number" id="msShip" min="0" step="1" value="0"></label>
                        <label class="ba-f">Payment received by<select id="msPay">${Object.keys(PAY_METHODS).map(k => `<option value="${k}">${PAY_METHODS[k]}</option>`).join('')}</select></label>
                        <label class="ba-f">Order status<select id="msStatus"><option value="delivered">Delivered</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option></select></label>
                        <label class="ba-f ba-span2">Note (optional)<input type="text" id="msNote" placeholder="e.g. paid advance, bKash TrxID, etc."></label>
                    </div>
                    <div id="msTotals" style="text-align:right;margin:16px 2px 0;line-height:1.9"></div>
                    <div class="ba-formactions">
                        <button class="ba-btn green" data-act="ms-save"><i class="fas fa-check"></i> Save sale</button>
                        <button class="ba-btn ghost" data-act="close-editor">Cancel</button>
                    </div>
                </div></div></div>`;
        renderMsLines();
    }

    function renderMsLines() {
        const box = $('#msLines');
        if (!box) return;
        box.innerHTML = msLines.map((l, i) => {
            const p = S.products.find(x => x.id === l.pid);
            const sk = p && p.sizes && Object.keys(p.sizes).length ? sizeKeys(p.sizes) : null;
            return `<div class="ba-msline" data-i="${i}">
                <label class="ms-c"><small>Product</small><select class="ms-prod"><option value="">Choose product…</option>${S.products.map(x => `<option value="${esc(x.id)}" ${x.id === l.pid ? 'selected' : ''}>${esc(x.name)}${x.active === false ? ' (hidden)' : ''}</option>`).join('')}</select></label>
                <label class="ms-c"><small>Size</small><select class="ms-size" ${sk ? '' : 'disabled'}>${sk ? '<option value="">Size…</option>' + sk.map(k => `<option value="${esc(k)}" ${k === l.size ? 'selected' : ''}>${esc(k)} (${parseInt(p.sizes[k]) || 0} left)</option>`).join('') : '<option value="">—</option>'}</select></label>
                <label class="ms-c"><small>Qty</small><input type="number" class="ms-qty" min="1" step="1" value="${l.qty}"></label>
                <label class="ms-c"><small>Price each</small><input type="number" class="ms-price" min="0" step="1" value="${l.price}"></label>
                <button class="ba-btn danger sm" data-act="ms-del-line" data-i="${i}" ${msLines.length === 1 ? 'disabled' : ''}>✕</button>
            </div>`;
        }).join('');
        msTotals();
    }

    function msCalc() {
        const num = (id) => Math.max(0, Number($(id) && $(id).value) || 0);
        const sub = msLines.reduce((a, l) => a + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
        const disc = num('#msDisc'), ship = num('#msShip');
        return { sub, disc, ship, total: Math.max(0, sub - disc + ship) };
    }
    function msTotals() {
        const el = $('#msTotals');
        if (!el) return;
        const t = msCalc();
        el.innerHTML = `Subtotal: <b>${money(t.sub)}</b><br>${t.disc ? `Discount: <b>-${money(t.disc)}</b><br>` : ''}${t.ship ? `Delivery: <b>${money(t.ship)}</b><br>` : ''}<span style="font-size:18px">Total: <b>${money(t.total)}</b></span>`;
    }
    function msInput(t) {
        const row = t.closest('.ba-msline');
        if (row) {
            const l = msLines[Number(row.dataset.i)];
            if (t.classList.contains('ms-qty')) l.qty = parseInt(t.value) || 0;
            else if (t.classList.contains('ms-price')) l.price = Number(t.value) || 0;
        }
        msTotals();
    }
    function msChange(t) {
        const row = t.closest('.ba-msline');
        if (!row) return;
        const l = msLines[Number(row.dataset.i)];
        if (t.classList.contains('ms-prod')) {
            l.pid = t.value; l.size = '';
            const p = S.products.find(x => x.id === l.pid);
            l.price = p ? window.computePricing(p).price : 0;
            renderMsLines();
        } else if (t.classList.contains('ms-size')) {
            l.size = t.value;
        }
    }

    async function saveManualSale() {
        try { await pullStore(); } catch (e) { /* use what we have */ }
        const items = [], need = {};
        for (const l of msLines) {
            const p = S.products.find(x => x.id === l.pid);
            if (!p) { toast('Choose a product for every item row.', 'error'); return; }
            const sized = p.sizes && Object.keys(p.sizes).length;
            if (sized && !l.size) { toast(`Choose a size for ${p.name}.`, 'error'); return; }
            const qty = parseInt(l.qty), price = Number(l.price);
            if (!(qty >= 1)) { toast(`Enter a quantity for ${p.name}.`, 'error'); return; }
            if (!(price >= 0)) { toast(`Enter the price for ${p.name}.`, 'error'); return; }
            items.push({ id: p.id, size: sized ? l.size : null, qty, unit_price: price });
            const key = p.id + '|' + (sized ? l.size : '');
            need[key] = (need[key] || 0) + qty;
        }
        // stock check (warn, but let the owner override — their count may simply be out of date)
        let oversell = false;
        for (const key of Object.keys(need)) {
            const [pid, size] = key.split('|');
            const p = S.products.find(x => x.id === pid);
            const have = size ? (parseInt(p.sizes[size]) || 0) : (parseInt(p.stock) || 0);
            if (need[key] > have) {
                if (!confirm(`${p.name}${size ? ' (' + size + ')' : ''}: only ${have} in stock but you are selling ${need[key]}.\nSave anyway? Stock will be set to 0.`)) return;
                oversell = true;
            }
        }

        const t = msCalc();
        const sale = {
            created_at: $('#msDate').value ? localToIso($('#msDate').value) : new Date().toISOString(),
            channel: $('#msChannel').value,
            full_name: $('#msName').value.trim(), phone: $('#msPhone').value.trim(), address: $('#msAddr').value.trim(),
            notes: $('#msNote').value.trim(), payment_method: $('#msPay').value, status: $('#msStatus').value,
            discount: t.disc, shipping: t.ship, allow_oversell: oversell
        };
        const btn = $('[data-act="ms-save"]');
        if (btn) btn.disabled = true;
        // one database call does everything at once: checks + deducts stock and saves the order (all-or-nothing)
        const r = await run(sb().rpc('admin_add_manual_sale', { p_sale: sale, p_items: items }));
        if (!r) { if (btn) btn.disabled = false; return; }

        closeEditor();
        await Promise.all([pullOrders(), afterWrite()]);
        updateNavBadge();
        renderTab(ui.tab, true);
        toast(`Manual sale ${(r.data && r.data.id) || ''} saved — stock updated.`, 'success');
    }

    // ---------- bKash payments ----------
    function renderPayments(v) {
        const unused = payments.filter(p => !p.used_order).length;
        v.innerHTML = `
            <div class="ba-note" style="margin-bottom:16px">This is the money that really reached your bKash. When a customer types a Transaction ID at checkout, the shop matches the <b>ID + exact amount</b> with this list and confirms the order automatically.
            It fills itself if you set up the SMS webhook (see SETUP.md) — or you can add a payment by hand below.</div>
            <div class="ba-card">
                <h3>Add a received payment by hand</h3>
                <div class="ba-grid3" style="margin-top:10px">
                    <label class="ba-f">Transaction ID (TrxID)<input type="text" id="bpTrx" placeholder="9A1B2C3D4E" style="text-transform:uppercase"></label>
                    <label class="ba-f">Amount (৳)<input type="number" id="bpAmount" min="1" step="1"></label>
                    <label class="ba-f">Sender number (optional)<input type="text" id="bpSender" placeholder="017XXXXXXXX"></label>
                </div>
                <div class="ba-formactions"><button class="ba-btn" data-act="payment-add">Add payment</button></div>
            </div>
            <div class="ba-card" style="padding:0">
                <div style="padding:16px 20px 0"><h3>Received payments <span class="ba-pill ${unused ? 'amber' : ''}">${unused} not used yet</span></h3></div>
                <div class="ba-tablewrap" style="border:none;border-radius:0 0 14px 14px"><table class="ba-table" style="min-width:680px">
                    <thead><tr><th>TrxID</th><th>Amount</th><th>From</th><th>Received</th><th>Source</th><th>Used for</th><th></th></tr></thead>
                    <tbody>${payments.length ? payments.map(p => `<tr>
                        <td><b>${esc(p.trx_id)}</b></td><td>${money(p.amount)}</td><td>${esc(p.sender || '—')}</td>
                        <td>${esc(fmtDate(p.received_at))}</td><td>${p.source === 'sms' ? '<span class="ba-pill green">SMS</span>' : '<span class="ba-pill">Manual</span>'}</td>
                        <td>${p.used_order ? `<span class="ba-pill green">Order ${esc(p.used_order)}</span>` : '<span class="ba-pill amber">Not used yet</span>'}</td>
                        <td>${p.used_order ? '' : `<button class="ba-btn danger sm" data-act="payment-delete" data-id="${esc(p.trx_id)}"><i class="fas fa-trash"></i></button>`}</td></tr>`).join('') : '<tr><td colspan="7"><div class="ba-empty">No payments recorded yet.</div></td></tr>'}</tbody>
                </table></div>
            </div>`;
    }

    async function addManualPayment() {
        const trx = $('#bpTrx').value.trim().toUpperCase().replace(/\s+/g, '');
        const amount = Number($('#bpAmount').value);
        if (!/^[A-Z0-9]{6,20}$/.test(trx)) { toast('Enter a valid Transaction ID (6–20 letters/numbers).', 'error'); return; }
        if (!(amount > 0)) { toast('Enter the amount you received.', 'error'); return; }
        const r = await run(sb().from('bkash_payments').insert({ trx_id: trx, amount, sender: $('#bpSender').value.trim() || null, source: 'manual' }), 'Payment added.');
        if (!r) return;
        await pullPayments();
        renderPayments($('#baView'));
    }

    async function deletePayment(trx) {
        if (!confirm(`Delete payment ${trx}?`)) return;
        const r = await run(sb().from('bkash_payments').delete().eq('trx_id', trx));
        if (!r) return;
        await pullPayments();
        renderPayments($('#baView'));
    }

    // ---------- Products ----------
    function renderProducts(v) {
        v.innerHTML = `
            <div class="ba-toolbar">
                <input type="search" id="baSearch" class="grow" placeholder="Search products…" value="${esc(ui.q)}">
                <select id="baCatFilter">
                    <option value="all">All categories</option>
                    ${Object.keys(CATS).map(k => `<option value="${k}" ${ui.cat === k ? 'selected' : ''}>${CATS[k]}</option>`).join('')}
                </select>
                <button class="ba-btn" data-act="add-product"><i class="fas fa-plus"></i> Add product</button>
            </div>
            <div class="ba-tablewrap">
                <table class="ba-table ba-t-prods">
                    <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
                    <tbody id="baProdBody"></tbody>
                </table>
            </div>`;
        drawProductRows();
    }

    function drawProductRows() {
        const body = $('#baProdBody');
        if (!body) return;
        const q = ui.q.trim().toLowerCase();
        const rows = S.products.filter(p =>
            (ui.cat === 'all' || p.category === ui.cat) &&
            (!q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q) || p.id.toLowerCase().includes(q)));
        if (!rows.length) { body.innerHTML = '<tr><td colspan="6"><div class="ba-empty">No products found.</div></td></tr>'; return; }
        body.innerHTML = rows.map(p => {
            const pr = window.computePricing(p);
            const total = prodStock(p);
            const chips = p.sizes && Object.keys(p.sizes).length
                ? sizeKeys(p.sizes).map(k => { const q2 = parseInt(p.sizes[k]) || 0; return `<span class="ba-chip ${q2 <= 0 ? 'out' : q2 <= lowAt() ? 'low' : ''}">${esc(k)}: ${q2}</span>`; }).join('')
                : `<span class="ba-chip ${total <= 0 ? 'out' : total <= lowAt() ? 'low' : ''}">${total} in stock</span>`;
            return `<tr class="${p.active === false ? 'hidden-row' : ''}">
                <td><div class="ba-prod"><img src="${esc(p.image)}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.id)}${p.featured ? ' · ★ featured' : ''}</small></div></div></td>
                <td>${esc(CATS[p.category] || p.category)}</td>
                <td><b>${money(pr.price)}</b>${pr.originalPrice ? `<span class="ba-old">${money(pr.originalPrice)}</span>` : ''}${pr.fromSale ? '<br><span class="ba-pill green">Sale</span>' : ''}</td>
                <td>${chips}</td>
                <td>${p.active === false ? '<span class="ba-pill">Hidden</span>' : (total <= 0 ? '<span class="ba-pill red">Sold out</span>' : '<span class="ba-pill green">Live</span>')}</td>
                <td><div class="ba-actions">
                    <button class="ba-btn ghost sm" data-act="edit" data-id="${esc(p.id)}"><i class="fas fa-pen"></i> Edit</button>
                    <button class="ba-btn ghost sm" data-act="toggle-visible" data-id="${esc(p.id)}" title="Show / hide on site"><i class="fas ${p.active === false ? 'fa-eye' : 'fa-eye-slash'}"></i></button>
                    <button class="ba-btn ghost sm" data-act="duplicate" data-id="${esc(p.id)}" title="Duplicate"><i class="fas fa-copy"></i></button>
                    <button class="ba-btn danger sm" data-act="delete" data-id="${esc(p.id)}" title="Delete"><i class="fas fa-trash"></i></button>
                </div></td>
            </tr>`;
        }).join('');
    }

    // ----- product editor -----
    function sizeRowHTML(name, qty, enabled) {
        return `<div class="ba-sizerow ${enabled ? '' : 'off'}" data-size="${esc(name)}">
            <label><input type="checkbox" class="ba-sz-on" ${enabled ? 'checked' : ''}> ${esc(name)}</label>
            <input type="number" min="0" step="1" class="ba-sz-qty" value="${qty}" ${enabled ? '' : 'disabled'}>
        </div>`;
    }

    function openEditor(id) {
        edId = id;
        const isNew = !id;
        const p = isNew ? {
            id: '', name: '', category: 'clothing', price: '', discount: null, image: '', description: '',
            featured: false, active: true, rating: 5, reviews: 0, sizes: null, stock: 0
        } : clone(S.products.find(x => x.id === id));
        edImage = p.image || '';
        edOrigImage = edImage;
        const sized = !!(p.sizes && Object.keys(p.sizes).length) || (isNew && p.category === 'clothing');
        edOrigSig = isNew ? '' : stockSig(p.sizes && Object.keys(p.sizes).length ? p.sizes : null, parseInt(p.stock) || 0);
        const allSizes = [...(S.settings.sizeOptions || [])];
        if (p.sizes) Object.keys(p.sizes).forEach(k => { if (!allSizes.includes(k)) allSizes.push(k); });

        $('#baModalHost').innerHTML = `
            <div class="ba-modal-bg" id="baModal">
                <div class="ba-modal-card">
                    <div class="ba-modal-head"><h3>${isNew ? 'Add product' : 'Edit product'}</h3><button class="ba-x" data-act="close-editor">✕</button></div>
                    <div class="ba-modal-body">
                        <div class="ba-grid2">
                            <label class="ba-f ba-span2">Product name *<input type="text" id="peName" value="${esc(p.name)}" placeholder="e.g. BLKPAPER Oversized Tee"></label>
                            <label class="ba-f">Category<select id="peCat">${Object.keys(CATS).map(k => `<option value="${k}" ${p.category === k ? 'selected' : ''}>${CATS[k]}</option>`).join('')}</select></label>
                            <label class="ba-f">Regular price (৳) *<input type="number" id="pePrice" min="0" step="1" value="${esc(p.price)}"></label>
                            <label class="ba-f">Discount<select id="peDType">
                                <option value="" ${!p.discount ? 'selected' : ''}>No discount</option>
                                <option value="percent" ${p.discount && p.discount.type === 'percent' ? 'selected' : ''}>Percent (%) off</option>
                                <option value="fixed" ${p.discount && p.discount.type === 'fixed' ? 'selected' : ''}>Fixed amount (৳) off</option>
                            </select></label>
                            <label class="ba-f">Discount value<input type="number" id="peDVal" min="0" step="1" value="${p.discount ? esc(p.discount.value) : ''}"></label>
                            <div class="ba-note ba-span2" id="pePreview"></div>
                            <label class="ba-f ba-span2">Description<textarea id="peDesc" rows="3">${esc(p.description)}</textarea></label>

                            <div class="ba-f ba-span2">Product image
                                <div class="ba-imgrow">
                                    <img id="pePrev" src="${esc(edImage)}" alt="">
                                    <div class="ba-imginputs">
                                        <div><button type="button" class="ba-btn ghost sm" data-act="pick-image" id="peUploadBtn"><i class="fas fa-upload"></i> Upload photo</button>
                                        <input type="file" id="peFile" accept="image/*" style="display:none"></div>
                                        <input type="text" id="peImgUrl" placeholder="…or paste an image link" value="${esc(edImage)}">
                                        <small id="peImgInfo">Photos are resized and stored in your Supabase storage.</small>
                                    </div>
                                </div>
                            </div>

                            <div class="ba-f ba-span2">Stock tracking
                                <div class="ba-modes">
                                    <label class="ba-mode"><input type="radio" name="peMode" value="sized" ${sized ? 'checked' : ''}> By size (S, M, L…)</label>
                                    <label class="ba-mode"><input type="radio" name="peMode" value="single" ${!sized ? 'checked' : ''}> Single quantity</label>
                                </div>
                            </div>
                            <div class="ba-span2" id="peSizedBox" style="${sized ? '' : 'display:none'}">
                                <small style="color:#6b7280">Tick the sizes you sell and set how many you have of each. Orders deduct from these numbers automatically.</small>
                                <div class="ba-sizes" id="peSizes">
                                    ${allSizes.map(sz => { const has = p.sizes && sz in p.sizes; return sizeRowHTML(sz, has ? p.sizes[sz] : 0, !!has); }).join('')}
                                </div>
                                <div class="ba-addsize"><input type="text" id="peNewSize" placeholder="Add another size (e.g. 3XL, 42)"><button type="button" class="ba-btn ghost sm" data-act="add-size"><i class="fas fa-plus"></i> Add</button></div>
                            </div>
                            <label class="ba-f ba-span2" id="peSingleBox" style="${sized ? 'display:none' : ''}">Quantity in stock<input type="number" id="peStock" min="0" step="1" value="${parseInt(p.stock) || 0}"></label>

                            <div class="ba-f">Rating (0–5)<input type="number" id="peRating" min="0" max="5" step="0.1" value="${esc(p.rating)}"></div>
                            <div class="ba-f">Review count<input type="number" id="peReviews" min="0" step="1" value="${esc(p.reviews)}"></div>
                            <div class="ba-f ba-span2 ba-checks">
                                <label class="ba-check"><input type="checkbox" id="peFeatured" ${p.featured ? 'checked' : ''}> Featured (gold badge)</label>
                                <label class="ba-check"><input type="checkbox" id="peActive" ${p.active !== false ? 'checked' : ''}> Visible on the site</label>
                            </div>
                        </div>
                        <div class="ba-formactions">
                            <button class="ba-btn" data-act="save-product" id="peSaveBtn">${isNew ? 'Add product' : 'Save changes'}</button>
                            <button class="ba-btn ghost" data-act="close-editor">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>`;
        updatePreview();
        $('#peName').focus();
    }

    function readDiscount() {
        const type = $('#peDType').value;
        const val = Number($('#peDVal').value);
        return type && val > 0 ? { type, value: val } : null;
    }

    function updatePreview() {
        const el = $('#pePreview');
        if (!el) return;
        const price = Number($('#pePrice').value) || 0;
        const tmp = { price, category: $('#peCat').value, discount: readDiscount() };
        const pr = window.computePricing(tmp);
        if (!price) { el.textContent = 'Enter a price to see what customers will pay.'; return; }
        el.innerHTML = pr.originalPrice
            ? `Customers pay <b>${money(pr.price)}</b> <span class="ba-old">${money(pr.originalPrice)}</span> (${Math.round((pr.originalPrice - pr.price) / pr.originalPrice * 100)}% off)${pr.fromSale ? ' — the site-wide sale gives the bigger discount.' : ''}`
            : `Customers pay <b>${money(price)}</b>.`;
    }

    // resize the photo in the browser, then upload it to Supabase Storage
    function resizeToBlob(file, opts) {
        opts = opts || {};
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Could not read the file.'));
            reader.onload = () => {
                const img = new Image();
                img.onerror = () => reject(new Error('That file is not a valid image.'));
                img.onload = () => {
                    const max = opts.max || 1200;
                    const scale = Math.min(1, max / Math.max(img.width, img.height));
                    const c = document.createElement('canvas');
                    c.width = Math.round(img.width * scale);
                    c.height = Math.round(img.height * scale);
                    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                    c.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process the image.'))), 'image/jpeg', opts.quality || 0.85);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async function uploadImage(file, opts) {
        opts = opts || {};
        const blob = await resizeToBlob(file, opts);
        const path = `${opts.folder || 'p'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error } = await sb().storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
        if (error) throw error;
        return sb().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    }

    function bucketPath(url) {
        const marker = '/' + BUCKET + '/';
        const i = (url || '').indexOf(marker);
        return i >= 0 ? decodeURIComponent(url.slice(i + marker.length).split('?')[0]) : null;
    }
    async function removeImage(url) {
        const path = bucketPath(url);
        if (path) { try { await sb().storage.from(BUCKET).remove([path]); } catch (e) { /* not important */ } }
    }

    async function saveProduct() {
        const name = $('#peName').value.trim();
        const price = Number($('#pePrice').value);
        if (!name) { toast('Product name is required.', 'error'); return; }
        if (!(price > 0)) { toast('Enter a regular price greater than 0.', 'error'); return; }
        const discount = readDiscount();
        if (discount && discount.type === 'percent' && discount.value >= 100) { toast('Percent discount must be below 100.', 'error'); return; }
        if (discount && discount.type === 'fixed' && discount.value >= price) { toast('Fixed discount must be less than the price.', 'error'); return; }
        const sized = document.querySelector('input[name="peMode"]:checked').value === 'sized';
        let sizes = null, stock = 0;
        if (sized) {
            sizes = {};
            document.querySelectorAll('#peSizes .ba-sizerow').forEach(row => {
                if ($('.ba-sz-on', row).checked) sizes[row.dataset.size] = Math.max(0, parseInt($('.ba-sz-qty', row).value) || 0);
            });
            if (!Object.keys(sizes).length) { toast('Tick at least one size.', 'error'); return; }
        } else {
            stock = Math.max(0, parseInt($('#peStock').value) || 0);
        }
        const category = $('#peCat').value;
        const row = {
            name, category, price,
            discount_type: discount ? discount.type : null,
            discount_value: discount ? discount.value : 0,
            image_url: edImage.trim(),
            description: $('#peDesc').value.trim(),
            featured: $('#peFeatured').checked,
            active: $('#peActive').checked,
            rating: Math.min(5, Math.max(0, Number($('#peRating').value) || 0)),
            reviews: Math.max(0, parseInt($('#peReviews').value) || 0)
        };
        // Only touch stock numbers if you actually changed them — otherwise a sale that happened while the
        // editor was open could be overwritten.
        const stockChanged = !edId || stockSig(sized ? sizes : null, stock) !== edOrigSig;
        if (stockChanged) { row.sizes = sized ? sizes : null; row.stock = sized ? 0 : stock; }

        const btn = $('#peSaveBtn');
        btn.disabled = true; btn.textContent = 'Saving…';
        let r;
        if (edId) {
            r = await run(sb().from('products').update(row).eq('id', edId));
        } else {
            row.id = category + '-' + Date.now().toString(36);
            row.sort_order = Date.now();
            r = await run(sb().from('products').insert(row));
        }
        if (!r) { btn.disabled = false; btn.textContent = edId ? 'Save changes' : 'Add product'; return; }
        if (edId && edOrigImage && edOrigImage !== edImage) removeImage(edOrigImage);
        closeEditor();
        await afterWrite();
        if (ui.tab === 'products') drawProductRows(); else renderTab(ui.tab, true);
        toast('Saved — live on your shop now.', 'success');
    }

    function closeEditor() { const h = $('#baModalHost'); if (h) h.innerHTML = ''; edId = null; }

    // ---------- Stock ----------
    function renderStock(v) {
        v.innerHTML = `
            <div class="ba-toolbar">
                <input type="search" id="baStockSearch" class="grow" placeholder="Search products…" value="${esc(ui.q)}">
                <label class="ba-check"><input type="checkbox" id="baLowOnly" ${ui.lowOnly ? 'checked' : ''}> Only low / sold-out</label>
            </div>
            <div class="ba-note" style="margin-bottom:16px">Change a number and press <b>Tab</b> or click outside — it saves instantly and shoppers see it live. Customer orders deduct from these numbers automatically.</div>
            <div class="ba-tablewrap"><table class="ba-table ba-t-stack"><thead><tr><th style="width:34%">Product</th><th>Stock</th></tr></thead><tbody id="baStockBody"></tbody></table></div>`;
        drawStockRows();
    }

    function drawStockRows() {
        const body = $('#baStockBody');
        if (!body) return;
        const q = ui.q.trim().toLowerCase();
        const rows = S.products.filter(p => (!q || p.name.toLowerCase().includes(q)) && (!ui.lowOnly || attention(Object.assign({}, p, { active: true }))));
        if (!rows.length) { body.innerHTML = '<tr><td colspan="2"><div class="ba-empty">Nothing to show.</div></td></tr>'; return; }
        const cls = (n) => (n <= 0 ? 'out' : n <= lowAt() ? 'low' : '');
        body.innerHTML = rows.map(p => {
            const cells = p.sizes && Object.keys(p.sizes).length
                ? sizeKeys(p.sizes).map(k => `<label class="ba-stockcell">${esc(k)}<input type="number" min="0" class="${cls(parseInt(p.sizes[k]) || 0)}" data-pid="${esc(p.id)}" data-size="${esc(k)}" value="${parseInt(p.sizes[k]) || 0}"></label>`).join('')
                : `<label class="ba-stockcell">Quantity<input type="number" min="0" class="${cls(parseInt(p.stock) || 0)}" data-pid="${esc(p.id)}" value="${parseInt(p.stock) || 0}"></label>`;
            return `<tr class="${p.active === false ? 'hidden-row' : ''}">
                <td><div class="ba-prod"><img src="${esc(p.image)}" alt=""><div><b>${esc(p.name)}</b><small>${esc(CATS[p.category] || p.category)}${p.active === false ? ' · hidden' : ''}</small></div></div></td>
                <td><div class="ba-stockcells">${cells}</div></td></tr>`;
        }).join('');
    }

    // ---------- Offers ----------
    function renderOffers(v) {
        const sale = S.sale;
        const st = window.getSaleStatus(sale);
        const stPill = { active: '<span class="ba-pill green">Running now</span>', scheduled: '<span class="ba-pill amber">Scheduled</span>', expired: '<span class="ba-pill red">Ended</span>', off: '<span class="ba-pill">Off</span>' }[st];
        const c = ui.couponIdx >= 0 ? S.coupons[ui.couponIdx] : { code: '', type: 'percent', value: '', minOrder: 0, expires: '', active: true, note: '' };
        v.innerHTML = `
            <div class="ba-card">
                <h3>Site-wide sale ${stPill}</h3>
                <p class="ba-sub">Takes a percentage off every product (or one category). If a product already has a bigger discount, the bigger one is used. Set dates to start and stop it automatically.</p>
                <div class="ba-grid2">
                    <label class="ba-check ba-span2"><input type="checkbox" id="saOn" ${sale.enabled ? 'checked' : ''}> Sale enabled</label>
                    <label class="ba-f">Sale name<input type="text" id="saName" value="${esc(sale.name)}" placeholder="e.g. Eid Sale"></label>
                    <label class="ba-f">Discount (%)<input type="number" id="saPct" min="1" max="90" value="${esc(sale.percent)}"></label>
                    <label class="ba-f">Applies to<select id="saCat"><option value="all">Everything</option>${Object.keys(CATS).map(k => `<option value="${k}" ${sale.category === k ? 'selected' : ''}>${CATS[k]} only</option>`).join('')}</select></label>
                    <span></span>
                    <label class="ba-f">Starts (optional)<input type="datetime-local" id="saStart" value="${esc(isoToLocal(sale.start))}"></label>
                    <label class="ba-f">Ends (optional)<input type="datetime-local" id="saEnd" value="${esc(isoToLocal(sale.end))}"></label>
                    <label class="ba-f ba-span2">Banner text on top of the site (optional)<input type="text" id="saBanner" value="${esc(sale.banner)}" placeholder="e.g. 🔥 Eid Sale — 20% OFF everything!"><small>Shown while the sale is running.</small></label>
                </div>
                <div class="ba-formactions"><button class="ba-btn" data-act="save-sale">Save sale</button></div>
            </div>

            <div class="ba-card">
                <h3>Coupon codes</h3>
                <p class="ba-sub">Customers type a code in the cart. Codes are private — shoppers can't list them — and are re-checked on the server when the order is placed.</p>
                <div class="ba-tablewrap" style="margin-bottom:18px">
                    <table class="ba-table" style="min-width:640px"><thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Expires</th><th>Status</th><th></th></tr></thead><tbody>
                    ${S.coupons.length ? S.coupons.map((cp, i) => `<tr>
                        <td><b>${esc(cp.code)}</b><br><small style="color:#9ca3af">${esc(cp.note || '')}</small></td>
                        <td>${cp.type === 'percent' ? esc(cp.value) + '%' : money(cp.value)} off</td>
                        <td>${Number(cp.minOrder) ? money(cp.minOrder) : '—'}</td>
                        <td>${cp.expires ? esc(cp.expires) : 'Never'}</td>
                        <td>${cp.active === false ? '<span class="ba-pill">Paused</span>' : '<span class="ba-pill green">Active</span>'}</td>
                        <td><div class="ba-actions">
                            <button class="ba-btn ghost sm" data-act="coupon-edit" data-i="${i}"><i class="fas fa-pen"></i></button>
                            <button class="ba-btn ghost sm" data-act="coupon-toggle" data-i="${i}">${cp.active === false ? 'Activate' : 'Pause'}</button>
                            <button class="ba-btn danger sm" data-act="coupon-delete" data-i="${i}"><i class="fas fa-trash"></i></button>
                        </div></td></tr>`).join('') : '<tr><td colspan="6"><div class="ba-empty">No coupons yet.</div></td></tr>'}
                    </tbody></table>
                </div>
                <h3 style="font-size:15px">${ui.couponIdx >= 0 ? 'Edit coupon' : 'New coupon'}</h3>
                <div class="ba-grid3" style="margin-top:10px">
                    <label class="ba-f">Code<input type="text" id="cpCode" value="${esc(c.code)}" placeholder="EID25" style="text-transform:uppercase" ${ui.couponIdx >= 0 ? 'readonly' : ''}></label>
                    <label class="ba-f">Type<select id="cpType"><option value="percent" ${c.type === 'percent' ? 'selected' : ''}>Percent (%)</option><option value="fixed" ${c.type === 'fixed' ? 'selected' : ''}>Fixed amount (৳)</option></select></label>
                    <label class="ba-f">Value<input type="number" id="cpValue" min="1" value="${esc(c.value)}"></label>
                    <label class="ba-f">Minimum order (৳)<input type="number" id="cpMin" min="0" value="${esc(c.minOrder || 0)}"></label>
                    <label class="ba-f">Expires (optional)<input type="date" id="cpExp" value="${esc(c.expires || '')}"></label>
                    <label class="ba-f">Note (for you)<input type="text" id="cpNote" value="${esc(c.note || '')}" placeholder="e.g. Instagram giveaway"></label>
                </div>
                <div class="ba-formactions">
                    <button class="ba-btn" data-act="coupon-save">${ui.couponIdx >= 0 ? 'Update coupon' : 'Add coupon'}</button>
                    ${ui.couponIdx >= 0 ? '<button class="ba-btn ghost" data-act="coupon-cancel">Cancel edit</button>' : ''}
                </div>
            </div>
            <div class="ba-note">Per-product discounts are set inside each product (Products → Edit).</div>`;
    }

    async function saveSale() {
        const pct = Number($('#saPct').value);
        if ($('#saOn').checked && !(pct >= 1 && pct <= 90)) { toast('Sale percent must be between 1 and 90.', 'error'); return; }
        const start = $('#saStart').value, end = $('#saEnd').value;
        if (start && end && new Date(end) <= new Date(start)) { toast('The end time must be after the start time.', 'error'); return; }
        const sale = {
            enabled: $('#saOn').checked, name: $('#saName').value.trim() || 'Sale', percent: pct || 10,
            category: $('#saCat').value, start: localToIso(start), end: localToIso(end), banner: $('#saBanner').value.trim()
        };
        const r = await run(sb().from('settings').upsert({ key: 'sale', value: sale }), 'Sale saved — live now.');
        if (!r) return;
        S.sale = sale;
        await afterWrite();
        renderOffers($('#baView'));
    }

    async function saveCoupon() {
        const editing = ui.couponIdx >= 0;
        const code = $('#cpCode').value.trim().toUpperCase().replace(/\s+/g, '');
        const value = Number($('#cpValue').value);
        const type = $('#cpType').value;
        if (!code) { toast('Enter a coupon code.', 'error'); return; }
        if (!(value > 0)) { toast('Enter a discount value.', 'error'); return; }
        if (type === 'percent' && value > 100) { toast('Percent cannot be more than 100.', 'error'); return; }
        if (!editing && S.coupons.some(x => x.code.toUpperCase() === code)) { toast('That code already exists.', 'error'); return; }
        const row = {
            code, type, value, min_order: Number($('#cpMin').value) || 0, expires: $('#cpExp').value || null,
            note: $('#cpNote').value.trim(), active: editing ? S.coupons[ui.couponIdx].active !== false : true
        };
        const r = await run(sb().from('coupons').upsert(row), 'Coupon saved.');
        if (!r) return;
        ui.couponIdx = -1;
        await pullCoupons();
        renderOffers($('#baView'));
    }

    // ---------- Settings ----------
    function renderSettings(v) {
        const s = S.settings;
        stQr = s.bkashQr || '';
        v.innerHTML = `
            <div class="ba-card">
                <h3>Shipping & stock</h3>
                <div class="ba-grid3" style="margin-top:12px">
                    <label class="ba-f">Shipping fee (৳)<input type="number" id="stShip" min="0" value="${esc(s.shippingFee)}"></label>
                    <label class="ba-f">Free shipping over (৳)<input type="number" id="stFree" min="0" value="${esc(s.freeShippingOver)}"><small>0 = no free shipping</small></label>
                    <label class="ba-f">“Low stock” at or below<input type="number" id="stLow" min="0" value="${esc(s.lowStockAt)}"><small>Shows “Only N left” to customers</small></label>
                    <label class="ba-f ba-span2" style="grid-column:1/-1">Size options for new products<input type="text" id="stSizes" value="${esc((s.sizeOptions || []).join(', '))}"><small>Comma separated, e.g. S, M, L, XL, XXL</small></label>
                </div>
            </div>
            <div class="ba-card">
                <h3>bKash online payment</h3>
                <p class="ba-sub">When a bKash number is set, customers who choose bKash see a payment window with your QR code, enter their Transaction ID, and the order is confirmed automatically once the matching payment is found in <b>bKash Payments</b>. Leave the number empty to switch this off.</p>
                <div class="ba-grid2">
                    <label class="ba-f">bKash number<input type="text" id="stBkNum" value="${esc(s.bkashNumber)}" placeholder="01XXXXXXXXX"></label>
                    <label class="ba-f">Account name (optional)<input type="text" id="stBkName" value="${esc(s.bkashName)}" placeholder="BLKPAPER"></label>
                    <label class="ba-f">Keep items reserved for (minutes)<input type="number" id="stBkHold" min="3" max="120" value="${esc(s.bkashHoldMinutes || 15)}"><small>Unpaid orders are cancelled after this and the stock is released.</small></label>
                    <div class="ba-f">Your bKash QR code image
                        <div class="ba-imgrow">
                            <img id="stQrPrev" src="${esc(stQr)}" alt="" style="${stQr ? '' : 'display:none'}">
                            <div class="ba-imginputs">
                                <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="ba-btn ghost sm" data-act="qr-pick"><i class="fas fa-upload"></i> Upload QR</button>
                                <button type="button" class="ba-btn ghost sm" data-act="qr-remove">Remove</button></div>
                                <input type="file" id="stQrFile" accept="image/*" style="display:none">
                                <small id="stQrInfo">Screenshot or download the QR from your bKash app, then upload it here.</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ba-card">
                <h3>Homepage messages</h3>
                <div class="ba-grid2" style="margin-top:12px">
                    <label class="ba-f ba-span2">Hero offer badge<input type="text" id="stHero" value="${esc(s.heroOffer)}" placeholder="20% OFF on First Purchase"><small>Leave empty to hide the badge.</small></label>
                    <label class="ba-check ba-span2"><input type="checkbox" id="stAnnOn" ${s.announcementOn ? 'checked' : ''}> Show announcement bar at the top</label>
                    <label class="ba-f ba-span2">Announcement text<input type="text" id="stAnn" value="${esc(s.announcement)}" placeholder="🚚 Free delivery on orders over ৳3,000"></label>
                </div>
            </div>
            <div class="ba-card">
                <h3>Contact details</h3>
                <div class="ba-grid2" style="margin-top:12px">
                    <label class="ba-f">Phone<input type="text" id="stPhone" value="${esc(s.phone)}"></label>
                    <label class="ba-f">Email<input type="email" id="stEmail" value="${esc(s.email)}"></label>
                    <label class="ba-f ba-span2">Address<input type="text" id="stAddr" value="${esc(s.address)}"></label>
                    <label class="ba-f ba-span2">WhatsApp number (with country code)<input type="text" id="stWa" value="${esc(s.whatsapp)}" placeholder="8801XXXXXXXXX"></label>
                </div>
            </div>
            <div class="ba-formactions" style="margin-top:0">
                <button class="ba-btn" data-act="save-settings">Save settings</button>
                <button class="ba-btn ghost" data-act="backup"><i class="fas fa-download"></i> Download backup (JSON)</button>
            </div>`;
    }

    async function saveSettings() {
        const sizes = $('#stSizes').value.split(',').map(x => x.trim()).filter(Boolean);
        const settings = Object.assign({}, S.settings, {
            shippingFee: Math.max(0, Number($('#stShip').value) || 0),
            freeShippingOver: Math.max(0, Number($('#stFree').value) || 0),
            lowStockAt: Math.max(0, parseInt($('#stLow').value) || 0),
            sizeOptions: sizes.length ? sizes : ['S', 'M', 'L', 'XL'],
            heroOffer: $('#stHero').value.trim(),
            announcementOn: $('#stAnnOn').checked,
            announcement: $('#stAnn').value.trim(),
            phone: $('#stPhone').value.trim(),
            email: $('#stEmail').value.trim(),
            address: $('#stAddr').value.trim(),
            whatsapp: $('#stWa').value.trim(),
            bkashNumber: $('#stBkNum').value.trim(),
            bkashName: $('#stBkName').value.trim(),
            bkashQr: stQr,
            bkashHoldMinutes: Math.min(120, Math.max(3, parseInt($('#stBkHold').value) || 15))
        });
        const r = await run(sb().from('settings').upsert({ key: 'store', value: settings }), 'Settings saved — live now.');
        if (!r) return;
        S.settings = settings;
        await afterWrite();
    }

    function downloadBackup() {
        const data = { exportedAt: new Date().toISOString(), products: S.products, settings: S.settings, sale: S.sale, coupons: S.coupons, orders: orders };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'blkpaper-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }

    // ---------- events ----------
    const actions = {
        'tab': (b) => renderTab(b.dataset.tab),
        'tab-stock': () => renderTab('stock'),
        'close': () => close(),
        'lock': async () => { stopLive(); try { await sb().auth.signOut(); } catch (e) { /* ignore */ } showLock(); },
        'reload': async () => { await loadAll(); updateNavBadge(); renderTab(ui.tab, true); toast('Reloaded.', 'success'); },
        'add-product': () => openEditor(null),
        'edit': (b) => openEditor(b.dataset.id),
        'close-editor': () => closeEditor(),
        'save-product': () => saveProduct(),
        'pick-image': () => $('#peFile').click(),
        'add-size': () => {
            const input = $('#peNewSize');
            const name = input.value.trim();
            if (!name) return;
            if ([...document.querySelectorAll('#peSizes .ba-sizerow')].some(r => r.dataset.size.toLowerCase() === name.toLowerCase())) { toast('That size is already in the list.', 'error'); return; }
            $('#peSizes').insertAdjacentHTML('beforeend', sizeRowHTML(name, 0, true));
            input.value = '';
        },
        'toggle-visible': async (b) => {
            const p = S.products.find(x => x.id === b.dataset.id);
            const r = await run(sb().from('products').update({ active: p.active === false }).eq('id', p.id));
            if (!r) return;
            await afterWrite();
            drawProductRows();
            toast(p.active === false ? 'Product hidden from the site.' : 'Product is now visible.', 'success');
        },
        'duplicate': async (b) => {
            const p = clone(S.products.find(x => x.id === b.dataset.id));
            const row = {
                id: p.category + '-' + Date.now().toString(36), name: p.name + ' (copy)', category: p.category, price: p.price,
                discount_type: p.discount ? p.discount.type : null, discount_value: p.discount ? p.discount.value : 0,
                image_url: p.image, description: p.description, featured: false, active: false, rating: p.rating, reviews: p.reviews,
                sizes: p.sizes || null, stock: p.sizes ? 0 : p.stock, sort_order: Date.now()
            };
            const r = await run(sb().from('products').insert(row));
            if (!r) return;
            await afterWrite();
            drawProductRows();
            toast('Duplicated — the copy is hidden until you edit and show it.', 'success');
        },
        'delete': async (b) => {
            const p = S.products.find(x => x.id === b.dataset.id);
            if (!confirm(`Delete “${p.name}” permanently?\n(Tip: use the eye button to just hide it. Past orders keep their details.)`)) return;
            const r = await run(sb().from('products').delete().eq('id', p.id));
            if (!r) return;
            removeImage(p.image);
            await afterWrite();
            drawProductRows();
            toast('Product deleted.', 'success');
        },
        'order-filter': (b) => { ui.orderFilter = b.dataset.f; renderOrders($('#baView')); },
        'order-view': (b) => openOrder(b.dataset.id),
        'order-status': (b) => setOrderStatus(b.dataset.id, b.dataset.s),
        'order-markpaid': (b) => markOrderPaid(b.dataset.id),
        'payment-add': () => addManualPayment(),
        'payment-delete': (b) => deletePayment(b.dataset.id),
        'qr-pick': () => $('#stQrFile').click(),
        'qr-remove': () => { stQr = ''; $('#stQrPrev').style.display = 'none'; $('#stQrInfo').textContent = 'QR removed — click Save settings.'; },
        'order-cancel': (b) => {
            if (!confirm('Cancel this order and put the items back in stock?')) return;
            setOrderStatus(b.dataset.id, 'cancelled');
        },
        'ms-open': () => openManualSale(),
        'ms-add-line': () => { msLines.push({ pid: '', size: '', qty: 1, price: 0 }); renderMsLines(); },
        'ms-del-line': (b) => { if (msLines.length > 1) { msLines.splice(Number(b.dataset.i), 1); renderMsLines(); } },
        'ms-save': () => saveManualSale(),
        'save-sale': () => saveSale(),
        'coupon-save': () => saveCoupon(),
        'coupon-edit': (b) => { ui.couponIdx = Number(b.dataset.i); renderOffers($('#baView')); $('#baView').scrollTop = 99999; },
        'coupon-cancel': () => { ui.couponIdx = -1; renderOffers($('#baView')); },
        'coupon-toggle': async (b) => {
            const c = S.coupons[Number(b.dataset.i)];
            const r = await run(sb().from('coupons').update({ active: c.active === false }).eq('code', c.code));
            if (!r) return;
            await pullCoupons();
            renderOffers($('#baView'));
        },
        'coupon-delete': async (b) => {
            const c = S.coupons[Number(b.dataset.i)];
            if (!confirm(`Delete coupon ${c.code}?`)) return;
            const r = await run(sb().from('coupons').delete().eq('code', c.code));
            if (!r) return;
            ui.couponIdx = -1;
            await pullCoupons();
            renderOffers($('#baView'));
        },
        'save-settings': () => saveSettings(),
        'backup': () => downloadBackup()
    };

    function bindEvents() {
        root.addEventListener('click', (e) => {
            const b = e.target.closest('[data-act]');
            if (!b) return;
            const fn = actions[b.dataset.act];
            if (fn) fn(b);
        });
        root.addEventListener('input', (e) => {
            const t = e.target;
            if (t.id === 'baSearch') { ui.q = t.value; drawProductRows(); }
            else if (t.id === 'baStockSearch') { ui.q = t.value; drawStockRows(); }
            else if (t.closest && t.closest('#msBox')) msInput(t);
            else if (t.id === 'peImgUrl') { edImage = t.value.trim(); $('#pePrev').src = edImage; }
            else if (['pePrice', 'peDVal'].includes(t.id)) updatePreview();
        });
        root.addEventListener('change', async (e) => {
            const t = e.target;
            if (t.id === 'baCatFilter') { ui.cat = t.value; drawProductRows(); }
            else if (t.id === 'baSrcFilter') { ui.orderSrc = t.value; renderOrders($('#baView')); }
            else if (t.classList.contains('ms-prod') || t.classList.contains('ms-size')) msChange(t);
            else if (t.id === 'baLowOnly') { ui.lowOnly = t.checked; drawStockRows(); }
            else if (t.id === 'peCat' || t.id === 'peDType') updatePreview();
            else if (t.name === 'peMode') {
                const sized = t.value === 'sized';
                $('#peSizedBox').style.display = sized ? '' : 'none';
                $('#peSingleBox').style.display = sized ? 'none' : '';
            }
            else if (t.classList.contains('ba-sz-on')) {
                const row = t.closest('.ba-sizerow');
                row.classList.toggle('off', !t.checked);
                $('.ba-sz-qty', row).disabled = !t.checked;
            }
            else if (t.id === 'stQrFile' && t.files[0]) {
                const info = $('#stQrInfo');
                info.textContent = 'Uploading…';
                try {
                    stQr = await uploadImage(t.files[0], { max: 900, quality: 0.95, folder: 'qr' });
                    const prev = $('#stQrPrev');
                    prev.src = stQr; prev.style.display = '';
                    info.textContent = 'QR uploaded ✔ — click Save settings.';
                } catch (err) { info.textContent = ''; toast('Upload failed: ' + (err.message || err), 'error'); }
                t.value = '';
            }
            else if (t.id === 'peFile' && t.files[0]) {
                const info = $('#peImgInfo'), btn = $('#peUploadBtn');
                btn.disabled = true; info.textContent = 'Uploading photo…';
                try {
                    const url = await uploadImage(t.files[0]);
                    edImage = url;
                    $('#pePrev').src = url;
                    $('#peImgUrl').value = url;
                    info.textContent = 'Photo uploaded ✔ — remember to click Save.';
                } catch (err) {
                    info.textContent = '';
                    toast('Upload failed: ' + (err.message || err), 'error');
                }
                btn.disabled = false;
                t.value = '';
            }
            else if (t.dataset && t.dataset.pid !== undefined && t.closest('#baStockBody')) {
                const p = S.products.find(x => x.id === t.dataset.pid);
                const val = Math.max(0, parseInt(t.value) || 0);
                t.value = val;
                const size = t.dataset.size !== undefined ? t.dataset.size : null;
                const r = await run(sb().rpc('admin_set_stock', { p_id: p.id, p_size: size, p_qty: val }));
                if (!r) { drawStockRows(); return; }
                if (size !== null) p.sizes[size] = val; else p.stock = val;
                t.className = val <= 0 ? 'out' : val <= lowAt() ? 'low' : '';
                toast('Stock saved — live now.', 'success');
                window.BLKStore.refresh();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && root && root.style.display !== 'none' && $('#baModal')) closeEditor();
        });
    }

    // ---------- open / close ----------
    function ensureRoot() {
        injectStyles();
        if (root) return;
        root = document.createElement('div');
        root.id = 'blkAdmin';
        document.body.appendChild(root);
        bindEvents();
    }

    async function open() {
        ensureRoot();
        root.style.display = '';
        document.body.style.overflow = 'hidden';
        if (!sb()) { showLock(); return; }
        try {
            const { data } = await sb().auth.getSession();
            if (data && data.session) {
                const { data: ok } = await sb().rpc('is_admin');
                if (ok) { showPanel(); return; }
            }
        } catch (e) { /* fall through to login */ }
        showLock();
    }

    function close() {
        if (!root) return;
        stopLive();
        panelOpen = false;
        root.style.display = 'none';
        root.innerHTML = '';
        document.body.style.overflow = '';
        if (location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search);
    }

    window.BLKAdmin = { open: open, close: close };
})();