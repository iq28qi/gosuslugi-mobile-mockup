const fs = require('fs');
const images = JSON.parse(fs.readFileSync('extracted_images.json', 'utf8'));
// Shared vector keeps the scan dialog and keypad icon optically consistent.
const faceIdGlyph = '<path d="M21 7h-6a8 8 0 0 0-8 8v6m36-14h6a8 8 0 0 1 8 8v6M7 43v6a8 8 0 0 0 8 8h6m22 0h6a8 8 0 0 0 8-8v-6"/><path d="M22 25v6m20-6v6m-9-7v12a3 3 0 0 1-3 3h-2M22 45c5 6 15 6 20 0"/>';

// Double-headed eagle SVG path for watermark
const eagleWatermarkSvg = `
<svg class="watermark-eagle" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <g id="eagle-wing">
      <path d="M91 89C64 82 48 61 28 30C20 38 25 52 40 65C26 59 17 50 9 39C6 57 23 72 43 80C25 78 14 69 3 60C0 77 19 90 40 94C21 95 13 89 0 82C2 100 21 108 44 108C31 116 18 113 8 109C14 125 33 129 52 120C48 135 36 142 23 143C42 153 60 141 69 127C72 141 66 151 54 158C72 159 83 142 85 125Z"/>
      <path d="M81 101C66 101 59 115 63 126C67 137 56 149 46 154L52 163C69 157 81 145 82 134Z"/>
      <path d="M66 157 56 171 39 171 31 179 50 178 53 187 61 177 73 180 69 170 76 162Z"/>
    </g>
    <g id="eagle-head">
      <path d="M98 89C95 74 79 66 78 53L82 47C91 47 97 41 93 35C89 27 74 30 73 35L59 36 64 44 57 49 68 51C66 67 68 79 79 93Z"/>
      <path d="M65 27 62 16 69 19 75 11 80 20 87 16 85 27Z"/>
    </g>
  </defs>
  <use href="#eagle-wing"/><use href="#eagle-wing" transform="translate(200 0) scale(-1 1)"/>
  <use href="#eagle-head"/><use href="#eagle-head" transform="translate(200 0) scale(-1 1)"/>
  <path d="M89 21 86 9 94 13 100 2 107 13 115 9 112 21Z M97 0V10H103V0Z"/>
  <path d="M79 89Q100 80 121 89L119 121Q112 141 100 149Q87 141 81 121Z"/>
  <path d="M94 145C84 152 87 173 74 185C78 183 87 184 88 178L89 202 98 187 100 220 104 187 113 203 113 178C114 184 123 184 128 186C114 172 117 152 107 145Z"/>
  <path d="M17 157 21 148 24 157 33 159 24 162 24 181H18V162L10 159Z M163 174a13 13 0 1 0 26 0a13 13 0 1 0-26 0M173 150V165H180V150Z"/>
</svg>`;

// Elegant male silhouette SVG for portrait photo
const portraitSilhouetteSvg = `
<svg class="portrait-silhouette" viewBox="0 0 132 196" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path fill="#fff" stroke="none" d="M0 177 29 167 36 141Q25 125 24 112C13 123 11 84 20 88L17 59Q13 42 31 34C39 10 72 9 91 24Q118 38 114 62L110 87C120 80 116 120 107 115Q104 131 96 140L101 167 132 179V196H0Z"/>
</svg>`;

