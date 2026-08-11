import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

const BACKEND = 'http://localhost:5000';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap');

  :root {
    --g950:#051809;--g900:#0a2912;--g800:#12451f;--g700:#1b632e;
    --g600:#268740;--g500:#2eb050;--g400:#54d274;--g300:#88e39f;
    --g200:#beedd0;--g100:#e3f8eb;--g50:#f4fbf6;
    --gold:#d99b26;--gold2:#f3c766;
    --cream:#f8f6f0;--cream2:#ede8dc;--cream3:#ded6c3;
    --white:#ffffff;--text:#0b2110;--text2:#214228;--text3:#4d6e55;
    --sh-sm:0 4px 20px rgba(5,24,9,.06);
    --sh-md:0 14px 40px rgba(5,24,9,.10);
    --sh-lg:0 24px 60px rgba(5,24,9,.15);
    --r-xl:28px;--r-lg:20px;--r-md:14px;--r-sm:10px;
  }

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--cream);color:var(--text);overflow-x:hidden}

  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(46,176,80,.5)}50%{box-shadow:0 0 0 12px rgba(46,176,80,0)}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes spin{to{transform:rotate(360deg)}}

  .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
  .reveal.on{opacity:1;transform:translateY(0)}
  .reveal-r{opacity:0;transform:translateX(24px);transition:opacity .7s ease,transform .7s ease}
  .reveal-r.on{opacity:1;transform:translateX(0)}
  .reveal-l{opacity:0;transform:translateX(-24px);transition:opacity .7s ease,transform .7s ease}
  .reveal-l.on{opacity:1;transform:translateX(0)}

  /* ══ NAVBAR ══ */
  .navbar{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all .35s ease}
  .navbar.solid{background:rgba(248,246,240,.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(46,176,80,.12);box-shadow:0 4px 24px rgba(5,24,9,.05)}
  .nav-inner{max-width:1280px;margin:0 auto;padding:0 32px;height:80px;display:flex;align-items:center;justify-content:space-between;gap:20px}
  .nav-brand{display:flex;align-items:center;gap:12px;text-decoration:none;flex-shrink:0}
  .nav-brand-logo{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,var(--g400),var(--g700));display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 6px 18px rgba(27,99,46,.3);transition:transform .35s ease}
  .nav-brand:hover .nav-brand-logo{transform:rotate(-8deg) scale(1.08)}
  .nav-brand-text{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:800;color:var(--g950);letter-spacing:-.5px}
  .nav-brand-text em{font-style:normal;color:var(--g600)}
  .nav-menu{display:flex;align-items:center;gap:4px;list-style:none}
  .nav-menu li a{display:block;padding:8px 18px;border-radius:999px;font-size:.92rem;font-weight:600;color:var(--text2);text-decoration:none;transition:all .22s ease}
  .nav-menu li a:hover,.nav-menu li a.active{background:var(--g100);color:var(--g700)}
  .nav-btns{display:flex;align-items:center;gap:12px;flex-shrink:0}
  .nav-login{padding:10px 22px;border-radius:999px;font-size:.9rem;font-weight:700;color:var(--white);background:linear-gradient(135deg,var(--g500),var(--g700));border:1.5px solid var(--g600);text-decoration:none;box-shadow:0 6px 18px rgba(27,99,46,.22);transition:all .25s ease}
  .nav-login:hover{background:linear-gradient(135deg,var(--g600),var(--g800));transform:translateY(-1px);box-shadow:0 8px 22px rgba(27,99,46,.28)}
  .nav-cta{padding:11px 26px;border-radius:999px;font-size:.9rem;font-weight:700;color:var(--white);background:linear-gradient(135deg,var(--g600),var(--g800));text-decoration:none;box-shadow:0 6px 20px rgba(27,99,46,.3);transition:all .25s ease}
  .nav-cta:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(27,99,46,.4)}

  /* ══ HERO ══ */
  .hero{min-height:100vh;display:flex;align-items:center;padding:110px 32px 80px;position:relative;overflow:hidden;background:radial-gradient(circle at 80% 20%,#e8f7ec 0%,var(--cream) 60%)}
  .hero-grid{max-width:1280px;margin:0 auto;position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(46,176,80,.12);border:1px solid rgba(46,176,80,.25);color:var(--g700);font-size:.78rem;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:8px 18px;border-radius:999px;margin-bottom:24px;animation:fadeIn .5s ease both}
  .ew-dot{width:8px;height:8px;border-radius:50%;background:var(--g500);animation:pulse 2.2s infinite}
  .hero-h1{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,4.8vw,5.2rem);line-height:1.05;letter-spacing:-1.5px;color:var(--g950);margin-bottom:22px;animation:fadeUp .8s ease .1s both}
  .h1-accent{color:var(--g600);position:relative;display:inline-block;font-style:italic}
  .h1-accent::after{content:'';position:absolute;bottom:2px;left:0;right:0;height:5px;background:linear-gradient(90deg,var(--g400),var(--gold2));border-radius:4px}
  .hero-p{font-size:1.1rem;line-height:1.8;color:var(--text3);max-width:520px;margin-bottom:36px;animation:fadeUp .8s ease .2s both}
  .hero-btns{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:46px;animation:fadeUp .8s ease .3s both}
  .btn-main{display:inline-flex;align-items:center;gap:10px;padding:16px 36px;border-radius:var(--r-md);font-size:.98rem;font-weight:700;color:var(--white);background:linear-gradient(135deg,var(--g600),var(--g800));text-decoration:none;border:none;cursor:pointer;box-shadow:0 10px 30px rgba(27,99,46,.35);transition:all .3s ease;font-family:inherit}
  .btn-main:hover{transform:translateY(-3px);box-shadow:0 16px 38px rgba(27,99,46,.45)}
  .btn-sub{display:inline-flex;align-items:center;gap:10px;padding:16px 28px;border-radius:var(--r-md);font-size:.98rem;font-weight:600;color:var(--text2);background:var(--white);text-decoration:none;border:1.5px solid var(--cream3);cursor:pointer;transition:all .3s ease;font-family:inherit}
  .btn-sub:hover{border-color:var(--g400);color:var(--g700);transform:translateY(-2px)}
  .hero-stats{display:flex;gap:28px;animation:fadeUp .8s ease .4s both}
  .hs-n{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:800;color:var(--g700);line-height:1}
  .hs-l{font-size:.8rem;color:var(--text3);font-weight:600;margin-top:4px}
  .hs-div{width:1px;background:var(--cream3);align-self:center;height:38px}
  .hero-vis{position:relative;animation:fadeIn .9s ease .2s both}
  .hero-img-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .hero-img-item{border-radius:var(--r-lg);overflow:hidden;position:relative;box-shadow:var(--sh-md)}
  .hero-img-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
  .hero-img-item:hover img{transform:scale(1.08)}
  .hero-img-item.tall{grid-row:span 2;height:360px}
  .hero-img-item:not(.tall){height:172px}
  .hero-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,24,9,.6) 0%,transparent 60%)}
  .hero-img-label{position:absolute;bottom:12px;left:12px;font-size:.75rem;font-weight:700;color:var(--white);background:rgba(5,24,9,.55);backdrop-filter:blur(8px);padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.15)}
  .hero-scan-badge{position:absolute;top:-16px;left:-20px;z-index:2;background:var(--white);border-radius:var(--r-md);box-shadow:var(--sh-lg);padding:12px 18px;display:flex;align-items:center;gap:12px;border:1px solid rgba(46,176,80,.15);animation:float 6s ease-in-out infinite}
  .hero-result-badge{position:absolute;bottom:-16px;right:-16px;z-index:2;background:var(--white);border-radius:var(--r-md);box-shadow:var(--sh-lg);padding:12px 18px;display:flex;align-items:center;gap:12px;border:1px solid rgba(46,176,80,.15);animation:float 6s ease-in-out infinite;animation-delay:-3s}
  .badge-icon{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
  .badge-title{font-size:.78rem;font-weight:700;color:var(--text)}
  .badge-sub{font-size:.7rem;color:var(--text3);margin-top:1px}

  /* ══ MARQUEE ══ */
  .mq-bar{overflow:hidden;background:var(--g950);padding:18px 0}
  .mq-track{display:flex;animation:marquee 30s linear infinite;width:max-content}
  .mq-it{display:inline-flex;align-items:center;gap:12px;padding:0 28px;font-size:.85rem;font-weight:600;color:rgba(255,255,255,.75);white-space:nowrap}
  .mq-dot{width:6px;height:6px;border-radius:50%;background:var(--g400);flex-shrink:0}

  /* ══ LAYOUT ══ */
  .wrap{max-width:1280px;margin:0 auto}
  .pad{padding:110px 32px}
  .pad-alt{padding:110px 32px;background:var(--white)}
  .section-center{text-align:center;max-width:640px;margin:0 auto 60px}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.78rem;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:var(--g600);margin-bottom:12px}
  .eyebrow::before{content:'';width:24px;height:2px;background:var(--g500);border-radius:2px}
  .sec-h{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,3.5vw,3.6rem);line-height:1.1;letter-spacing:-1px;color:var(--g950);margin-bottom:16px}
  .sec-h span{color:var(--g600);font-style:italic}
  .sec-p{font-size:1.05rem;line-height:1.8;color:var(--text3)}

  /* ══ ABOUT ══ */
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:68px;align-items:center}
  .about-photo-collage{position:relative}
  .about-photos{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .ap-item{border-radius:var(--r-lg);overflow:hidden;position:relative;box-shadow:var(--sh-md)}
  .ap-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
  .ap-item:hover img{transform:scale(1.08)}
  .ap-item.tall{grid-row:span 2;height:320px}
  .ap-item:not(.tall){height:152px}
  .ap-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,24,9,.4) 0%,transparent 60%)}
  .about-stat-pill{position:absolute;bottom:-18px;right:-18px;z-index:2;background:var(--white);border-radius:var(--r-lg);box-shadow:var(--sh-lg);padding:18px 24px;border:1px solid rgba(46,176,80,.15);animation:float 7s ease-in-out infinite}
  .asp-num{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:800;color:var(--g700);display:block;line-height:1}
  .asp-lbl{font-size:.8rem;color:var(--text3);font-weight:600;margin-top:4px}
  .about-points{display:flex;flex-direction:column;gap:20px;margin-top:32px}
  .apoint{display:flex;align-items:flex-start;gap:16px}
  .apoint-icon{width:44px;height:44px;border-radius:12px;background:var(--g100);color:var(--g700);display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0}
  .apoint-h{font-size:1rem;font-weight:700;color:var(--text);margin-bottom:2px}
  .apoint-p{font-size:.88rem;color:var(--text3);line-height:1.6}
  .tech-stack{display:flex;flex-wrap:wrap;gap:10px;margin-top:32px}
  .tech-chip{display:inline-flex;align-items:center;gap:6px;background:var(--g50);color:var(--g700);font-size:.8rem;font-weight:700;padding:7px 16px;border-radius:999px;border:1px solid rgba(46,176,80,.2);transition:all .25s ease}
  .tech-chip:hover{background:var(--g100);transform:translateY(-2px)}

  /* ══ STEPS ══ */
  .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
  .step-card{background:var(--cream);border-radius:var(--r-xl);padding:40px 32px;border:1.5px solid var(--cream2);transition:all .35s ease}
  .step-card:hover{border-color:var(--g300);transform:translateY(-8px);box-shadow:var(--sh-md);background:var(--white)}
  .step-ic{width:60px;height:60px;border-radius:18px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 8px 20px rgba(27,99,46,.25)}
  .si-g{background:linear-gradient(135deg,var(--g500),var(--g700))}
  .si-gold{background:linear-gradient(135deg,var(--gold),var(--gold2))}
  .step-card h3{font-size:1.2rem;font-weight:700;color:var(--g950);margin-bottom:12px}
  .step-card p{font-size:.92rem;color:var(--text3);line-height:1.7}

  /* ══ FEATURES ══ */
  .feat-header{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin-bottom:56px;flex-wrap:wrap}
  .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .feat-card{background:var(--white);border-radius:var(--r-xl);padding:32px;border:1px solid var(--cream2);transition:all .35s ease;position:relative;overflow:hidden}
  .feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--g500),var(--g300));transform:scaleX(0);transform-origin:left;transition:transform .35s ease}
  .feat-card:hover{transform:translateY(-6px);box-shadow:var(--sh-md);border-color:var(--g200)}
  .feat-card:hover::before{transform:scaleX(1)}
  .feat-icon{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:20px}
  .fi1{background:#dcfce7}.fi2{background:#dbeafe}.fi3{background:#fef3c7}.fi4{background:#ede9fe}.fi5{background:#fce7f3}.fi6{background:#ccfbf1}
  .feat-card h3{font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:8px}
  .feat-card p{font-size:.88rem;color:var(--text3);line-height:1.7}
  .feat-tag{display:inline-block;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.8px;padding:4px 12px;border-radius:999px;margin-top:16px}
  .ft-ai{background:#dbeafe;color:#1d4ed8}.ft-new{background:#dcfce7;color:#15803d}.ft-free{background:#fef3c7;color:#92400e}

  /* ══ DISEASE ══ */
  .disease-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
  .disease-card{border-radius:var(--r-xl);overflow:hidden;background:var(--white);border:1.5px solid var(--cream2);transition:all .35s ease;box-shadow:var(--sh-sm)}
  .disease-card:hover{transform:translateY(-8px);box-shadow:var(--sh-md);border-color:var(--g300)}
  .disease-photo-wrapper{width:100%;height:190px;overflow:hidden;position:relative}
  .disease-photo{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
  .disease-card:hover .disease-photo{transform:scale(1.08)}
  .disease-info{padding:20px}
  .disease-name{font-size:1.05rem;font-weight:800;color:var(--g950);margin-bottom:6px}
  .disease-count{font-size:.72rem;font-weight:700;color:var(--g700);background:var(--g100);padding:3px 10px;border-radius:999px;display:inline-block;margin-bottom:10px}
  .disease-desc{font-size:.82rem;color:var(--text3);line-height:1.55}

  /* ══ FEEDBACK / TESTIMONIALS ══ */
  .fb-section{padding:110px 32px;background:var(--cream)}
  .fb-header{text-align:center;max-width:640px;margin:0 auto 16px}
  .fb-live-badge{
    display:inline-flex;align-items:center;gap:8px;
    background:var(--g100);border:1.5px solid rgba(46,176,80,.3);
    color:var(--g700);font-size:.8rem;font-weight:700;
    padding:8px 20px;border-radius:999px;margin-bottom:48px;
  }
  .fb-live-dot{width:8px;height:8px;border-radius:50%;background:var(--g500);animation:pulse 1.8s infinite}

  .fb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}

  /* loading */
  .fb-loading{
    grid-column:1/-1;display:flex;flex-direction:column;
    align-items:center;justify-content:center;padding:5rem;gap:1rem;
  }
  .fb-spinner{width:40px;height:40px;border:3px solid var(--cream2);border-top-color:var(--g500);border-radius:50%;animation:spin .8s linear infinite}
  .fb-loading-text{font-size:.9rem;color:var(--text3);font-weight:500}

  /* empty */
  .fb-empty{
    grid-column:1/-1;text-align:center;padding:5rem 2rem;
    background:var(--white);border-radius:var(--r-xl);
    border:2px dashed var(--cream3);
  }
  .fb-empty-icon{font-size:3.5rem;display:block;margin-bottom:1rem}
  .fb-empty-title{font-size:1.15rem;font-weight:800;color:var(--g950);margin-bottom:8px}
  .fb-empty-desc{font-size:.92rem;color:var(--text3);line-height:1.7;max-width:420px;margin:0 auto 1.5rem}
  .fb-empty-link{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:999px;background:linear-gradient(135deg,var(--g500),var(--g700));color:var(--white);font-size:.9rem;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(27,99,46,.3);transition:all .25s ease}
  .fb-empty-link:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(27,99,46,.4)}

  /* error */
  .fb-error{
    grid-column:1/-1;text-align:center;padding:3rem;
    background:#fef2f2;border-radius:var(--r-xl);border:1.5px solid #fecaca;
  }
  .fb-error-icon{font-size:2.5rem;display:block;margin-bottom:.75rem}
  .fb-error-text{font-size:.9rem;color:#dc2626;font-weight:500}

  /* card */
  .fb-card{
    background:var(--white);border-radius:var(--r-xl);padding:30px;
    border:1.5px solid var(--cream2);transition:all .35s ease;
    position:relative;overflow:hidden;display:flex;flex-direction:column;
    opacity:0;transform:translateY(24px);
  }
  .fb-card.on{opacity:1;transform:translateY(0)}
  .fb-card::after{
    content:'';position:absolute;bottom:0;left:0;right:0;height:4px;
    background:linear-gradient(90deg,var(--g400),var(--gold2));
    transform:scaleX(0);transform-origin:left;transition:transform .35s ease;
  }
  .fb-card:hover{transform:translateY(-6px);box-shadow:var(--sh-md);border-color:var(--g200)}
  .fb-card:hover::after{transform:scaleX(1)}

  .fb-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .fb-stars{color:var(--gold);font-size:1.1rem;letter-spacing:2px}
  .fb-date{font-size:.72rem;color:var(--text3);font-weight:500}

  .fb-cat{display:inline-block;font-size:.72rem;font-weight:700;padding:4px 12px;border-radius:999px;background:var(--g100);color:var(--g700);border:1px solid rgba(46,176,80,.25);margin-bottom:14px}

  .fb-title{font-size:1.02rem;font-weight:800;color:var(--g950);margin-bottom:10px;line-height:1.35}
  .fb-message{font-size:.9rem;color:var(--text2);line-height:1.8;font-style:italic;flex:1;margin-bottom:20px}

  .fb-author{display:flex;align-items:center;gap:14px;padding-top:16px;border-top:1px solid var(--cream2);margin-top:auto}
  .fb-ava{
    width:46px;height:46px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,var(--g300),var(--g600));
    display:flex;align-items:center;justify-content:center;
    font-size:1.1rem;font-weight:800;color:var(--white);
    border:2px solid var(--g200);
  }
  .fb-name{font-size:.92rem;font-weight:700;color:var(--text)}
  .fb-role{font-size:.76rem;color:var(--text3);margin-top:2px}

  /* ══ CTA ══ */
  .cta-wrap{padding:100px 32px;background:linear-gradient(135deg,var(--g950) 0%,var(--g800) 100%);position:relative;overflow:hidden}
  .cta-grid{max-width:1280px;margin:0 auto;position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:48px;flex-wrap:wrap}
  .cta-copy h2{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,3.5vw,3.6rem);line-height:1.1;color:var(--white);margin-bottom:16px}
  .cta-copy h2 span{color:var(--g300);font-style:italic}
  .cta-copy p{font-size:1.05rem;color:rgba(255,255,255,.75);line-height:1.8;max-width:500px}
  .cta-side{display:flex;flex-direction:column;gap:12px;align-items:center;flex-shrink:0}
  .btn-cta{display:inline-flex;align-items:center;gap:10px;padding:18px 44px;border-radius:var(--r-md);font-size:1.02rem;font-weight:800;color:var(--g950);background:var(--white);text-decoration:none;box-shadow:0 10px 36px rgba(0,0,0,.3);transition:all .3s ease}
  .btn-cta:hover{transform:translateY(-4px);box-shadow:0 18px 48px rgba(0,0,0,.4)}
  .cta-note{font-size:.8rem;color:rgba(255,255,255,.5);font-weight:500}

  /* ══ FOOTER ══ */
  .footer{background:var(--g950);border-top:1px solid rgba(255,255,255,.08)}
  .footer-main{max-width:1280px;margin:0 auto;padding:80px 32px 56px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px}
  .footer-logo-row{display:flex;align-items:center;gap:12px;text-decoration:none;margin-bottom:20px}
  .footer-logo-ic{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,var(--g500),var(--g700));display:flex;align-items:center;justify-content:center;font-size:20px}
  .footer-logo-name{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:800;color:var(--white)}
  .footer-logo-name span{color:var(--g400)}
  .footer-desc{font-size:.88rem;line-height:1.8;color:rgba(255,255,255,.5);max-width:300px;margin-bottom:24px}
  .footer-socials{display:flex;gap:10px}
  .f-social{width:38px;height:38px;border-radius:10px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:15px;text-decoration:none;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.08);transition:all .25s ease}
  .f-social:hover{background:var(--g700);color:var(--white);transform:translateY(-2px)}
  .footer-col h4{font-size:.8rem;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.9);margin-bottom:20px}
  .footer-col a{display:block;color:rgba(255,255,255,.5);text-decoration:none;font-size:.88rem;margin-bottom:10px;transition:color .2s ease}
  .footer-col a:hover{color:var(--g300)}
  .footer-bottom{max-width:1280px;margin:0 auto;padding:24px 32px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px}
  .footer-bottom span{font-size:.82rem;color:rgba(255,255,255,.4)}
  .footer-bl{display:flex;gap:24px}
  .footer-bl a{font-size:.82rem;color:rgba(255,255,255,.4);text-decoration:none;transition:color .2s ease}
  .footer-bl a:hover{color:var(--g400)}

  /* ══ RESPONSIVE ══ */
  @media(max-width:1100px){.hero-grid{gap:40px}.about-grid{grid-template-columns:1fr;gap:48px}.feat-grid{grid-template-columns:repeat(2,1fr)}.disease-grid{grid-template-columns:repeat(2,1fr)}.footer-main{grid-template-columns:1fr 1fr}.cta-grid{flex-direction:column;text-align:center}.fb-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:860px){.hero-grid{grid-template-columns:1fr}.hero-vis{display:none}.steps-grid{grid-template-columns:1fr}.nav-menu{display:none}.pad,.pad-alt,.fb-section{padding:80px 20px}.fb-grid{grid-template-columns:1fr}}
  @media(max-width:640px){.disease-grid{grid-template-columns:1fr}.feat-grid{grid-template-columns:1fr}.footer-main{grid-template-columns:1fr}}