let html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
  <meta name="theme-color" content="#000000">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Госуслуги">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="description" content="Мобильное приложение Госуслуги">
  <title>Госуслуги</title>
  <link rel="icon" type="image/png" href="icon-180.png">
  <link rel="apple-touch-icon" sizes="180x180" href="icon-180.png">
  <link rel="manifest" href="manifest.webmanifest">
  <style>
    :root {
      --bg: #000000;
      --text: #ffffff;
      --text-muted: #8c97aa;
      --blue: #008dff;
      --blue-glow: rgba(0, 141, 255, 0.4);
      --crimson: #8b1527;
      --crimson-watermark: rgba(155, 23, 48, 0.12);
      --ease-ios: cubic-bezier(0.32, 0.72, 0, 1);
      --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.25);
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0; padding: 0;
      background: #000000;
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100svh;
      overflow-x: hidden;
      user-select: none;
      -webkit-user-select: none;
    }
    button {
      font: inherit; color: inherit; background: none; border: 0;
      cursor: pointer; padding: 0; margin: 0;
      touch-action: manipulation;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    button:active { opacity: 0.75; transform: scale(0.96); }

    /* Main Phone Shell */
    #phone {
      max-width: 440px;
      min-height: 100svh;
      margin: 0 auto;
      position: relative;
      background: #000000;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 500px) {
      body {
        background: #14161b;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px 0;
      }
      #phone {
        height: 884px;
        border-radius: 48px;
        box-shadow: 0 0 0 12px #262933, 0 25px 70px rgba(0,0,0,0.85);
      }
    }

    svg {
      width: 24px; height: 24px;
      fill: none; stroke: currentColor;
      stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
    }

    /* iOS Status Bar */
    .status-bar {
      height: 48px;
      padding: 12px 22px 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.3px;
      z-index: 40;
      position: relative;
      background: transparent;
    }
    .status-bar .right {
      display: flex; gap: 6px; align-items: center; font-size: 11px;
    }
    .status-bar .battery {
      width: 22px; height: 11px;
      border: 1px solid #ffffff;
      border-radius: 3.5px;
      padding: 1px;
      position: relative;
      display: flex; align-items: center;
    }
    .status-bar .battery::after {
      content: '';
      position: absolute; right: -3px; top: 2.5px;
      width: 2px; height: 4px;
      background: #ffffff;
      border-radius: 0 1px 1px 0;
    }
    .status-bar .battery-fill {
      width: 75%; height: 100%;
      background: #ffffff;
      border-radius: 1.5px;
    }

    /* Screens Container */
    main {
      flex: 1;
      position: relative;
      overflow: hidden;
      display: flex;
    }
    .screen {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translate3d(24px, 0, 0);
      transition: opacity 0.32s var(--ease-ios), transform 0.35s var(--ease-ios), visibility 0s 0.35s;
    }
    .screen.active {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translate3d(0, 0, 0);
      transition: opacity 0.32s var(--ease-ios), transform 0.35s var(--ease-ios), visibility 0s 0s;
    }

    /* 1. Splash Screen */
    .splash-screen {
      background: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .splash-logo-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: -50px;
      animation: splashLogoEnter 0.6s var(--ease-ios) both;
    }
    @keyframes splashLogoEnter {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }
    .gosuslugi-hex-logo {
      width: 160px;
      height: 180px;
    }
    .splash-spinner {
      width: 28px;
      height: 28px;
      border: 3px solid #008dff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      position: absolute;
      bottom: 120px;
      left: calc(50% - 14px);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* 2. PIN Code Screen */
    .pin-screen {
      background: #000000;
      display: flex;
      flex-direction: column;
      padding-bottom: 90px;
    }
    .pin-profile {
      margin-top: 36px;
      text-align: center;
      animation: fadeInDown 0.4s var(--ease-ios);
    }
    .pin-avatar-circle {
      width: 48px;
      height: 48px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      margin: 0 auto;
      display: grid;
      place-items: center;
    }
    .pin-avatar-circle svg {
      width: 28px; height: 28px; stroke-width: 2;
    }
    .pin-profile h2 {
      font-size: 19px;
      font-weight: 700;
      margin: 12px 0 0;
      letter-spacing: -0.2px;
    }
    .pin-entry-box {
      margin-top: 52px;
      text-align: center;
    }
    .pin-entry-box h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 20px;
    }
    .pin-dots {
      display: flex;
      justify-content: center;
      gap: 24px;
    }
    .pin-dot {
      width: 13px;
      height: 13px;
      background: #555d70;
      border-radius: 50%;
      transition: background 0.2s ease, transform 0.22s var(--ease-spring), box-shadow 0.2s ease;
    }
    .pin-dot.on {
      background: #008dff;
      transform: scale(1.15);
      box-shadow: 0 0 10px var(--blue-glow);
    }
    .pin-hint {
      color: var(--text-muted);
      font-size: 12px;
      margin-top: 14px;
    }
    .pin-keypad {
      margin: auto 24px 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px 20px;
    }
    .pin-keypad button {
      height: 70px;
      font-size: 32px;
      font-weight: 300;
      color: #008dff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: transform 0.15s ease, background 0.15s ease;
    }
    .pin-keypad button:active {
      transform: scale(0.86);
      background: rgba(0, 141, 255, 0.12);
    }
    .pin-keypad .del-btn svg {
      width: 32px; height: 32px;
    }

    /* 3. Home Screen */
    .home-screen {
      background: linear-gradient(180deg, #04080f 0%, #03132e 45%, #000000 100%);
      padding-bottom: 130px;
    }
    .home-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px 18px;
    }
    .home-header .name-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    .home-header .name-btn svg {
      width: 22px; height: 22px;
    }
    .headtools {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .headtools button {
      position: relative;
    }
    .headtools .notif-dot::after {
      content: '';
      position: absolute;
      top: -1px; right: 0;
      width: 7px; height: 7px;
      background: #ff453a;
      border-radius: 50%;
    }
    .goskan-badge {
      font-size: 12px;
      font-weight: 700;
      border: 1.5px dashed #ffffff;
      padding: 3px 6px !important;
      border-radius: 6px;
      letter-spacing: 0.2px;
    }
    .chips-row {
      display: flex;
      gap: 8px;
      padding: 0 16px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .chips-row::-webkit-scrollbar { display: none; }
    .chips-row button {
      background: #1e232c;
      border: 1px solid #40444b;
      border-radius: 6px 20px 20px 20px;
      padding: 9px 14px;
      font-size: 13.5px;
      font-weight: 500;
      white-space: nowrap;
    }
    .stories-row {
      display: flex;
      gap: 7px;
      padding: 16px 12px 4px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x proximity;
    }
    .stories-row::-webkit-scrollbar { display: none; }
    .story-card {
      border: 2px solid #008dff;
      border-radius: 18px;
      padding: 3px;
      width: 110px;
      min-width: 110px;
      height: 112px;
      scroll-snap-align: start;
      transition: transform 0.2s var(--ease-ios);
    }
    .story-card:active { transform: scale(0.95); }
    .story-card img {
      width: 100%; height: 100%;
      border-radius: 14px;
      object-fit: cover;
      display: block;
    }
    .balance-card {
      margin: 18px 14px 22px;
      background: #263147;
      border: 1px solid #505b6d;
      border-radius: 14px;
      padding: 18px 20px;
      display: block;
      width: calc(100% - 28px);
      text-align: left;
    }
    .balance-card strong {
      display: block;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .balance-card span {
      font-size: 15px;
      color: #92a0b8;
    }
    .dashboard-panel {
      margin: 8px 10px;
      background: #28282f;
      border-radius: 15px;
      padding: 20px 18px 18px;
    }
    .dashboard-panel h2 {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 16px;
      letter-spacing: -0.3px;
    }
    .grid-items {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
    }
    .grid-item img {
      width: 55px; height: 55px;
      border-radius: 13px;
      display: block;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .home-extra-note {
      padding: 18px 24px;
      color: #8d9caf;
      font-size: 14px;
    }

    /* 4. Passport Screen */
    .document-screen {
      background: #000000;
      padding-bottom: 110px;
      transform: translate3d(100%, 0, 0);
    }
    .document-screen.active {
      transform: translate3d(0, 0, 0);
    }
    .doc-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px 18px;
    }
    .doc-topbar h2 {
      font-size: 17px;
      font-weight: 700;
      margin: 0;
    }
    .doc-topbar button {
      color: #ffffff;
      padding: 4px;
    }
    .doc-topbar button svg {
      width: 24px; height: 24px;
    }

    /* Passport Card Component */
    .passport-card {
      margin: 0 12px;
      border-radius: 18px;
      background: #fdf8f8;
      color: #1a1a1a;
      overflow: hidden;
      box-shadow: 0 12px 35px rgba(0,0,0,0.65);
      position: relative;
      animation: cardPopIn 0.4s var(--ease-ios);
    }
    @keyframes cardPopIn {
      from { opacity: 0; transform: scale(0.96) translateY(12px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .passport-header-bar {
      background: #8b1527;
      color: #ffffff;
      padding: 14px 10px;
      text-align: center;
      font-size: 15px;
      font-weight: 750;
      letter-spacing: 2px;
    }
    .passport-body {
      padding: 18px 16px 20px;
      position: relative;
      overflow: hidden;
    }
    .watermark-eagle {
      position: absolute;
      left: -20px;
      bottom: -15px;
      width: 210px;
      height: 210px;
      fill: #8b1527;
      fill-opacity: 0.12;
      pointer-events: none;
      z-index: 1;
    }
    .passport-top-row {
      display: flex;
      gap: 16px;
      position: relative;
      z-index: 2;
    }
    .passport-photo-box {
      width: 104px;
      height: 138px;
      background: #e8e0e3;
      border-radius: 14px;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(0,0,0,0.08);
    }
    .portrait-silhouette {
      width: 90px;
      height: 120px;
      display: block;
    }
    .passport-top-fields {
      flex: 1;
      min-width: 0;
    }
    .series-num-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .series-num-val {
      color: #9b1730;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .copy-icon-btn {
      color: #9b1730;
      padding: 3px;
      border-radius: 6px;
      transition: transform 0.15s ease, background 0.15s ease;
    }
    .copy-icon-btn:active {
      transform: scale(0.85);
      background: rgba(155, 23, 48, 0.15);
    }
    .copy-icon-btn svg {
      width: 19px; height: 19px;
    }
    .field-label {
      font-size: 11.5px;
      color: #5c677a;
      margin-top: 8px;
      margin-bottom: 2px;
      font-weight: 500;
    }
    .field-val {
      font-size: 13px;
      font-weight: 750;
      color: #181c24;
      line-height: 1.32;
    }
    .field-val-large {
      font-size: 15px;
    }
    .passport-cols-2 {
      display: flex;
      gap: 12px;
    }
    .passport-cols-2 > div {
      flex: 1;
    }
    .passport-bottom-fields {
      position: relative;
      z-index: 2;
      margin-top: 10px;
    }
    .passport-bottom-fields .name-val {
      font-size: 15.5px;
      font-weight: 800;
      color: #181c24;
      line-height: 1.3;
    }
    .passport-bottom-fields .birth-date-val {
      font-size: 16px;
      font-weight: 800;
      color: #181c24;
    }
    .card-internal-link {
      color: #0082f6;
      font-size: 14px;
      font-weight: 600;
      margin-top: 18px;
      display: inline-block;
      text-decoration: none;
    }
    .card-internal-link:active { opacity: 0.7; }
    .doc-bottom-actions {
      text-align: center;
      margin-top: 18px;
    }
    .details-text-btn {
      color: #0082f6;
      font-size: 14.5px;
      font-weight: 600;
    }
    .doc-disclaimer {
      color: #8c97aa;
      font-size: 12px;
      margin-top: 16px;
    }

    /* VPN Alert Banner */
    .vpn-banner {
      position: fixed;
      bottom: 46px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 16px);
      max-width: 424px;
      padding: 14px 16px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #414b60;
      color: #ffffff;
      font-size: 12px;
      line-height: 1.35;
      z-index: 50;
      box-shadow: 0 6px 20px rgba(0,0,0,0.45);
      transition: opacity 0.25s ease, transform 0.25s var(--ease-ios);
    }
    .vpn-banner.home-pos {
      bottom: 94px;
    }
    .vpn-banner.dismissed {
      opacity: 0;
      transform: translate(-50%, 16px);
      pointer-events: none;
    }
    .vpn-alert-badge {
      background: #ff453a;
      width: 20px; height: 20px;
      border-radius: 50%;
      font-size: 15px; font-weight: 800;
      display: grid; place-items: center;
      flex-shrink: 0;
    }
    .vpn-close-btn {
      color: #a4afc2;
      font-size: 24px;
      line-height: 18px;
      margin-left: auto;
      align-self: flex-start;
      padding: 0 2px;
    }

    /* Bottom Navigation Bar */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 440px;
      height: 84px;
      display: flex;
      justify-content: space-around;
      background: linear-gradient(180deg, #16171a 0%, #0a0b0d 100%);
      padding: 8px 0 24px;
      border-top: 1px solid #282a30;
      z-index: 45;
    }
    .bottom-nav button {
      font-size: 11px;
      color: #97a4b9;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      flex: 1;
      transition: color 0.2s ease, transform 0.2s ease;
    }
    .bottom-nav button.selected {
      color: #008dff;
    }
    .bottom-nav button.selected svg {
      stroke: #008dff;
    }
    .bottom-nav .assistant-tab img {
      width: 42px; height: 44px;
      margin-top: -5px;
    }

    /* iOS Home Bar Indicator */
    .home-bar {
      position: fixed;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      height: 5px;
      border-radius: 6px;
      background: #ffffff;
      z-index: 60;
      pointer-events: none;
    }

    /* Toast Notification */
    .toast-msg {
      position: fixed;
      top: 55px;
      left: 50%;
      transform: translate(-50%, -20px);
      background: rgba(30, 32, 40, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.15);
      color: #ffffff;
      padding: 11px 20px;
      border-radius: 25px;
      font-size: 13.5px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      opacity: 0;
      pointer-events: none;
      z-index: 100;
      transition: opacity 0.25s ease, transform 0.25s var(--ease-spring);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toast-msg.show {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    .toast-check {
      color: #34c759;
      font-size: 16px;
    }

    /* Bottom Sheet Modal */
    .sheet-backdrop {
      position: fixed;
      inset: 0;
      z-index: 80;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.28s ease, visibility 0s 0.28s;
    }
    .sheet-backdrop.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition: opacity 0.28s ease, visibility 0s 0s;
    }
    .sheet-card {
      background: #252732;
      width: 100%;
      max-width: 440px;
      border-radius: 24px 24px 0 0;
      padding: 12px 20px 42px;
      max-height: 82svh;
      overflow-y: auto;
      transform: translate3d(0, 100%, 0);
      transition: transform 0.35s var(--ease-ios);
    }
    .sheet-backdrop.open .sheet-card {
      transform: translate3d(0, 0, 0);
    }
    .sheet-handle {
      width: 36px; height: 4px;
      background: #5a6070;
      border-radius: 3px;
      margin: 4px auto 14px;
    }
    .sheet-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .sheet-header h3 {
      font-size: 19px;
      font-weight: 700;
      margin: 0;
    }
    .sheet-close-btn {
      font-size: 26px;
      color: #8f98ab;
      line-height: 20px;
    }
    .sheet-content p {
      font-size: 14.5px;
      line-height: 1.45;
      color: #cfd5e2;
    }
    .sheet-btn-primary {
      width: 100%;
      background: #008dff;
      color: #ffffff;
      padding: 14px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      margin-top: 14px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 11px 0;
      border-bottom: 1px solid #373b49;
      font-size: 14px;
    }
    .detail-row span:first-child { color: #8e9bb0; }
    .detail-row span:last-child { font-weight: 600; color: #ffffff; text-align: right; }
    .valid-badge {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(52, 199, 89, 0.18);
      color: #34c759;
      padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 700;
    }

    /* Mobile geometry follows the supplied screens. Fixed layers belong to the
       phone, so the preview and a real device use the same coordinates. */
    :root { --text: #dddde2; --crimson: #a71029; }
    html, body { height: 100%; min-height: 0; overflow: hidden; }
    body { font-family: -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif; }
    #phone {
      width: 100%; max-width: 480px; height: 100vh; height: 100dvh;
      min-height: 0; isolation: isolate; border-radius: 0; box-shadow: none;
    }
    main { min-height: 0; }
    .status-bar { display: none; }
    .screen { padding-top: env(safe-area-inset-top, 0px); scrollbar-width: none; overscroll-behavior-y: contain; }
    .screen::-webkit-scrollbar { display: none; }
    .screen:focus { outline: none; }
    button:focus-visible, input:focus-visible { outline: 2px solid #008dff; outline-offset: 4px; }
    .splash-logo-wrap { margin: -24px 0 0; }
    .gosuslugi-hex-logo { width: clamp(94px, 27vw, 124px); height: auto; stroke: none; }
    .splash-spinner { width: 22px; height: 22px; border-width: 2px; left: calc(50% - 11px); bottom: calc(92px + env(safe-area-inset-bottom, 0px)); }
    .pin-screen { padding-bottom: 0; overflow: hidden; }
    .pin-profile { position: absolute; top: clamp(40px, calc(15% - 54px), 90px); left: 0; right: 0; margin: 0; }
    .pin-avatar-circle { width: clamp(32px, 8.4vw, 38px); height: clamp(32px, 8.4vw, 38px); border: 0; }
    .pin-avatar-circle svg { width: 100%; height: 100%; stroke-width: 1.8; }
    .pin-profile h2 { font-size: clamp(14px, 4.2vw, 19px); margin-top: 21px; }
    .pin-entry-box { position: absolute; top: 43.8%; left: 0; right: 0; margin: 0; }
    .pin-entry-box h3 { font-size: clamp(13px, 3.55vw, 16px); margin-bottom: 20px; line-height: 20px; }
    .pin-dot { width: 12px; height: 12px; background: #535d70; }
    .pin-dot.on { transform: scale(1); box-shadow: none; }
    .pin-hint { margin: 14px 0 0; }
    .pin-keypad { position: absolute; top: 55.5%; bottom: 9.5%; left: 5%; right: 5%; margin: 0; gap: 0; grid-template-rows: repeat(4, 1fr); }
    .pin-keypad button { width: 100%; height: 100%; min-height: 44px; font-size: clamp(24px, 6.9vw, 31px); font-weight: 300; border-radius: 20px; }
    .pin-keypad button:disabled { color: #535d70; opacity: 1; cursor: default; }
    .pin-keypad .del-btn svg { width: 34px; height: 27px; }
    .home-screen { background: linear-gradient(180deg, #050910 0%, #031127 43%, #020c19 70%, #000 100%); padding-bottom: calc(158px + env(safe-area-inset-bottom, 0px)); }
    .home-header { height: 51px; padding: 0 16px 20px 6px; }
    .home-header .name-btn { gap: 8px; font-size: 18px; }
    .home-header .name-btn svg { width: 21px; height: 21px; }
    .headtools { gap: 18px; }
    .goskan-badge { font-size: 11px; padding: 4px 5px !important; border-width: 1px; border-radius: 4px; }
    .chips-row { gap: 8px; padding: 0 5px; }
    .chips-row button { height: 41px; padding: 10px 12px; font-size: 13px; }
    .stories-row { padding: 19px 0 4px; gap: 6px; }
    .story-card { width: 108px; min-width: 108px; height: 110px; padding: 3px; border-radius: 17px; }
    .story-card:first-child { margin-left: -9px; }
    .story-card img { border-radius: 13px; }
    .balance-card { margin: 19px 15px 28px 5px; width: calc(100% - 20px); min-height: 97px; padding: 21px 20px; background: #263147; border-color: #4e596b; border-radius: 13px; }
    .balance-card strong { font-size: 18px; margin-bottom: 11px; }
    .balance-card span { color: #dddde2; font-size: 14px; }
    .dashboard-panel { margin: 6px 7px 6px 0; padding: 24px 17px 19px; border-radius: 14px; background: #27272d; }
    .dashboard-panel h2 { font-size: 18px; margin-bottom: 19px; }
    .grid-items { gap: 10px; }
    .grid-item { gap: 10px; font-size: 12px; }
    .grid-item img { width: 55px; height: 55px; box-shadow: none; }
    .dashboard-panel + .dashboard-panel { padding-top: 24px; }
    .home-extra-note { padding: 20px 17px; font-size: 14px; }
    .document-screen { padding-bottom: calc(134px + env(safe-area-inset-bottom, 0px)); }
    .doc-topbar { height: 60px; padding: 0 4px 17px 0; }
    .doc-topbar h2 { font-size: 17px; }
    .doc-topbar button { color: #8e9dab; }
    .passport-card { margin: 0; background: #f5e7e8; border-radius: 17px 17px 12px 4px; box-shadow: none; }
    .passport-header-bar { height: 46px; padding: 16px 10px 12px; background: #a71029; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: 700; letter-spacing: 1.3px; }
    .passport-body { display: grid; grid-template-columns: 32% minmax(0, 1fr); gap: 0 18px; padding: 22px 13px 23px; }
    .passport-top-row { display: contents; }
    .passport-photo-box { grid-column: 1; grid-row: 1 / 3; align-self: start; width: 100%; height: auto; aspect-ratio: 132 / 196; border-radius: 13px; background: #e2dbde; box-shadow: none; }
    .portrait-silhouette { width: 100%; height: 100%; stroke: none; }
    .passport-top-fields { grid-column: 2; grid-row: 1; }
    .passport-bottom-fields { grid-column: 2; grid-row: 2; margin-top: 12px; }
    .series-num-wrap { gap: 9px; margin-bottom: 10px; white-space: nowrap; }
    .series-num-val { font-size: clamp(16px, 4.95vw, 22px); font-weight: 600; letter-spacing: 0; color: #b51530; }
    .copy-icon-btn { padding: 0; color: #b51530; }
    .copy-icon-btn svg { width: 20px; height: 20px; }
    .field-label { font-size: 12px; font-weight: 400; color: #536278; margin: 12px 0 5px; line-height: 14px; letter-spacing: .15px; }
    .passport-top-fields > .field-label { margin-top: 0; }
    .field-val, .field-val-large, .passport-bottom-fields .name-val, .passport-bottom-fields .birth-date-val { font-size: 14px; line-height: 18px; font-weight: 400; color: #28272c; letter-spacing: .15px; }
    .passport-cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .passport-cols-2 > div { min-width: 0; }
    .passport-bottom-fields > .field-label:first-child { margin-top: 0; }
    .passport-bottom-fields .passport-cols-2 { margin-top: 0 !important; }
    .passport-bottom-fields .passport-cols-2 .field-label { margin-top: 13px; white-space: nowrap; }
    .passport-bottom-fields > .field-label:last-of-type { margin-top: 13px !important; }
    .card-internal-link { font-size: 16px; margin-top: 17px; color: #008dff; }
    .watermark-eagle { left: -79px; bottom: 17px; width: 210px; height: 235px; fill-opacity: .055; stroke: none; }
    .doc-bottom-actions { margin-top: 21px; }
    .details-text-btn { font-size: 14px; font-weight: 400; }
    .doc-disclaimer { margin-top: 33px; font-size: 12px; }
    .vpn-banner { position: absolute; bottom: calc(48px + env(safe-area-inset-bottom, 0px)); width: calc(100% - 8px); max-width: none; min-height: 64px; padding: 15px 16px; gap: 9px; background: #414b60; border-radius: 12px; box-shadow: none; font-size: 12px; font-weight: 400; }
    .vpn-banner.home-pos { bottom: calc(74px + env(safe-area-inset-bottom, 0px)); }
    #phone[data-screen="pin"] .vpn-banner { bottom: calc(32px + env(safe-area-inset-bottom, 0px)); }
    .vpn-close-btn { align-self: center; min-width: 22px; height: 32px; padding: 4px; color: #929fb3; }
    .bottom-nav { position: absolute; max-width: none; height: calc(64px + env(safe-area-inset-bottom, 0px)); padding: 8px 0 calc(10px + env(safe-area-inset-bottom, 0px)); background: #101114; }
    .bottom-nav svg { width: 22px; height: 22px; }
    .bottom-nav .selected svg use { fill: #008dff; }
    .bottom-nav .assistant-tab img { height: 44px; width: 42px; margin-top: -4px; }
    .home-bar { position: absolute; width: 148px; bottom: 9px; }
    #phone[data-screen="home"] .home-bar { display: none; }
    .toast-msg { position: absolute; width: max-content; max-width: calc(100% - 32px); top: calc(30px + env(safe-area-inset-top, 0px)); }
    .sheet-backdrop { position: absolute; }
    .sheet-card { max-width: none; max-height: 85%; padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px)); }
    .detail-row { gap: 16px; }
    .detail-row span:first-child { flex-shrink: 0; }
    .detail-row span:last-child { overflow-wrap: anywhere; }
    #phone.modal-open .vpn-banner, #phone.modal-open .home-bar { opacity: 0; pointer-events: none; }
    @media (max-width: 360px) {
      .pin-profile h2 { margin-top: 14px; }
      .pin-dots { gap: 19px; }
      .pin-dot { width: 10px; height: 10px; }
      .pin-hint { font-size: 10px; }
      .home-header .name-btn { font-size: 16px; gap: 5px; }
      .headtools { gap: 12px; }
      .dashboard-panel h2 { font-size: 16px; }
      .grid-items { gap: 5px; }
      .grid-item { font-size: 10px; }
      .grid-item img { width: 48px; height: 48px; }
      .passport-body { grid-template-columns: 29% minmax(0, 1fr); gap: 0 11px; padding: 18px 10px; }
      .passport-cols-2 { gap: 9px; }
      .field-label { font-size: 10px; }
      .field-val, .field-val-large, .passport-bottom-fields .name-val, .passport-bottom-fields .birth-date-val { font-size: 12px; line-height: 16px; }
      .card-internal-link { font-size: 14px; }
      .vpn-banner { font-size: 9px; padding: 12px 6px; gap: 5px; min-height: 50px; }
      .vpn-alert-badge { width: 17px; height: 17px; font-size: 13px; }
    }
    @media (max-height: 750px) and (min-height: 561px) {
      .pin-keypad { bottom: calc(112px + env(safe-area-inset-bottom, 0px)); }
    }
    @media (max-height: 560px) {
      .pin-profile { top: 16px; }
      .pin-profile h2 { margin-top: 8px; }
      .pin-entry-box { top: 26%; }
      .pin-keypad { top: 41%; bottom: 15%; }
      .pin-hint { margin-top: 6px; }
      #phone[data-screen="pin"] .vpn-banner { bottom: 20px; min-height: 40px; padding-block: 8px; }
    }
    @media (max-height: 440px) {
      .pin-profile { top: 12%; left: 0; right: 58%; }
      .pin-entry-box { top: 48%; right: 58%; }
      .pin-entry-box h3 { margin-bottom: 12px; }
      .pin-hint { font-size: 10px; }
      .pin-keypad { top: 8%; bottom: 96px; left: 44%; right: 2%; }
      .pin-keypad button { min-height: 40px; font-size: 24px; }
    }
    @media (min-width: 600px) {
      body { display: flex; align-items: center; justify-content: center; padding: 20px 0; background: #14161b; }
      #phone { width: 440px; height: min(940px, calc(100dvh - 40px)); border-radius: 36px; box-shadow: 0 0 0 9px #262933, 0 25px 70px #0009; }
    }
    @media (display-mode: standalone) { .home-bar { display: none; } }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
    }
  </style>
</head>
<body>
  <!-- Global Symbols -->
  <svg style="display:none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <symbol id="user" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="10" r="3.4"/>
        <path d="M5 19c1-6 13-6 14 0"/>
      </symbol>
      <symbol id="back" viewBox="0 0 24 24">
        <path d="m15 4-8 8 8 8"/>
      </symbol>
      <symbol id="next" viewBox="0 0 24 24">
        <path d="m9 6 6 6-6 6"/>
      </symbol>
      <symbol id="search" viewBox="0 0 24 24">
        <circle cx="10" cy="10" r="8"/>
        <path d="m16 16 6 6"/>
      </symbol>
      <symbol id="bell" viewBox="0 0 24 24">
        <path d="M5 15c1-1 2-2 2-6a5 5 0 0 1 10 0c0 4 1 5 2 6l-1 2H6zM10 20q2 3 4 0"/>
      </symbol>
      <symbol id="home-icon" viewBox="0 0 24 24">
        <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/>
      </symbol>
      <symbol id="grid" viewBox="0 0 24 24">
        <rect x="2" y="2" width="7" height="7" rx="2"/>
        <rect x="14" y="2" width="7" height="7" rx="2"/>
        <rect x="2" y="14" width="7" height="7" rx="2"/>
        <rect x="14" y="14" width="7" height="7" rx="2"/>
      </symbol>
      <symbol id="wallet" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="17" rx="3"/>
        <path d="M22 9h-6q-4 4 0 7h6"/>
        <circle cx="17" cy="12.5" r=".5"/>
      </symbol>
      <symbol id="file" viewBox="0 0 24 24">
        <path d="M5 2h9l6 6v13H5zM14 2v7h6M9 13h6M9 17h6"/>
      </symbol>
      <symbol id="share" viewBox="0 0 24 24">
        <path d="M8 8H5v14h14V8h-3M12 15V2m-4 4 4-4 4 4"/>
      </symbol>
      <symbol id="copy" viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </symbol>
    </defs>
  </svg>

  <div id="phone" data-screen="splash">
    <!-- Main Screens View -->
    <main>
      <!-- Screen 1: Splash -->
      <section id="splash" class="screen splash-screen active" onclick="skipSplash()">
        <div class="splash-logo-wrap">
          <svg class="gosuslugi-hex-logo" viewBox="0 0 128 140" xmlns="http://www.w3.org/2000/svg" aria-label="Госуслуги">
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#008dff"/>
                <stop offset=".44" stop-color="#0078b8"/>
                <stop offset=".7" stop-color="#b7173d"/>
                <stop offset="1" stop-color="#bd173b"/>
              </linearGradient>
            </defs>
            <path d="M15 34C24 24 40 15 53 9Q66 2 80 10L101 23Q121 35 121 55V83Q121 102 104 112L80 126Q66 134 52 128L28 115Q20 110 15 104" fill="none" stroke="url(#logoGradient)" stroke-width="8" stroke-linecap="butt" stroke-linejoin="round"/>
            <text x="7" y="62" fill="#007dbb" font-size="30" font-weight="750" font-family="Arial, sans-serif" stroke="none">гос</text>
            <text x="7" y="88" fill="#bd173b" font-size="30" font-weight="750" font-family="Arial, sans-serif" stroke="none" letter-spacing="-1">услуги</text>
          </svg>
        </div>
        <div class="splash-spinner"></div>
      </section>

      <!-- Screen 2: PIN Code -->
      <section id="pin" class="screen pin-screen">
        <div class="pin-profile">
          <div class="pin-avatar-circle">
            <svg><use href="#user"/></svg>
          </div>
          <h2>Димитрий</h2>
        </div>
        <div class="pin-controls">
        <div class="pin-entry-box">
          <h3>Код доступа</h3>
          <div class="pin-dots">
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
            <span class="pin-dot"></span>
          </div>
          <p class="pin-hint">Введите пароль</p>
        </div>
        <div class="pin-keypad" id="keypad"></div>
        </div>
      </section>

      <!-- Screen 3: Home Dashboard -->
      <section id="home" class="screen home-screen">
        <header class="home-header">
          <button class="name-btn" onclick="showProfile()">
            <svg><use href="#user"/></svg>
            <span>Димитрий</span>
            <svg style="width:16px;height:16px"><use href="#next"/></svg>
          </button>
          <div class="headtools">
            <button aria-label="Поиск" onclick="searchServices()">
              <svg><use href="#search"/></svg>
            </button>
            <button class="notif-dot" aria-label="Уведомления" onclick="openNotifications()">
              <svg><use href="#bell"/></svg>
            </button>
            <button class="goskan-badge" onclick="modal('Госкан', '<p>Сканирование документов временно недоступно.</p>')">
              госкан
            </button>
          </div>
        </header>

        <!-- Chips -->
        <div class="chips-row">
          <button onclick="service('Поступление в колледж')">Поступление в колледж</button>
          <button onclick="service('Запись к врачу')">Запись к врачу</button>
          <button onclick="service('Субсидии')">Субсидии</button>
        </div>

        <!-- Stories Carousel -->
        <div class="stories-row">
          <button class="story-card" onclick="service('Доступ к важным сайтам')">
            <img src="${images.story1}" alt="Доступ к важным сайтам">
          </button>
          <button class="story-card" onclick="service('Защита близких от взлома')">
            <img src="${images.story2}" alt="Защита близких от взлома">
          </button>
          <button class="story-card" onclick="service('Налоговый вычет')">
            <img src="${images.story3}" alt="Оформите налоговый вычет">
          </button>
          <button class="story-card" onclick="service('Аренда')">
            <img src="${images.story4}" alt="Аренда">
          </button>
        </div>

        <!-- Balance Card -->
        <button class="balance-card" onclick="modal('Начисления', '<p>Нет начислений</p><p>Уточните данные для поиска начислений.</p>')">
          <strong>Нет начислений</strong>
          <span>уточните данные</span>
        </button>

        <!-- Documents Section -->
        <section class="dashboard-panel">
          <h2>Документы для предъявления</h2>
          <div class="grid-items">
            <button class="grid-item" onclick="openPassport()">
              <img src="${images.docPassport}" alt="">
              <span>Паспорт</span>
            </button>
            <button class="grid-item" onclick="service('СНИЛС')">
              <img src="${images.docSnils}" alt="">
              <span>СНИЛС</span>
            </button>
            <button class="grid-item" onclick="service('ИНН')">
              <img src="${images.docInn}" alt="">
              <span>ИНН</span>
            </button>
            <button class="grid-item" onclick="documents()">
              <img src="${images.docAll}" alt="">
              <span>Все</span>
            </button>
          </div>
        </section>

        <!-- Services Section -->
        <section class="dashboard-panel">
          <h2>Сервисы и приложения</h2>
          <div class="grid-items">
            <button class="grid-item" onclick="service('Здоровье')">
              <img src="${images.servHealth}" alt="">
              <span>Здоровье</span>
            </button>
            <button class="grid-item" onclick="service('Авто')">
              <img src="${images.servAuto}" alt="">
              <span>Авто</span>
            </button>
            <button class="grid-item" onclick="service('Моя школа')">
              <img src="${images.servSchool}" alt="">
              <span>Моя школа</span>
            </button>
            <button class="grid-item" onclick="services()">
              <img src="${images.servOther}" alt="">
              <span>Другие</span>
            </button>
          </div>
        </section>

        <div class="home-extra-note">Уведомления и статусы заявлений теперь в колокольчике сверху</div>
      </section>

      <!-- Screen 4: Passport Screen -->
      <section id="document" class="screen document-screen">
        <header class="doc-topbar">
          <button aria-label="Назад" onclick="closePassport()">
            <svg><use href="#back"/></svg>
          </button>
          <h2>Паспорт РФ</h2>
          <button aria-label="Поделиться" onclick="shareDocument()">
            <svg><use href="#share"/></svg>
          </button>
        </header>

        <!-- Reference passport mockup -->
        <article class="passport-card">
          <div class="passport-header-bar">РОССИЙСКАЯ ФЕДЕРАЦИЯ</div>
          <div class="passport-body">
            ${eagleWatermarkSvg}

            <!-- Top Row: Photo + First Block -->
            <div class="passport-top-row">
              <div class="passport-photo-box">
                ${portraitSilhouetteSvg}
              </div>

              <div class="passport-top-fields">
                <div class="series-num-wrap">
                  <span class="series-num-val" id="docSeriesNum">6523 854155</span>
                  <button class="copy-icon-btn" aria-label="Скопировать номер" onclick="copyDocNumber('6523 854155')">
                    <svg><use href="#copy"/></svg>
                  </button>
                </div>

                <div class="field-label">Кем выдан</div>
                <div class="field-val">ГУ МВД РОССИИ ПО СВЕРДЛОВСКОЙ ОБЛАСТИ</div>

                <div class="passport-cols-2" style="margin-top:4px;">
                  <div>
                    <div class="field-label">Дата выдачи</div>
                    <div class="field-val field-val-large">20.10.2023</div>
                  </div>
                  <div>
                    <div class="field-label">Код<br>подразделения</div>
                    <div class="field-val field-val-large">660-047</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Block: Full Name, Gender, Birth, Birthplace -->
            <div class="passport-bottom-fields">
              <div class="field-label">ФИО</div>
              <div class="name-val">ТИМОФЕЕВ ДИМИТРИЙ АЛЕКСАНДРОВИЧ</div>

              <div class="passport-cols-2" style="margin-top:6px;">
                <div>
                  <div class="field-label">Пол</div>
                  <div class="field-val field-val-large">МУЖСКОЙ</div>
                </div>
                <div>
                  <div class="field-label">Дата рождения</div>
                  <div class="birth-date-val">02.10.2008</div>
                </div>
              </div>

              <div class="field-label" style="margin-top:8px;">Место рождения</div>
              <div class="field-val field-val-large">СВЕРДЛОВСКАЯ ОБЛ, Г ПЕРВОУРАЛЬСК</div>

              <button class="card-internal-link" onclick="openPassportDetails()">детали документа</button>
            </div>
          </div>
        </article>

      </section>
    </main>

    <div id="faceIdOverlay" class="face-id-overlay" role="dialog" aria-label="Имитация Face ID" aria-modal="true" aria-hidden="true" inert>
      <div class="face-id-card"><svg viewBox="0 0 64 64" aria-hidden="true"><g class="face-id-face">${faceIdGlyph}</g><path class="face-id-check" d="m16 33 10 10 22-24"/></svg><strong>Face ID</strong><span class="face-id-caption" role="status">Сканирование…</span></div>
      <button class="face-id-code" onclick="closeFaceIdPreview()">Ввести код</button>
    </div>

    <div class="screen-footer document-footer">
      <button class="footer-primary" onclick="openMaxInstall()"><svg aria-hidden="true"><use href="#icon-face"/></svg>Предъявить в MAX</button>
    </div>
    <div class="screen-footer max-footer">
      <a class="footer-primary" href="https://download.max.ru/" target="_blank" rel="noopener noreferrer">Установить</a>
    </div>

    <!-- VPN Warning Alert Banner -->
    <div id="vpn" class="vpn-banner">
      <span class="vpn-alert-badge">!</span>
      <span>Возможно, у вас подключён VPN. Отключите его, если возникают проблемы при работе приложения</span>
      <button class="vpn-close-btn" aria-label="Закрыть" onclick="dismissWarning()">×</button>
    </div>

    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav" id="nav" style="display:none">
      <button class="selected" id="navHomeBtn" onclick="openTab('home')">
        <svg><use href="#home-icon"/></svg>
        <span>главная</span>
      </button>
      <button id="navServicesBtn" onclick="services()">
        <svg><use href="#grid"/></svg>
        <span>услуги</span>
      </button>
      <button class="assistant-tab" aria-label="Помощник" onclick="openAssistant()">
        <img src="${images.assistant}" alt="Помощник">
      </button>
      <button id="navPaymentsBtn" onclick="payments()">
        <svg><use href="#wallet"/></svg>
        <span>платежи</span>
      </button>
      <button id="navDocBtn" onclick="documents()">
        <svg><use href="#file"/></svg>
        <span>документы</span>
      </button>
    </nav>

    <!-- Toast Notification -->
    <div id="toast" class="toast-msg" role="status" aria-live="polite">
      <span class="toast-check">✓</span>
      <span id="toastText">Скопировано</span>
    </div>

    <!-- Interactive Bottom Sheet Modal -->
    <div id="sheet" class="sheet-backdrop" aria-hidden="true" inert onclick="if(event.target===this)closeModal()">
      <div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="sheettitle">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <h3 id="sheettitle">Заголовок</h3>
          <button class="sheet-close-btn" aria-label="Закрыть" onclick="closeModal()">×</button>
        </div>
        <div id="sheetbody" class="sheet-content"></div>
      </div>
    </div>

    <!-- iOS Home Bar Indicator -->
    <div class="home-bar"></div>
  </div>

  <script>
    let currentScreen = 'splash';
    let pinCount = 0;
    let lastFocusElement = null;
    let toastTimer = null;
    let splashTimer = null;
    let pinCompleteTimer = null;
    let pinUnlocking = false;

    const names = ['Поступление в колледж', 'Запись к врачу', 'Субсидии', 'Здоровье', 'Авто', 'Моя школа'];
    const $ = id => document.getElementById(id);

    // Navigation with smooth transitions
    function navigate(id, push = false, direction = 'forward') {
      if (!$(id)?.classList.contains('screen')) return;
      const previous = currentScreen;
      window.closeFaceIdPreview?.();
      closeModal();
      clearTimeout(splashTimer);
      clearTimeout(pinCompleteTimer);
      if (id === 'pin') resetPin();
      currentScreen = id;
      $('phone').dataset.screen = id;
      document.querySelectorAll('.screen').forEach(el => {
        const active = el.id === id;
        el.classList.toggle('active', active);
        el.setAttribute('aria-hidden', String(!active));
        el.inert = !active;
      });

      const tabs = { home: 'navHomeBtn', servicesScreen: 'navServicesBtn', paymentsScreen: 'navPaymentsBtn', documentsScreen: 'navDocBtn' };
      const showNav = id in tabs;

      // Update bottom nav
      $('nav').style.display = showNav ? 'flex' : 'none';
      $('nav').inert = !showNav;
      $('vpn').inert = !['splash', 'pin'].includes(id) || $('vpn').classList.contains('dismissed');
      $('phone').classList.toggle('app-unlocked', !['splash', 'pin'].includes(id));
      $('phone').classList.toggle('has-navigation', showNav);
      if (push && previous !== id) history.pushState({ screen: id }, '');
      if (id === 'home' && !history.state?.screen) history.replaceState({ screen: 'home' }, '');

      Object.values(tabs).forEach(buttonId => {
        const selected = tabs[id] === buttonId;
        $(buttonId).classList.toggle('selected', selected);
        if (selected) $(buttonId).setAttribute('aria-current', 'page');
        else $(buttonId).removeAttribute('aria-current');
      });

      $(id).setAttribute('tabindex', '-1');
      $(id).focus({ preventScroll: true });
      window.updateScreenChrome?.(id);
      window.animateScreenChange?.(previous, id, direction);
    }

    function openPassport() {
      if (currentScreen === 'document') return;
      window.passportReturnScreen = currentScreen;
      $('document').scrollTop = 0;
      navigate('document', true);
    }

    function closePassport() {
      if (history.state?.screen === 'document') history.back();
      else navigate(window.passportReturnScreen || 'home', false, 'back');
    }

    window.addEventListener('popstate', event => {
      const target = event.state?.screen;
      if (target && $(target)?.classList.contains('screen')) navigate(target, false, 'back');
      else if (!['splash', 'pin'].includes(currentScreen)) navigate('home', false, 'back');
    });

    // Skip Splash screen
    function skipSplash() {
      if (currentScreen !== 'splash') return;
      navigate('pin');
      window.previewFaceId?.();
    }

    function resetPin() {
      clearTimeout(pinCompleteTimer);
      pinCount = 0;
      pinUnlocking = false;
      document.querySelectorAll('.pin-dot').forEach(d => d.classList.remove('on'));
      document.querySelectorAll('#keypad button').forEach(b => b.disabled = false);
    }

    function replaySplash() {
      resetPin();
      navigate('splash');
      splashTimer = setTimeout(skipSplash, 1800);
    }

    // PIN code handling
    function inputKey(key) {
      if (currentScreen !== 'pin' || pinUnlocking || $('faceIdOverlay').classList.contains('open')) return;

      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(15);

      if (key === 'delete') {
        pinCount = Math.max(0, pinCount - 1);
      } else {
        if (pinCount < 4) pinCount++;
      }

      document.querySelectorAll('.pin-dot').forEach((el, i) => {
        el.classList.toggle('on', i < pinCount);
      });

      if (pinCount === 4) {
        pinUnlocking = true;
        document.querySelectorAll('#keypad button').forEach(b => b.disabled = true);
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
        pinCompleteTimer = setTimeout(() => {
          resetPin();
          navigate('home');
        }, 300);
      }
    }

    // Keypad generation
    $('keypad').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map(k => {
      if (k === '') return '<button class="face-id-key" aria-label="Face ID" onclick="previewFaceId()"><svg viewBox="0 0 64 64" aria-hidden="true">${faceIdGlyph}</svg></button>';
      if (k === 'delete') {
        return \`<button class="del-btn" aria-label="Удалить" onclick="inputKey('delete')"><svg viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg></button>\`;
      }
      return \`<button onclick="inputKey('\${k}')">\${k}</button>\`;
    }).join('');

    // Toast notification
    function showToast(text) {
      const toast = $('toast');
      $('toastText').textContent = text;
      toast.classList.add('show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2200);
    }

    // Copy document series and number
    async function copyText(text) {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        const input = document.createElement('textarea');
        input.value = text;
        input.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        return copied;
      }
    }

    async function copyDocNumber(num) {
      if (navigator.vibrate) navigator.vibrate(20);
      showToast(await copyText(num) ? 'Серия и номер скопированы' : 'Не удалось скопировать номер');
    }

    // Copy full passport data
    async function copyAllPassportData() {
      const text = \`Паспорт РФ
Серия и номер: 6523 854155
Кем выдан: ГУ МВД РОССИИ ПО СВЕРДЛОВСКОЙ ОБЛАСТИ
Дата выдачи: 20.10.2023
Код подразделения: 660-047
ФИО: ТИМОФЕЕВ ДИМИТРИЙ АЛЕКСАНДРОВИЧ
Пол: МУЖСКОЙ
Дата рождения: 02.10.2008
Место рождения: СВЕРДЛОВСКАЯ ОБЛ, Г ПЕРВОУРАЛЬСК\`;
      showToast(await copyText(text) ? 'Данные скопированы' : 'Не удалось скопировать данные');
      closeModal();
    }

    function shareDocument() {
      if (navigator.share) {
        navigator.share({
          title: 'Паспорт РФ',
          text: 'ТИМОФЕЕВ ДИМИТРИЙ АЛЕКСАНДРОВИЧ, Дата рождения: 02.10.2008, Паспорт: 6523 854155'
        }).catch(() => {});
      } else {
        copyAllPassportData();
      }
    }

    // Passport Details Sheet
    function openPassportDetails() {
      const body = \`
        <div style="margin-bottom:14px;">
          <span class="valid-badge">● Подтверждено</span>
        </div>
        <div class="detail-row"><span>Документ</span><span>Паспорт РФ</span></div>
        <div class="detail-row"><span>Серия и номер</span><span>6523 854155</span></div>
        <div class="detail-row"><span>ФИО</span><span>ТИМОФЕЕВ ДИМИТРИЙ АЛЕКСАНДРОВИЧ</span></div>
        <div class="detail-row"><span>Пол</span><span>МУЖСКОЙ</span></div>
        <div class="detail-row"><span>Дата рождения</span><span>02.10.2008</span></div>
        <div class="detail-row"><span>Место рождения</span><span>СВЕРДЛОВСКАЯ ОБЛ, Г ПЕРВОУРАЛЬСК</span></div>
        <div class="detail-row"><span>Дата выдачи</span><span>20.10.2023</span></div>
        <div class="detail-row"><span>Код подразделения</span><span>660-047</span></div>
        <div class="detail-row"><span>Кем выдан</span><span>ГУ МВД РОССИИ ПО СВЕРДЛОВСКОЙ ОБЛАСТИ</span></div>
        <button class="sheet-btn-primary" onclick="copyAllPassportData()">Скопировать все данные</button>
      \`;
      modal('Детали документа', body);
    }

    // Dismiss VPN banner
    function dismissWarning() {
      $('vpn').classList.add('dismissed');
      $('phone').classList.add('warning-dismissed');
      setTimeout(() => {
        $('vpn').style.display = 'none';
      }, 260);
    }

    // Modal Sheet handling
    function modal(title, body) {
      if (!$('sheet').classList.contains('open')) lastFocusElement = document.activeElement;
      $('sheettitle').textContent = title;
      $('sheetbody').innerHTML = body;
      $('sheet').inert = false;
      $('sheet').setAttribute('aria-hidden', 'false');
      $('sheet').classList.add('open');
      $('phone').classList.add('modal-open');
      document.querySelector('main').inert = true;
      $('nav').inert = true;
      $('vpn').inert = true;
      $('sheet').querySelector('.sheet-close-btn').focus({ preventScroll: true });
    }

    function closeModal() {
      if (!$('sheet').classList.contains('open')) return;
      $('sheet').classList.remove('open');
      $('sheet').inert = true;
      $('sheet').setAttribute('aria-hidden', 'true');
      $('phone').classList.remove('modal-open');
      document.querySelector('main').inert = false;
      $('nav').inert = !['home', 'servicesScreen', 'paymentsScreen', 'documentsScreen'].includes(currentScreen);
      $('vpn').inert = !['pin', 'splash'].includes(currentScreen) || $('vpn').classList.contains('dismissed');
      if (lastFocusElement) {
        lastFocusElement.focus();
        lastFocusElement = null;
      }
    }

    // Services modals
    function service(name) {
      modal(name, '<p>Подача заявлений и получение данных пока недоступны.</p>');
    }

    function documents() {
      modal('Документы', \`
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="sheet-btn-primary" onclick="openPassport()">Паспорт РФ</button>
          <button class="sheet-btn-primary" style="background:#323644" onclick="service('СНИЛС')">СНИЛС</button>
          <button class="sheet-btn-primary" style="background:#323644" onclick="service('ИНН')">ИНН</button>
        </div>
      \`);
    }

    function services() {
      modal('Услуги', \`
        <div style="display:flex;flex-direction:column;gap:6px;">
          \${names.map(n => \`<button class="sheet-btn-primary" style="background:#323644" onclick="service('\${n}')">\${n}</button>\`).join('')}
        </div>
      \`);
    }

    function openAssistant() {
      modal('Робот Макс', \`
        <p>Здравствуйте, Димитрий! Я цифровой помощник Госуслуг. Чем могу помочь?</p>
        <button class="sheet-btn-primary" onclick="openPassport()">Показать Паспорт РФ</button>
        <button class="sheet-btn-primary" style="background:#323644" onclick="service('Справки и выписки')">Справки и выписки</button>
        <button class="sheet-btn-primary" style="background:#323644" onclick="service('Штрафы и налоги')">Штрафы и налоги</button>
      \`);
    }

    function showProfile() {
      modal('Димитрий', \`
        <div style="text-align:center;margin-bottom:14px;">
          <div class="pin-avatar-circle" style="margin-bottom:8px;"><svg><use href="#user"/></svg></div>
          <strong style="font-size:17px;">Тимофеев Димитрий Александрович</strong>
          <p style="color:#8c97aa;margin:4px 0 0;font-size:13px;">Дата рождения: 02.10.2008</p>
        </div>
        <button class="sheet-btn-primary" onclick="navigate('pin')">Экран ввода кода</button>
        <button class="sheet-btn-primary" style="background:#323644" onclick="replaySplash()">Экран загрузки</button>
      \`);
    }

    function searchServices() {
      modal('Поиск', \`
        <input id="searchInput" aria-label="Поиск услуг" placeholder="Поиск услуг..." style="width:100%;padding:14px;background:#151821;border:1px solid #4a5468;border-radius:12px;color:white;font:inherit;font-size:16px;">
        <div id="results" style="margin-top:12px;display:flex;flex-direction:column;gap:6px;"></div>
      \`);
      const render = q => {
        const res = $('results');
        const filtered = names.filter(n => n.toLowerCase().includes(q.toLowerCase()));
        res.innerHTML = filtered.map(n => \`<button class="sheet-btn-primary" style="background:#323644" onclick="service('\${n}')">\${n}</button>\`).join('') || '<p style="color:#8c97aa;text-align:center;margin-top:12px;">Ничего не найдено</p>';
      };
      render('');
      $('searchInput').addEventListener('input', e => render(e.target.value));
      setTimeout(() => $('searchInput')?.focus(), 100);
    }

    // Keyboard support
    document.addEventListener('keydown', e => {
      if ($('sheet').classList.contains('open')) {
        if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
        if (e.key === 'Tab') {
          const items = [...$('sheet').querySelectorAll('button, input, a[href]')].filter(el => !el.disabled);
          const first = items[0], last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
        return;
      }
      if (e.key === 'Escape' && currentScreen === 'document') closePassport();
      if (currentScreen === 'pin') {
        if (/^\\d$/.test(e.key)) { e.preventDefault(); inputKey(e.key); }
        if (e.key === 'Backspace') { e.preventDefault(); inputKey('delete'); }
      }
    });

    // An edge swipe returns from the document on touch devices.
    let swipeStart = null;
    $('document').addEventListener('pointerdown', e => {
      const edge = e.clientX - $('phone').getBoundingClientRect().left;
      if (currentScreen === 'document' && edge < 28 && !$('sheet').classList.contains('open')) swipeStart = { x: e.clientX, y: e.clientY };
    });
    $('document').addEventListener('pointerup', e => {
      if (!swipeStart) return;
      const dx = e.clientX - swipeStart.x, dy = e.clientY - swipeStart.y;
      swipeStart = null;
      if (dx > 90 && dx > Math.abs(dy) * 1.3) closePassport();
    });
    $('document').addEventListener('pointercancel', () => swipeStart = null);

    // Auto-advance from splash
    document.querySelectorAll('.screen').forEach(el => {
      el.inert = el.id !== 'splash';
      el.setAttribute('aria-hidden', String(el.id !== 'splash'));
    });
    splashTimer = setTimeout(skipSplash, 1800);
  </script>
</body>
</html>
`;

const referenceAssets = JSON.parse(fs.readFileSync('reference-assets.json', 'utf8'));
const assets = { ...images, ...referenceAssets };
const additionalScreens = fs.readFileSync('screens.html', 'utf8').replace(/\{\{asset\.([a-zA-Z0-9]+)\}\}/g, (_, key) => {
  if (!assets[key]) throw new Error('Missing asset: ' + key);
  return assets[key];
});
html = html.replace('</style>', fs.readFileSync('mobile-ui.css', 'utf8') + '\n  </style>');
html = html.replace('    <!-- Main Screens View -->', fs.readFileSync('status-bar.html', 'utf8') + '\n    <!-- Main Screens View -->');
html = html.replace('    </main>', additionalScreens + '\n    </main>');
const storyAssets = Object.fromEntries(Object.entries(referenceAssets).filter(([key]) => key.startsWith('story')));
const menuAssets = Object.fromEntries(Object.entries(referenceAssets).filter(([key]) => key.startsWith('menu')));
const appScript = fs.readFileSync('mobile-app.js', 'utf8')
  .replace('REFERENCE_STORY_ASSETS', JSON.stringify(storyAssets))
  .replace('REFERENCE_MENU_ICONS', JSON.stringify(menuAssets));
html = html.replace('  </script>', appScript + '\n  </script>');
const revision = require('node:crypto').createHash('sha256').update(html).digest('hex').slice(0, 12);
html = html.replace('</head>', '<meta name="app-revision" content="' + revision + '">\n</head>');
fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('app-version.json', JSON.stringify({ revision }) + '\n', 'utf8');
console.log('Successfully generated updated index.html! File size:', html.length);