`;

/* ── Hooks ── */
function useReveal() {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll('.reveal,.reveal-r,.reveal-l');
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
        { threshold: 0.08 }
      );
      els.forEach(el => io.observe(el));
      return io;
    };
    const io = run();
    return () => io.disconnect();
  }, []);
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => { const v = entries.find(e => e.isIntersecting); if (v) setActive(v.target.id); },
      { rootMargin: '-35% 0px -50% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

function getRoleLabel(role) {
  if (role === 'farmer')   return '🌾 Farmer';
  if (role === 'gardener') return '🌱 Home Gardener';
  return '🔬 Researcher';
}

/* ── Static Data ── */
const MQ = [
  '🍅 Tomato Early Blight','🌶️ Pepper Leaf Spot','🌽 Corn Rust Shield','🥬 Lettuce Mildew Watch',
  '🚜 Field Diagnosis','🌿 20+ Conditions','⚡ Instant Results','📱 Mobile Friendly',
  '🍅 Tomato Early Blight','🌶️ Pepper Leaf Spot','🌽 Corn Rust Shield','🥬 Lettuce Mildew Watch',
];

const FEATURES = [
  { e:'🍅',bg:'fi1',tag:'ft-new', tl:'Instant',   h:'Rapid Vegetable Diagnosis',   p:'Upload a leaf photo to identify diseases and fungal infections in under 5 seconds.',d:'0s'  },
  { e:'🌿',bg:'fi2',tag:'ft-new', tl:'Trusted',   h:'Field-Ready Care Advice',      p:'Get step-by-step organic and chemical treatment guidelines tailored to your crop.',d:'.1s' },
  { e:'📋',bg:'fi3',tag:'ft-free',tl:'Custom',    h:'Personalised Recovery Plans',  p:'Track individual crop field beds with customized recovery schedules and spray alerts.',d:'.2s'},
  { e:'📊',bg:'fi4',tag:'ft-free',tl:'Insights',  h:'Historical Health Records',    p:'Store past crop diagnostic reports to identify seasonal disease patterns early.',d:'.3s'  },
  { e:'🛡️',bg:'fi5',tag:'ft-new', tl:'Secure',    h:'Private Farm Logs',            p:'Your crop health logs and farm notes remain strictly private and accessible anywhere.',d:'.4s'},
  { e:'📱',bg:'fi6',tag:'ft-free',tl:'Any Device',h:'Offline Field Access',         p:'Designed for high performance even in rural areas with low network connectivity.',d:'.5s'  },
];

const DISEASES = [
  { photo:'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',n:'Tomato',    c:'28 conditions',d:'Early blight, bacterial spot, leaf curl virus, and target spot.'        },
  { photo:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',n:'Potato',    c:'18 conditions',d:'Late blight, blackleg, common scab, and verticillium wilt.'             },
  { photo:'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',   n:'Corn/Maize',c:'22 conditions',d:'Common rust, gray leaf spot, northern corn leaf blight, and smut.'    },
  { photo:'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',   n:'Bell Pepper',c:'14 conditions',d:'Bacterial spot, anthracnose, tobacco mosaic virus, and phytophthora.'},
  { photo:'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',n:'Lettuce',   c:'16 conditions',d:'Downy mildew, tipburn, lettuce drop, and mosaic virus.'                },
  { photo:'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',n:'Eggplant',  c:'12 conditions',d:'Phomopsis blight, verticillium wilt, cercospora leaf spot, and rot.'   },
  { photo:'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',n:'Carrot',    c:'15 conditions',d:'Alternaria leaf blight, powdery mildew, cavity spot, and root knot.'   },
  { photo:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',n:'Spinach',   c:'10 conditions',d:'Downy mildew, damping off, cladosporium leaf spot, and mosaic.'        },
];

/* ── Feedback Fetcher Component ── */
function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch('http://localhost:5000/feedback-public')
      .then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFeedbacks(data);
          setStatus('ok');
        } else {
          setStatus('empty');
        }
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    if (status === 'ok') {
      setTimeout(() => {
        document.querySelectorAll('.fb-card').forEach(el => {
          el.classList.add('on');
        });
      }, 100);
    }
  }, [status, feedbacks]);

  return (
    <section id="testimonials">
      <div className="fb-section">
        <div className="wrap">
          <div className="fb-header reveal on">
            <div className="eyebrow">User Reviews</div>
            <h2 className="sec-h">
              What Our <span>Users Say</span>
            </h2>
            <p className="sec-p">
              Real feedback from farmers and home gardeners using AgroGuide every day.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="fb-live-badge">
              <span className="fb-live-dot"></span>
              {status === 'loading' && 'Loading reviews...'}
              {status === 'ok' && `✅ ${feedbacks.length} real reviews from our users`}
              {status === 'empty' && '💬 No reviews yet — be the first!'}
              {status === 'error' && '⚠️ Could not load reviews'}
            </div>
          </div>

          <div className="fb-grid">
            {status === 'loading' && (
              <div className="fb-loading">
                <div className="fb-spinner"></div>
                <div className="fb-loading-text">Loading from database...</div>
              </div>
            )}

            {status === 'error' && (
              <div className="fb-error">
                <span className="fb-error-icon">⚠️</span>
                <div className="fb-error-text">
                  Could not load reviews. Make sure node server.js is running.
                </div>
              </div>
            )}

            {status === 'empty' && (
              <div className="fb-empty">
                <span className="fb-empty-icon">💬</span>
                <div className="fb-empty-title">No Reviews Yet</div>
                <div className="fb-empty-desc">
                  Login and click Give Feedback in your dashboard to leave a review!
                </div>
                <Link to="/register" className="fb-empty-link">
                  🌿 Join and Leave a Review →
                </Link>
              </div>
            )}

            {status === 'ok' &&
              feedbacks.map((fb, i) => (
                <div
                  key={fb.id || i}
                  className="fb-card"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  <div className="fb-card-top">
                    <div className="fb-stars">
                      {'⭐'.repeat(Math.min(Number(fb.rating) || 5, 5))}
                    </div>
                    <div className="fb-date">{fmtDate(fb.createdAt)}</div>
                  </div>

                  {fb.category && <div className="fb-cat">{fb.category}</div>}

                  {fb.title && <div className="fb-title">"{fb.title}"</div>}

                  <p className="fb-message">{fb.message}</p>

                  <div className="fb-author">
                    <div className="fb-ava">
                      {(fb.author || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fb-name">{fb.author || 'AgroGuide User'}</div>
                      <div className="fb-role">{getRoleLabel(fb.role)}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Home Component ── */
export default function Home() {
  const active = useActiveSection(['home','about','features','diseases','testimonials']);
  const [solid, setSolid] = useState(false);
  useReveal();

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* ══ NAVBAR ══ */}
      <nav className={`navbar${solid ? ' solid' : ''}`}>
        <div className="nav-inner">
          <a className="nav-brand" href="#home" onClick={e => { e.preventDefault(); go('home'); }}>
            <div className="nav-brand-logo">🌿</div>
            <span className="nav-brand-text">Agro<em>Guide</em></span>
          </a>
          <ul className="nav-menu">
            {[
              { id:'home',         label:'Home'     },
              { id:'about',        label:'About'    },
              { id:'features',     label:'Features' },
              { id:'diseases',     label:'Diseases' },
              { id:'testimonials', label:'Reviews'  },
            ].map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'active' : ''}
                  onClick={e => { e.preventDefault(); go(item.id); }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-btns">
            <Link to="/login"    className="nav-login">Login</Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home">
        <div className="hero">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <span className="ew-dot"></span>
                🌱 Vegetable Health Monitoring System
              </div>
              <h1 className="hero-h1">
                Protect your crops with <span className="h1-accent">expert field diagnosis</span>
              </h1>
              <p className="hero-p">
                Take a photo of any damaged leaf to receive an instant, accurate crop disease report
                and simple care plans engineered for farmers and home growers.
              </p>
              <div className="hero-btns">
                <Link to="/register" className="btn-main">🚀 Get Started Free →</Link>
                <button className="btn-sub" onClick={() => go('about')}>Learn More ↓</button>
              </div>
              <div className="hero-stats">
                <div><span className="hs-n">98.5%</span><span className="hs-l">Diagnosis Accuracy</span></div>
                <div className="hs-div"></div>
                <div><span className="hs-n">50K+</span><span className="hs-l">Crops Monitored</span></div>
                <div className="hs-div"></div>
                <div><span className="hs-n">20+</span><span className="hs-l">Diseases Covered</span></div>
              </div>
            </div>

            <div className="hero-vis">
              <div className="hero-scan-badge">
                <div className="badge-icon" style={{background:'#dcfce7'}}>🔬</div>
                <div>
                  <div className="badge-title">AI Leaf Scanning</div>
                  <div className="badge-sub">Real-time disease detection</div>
                </div>
              </div>
              <div className="hero-img-grid">
                <div className="hero-img-item tall">
                  <img src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80" alt="Tomato" />
                  <div className="hero-img-overlay"></div>
                  <span className="hero-img-label">🍅 Tomato Crop Check</span>
                </div>
                <div className="hero-img-item">
                  <img src="https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80" alt="Pepper" />
                  <div className="hero-img-overlay"></div>
                  <span className="hero-img-label">🌶️ Bell Pepper Health</span>
                </div>
                <div className="hero-img-item">
                  <img src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80" alt="Lettuce" />
                  <div className="hero-img-overlay"></div>
                  <span className="hero-img-label">🥬 Lettuce Monitoring</span>
                </div>
              </div>
              <div className="hero-result-badge">
                <div className="badge-icon" style={{background:'#fef3c7'}}>✅</div>
                <div>
                  <div className="badge-title">Diagnosis Ready</div>
                  <div className="badge-sub">Care plan generated instantly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="mq-bar">
        <div className="mq-track">
          {MQ.map((item, i) => (
            <span key={i} className="mq-it">
              <span className="mq-dot"></span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ══ ABOUT ══ */}
      <section id="about">
        <div className="pad-alt">
          <div className="wrap">
            <div className="about-grid">
              <div className="about-photo-collage reveal-l">
                <div className="about-photos">
                  <div className="ap-item tall">
                    <img src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80" alt="Potato" />
                    <div className="ap-overlay"></div>
                  </div>
                  <div className="ap-item">
                    <img src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80" alt="Carrot" />
                    <div className="ap-overlay"></div>
                  </div>
                  <div className="ap-item">
                    <img src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80" alt="Corn" />
                    <div className="ap-overlay"></div>
                  </div>
                </div>
                <div className="about-stat-pill">
                  <span className="asp-num">20+</span>
                  <span className="asp-lbl">Plant Pathologies</span>
                </div>
              </div>

              <div className="reveal-r">
                <div className="eyebrow">About AgroGuide</div>
                <h2 className="sec-h">Empowering Farmers with <span>Smarter Insights</span></h2>
                <p className="sec-p">
                  AgroGuide bridges agricultural science and field farming. Our mission is to keep
                  your vegetable beds healthy and yields abundant with accessible digital diagnostic tools.
                </p>
                <div className="about-points">
                  {[
                    {icon:'🎯',h:'Accurate Pathogen Identification',p:'Detect early-stage fungal, bacterial, and viral infections before they spread.'},
                    {icon:'⚡',h:'Fast Field Action Plans',          p:'Receive instant advice on natural remedies and proper treatment dosages.'},
                    {icon:'🌍',h:'Built for Everyone',               p:'Designed for effortless operation on smartphones directly in your field.'},
                    {icon:'🔒',h:'Secure Farm Data',                 p:'All your crop photos, yield logs, and treatment notes stay confidential.'},
                  ].map((pt, i) => (
                    <div key={i} className="apoint">
                      <div className="apoint-icon">{pt.icon}</div>
                      <div>
                        <div className="apoint-h">{pt.h}</div>
                        <div className="apoint-p">{pt.p}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tech-stack">
                  {['🍅 Tomatoes','🌶️ Peppers','🌽 Corn','🥔 Potatoes','🥬 Greens','🍆 Eggplant','🥕 Carrots'].map((t, i) => (
                    <span key={i} className="tech-chip">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <div className="pad">
        <div className="wrap">
          <div className="section-center reveal">
            <div className="eyebrow">How It Works</div>
            <h2 className="sec-h">Diagnose in <span>3 Easy Steps</span></h2>
            <p className="sec-p">Detect issues early and secure your harvest with simple smartphone scans.</p>
          </div>
          <div className="steps-grid">
            {[
              {ic:'📷',gold:false,h:'1. Take or Upload Photo',    p:'Capture a clear picture of the infected leaf or stem using your phone or desktop camera.'},
              {ic:'🔬',gold:true, h:'2. Instant Scan & Analysis', p:'AgroGuide checks the leaf symptoms against our database of 20+ vegetable plant conditions.'},
              {ic:'🌱',gold:false,h:'3. Receive Recovery Plan',   p:'Get step-by-step treatment instructions, organic solutions, and prevention tips.'},
            ].map((s, i) => (
              <div key={i} className="step-card reveal" style={{ transitionDelay:`${i * .15}s` }}>
                <div className={`step-ic ${s.gold ? 'si-gold' : 'si-g'}`}>{s.ic}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <section id="features">
        <div className="pad-alt">
          <div className="wrap">
            <div className="feat-header">
              <div>
                <div className="eyebrow reveal">Features</div>
                <h2 className="sec-h reveal">Complete <span>Crop Care</span></h2>
              </div>
              <p className="sec-p reveal" style={{maxWidth:'380px'}}>
                Everything you need to prevent outbreaks, monitor soil health, and protect your harvest.
              </p>
            </div>
            <div className="feat-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="feat-card reveal" style={{ transitionDelay: f.d }}>
                  <div className={`feat-icon ${f.bg}`}>{f.e}</div>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                  <span className={`feat-tag ${f.tag}`}>{f.tl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DISEASE GALLERY ══ */}
      <section id="diseases">
        <div className="pad">
          <div className="wrap">
            <div className="section-center reveal">
              <div className="eyebrow">Disease Coverage</div>
              <h2 className="sec-h">20+ Vegetable <span>Conditions Monitored</span></h2>
              <p className="sec-p">Comprehensive disease monitoring tailored for major vegetable varieties grown globally.</p>
            </div>
            <div className="disease-grid">
              {DISEASES.map((d, i) => (
                <div key={i} className="disease-card reveal" style={{ transitionDelay:`${i * .08}s` }}>
                  <div className="disease-photo-wrapper">
                    <img className="disease-photo" src={d.photo} alt={d.n} loading="lazy" />
                  </div>
                  <div className="disease-info">
                    <div className="disease-name">{d.n}</div>
                    <div className="disease-count">{d.c}</div>
                    <div className="disease-desc">{d.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEEDBACK — reads from MySQL database ══ */}
      <FeedbackSection />

      {/* ══ CTA ══ */}
      <div className="cta-wrap">
        <div className="cta-grid">
          <div className="cta-copy reveal">
            <h2>Start Protecting Your Harvest <span>Today</span></h2>
            <p>Join 50,000+ growers protecting their vegetable fields and garden beds with instant crop health monitoring.</p>
          </div>
          <div className="cta-side reveal">
            <Link to="/register" className="btn-cta">🌿 Create Free Account →</Link>
            <span className="cta-note">✅ Free forever · Instant leaf scanning</span>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="footer-main">
          <div>
            <a href="#home" className="footer-logo-row">
              <div className="footer-logo-ic">🌿</div>
              <span className="footer-logo-name">Agro<span>Guide</span></span>
            </a>
            <p className="footer-desc">
              Next-generation vegetable crop disease monitoring and treatment planning platform for modern agriculture.
            </p>
            <div className="footer-socials">
              {['🐦','💼','📘','📸'].map((ic, i) => (
                <a key={i} href="#home" className="f-social">{ic}</a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <Link to="/register">Register</Link>
            <Link to="/login">Sign In</Link>
          </div>
          <div className="footer-col">
            <h4>Crops Covered</h4>
            <a href="#diseases">Tomatoes</a>
            <a href="#diseases">Potatoes</a>
            <a href="#diseases">Corn & Maize</a>
            <a href="#diseases">Bell Peppers</a>
            <a href="#diseases">Lettuce & Greens</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#home">Help Center</a>
            <a href="#home">Documentation</a>
            <a href="#home">Privacy Policy</a>
            <a href="#home">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AgroGuide. All rights reserved. Designed for farmers and home growers.</span>
          <div className="footer-bl">
            <a href="#home">Privacy</a>
            <a href="#home">Terms</a>
            <a href="#home">Cookies</a>
          </div>
        </div>
      </footer>
    </>
  );
}